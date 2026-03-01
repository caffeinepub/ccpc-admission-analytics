import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SubmittedStudent } from "./backend.d.ts";
import ComparisonTab from "./components/ComparisonTab";
import DynamicHSCTab from "./components/DynamicHSCTab";
import Footer from "./components/Footer";
import HSC2024Tab from "./components/HSC2024Tab";
import HSC2025Tab from "./components/HSC2025Tab";
import HeroSection from "./components/HeroSection";
import OverviewTab from "./components/OverviewTab";
import ProfilesTab from "./components/ProfilesTab";
import SubmitStudentForm from "./components/SubmitStudentForm";
import type { Student } from "./data";
import { useActor } from "./hooks/useActor";

function deriveShortName(institution: string): string {
  const words = institution.trim().split(/\s+/);
  return words
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 5);
}

function convertSubmittedStudent(s: SubmittedStudent, offset: number): Student {
  return {
    id: offset + Number(s.id),
    name: s.name,
    institution: s.institution,
    shortName: deriveShortName(s.institution),
    section: s.section || undefined,
    department: s.department || undefined,
    rank: s.rank != null ? Number(s.rank) : undefined,
    examType: s.examType as "Medical" | "BUET",
    year: Number(s.year) as 2024 | 2025,
    isSubmitted: true,
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const { actor, isFetching: isActorFetching } = useActor();
  const [submittedRaw, setSubmittedRaw] = useState<SubmittedStudent[]>([]);

  const fetchSubmitted = useCallback(async () => {
    if (!actor) return;
    try {
      const data = await actor.getSubmittedStudents();
      setSubmittedRaw(data);
    } catch (err) {
      console.error("Failed to fetch submitted students:", err);
    }
  }, [actor]);

  useEffect(() => {
    if (actor && !isActorFetching) {
      fetchSubmitted();
    }
  }, [actor, isActorFetching, fetchSubmitted]);

  const submittedStudents = useMemo(
    () => submittedRaw.map((s) => convertSubmittedStudent(s, 10000)),
    [submittedRaw],
  );

  // Years beyond 2025 that have at least one submitted student
  const dynamicYears = useMemo(() => {
    const years = new Set<number>();
    for (const s of submittedStudents) {
      if (Number(s.year) > 2025) years.add(Number(s.year));
    }
    return Array.from(years).sort();
  }, [submittedStudents]);

  const handleStudentSubmitted = useCallback(async () => {
    // Re-fetch to update dynamic tabs and charts
    await fetchSubmitted();
    setActiveTab("profiles");
  }, [fetchSubmitted]);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <main className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border pb-0 mb-8">
            <TabsList className="bg-secondary/50 border border-border h-12 w-full md:w-auto gap-1 flex-wrap md:flex-nowrap">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display font-semibold text-sm px-4"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="hsc2025"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display font-semibold text-sm px-4"
              >
                HSC 2025
              </TabsTrigger>
              <TabsTrigger
                value="hsc2024"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display font-semibold text-sm px-4"
              >
                HSC 2024
              </TabsTrigger>
              {dynamicYears.map((year) => (
                <TabsTrigger
                  key={year}
                  value={`hsc${year}`}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display font-semibold text-sm px-4"
                >
                  HSC {year}
                </TabsTrigger>
              ))}
              <TabsTrigger
                value="comparison"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display font-semibold text-sm px-4"
              >
                Comparison
              </TabsTrigger>
              <TabsTrigger
                value="profiles"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display font-semibold text-sm px-4"
              >
                Student Profiles
              </TabsTrigger>
              <TabsTrigger
                value="submit"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display font-semibold text-sm px-4 relative"
              >
                + Submit
              </TabsTrigger>
            </TabsList>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <TabsContent
              value="overview"
              forceMount
              hidden={activeTab !== "overview"}
            >
              <OverviewTab submittedStudents={submittedStudents} />
            </TabsContent>
            <TabsContent
              value="hsc2025"
              forceMount
              hidden={activeTab !== "hsc2025"}
            >
              <HSC2025Tab />
            </TabsContent>
            <TabsContent
              value="hsc2024"
              forceMount
              hidden={activeTab !== "hsc2024"}
            >
              <HSC2024Tab />
            </TabsContent>

            {/* Dynamic future year tabs */}
            {dynamicYears.map((year) => (
              <TabsContent
                key={year}
                value={`hsc${year}`}
                forceMount
                hidden={activeTab !== `hsc${year}`}
              >
                <DynamicHSCTab
                  year={year}
                  students={submittedStudents.filter(
                    (s) => Number(s.year) === year,
                  )}
                />
              </TabsContent>
            ))}

            <TabsContent
              value="comparison"
              forceMount
              hidden={activeTab !== "comparison"}
            >
              <ComparisonTab />
            </TabsContent>
            <TabsContent
              value="profiles"
              forceMount
              hidden={activeTab !== "profiles"}
            >
              <ProfilesTab />
            </TabsContent>
            <TabsContent
              value="submit"
              forceMount
              hidden={activeTab !== "submit"}
            >
              <div className="py-4">
                <SubmitStudentForm
                  onStudentSubmitted={handleStudentSubmitted}
                />
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
