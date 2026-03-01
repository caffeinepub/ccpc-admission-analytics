import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SubmittedStudent } from "./backend.d.ts";
import AdminLoginModal from "./components/AdminLoginModal";
import AdminTab from "./components/AdminTab";
import ComparisonTab from "./components/ComparisonTab";
import DynamicHSCTab from "./components/DynamicHSCTab";
import Footer from "./components/Footer";
import HSC2024Tab from "./components/HSC2024Tab";
import HSC2025Tab from "./components/HSC2025Tab";
import HeroSection from "./components/HeroSection";
import OverviewTab from "./components/OverviewTab";
import ProfilesTab from "./components/ProfilesTab";
import SubmitStudentForm from "./components/SubmitStudentForm";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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
    hasStarAchievement: s.hasStarAchievement,
    starNote: s.starNote,
  };
}

interface StarAnnouncement {
  id: number;
  emoji: string;
  text: string;
}

function AppContent() {
  const [activeTab, setActiveTab] = useState("overview");
  const { actor, isFetching: isActorFetching } = useActor();
  const [submittedRaw, setSubmittedRaw] = useState<SubmittedStudent[]>([]);
  const { role, sessionToken, isInitializing, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isAdmin = role === "admin";

  const [starAnnouncements, setStarAnnouncements] = useState<
    StarAnnouncement[]
  >([]);

  const fetchStarAnnouncements = useCallback(async () => {
    if (!actor) return;
    try {
      const data = await actor.getStarAnnouncements();
      setStarAnnouncements(
        data.map((a) => ({ id: Number(a.id), emoji: a.emoji, text: a.text })),
      );
    } catch (err) {
      console.error("Failed to fetch star announcements:", err);
    }
  }, [actor]);

  const handleAddAnnouncement = useCallback(
    async (emoji: string, text: string) => {
      if (!actor || !sessionToken) return;
      try {
        await actor.addStarAnnouncement(emoji, text, sessionToken);
        await fetchStarAnnouncements();
      } catch (err) {
        console.error("Failed to add announcement:", err);
      }
    },
    [actor, sessionToken, fetchStarAnnouncements],
  );

  const handleEditAnnouncement = useCallback(
    async (id: number, emoji: string, text: string) => {
      if (!actor || !sessionToken) return;
      try {
        await actor.editStarAnnouncement(BigInt(id), emoji, text, sessionToken);
        await fetchStarAnnouncements();
      } catch (err) {
        console.error("Failed to edit announcement:", err);
      }
    },
    [actor, sessionToken, fetchStarAnnouncements],
  );

  const handleRemoveAnnouncement = useCallback(
    async (id: number) => {
      if (!actor || !sessionToken) return;
      try {
        await actor.removeStarAnnouncement(BigInt(id), sessionToken);
        await fetchStarAnnouncements();
      } catch (err) {
        console.error("Failed to remove announcement:", err);
      }
    },
    [actor, sessionToken, fetchStarAnnouncements],
  );

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
      void fetchSubmitted();
      void fetchStarAnnouncements();
    }
  }, [actor, isActorFetching, fetchSubmitted, fetchStarAnnouncements]);

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
    await fetchSubmitted();
    setActiveTab("profiles");
  }, [fetchSubmitted]);

  const tabTriggerClass =
    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display font-semibold text-sm px-4 hover:text-sky-blue transition-colors";

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        starAnnouncements={starAnnouncements}
        isAdmin={isAdmin}
        onAddAnnouncement={handleAddAnnouncement}
        onEditAnnouncement={handleEditAnnouncement}
        onRemoveAnnouncement={handleRemoveAnnouncement}
      />

      <main className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border pb-0 mb-8">
            <div className="flex items-center justify-between gap-2 pb-2">
              {/* Tab List */}
              <TabsList className="bg-secondary/50 border border-border h-12 gap-1 flex-wrap">
                <TabsTrigger value="overview" className={tabTriggerClass}>
                  Overview
                </TabsTrigger>
                <TabsTrigger value="hsc2025" className={tabTriggerClass}>
                  HSC 2025
                </TabsTrigger>
                <TabsTrigger value="hsc2024" className={tabTriggerClass}>
                  HSC 2024
                </TabsTrigger>
                {dynamicYears.map((year) => (
                  <TabsTrigger
                    key={year}
                    value={`hsc${year}`}
                    className={tabTriggerClass}
                  >
                    HSC {year}
                  </TabsTrigger>
                ))}
                <TabsTrigger value="comparison" className={tabTriggerClass}>
                  Comparison
                </TabsTrigger>
                <TabsTrigger value="profiles" className={tabTriggerClass}>
                  Student Profiles
                </TabsTrigger>
                <TabsTrigger value="submit" className={tabTriggerClass}>
                  Exam Form
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger
                    value="admin"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display font-semibold text-sm px-4 text-primary border border-primary/30 rounded-sm"
                  >
                    <Shield className="w-3.5 h-3.5 mr-1.5" />
                    Admin
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Auth controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {isInitializing ? null : isAdmin ? (
                  <>
                    <Badge className="bg-primary/15 text-primary border border-primary/30 px-2.5 py-1 font-mono text-xs gap-1.5 hidden sm:flex">
                      <Shield className="w-3 h-3" />
                      ADMIN
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="gap-1.5 text-muted-foreground hover:text-foreground h-8 px-3 text-xs font-display"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLoginModal(true)}
                    className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 h-8 px-3 text-xs font-display"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin Login
                  </Button>
                )}
              </div>
            </div>
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
              <OverviewTab
                submittedStudents={submittedStudents}
                isAdmin={isAdmin}
                sessionToken={sessionToken}
              />
            </TabsContent>
            <TabsContent
              value="hsc2025"
              forceMount
              hidden={activeTab !== "hsc2025"}
            >
              <HSC2025Tab isAdmin={isAdmin} />
            </TabsContent>
            <TabsContent
              value="hsc2024"
              forceMount
              hidden={activeTab !== "hsc2024"}
            >
              <HSC2024Tab isAdmin={isAdmin} />
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
                  isAdmin={isAdmin}
                />
              </TabsContent>
            ))}

            <TabsContent
              value="comparison"
              forceMount
              hidden={activeTab !== "comparison"}
            >
              <ComparisonTab isAdmin={isAdmin} sessionToken={sessionToken} />
            </TabsContent>
            <TabsContent
              value="profiles"
              forceMount
              hidden={activeTab !== "profiles"}
            >
              <ProfilesTab isAdmin={isAdmin} sessionToken={sessionToken} />
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
            {isAdmin && (
              <TabsContent
                value="admin"
                forceMount
                hidden={activeTab !== "admin"}
              >
                <div className="py-4">
                  <AdminTab sessionToken={sessionToken!} />
                </div>
              </TabsContent>
            )}
          </motion.div>
        </Tabs>
      </main>

      <Footer />
      <ThemeSwitcher />

      {/* Admin Login Modal */}
      <AdminLoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
