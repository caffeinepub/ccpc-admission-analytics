import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Edit2,
  Pencil,
  Shield,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type Student,
  buet2024,
  getDeptStats,
  getInstitutionStats,
  medical2024,
  medical2025,
} from "../data";
import { useActor } from "../hooks/useActor";

const CHART_COLORS = [
  "oklch(0.78 0.18 75)", // gold
  "oklch(0.55 0.15 195)", // teal
  "oklch(0.72 0.19 27)", // coral
  "oklch(0.68 0.17 155)", // emerald
  "oklch(0.62 0.18 300)", // violet
  "oklch(0.65 0.16 230)", // blue
  "oklch(0.75 0.17 55)", // amber
  "oklch(0.60 0.20 330)", // pink
];

interface OverviewTabProps {
  submittedStudents?: Student[];
  isAdmin?: boolean;
  sessionToken?: string | null;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name?: string; color?: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="font-display font-semibold text-foreground text-sm mb-1">
          {label}
        </p>
        {payload.map((entry) => (
          <p
            key={entry.name ?? String(entry.value)}
            className="text-xs font-mono"
            style={{ color: entry.color }}
          >
            {entry.name ? `${entry.name}: ` : ""}
            {entry.value} students
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Inline editable stat card value
function EditableStatValue({
  value,
  isAdmin,
  onSave,
}: {
  value: string | number;
  isAdmin: boolean;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [hovering, setHovering] = useState(false);

  if (!isAdmin) return <>{value}</>;

  if (editing) {
    return (
      <span className="flex items-center gap-1">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="h-8 w-20 text-sm font-display font-bold bg-secondary border-primary/30 focus:border-primary px-2"
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
          className="text-green-500 hover:text-green-400 transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </span>
    );
  }

  return (
    <span
      className="flex items-center gap-1 cursor-pointer group"
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
        <Pencil className="w-3 h-3 text-primary/50 hover:text-primary transition-colors" />
      )}
    </span>
  );
}

export default function OverviewTab({
  submittedStudents = [],
  isAdmin = false,
  sessionToken,
}: OverviewTabProps) {
  const { actor } = useActor();
  const med2025Stats = getInstitutionStats(medical2025).slice(0, 10);
  const med2024Stats = getInstitutionStats(medical2024).slice(0, 10);
  const deptStats = getDeptStats(buet2024);

  // Admin-editable trend base values
  const [trendBase2024Medical, setTrendBase2024Medical] = useState(25);
  const [trendBase2024Buet, setTrendBase2024Buet] = useState(10);
  const [trendBase2025Medical, setTrendBase2025Medical] = useState(36);
  const [yoySubtitle, setYoySubtitle] = useState(
    "Medical admission count comparison",
  );
  const [growthOverride, setGrowthOverride] = useState<string | null>(null);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  // Admin panel draft states
  const [draftMed2024, setDraftMed2024] = useState(
    String(trendBase2024Medical),
  );
  const [draftBuet2024, setDraftBuet2024] = useState(String(trendBase2024Buet));
  const [draftMed2025, setDraftMed2025] = useState(
    String(trendBase2025Medical),
  );
  const [draftSubtitle, setDraftSubtitle] = useState(yoySubtitle);
  const [draftGrowth, setDraftGrowth] = useState(growthOverride ?? "+44%");

  const [editingSubtitle, setEditingSubtitle] = useState(false);

  const totalSubmittedAll = submittedStudents.length;

  const [growthCardOverride, setGrowthCardOverride] = useState<string | null>(
    null,
  );

  // Admin-editable card labels
  const [cardLabels, setCardLabels] = useState([
    "Total Medical Students (All Years)",
    "BUET Admissions (HSC 2024)",
    "Unique Institutions (2025)",
    totalSubmittedAll > 0
      ? `+${totalSubmittedAll} Submitted (Future)`
      : "Growth (2024→2025)",
  ]);

  // Admin-editable badge text for charts
  const [med2025Badge, setMed2025Badge] = useState("36 students");
  const [med2024Bangla, setMed2024Bangla] = useState("10");
  const [med2024English, setMed2024English] = useState("15");
  const [med2024Total, setMed2024Total] = useState("25");

  // Fetch overview settings from backend on mount
  useEffect(() => {
    if (!actor) return;
    let cancelled = false;
    actor
      .getOverviewSettings()
      .then((settings) => {
        if (cancelled) return;
        const m24 = Number(settings.trendMed2024);
        const b24 = Number(settings.trendBuet2024);
        const m25 = Number(settings.trendMed2025);
        if (m24 !== 0) {
          setTrendBase2024Medical(m24);
          setDraftMed2024(String(m24));
        }
        if (b24 !== 0) {
          setTrendBase2024Buet(b24);
          setDraftBuet2024(String(b24));
        }
        if (m25 !== 0) {
          setTrendBase2025Medical(m25);
          setDraftMed2025(String(m25));
        }
        if (settings.yoySubtitle) {
          setYoySubtitle(settings.yoySubtitle);
          setDraftSubtitle(settings.yoySubtitle);
        }
        if (settings.growthOverride) {
          setGrowthOverride(settings.growthOverride);
          setGrowthCardOverride(settings.growthOverride);
          setDraftGrowth(settings.growthOverride);
        }
        if (settings.med2025Badge) setMed2025Badge(settings.med2025Badge);
        if (settings.med2024Bangla) setMed2024Bangla(settings.med2024Bangla);
        if (settings.med2024English) setMed2024English(settings.med2024English);
        if (settings.med2024Total) setMed2024Total(settings.med2024Total);
        setCardLabels((prev) => {
          const next = [...prev];
          if (settings.cardLabel0) next[0] = settings.cardLabel0;
          if (settings.cardLabel1) next[1] = settings.cardLabel1;
          if (settings.cardLabel2) next[2] = settings.cardLabel2;
          if (settings.cardLabel3) next[3] = settings.cardLabel3;
          return next;
        });
      })
      .catch((err) => {
        if (!cancelled) console.error("Failed to load overview settings:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [actor]);

  // Compute future years from submitted students (year > 2025)
  const futureYears = useMemo(() => {
    const years = new Set<number>();
    for (const s of submittedStudents) {
      if (Number(s.year) > 2025) years.add(Number(s.year));
    }
    return Array.from(years).sort();
  }, [submittedStudents]);

  const yoyData = useMemo(() => {
    const base = [
      { year: "Medical 2024", students: medical2024.length },
      { year: "Medical 2025", students: medical2025.length },
    ];
    for (const yr of futureYears) {
      const count = submittedStudents.filter(
        (s) => Number(s.year) === yr && s.examType === "Medical",
      ).length;
      base.push({ year: `Medical ${yr}`, students: count });
    }
    return base;
  }, [futureYears, submittedStudents]);

  // Trend line data uses admin-editable base values
  const trendData = useMemo(() => {
    const base: Array<{
      year: string;
      medical: number | null;
      buet: number | null;
    }> = [
      { year: "2024", medical: trendBase2024Medical, buet: trendBase2024Buet },
      { year: "2025", medical: trendBase2025Medical, buet: null },
    ];
    for (const yr of futureYears) {
      const medCount = submittedStudents.filter(
        (s) => Number(s.year) === yr && s.examType === "Medical",
      ).length;
      const buetCount = submittedStudents.filter(
        (s) => Number(s.year) === yr && s.examType === "BUET",
      ).length;
      base.push({
        year: String(yr),
        medical: medCount > 0 ? medCount : null,
        buet: buetCount > 0 ? buetCount : null,
      });
    }
    return base;
  }, [
    futureYears,
    submittedStudents,
    trendBase2024Medical,
    trendBase2024Buet,
    trendBase2025Medical,
  ]);

  const highlightCards = [
    {
      icon: Users,
      label: cardLabels[0],
      value:
        medical2024.length +
        medical2025.length +
        submittedStudents.filter((s) => s.examType === "Medical").length,
      color: "text-gold",
      bg: "bg-primary/10",
      border: "border-primary/20",
      editable: false,
      labelIdx: 0,
    },
    {
      icon: Building2,
      label: cardLabels[1],
      value:
        buet2024.length +
        submittedStudents.filter((s) => s.examType === "BUET").length,
      color: "text-teal",
      bg: "bg-accent/10",
      border: "border-accent/20",
      editable: false,
      labelIdx: 1,
    },
    {
      icon: Star,
      label: cardLabels[2],
      value: new Set(medical2025.map((s) => s.shortName)).size,
      color: "text-gold",
      bg: "bg-primary/10",
      border: "border-primary/20",
      editable: false,
      labelIdx: 2,
    },
    {
      icon: TrendingUp,
      label: cardLabels[3],
      value:
        growthCardOverride ??
        (totalSubmittedAll > 0 ? totalSubmittedAll : "+44%"),
      color: "text-teal",
      bg: "bg-accent/10",
      border: "border-accent/20",
      editable: true,
      labelIdx: 3,
    },
  ];

  const applyTrendEdits = async () => {
    const m24 = Number(draftMed2024);
    const b24 = Number(draftBuet2024);
    const m25 = Number(draftMed2025);
    const newM24 = !Number.isNaN(m24) ? m24 : trendBase2024Medical;
    const newB24 = !Number.isNaN(b24) ? b24 : trendBase2024Buet;
    const newM25 = !Number.isNaN(m25) ? m25 : trendBase2025Medical;
    if (!Number.isNaN(m24)) setTrendBase2024Medical(m24);
    if (!Number.isNaN(b24)) setTrendBase2024Buet(b24);
    if (!Number.isNaN(m25)) setTrendBase2025Medical(m25);
    setYoySubtitle(draftSubtitle);
    setGrowthOverride(draftGrowth || null);
    setGrowthCardOverride(draftGrowth || null);

    // Persist to backend
    if (actor && sessionToken) {
      try {
        await actor.updateOverviewSettings(
          {
            trendMed2024: BigInt(newM24),
            trendBuet2024: BigInt(newB24),
            trendMed2025: BigInt(newM25),
            yoySubtitle: draftSubtitle,
            growthOverride: draftGrowth || "",
            med2025Badge,
            med2024Bangla,
            med2024English,
            med2024Total,
            cardLabel0: cardLabels[0] ?? "",
            cardLabel1: cardLabels[1] ?? "",
            cardLabel2: cardLabels[2] ?? "",
            cardLabel3: cardLabels[3] ?? "",
          },
          sessionToken,
        );
      } catch (err) {
        console.error("Failed to save overview settings:", err);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Edit Panel */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-primary/30 bg-primary/5 overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setAdminPanelOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary/8 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-display font-semibold text-primary text-sm">
                Admin Controls
              </span>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-1.5 py-0 font-mono">
                Edit Charts
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Edit2 className="w-3.5 h-3.5 text-primary/60" />
              {adminPanelOpen ? (
                <ChevronUp className="w-4 h-4 text-primary/60" />
              ) : (
                <ChevronDown className="w-4 h-4 text-primary/60" />
              )}
            </div>
          </button>

          {adminPanelOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-primary/20 px-4 pb-4 pt-3 space-y-4"
            >
              <p className="text-xs text-muted-foreground">
                Changes will be saved to the backend and persist for all
                visitors.
              </p>

              {/* Trend Base Values */}
              <div>
                <p className="text-xs font-display font-semibold text-foreground mb-2">
                  Edit Trend Line Base Values
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label
                      htmlFor="admin-med2024"
                      className="text-xs text-muted-foreground mb-1 block"
                    >
                      Medical 2024
                    </label>
                    <Input
                      id="admin-med2024"
                      type="number"
                      value={draftMed2024}
                      onChange={(e) => setDraftMed2024(e.target.value)}
                      className="h-8 text-sm bg-secondary border-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="admin-buet2024"
                      className="text-xs text-muted-foreground mb-1 block"
                    >
                      BUET 2024
                    </label>
                    <Input
                      id="admin-buet2024"
                      type="number"
                      value={draftBuet2024}
                      onChange={(e) => setDraftBuet2024(e.target.value)}
                      className="h-8 text-sm bg-secondary border-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="admin-med2025"
                      className="text-xs text-muted-foreground mb-1 block"
                    >
                      Medical 2025
                    </label>
                    <Input
                      id="admin-med2025"
                      type="number"
                      value={draftMed2025}
                      onChange={(e) => setDraftMed2025(e.target.value)}
                      className="h-8 text-sm bg-secondary border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* YoY Subtitle */}
              <div>
                <p className="text-xs font-display font-semibold text-foreground mb-2">
                  Year-over-Year Chart Subtitle
                </p>
                <Input
                  value={draftSubtitle}
                  onChange={(e) => setDraftSubtitle(e.target.value)}
                  className="h-8 text-sm bg-secondary border-primary/30 focus:border-primary"
                  placeholder="Chart subtitle text"
                />
              </div>

              {/* Growth Card Override */}
              <div>
                <p className="text-xs font-display font-semibold text-foreground mb-2">
                  Growth Card Override Value
                </p>
                <Input
                  value={draftGrowth}
                  onChange={(e) => setDraftGrowth(e.target.value)}
                  className="h-8 text-sm bg-secondary border-primary/30 focus:border-primary"
                  placeholder="e.g. +44% or 61"
                />
              </div>

              <Button
                size="sm"
                onClick={() => {
                  void applyTrendEdits();
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-xs gap-1.5 h-8"
              >
                <Check className="w-3.5 h-3.5" />
                Apply & Save
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {highlightCards.map((card, i) => (
          <motion.div
            key={`card-${card.labelIdx}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <Card className={`${card.border} border card-hover`}>
              <CardContent className="p-4">
                <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-3`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <div
                  className={`text-3xl font-display font-bold stat-counter ${card.color}`}
                >
                  {card.editable && isAdmin ? (
                    <EditableStatValue
                      value={card.value}
                      isAdmin={isAdmin}
                      onSave={(v) => setGrowthCardOverride(v)}
                    />
                  ) : (
                    card.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-body mt-1 leading-tight">
                  {isAdmin ? (
                    <EditableStatValue
                      value={card.label}
                      isAdmin={isAdmin}
                      onSave={(v) =>
                        setCardLabels((prev) => {
                          const next = [...prev];
                          next[card.labelIdx] = v;
                          return next;
                        })
                      }
                    />
                  ) : (
                    card.label
                  )}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Year-over-Year + BUET Dept Chart */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* YoY Medical */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold" />
                Year-over-Year: Medical
              </CardTitle>
              <div className="flex items-center gap-1.5 group">
                {isAdmin && editingSubtitle ? (
                  <span className="flex items-center gap-1">
                    <Input
                      value={yoySubtitle}
                      onChange={(e) => setYoySubtitle(e.target.value)}
                      className="h-6 text-xs bg-secondary border-primary/30 focus:border-primary px-2 w-52"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Escape")
                          setEditingSubtitle(false);
                      }}
                      onBlur={() => setEditingSubtitle(false)}
                    />
                    <button
                      type="button"
                      onClick={() => setEditingSubtitle(false)}
                      className="text-green-500"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </span>
                ) : (
                  <p
                    className={`text-xs text-muted-foreground ${isAdmin ? "cursor-pointer hover:text-foreground" : ""}`}
                    onClick={() => isAdmin && setEditingSubtitle(true)}
                    onKeyDown={(e) => {
                      if (isAdmin && (e.key === "Enter" || e.key === " "))
                        setEditingSubtitle(true);
                    }}
                  >
                    {yoySubtitle}
                    {isAdmin && (
                      <Pencil className="w-2.5 h-2.5 inline ml-1 text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer
                width="100%"
                height={Math.max(220, yoyData.length * 48)}
              >
                <BarChart
                  data={yoyData}
                  margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="students" name="Students" radius={[6, 6, 0, 0]}>
                    {yoyData.map((entry, index) => (
                      <Cell
                        key={entry.year}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* BUET Department */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="border-border card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal" />
                BUET 2024: Department Breakdown
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Students per engineering department
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={deptStats}
                  layout="vertical"
                  margin={{ top: 4, right: 16, bottom: 4, left: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Students" radius={[0, 6, 6, 0]}>
                    {deptStats.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Medical Distribution Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 2025 Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg text-foreground">
                  Medical 2025: By College
                </CardTitle>
                <Badge className="bg-primary/20 text-gold border-primary/30 font-mono text-xs">
                  <EditableStatValue
                    value={med2025Badge}
                    isAdmin={isAdmin}
                    onSave={(v) => setMed2025Badge(v)}
                  />
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Top institutions by enrollment
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={med2025Stats}
                  layout="vertical"
                  margin={{ top: 4, right: 16, bottom: 4, left: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={48}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Students" radius={[0, 6, 6, 0]}>
                    {med2025Stats.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2025 Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="border-border card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg text-foreground">
                Medical 2025: Share by Institution
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Proportional distribution
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={med2025Stats}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={40}
                    paddingAngle={2}
                    label={({ name, count }) => `${name}:${count}`}
                    labelLine={false}
                  >
                    {med2025Stats.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} students`, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Medical 2024 Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-border card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="font-display text-lg text-foreground">
                Medical 2024: By College
              </CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-accent/20 text-teal border-accent/30 font-mono text-xs">
                  Bangla:{" "}
                  <EditableStatValue
                    value={med2024Bangla}
                    isAdmin={isAdmin}
                    onSave={(v) => setMed2024Bangla(v)}
                  />
                </Badge>
                <Badge className="bg-primary/20 text-gold border-primary/30 font-mono text-xs">
                  English:{" "}
                  <EditableStatValue
                    value={med2024English}
                    isAdmin={isAdmin}
                    onSave={(v) => setMed2024English(v)}
                  />
                </Badge>
                <Badge className="bg-secondary text-foreground font-mono text-xs">
                  Total:{" "}
                  <EditableStatValue
                    value={med2024Total}
                    isAdmin={isAdmin}
                    onSave={(v) => setMed2024Total(v)}
                  />
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={med2024Stats}
                layout="vertical"
                margin={{ top: 4, right: 16, bottom: 4, left: 52 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11 }}
                  width={52}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Students" radius={[0, 6, 6, 0]}>
                  {med2024Stats.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trend Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <Card className="border-border card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" />
              Admission Trend
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              CCPC medical admission growth trajectory
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart
                data={trendData}
                margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="medical"
                  name="Medical"
                  stroke="oklch(0.78 0.18 75)"
                  strokeWidth={3}
                  dot={{ r: 6, fill: "oklch(0.78 0.18 75)" }}
                />
                <Line
                  type="monotone"
                  dataKey="buet"
                  name="BUET"
                  stroke="oklch(0.55 0.15 195)"
                  strokeWidth={3}
                  dot={{ r: 6, fill: "oklch(0.55 0.15 195)" }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
