import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  Building2,
  Check,
  Hash,
  Pencil,
  Stethoscope,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { buet2024, medical2024 } from "../data";
import StudentCard from "./StudentCard";

const deptColorMap: Record<string, string> = {
  EEE: "bg-yellow-500/20 text-yellow-300",
  ME: "bg-sky-500/20 text-sky-300",
  "Civil Engineering": "bg-green-500/20 text-green-300",
  "Chemical Engineering": "bg-pink-500/20 text-pink-300",
  NCE: "bg-indigo-500/20 text-indigo-300",
};

interface AdminInlineEditProps {
  value: string | number;
  isAdmin: boolean;
  onSave: (v: string) => void;
  inputClassName?: string;
  displayClassName?: string;
}

function AdminInlineEdit({
  value,
  isAdmin,
  onSave,
  inputClassName = "",
  displayClassName = "",
}: AdminInlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [hovering, setHovering] = useState(false);

  if (!isAdmin) return <span className={displayClassName}>{value}</span>;

  if (editing) {
    return (
      <span className="inline-flex items-center gap-1">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className={`h-7 text-sm bg-secondary border-primary/30 focus:border-primary px-2 ${inputClassName}`}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSave(draft);
              setEditing(false);
            }
            if (e.key === "Escape") setEditing(false);
          }}
        />
        <button
          type="button"
          onClick={() => {
            onSave(draft);
            setEditing(false);
          }}
          className="text-green-500 hover:text-green-400"
        >
          <Check className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="w-3 h-3" />
        </button>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 cursor-pointer group ${displayClassName}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => {
        setDraft(String(value));
        setEditing(true);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setDraft(String(value));
          setEditing(true);
        }
      }}
    >
      {value}
      {hovering && (
        <Pencil className="w-2.5 h-2.5 text-primary/50 hover:text-primary transition-colors" />
      )}
    </span>
  );
}

interface HSC2024TabProps {
  isAdmin?: boolean;
}

export default function HSC2024Tab({ isAdmin = false }: HSC2024TabProps) {
  const [subTab, setSubTab] = useState("buet");

  // Admin-editable values
  const [bestRank, setBestRank] = useState(277);
  const [bestRankName, setBestRankName] = useState("Sadman Nuheen");
  const [medTotal, setMedTotal] = useState(25);
  const [medBangla, setMedBangla] = useState(10);
  const [medEnglish, setMedEnglish] = useState(15);

  // Sort BUET by rank
  const sortedBUET = [...buet2024].sort(
    (a, b) => (a.rank ?? 9999) - (b.rank ?? 9999),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          HSC 2024 Admissions
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          BUET and Medical college admissions from CCPC batch HSC 2024
        </p>
      </div>

      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList className="bg-secondary/50 border border-border">
          <TabsTrigger
            value="buet"
            className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-display font-semibold"
          >
            <Building2 className="w-4 h-4 mr-1.5" />
            BUET (10)
          </TabsTrigger>
          <TabsTrigger
            value="medical"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display font-semibold"
          >
            <Stethoscope className="w-4 h-4 mr-1.5" />
            Medical (25)
          </TabsTrigger>
        </TabsList>

        {/* ── BUET Tab ── */}
        <TabsContent value="buet" className="mt-6">
          <div className="space-y-5">
            {/* BUET Summary */}
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/25">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-display font-bold text-teal">
                    BUET Admissions 2024
                  </p>
                  <p className="text-sm text-foreground/80 mt-0.5">
                    10 CCPC students secured positions in Bangladesh University
                    of Engineering and Technology. Best rank:{" "}
                    <AdminInlineEdit
                      value={`#${bestRank}`}
                      isAdmin={isAdmin}
                      onSave={(v) => {
                        const n = Number(v.replace("#", ""));
                        if (!Number.isNaN(n)) setBestRank(n);
                      }}
                      displayClassName="text-gold font-bold"
                      inputClassName="w-16"
                    />{" "}
                    by{" "}
                    <AdminInlineEdit
                      value={bestRankName}
                      isAdmin={isAdmin}
                      onSave={setBestRankName}
                      displayClassName="font-semibold"
                      inputClassName="w-32"
                    />{" "}
                    (EEE).
                  </p>
                </div>
              </div>
            </div>

            {/* Dept Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                "EEE",
                "ME",
                "Civil Engineering",
                "Chemical Engineering",
                "NCE",
              ].map((dept) => {
                const count = buet2024.filter(
                  (s) => s.department === dept,
                ).length;
                return (
                  <Card key={dept} className="border-border text-center">
                    <CardContent className="p-3">
                      <div className="text-xl font-display font-bold text-teal">
                        {count}
                      </div>
                      <div
                        className={`text-xs px-1 py-0.5 rounded font-mono mt-1 ${deptColorMap[dept] ?? "text-muted-foreground"}`}
                      >
                        {dept}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* BUET Rank Table */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal" />
                  Students by Rank
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left px-4 py-3 text-xs font-display font-semibold text-muted-foreground">
                          #
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-display font-semibold text-muted-foreground">
                          Name
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-display font-semibold text-muted-foreground">
                          Section
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-display font-semibold text-muted-foreground">
                          Department
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-display font-semibold text-muted-foreground">
                          Rank
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedBUET.map((student, i) => (
                        <motion.tr
                          key={student.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                            {i + 1}
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">
                            {student.name}
                          </td>
                          <td className="px-4 py-3">
                            {student.section && student.section !== "-" ? (
                              <Badge
                                variant="outline"
                                className="text-xs font-mono"
                              >
                                {student.section}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground/40">
                                —
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {student.department ? (
                              <Badge
                                variant="outline"
                                className={`text-xs font-mono ${deptColorMap[student.department] ?? "text-muted-foreground"}`}
                              >
                                {student.department}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground/40">
                                —
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {student.rank ? (
                              <span className="font-mono text-teal font-semibold">
                                #{student.rank}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/40 text-xs">
                                N/A
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Cards Grid */}
            <div>
              <h3 className="font-display font-semibold text-foreground mb-3">
                Student Cards
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedBUET.map((student, i) => (
                  <StudentCard key={student.id} student={student} index={i} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Medical Tab ── */}
        <TabsContent value="medical" className="mt-6">
          <div className="space-y-5">
            {/* Medical Summary */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/25">
              <div className="flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-display font-bold text-gold">
                    Medical Admissions 2024 — Summary
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className="bg-secondary font-mono">
                      Total:{" "}
                      <AdminInlineEdit
                        value={medTotal}
                        isAdmin={isAdmin}
                        onSave={(v) => {
                          const n = Number(v);
                          if (!Number.isNaN(n)) setMedTotal(n);
                        }}
                        displayClassName="font-mono font-bold ml-1"
                        inputClassName="w-12"
                      />
                    </Badge>
                    <Badge className="bg-accent/20 text-teal border-accent/30 font-mono">
                      Bangla Version:{" "}
                      <AdminInlineEdit
                        value={medBangla}
                        isAdmin={isAdmin}
                        onSave={(v) => {
                          const n = Number(v);
                          if (!Number.isNaN(n)) setMedBangla(n);
                        }}
                        displayClassName="font-mono font-bold ml-1"
                        inputClassName="w-12"
                      />
                    </Badge>
                    <Badge className="bg-primary/20 text-gold border-primary/30 font-mono">
                      English Version:{" "}
                      <AdminInlineEdit
                        value={medEnglish}
                        isAdmin={isAdmin}
                        onSave={(v) => {
                          const n = Number(v);
                          if (!Number.isNaN(n)) setMedEnglish(n);
                        }}
                        displayClassName="font-mono font-bold ml-1"
                        inputClassName="w-12"
                      />
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Students placed across: Dhaka Medical (3), Salimullah
                    Medical (4), Chattogram Medical (4), Sylhet Osmani (2), and
                    more.
                  </p>
                </div>
              </div>
            </div>

            {/* Institution Summary Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Dhaka Medical", count: 3 },
                { label: "Salimullah MC", count: 4 },
                { label: "Chattogram MC", count: 4 },
                { label: "Sylhet Osmani", count: 2 },
                { label: "Cumilla MC", count: 1 },
                { label: "Rangamati MC", count: 2 },
                { label: "Cox's Bazar MC", count: 1 },
                { label: "Chandpur MC", count: 1 },
                { label: "Faridpur MC", count: 1 },
                { label: "Others", count: 6 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs font-body"
                >
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  <span className="text-foreground font-semibold">
                    {item.label}
                  </span>
                  <span className="text-gold font-mono font-bold">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Medical Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {medical2024.map((student, i) => (
                <StudentCard key={student.id} student={student} index={i} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
