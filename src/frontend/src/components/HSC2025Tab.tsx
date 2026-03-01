import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Filter, Pencil, Stethoscope, Trophy, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { getInstitutionStats, medical2025 } from "../data";
import StudentCard from "./StudentCard";

const ALL_SECTIONS = ["All", "A", "B", "C", "D", "E", "F", "G", "H"];

interface AdminEditableStatProps {
  value: number | string;
  isAdmin: boolean;
  onSave: (v: string) => void;
  className?: string;
}

function AdminEditableStat({
  value,
  isAdmin,
  onSave,
  className = "",
}: AdminEditableStatProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [hovering, setHovering] = useState(false);

  if (!isAdmin) return <div className={className}>{value}</div>;

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="h-8 w-16 text-center text-lg font-display font-bold bg-secondary border-primary/30 focus:border-primary px-1"
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
      </div>
    );
  }

  return (
    <div
      className={`${className} flex items-center gap-1 cursor-pointer group`}
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
    </div>
  );
}

interface HSC2025TabProps {
  isAdmin?: boolean;
}

export default function HSC2025Tab({ isAdmin = false }: HSC2025TabProps) {
  const [sectionFilter, setSectionFilter] = useState("All");
  const [institutionFilter, setInstitutionFilter] = useState("All");

  // Admin-editable stat card values
  const [statCmc, setStatCmc] = useState(13);
  const [statCoxBazar, setStatCoxBazar] = useState(4);
  const [statTribal, setStatTribal] = useState(3);
  const [statUnique, setStatUnique] = useState(15);

  const institutionStats = getInstitutionStats(medical2025);
  const institutions = ["All", ...institutionStats.map((s) => s.name)];

  const filtered = medical2025.filter((s) => {
    const secMatch = sectionFilter === "All" || s.section === sectionFilter;
    const instMatch =
      institutionFilter === "All" || s.institution === institutionFilter;
    return secMatch && instMatch;
  });

  // Sort: highlights first
  const sorted = [...filtered].sort((a, b) => {
    if (a.highlight && !b.highlight) return -1;
    if (!a.highlight && b.highlight) return 1;
    return 0;
  });

  const topCollege = institutionStats[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-gold" />
            HSC 2025 — Medical Admissions
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            36 students from CCPC secured medical college seats
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-primary/20 text-gold border-primary/30 font-mono text-sm px-3 py-1">
            36 Total
          </Badge>
          <Badge className="bg-accent/20 text-teal border-accent/30 font-mono text-sm px-3 py-1">
            {new Set(medical2025.map((s) => s.shortName)).size} Institutions
          </Badge>
        </div>
      </div>

      {/* Highlight Banner */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 rounded-xl bg-gradient-to-r from-primary/15 via-primary/8 to-transparent border border-primary/30"
      >
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-gold flex-shrink-0" />
          <div>
            <p className="font-display font-bold text-gold">
              ⭐ Star Achievement
            </p>
            <p className="text-sm text-foreground/80 mt-0.5">
              <span className="font-semibold">Tanrum Nur Seeam</span> (Section
              C, Old) secured{" "}
              <span className="text-gold font-bold">National Rank #143</span>{" "}
              and got into{" "}
              <span className="font-semibold">Dhaka Medical College</span> — the
              most prestigious medical institution in Bangladesh.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border">
          <CardContent className="p-3 text-center">
            <AdminEditableStat
              value={statCmc}
              isAdmin={isAdmin}
              onSave={(v) => {
                const n = Number(v);
                if (!Number.isNaN(n)) setStatCmc(n);
              }}
              className="text-2xl font-display font-bold text-gold justify-center"
            />
            <div className="text-xs text-muted-foreground">CMC (Most)</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-3 text-center">
            <AdminEditableStat
              value={statCoxBazar}
              isAdmin={isAdmin}
              onSave={(v) => {
                const n = Number(v);
                if (!Number.isNaN(n)) setStatCoxBazar(n);
              }}
              className="text-2xl font-display font-bold text-teal justify-center"
            />
            <div className="text-xs text-muted-foreground">Cox's Bazar MC</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-3 text-center">
            <AdminEditableStat
              value={statTribal}
              isAdmin={isAdmin}
              onSave={(v) => {
                const n = Number(v);
                if (!Number.isNaN(n)) setStatTribal(n);
              }}
              className="text-2xl font-display font-bold text-gold justify-center"
            />
            <div className="text-xs text-muted-foreground">Tribal Quota</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-3 text-center">
            <AdminEditableStat
              value={statUnique}
              isAdmin={isAdmin}
              onSave={(v) => {
                const n = Number(v);
                if (!Number.isNaN(n)) setStatUnique(n);
              }}
              className="text-2xl font-display font-bold text-teal justify-center"
            />
            <div className="text-xs text-muted-foreground">Unique Colleges</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display flex items-center gap-2 text-muted-foreground">
            <Filter className="w-4 h-4" />
            Filter Students
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className="w-36 bg-secondary border-border">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              {ALL_SECTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "All" ? "All Sections" : `Section ${s}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={institutionFilter}
            onValueChange={setInstitutionFilter}
          >
            <SelectTrigger className="w-48 bg-secondary border-border">
              <SelectValue placeholder="Institution" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {institutions.map((inst) => (
                <SelectItem key={inst} value={inst}>
                  {inst === "All" ? "All Institutions" : inst}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge
            variant="outline"
            className="self-center px-3 py-1.5 font-mono text-sm"
          >
            {filtered.length} / 36 shown
          </Badge>
        </CardContent>
      </Card>

      {/* Top Institution Note */}
      {topCollege && (
        <p className="text-sm text-muted-foreground">
          🏆{" "}
          <span className="text-foreground font-semibold">
            Chattogram Medical College (CMC)
          </span>{" "}
          leads with{" "}
          <span className="text-gold font-bold">
            {topCollege.count} students
          </span>{" "}
          — the most from CCPC in 2025.
        </p>
      )}

      {/* Student Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((student, i) => (
          <StudentCard key={student.id} student={student} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No students match the current filters.</p>
        </div>
      )}
    </div>
  );
}
