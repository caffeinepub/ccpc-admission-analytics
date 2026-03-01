import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Star, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
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

export default function OverviewTab({
  submittedStudents = [],
}: OverviewTabProps) {
  const med2025Stats = getInstitutionStats(medical2025).slice(0, 10);
  const med2024Stats = getInstitutionStats(medical2024).slice(0, 10);
  const deptStats = getDeptStats(buet2024);

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

  // Trend line data: per year, medical + buet
  const trendData = useMemo(() => {
    const base: Array<{
      year: string;
      medical: number | null;
      buet: number | null;
    }> = [
      { year: "2024", medical: 25, buet: 10 },
      { year: "2025", medical: 36, buet: null },
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
  }, [futureYears, submittedStudents]);

  const totalSubmittedAll = submittedStudents.length;

  const highlightCards = [
    {
      icon: Users,
      label: "Total Medical Students (All Years)",
      value:
        medical2024.length +
        medical2025.length +
        submittedStudents.filter((s) => s.examType === "Medical").length,
      color: "text-gold",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      icon: Building2,
      label: "BUET Admissions (HSC 2024)",
      value:
        buet2024.length +
        submittedStudents.filter((s) => s.examType === "BUET").length,
      color: "text-teal",
      bg: "bg-accent/10",
      border: "border-accent/20",
    },
    {
      icon: Star,
      label: "Unique Institutions (2025)",
      value: new Set(medical2025.map((s) => s.shortName)).size,
      color: "text-gold",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      icon: TrendingUp,
      label:
        totalSubmittedAll > 0
          ? `+${totalSubmittedAll} Submitted (Future)`
          : "Growth (2024→2025)",
      value: totalSubmittedAll > 0 ? totalSubmittedAll : "+44%",
      color: "text-teal",
      bg: "bg-accent/10",
      border: "border-accent/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {highlightCards.map((card, i) => (
          <motion.div
            key={card.label}
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
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground font-body mt-1 leading-tight">
                  {card.label}
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
              <p className="text-xs text-muted-foreground">
                Medical admission count comparison
              </p>
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
                  36 students
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
              <div className="flex gap-2">
                <Badge className="bg-accent/20 text-teal border-accent/30 font-mono text-xs">
                  Bangla: 10
                </Badge>
                <Badge className="bg-primary/20 text-gold border-primary/30 font-mono text-xs">
                  English: 15
                </Badge>
                <Badge className="bg-secondary text-foreground font-mono text-xs">
                  Total: 25
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
