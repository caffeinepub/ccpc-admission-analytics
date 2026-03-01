import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Info, Star, Trophy } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  buet2024,
  collegeComparisons,
  medical2024,
  medical2025,
} from "../data";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const isCCPC = label === "CCPC";
    return (
      <div
        className={`border rounded-lg p-3 shadow-xl ${isCCPC ? "bg-primary/20 border-primary/40" : "bg-card border-border"}`}
      >
        <p
          className={`font-display font-semibold text-sm mb-1 ${isCCPC ? "text-gold" : "text-foreground"}`}
        >
          {label} {isCCPC ? "⭐" : ""}
        </p>
        {payload.map((entry) => (
          <p
            key={entry.name}
            className="text-xs font-mono"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value} students
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const achievements = [
  {
    icon: "🏆",
    title: "Top Regional Performer",
    description:
      "CCPC leads Chattogram division with 36 medical admissions in HSC 2025 — more than any other cantonment college in the region.",
    color: "border-primary/30 bg-primary/8",
  },
  {
    icon: "📈",
    title: "44% Growth in Medical",
    description:
      "Medical admissions grew from 25 (HSC 2024) to 36 (HSC 2025) — a 44% increase, showing consistent academic improvement.",
    color: "border-accent/30 bg-accent/8",
  },
  {
    icon: "🎯",
    title: "National Rank #143",
    description:
      "Tanrum Nur Seeam's rank of 143rd nationally in the medical admission exam is CCPC's highest individual placement in recent years.",
    color: "border-primary/30 bg-primary/8",
  },
  {
    icon: "🏫",
    title: "10 BUET Admissions",
    description:
      "10 students from HSC 2024 secured seats in BUET across multiple departments — exceptional for a regional cantonment college.",
    color: "border-accent/30 bg-accent/8",
  },
];

export default function ComparisonTab() {
  const chartData = collegeComparisons.map((c) => ({
    college: c.college,
    "BUET (Est.)": c.buet2025Est,
    "Medical (Est.)": c.medical2025Est,
    isHighlighted: c.isHighlighted,
  }));

  // Top 5 medical colleges for CCPC 2025
  const ccpcTopColleges = [
    { name: "CMC", count: 13, full: "Chattogram Medical College" },
    { name: "CBMC", count: 4, full: "Cox's Bazar Medical College" },
    { name: "ChMC", count: 4, full: "Chandpur Medical College" },
    { name: "SOMC", count: 2, full: "MAG Osmani Medical College" },
    { name: "RaMC", count: 2, full: "Rangamati Medical College" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-gold" />
          Comparison & Analysis
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          CCPC performance vs other leading colleges in Bangladesh
        </p>
      </div>

      {/* Data Source Note */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          Comparison data for other colleges is estimated from publicly
          available Udvash-Unmesh rankings (2025). CCPC data is exact as
          reported.{" "}
          <span className="text-foreground/60">
            Sources: udvash-unmesh.com BUET, DU-Ka, DU-Kha college-wise PDFs.
          </span>
        </p>
      </div>

      {/* Achievement Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {achievements.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className={`border ${a.color} card-hover`}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">{a.icon}</span>
                  <div>
                    <p className="font-display font-bold text-foreground text-sm">
                      {a.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {a.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="font-display text-lg">
                College Comparison: BUET & Medical 2025
              </CardTitle>
              <Badge
                variant="outline"
                className="font-mono text-xs text-teal border-accent/30"
              >
                Estimated data for peers
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              CCPC highlighted in gold — showing strong performance relative to
              national peers
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 16, bottom: 40, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="college"
                  tick={{ fontSize: 11 }}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="BUET (Est.)" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell
                      key={`buet-${entry.college}`}
                      fill={
                        entry.isHighlighted
                          ? "oklch(0.78 0.18 75)"
                          : "oklch(0.55 0.15 195 / 0.7)"
                      }
                    />
                  ))}
                </Bar>
                <Bar dataKey="Medical (Est.)" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell
                      key={`med-${entry.college}`}
                      fill={
                        entry.isHighlighted
                          ? "oklch(0.78 0.18 75 / 0.6)"
                          : "oklch(0.72 0.19 27 / 0.5)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* CCPC Medical Distribution 2025 */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border h-full">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gold" />
                CCPC Top Destinations — Medical 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ccpcTopColleges.map((col, i) => (
                  <div key={col.name} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-4">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-foreground">
                          {col.full}
                        </span>
                        <span className="text-xs font-mono text-gold font-bold">
                          {col.count}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(col.count / 13) * 100}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="border-border h-full">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Star className="w-4 h-4 text-gold" />
                CCPC At a Glance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    label: "Medical 2025",
                    value: medical2025.length,
                    max: 40,
                    color: "from-primary to-primary/50",
                    text: "text-gold",
                  },
                  {
                    label: "Medical 2024",
                    value: medical2024.length,
                    max: 40,
                    color: "from-accent to-accent/50",
                    text: "text-teal",
                  },
                  {
                    label: "BUET 2024",
                    value: buet2024.length,
                    max: 20,
                    color: "from-primary/70 to-primary/30",
                    text: "text-gold",
                  },
                  {
                    label: "Total Admissions",
                    value:
                      medical2025.length + medical2024.length + buet2024.length,
                    max: 100,
                    color: "from-accent/70 to-accent/30",
                    text: "text-teal",
                  },
                ].map((stat, i) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-muted-foreground">
                        {stat.label}
                      </span>
                      <span
                        className={`text-lg font-display font-bold stat-counter ${stat.text}`}
                      >
                        {stat.value}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((stat.value / stat.max) * 100, 100)}%`,
                        }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.7 }}
                        className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    CCPC consistently ranks as{" "}
                    <span className="text-gold font-semibold">
                      Chattogram's top performing
                    </span>{" "}
                    cantonment college in national university and medical
                    entrance examinations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Table Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">
              College-by-College Breakdown
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Estimated figures for peer institutions
            </p>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-3 text-xs font-display font-semibold text-muted-foreground">
                    College
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-display font-semibold text-muted-foreground">
                    City
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-display font-semibold text-muted-foreground">
                    BUET 2025 (Est.)
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-display font-semibold text-muted-foreground">
                    Medical 2025
                  </th>
                </tr>
              </thead>
              <tbody>
                {collegeComparisons.map((col) => (
                  <tr
                    key={col.college}
                    className={`border-b border-border/50 transition-colors ${
                      col.isHighlighted
                        ? "bg-primary/8 hover:bg-primary/12"
                        : "hover:bg-secondary/20"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {col.isHighlighted && (
                          <span className="text-gold">⭐</span>
                        )}
                        <span
                          className={`font-semibold ${col.isHighlighted ? "text-gold" : "text-foreground"}`}
                        >
                          {col.college}
                        </span>
                        {col.isHighlighted && (
                          <Badge className="text-xs bg-primary/20 text-gold border-primary/30 font-mono px-1.5">
                            CCPC
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {col.city}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      <span
                        className={
                          col.isHighlighted
                            ? "text-gold font-bold"
                            : "text-muted-foreground"
                        }
                      >
                        {col.buet2025Est}
                        {!col.isHighlighted && (
                          <span className="text-xs opacity-50"> est.</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      <span
                        className={
                          col.isHighlighted
                            ? "text-gold font-bold"
                            : "text-muted-foreground"
                        }
                      >
                        {col.medical2025Est}
                        {!col.isHighlighted && (
                          <span className="text-xs opacity-50"> est.</span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
