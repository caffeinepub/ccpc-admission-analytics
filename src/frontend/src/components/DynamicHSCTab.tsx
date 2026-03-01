import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Filter,
  GraduationCap,
  Stethoscope,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type Student, getInstitutionStats, getSectionStats } from "../data";

const CHART_COLORS = [
  "oklch(0.78 0.18 75)",
  "oklch(0.55 0.15 195)",
  "oklch(0.72 0.19 27)",
  "oklch(0.68 0.17 155)",
  "oklch(0.62 0.18 300)",
  "oklch(0.65 0.16 230)",
  "oklch(0.75 0.17 55)",
  "oklch(0.60 0.20 330)",
];

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

export interface DynamicHSCTabProps {
  year: number;
  students: Student[];
}

const ALL_SECTIONS = ["All", "A", "B", "C", "D", "E", "F", "G", "H"];

export default function DynamicHSCTab({ year, students }: DynamicHSCTabProps) {
  const [sectionFilter, setSectionFilter] = useState("All");
  const [institutionFilter, setInstitutionFilter] = useState("All");

  const medicalStudents = useMemo(
    () => students.filter((s) => s.examType === "Medical"),
    [students],
  );
  const buetStudents = useMemo(
    () => students.filter((s) => s.examType === "BUET"),
    [students],
  );

  const institutionStats = useMemo(
    () => getInstitutionStats(students).slice(0, 10),
    [students],
  );
  const sectionStats = useMemo(() => getSectionStats(students), [students]);
  const institutions = useMemo(
    () => ["All", ...getInstitutionStats(students).map((s) => s.name)],
    [students],
  );
  const uniqueInstitutions = useMemo(
    () => new Set(students.map((s) => s.shortName)).size,
    [students],
  );

  const filtered = useMemo(
    () =>
      students.filter((s) => {
        const secMatch = sectionFilter === "All" || s.section === sectionFilter;
        const instMatch =
          institutionFilter === "All" || s.shortName === institutionFilter;
        return secMatch && instMatch;
      }),
    [students, sectionFilter, institutionFilter],
  );

  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-gold" />
              HSC {year} Admissions
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Future year — submit students to populate this tab
            </p>
          </div>
          <Badge className="bg-secondary text-muted-foreground border-border font-mono text-sm px-3 py-1">
            0 Students
          </Badge>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-24 text-center gap-4 border border-dashed border-border/50 rounded-2xl bg-secondary/20"
        >
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
            <GraduationCap className="w-10 h-10 text-gold opacity-60" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-foreground/70">
              No students for HSC {year} yet
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Use the <span className="text-gold font-semibold">+ Submit</span>{" "}
              tab to add students for HSC {year}. Charts, tables, and stats will
              appear automatically.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-gold" />
            HSC {year} Admissions
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {students.length} student{students.length !== 1 ? "s" : ""} from
            CCPC submitted for HSC {year}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-primary/20 text-gold border-primary/30 font-mono text-sm px-3 py-1">
            {students.length} Total
          </Badge>
          {medicalStudents.length > 0 && (
            <Badge className="bg-accent/20 text-teal border-accent/30 font-mono text-sm px-3 py-1">
              {medicalStudents.length} Medical
            </Badge>
          )}
          {buetStudents.length > 0 && (
            <Badge className="bg-primary/10 text-gold/80 border-primary/20 font-mono text-sm px-3 py-1">
              {buetStudents.length} BUET
            </Badge>
          )}
          <Badge className="bg-secondary text-foreground border-border font-mono text-sm px-3 py-1">
            {uniqueInstitutions} Institutions
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total Students",
            value: students.length,
            color: "text-gold",
          },
          {
            label: "Medical",
            value: medicalStudents.length,
            color: "text-gold",
          },
          { label: "BUET", value: buetStudents.length, color: "text-teal" },
          {
            label: "Institutions",
            value: uniqueInstitutions,
            color: "text-teal",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
          >
            <Card className="border-border">
              <CardContent className="p-3 text-center">
                <div
                  className={`text-2xl font-display font-bold ${stat.color}`}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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
            {filtered.length} / {students.length} shown
          </Badge>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bar: By Institution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal" />
                By Institution
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Students per college
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer
                width="100%"
                height={Math.max(200, institutionStats.length * 32)}
              >
                <BarChart
                  data={institutionStats}
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
                    {institutionStats.map((entry, index) => (
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

        {/* Pie: Institution Share */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border-border card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-gold" />
                Share by Institution
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Proportional distribution
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={institutionStats}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={35}
                    paddingAngle={2}
                    label={({ name, count }) => `${name}:${count}`}
                    labelLine={false}
                  >
                    {institutionStats.map((entry, index) => (
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

      {/* Section Distribution */}
      {sectionStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-gold" />
                Section Distribution
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Students across CCPC sections
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer
                width="100%"
                height={Math.max(160, sectionStats.length * 32)}
              >
                <BarChart
                  data={sectionStats}
                  layout="vertical"
                  margin={{ top: 4, right: 16, bottom: 4, left: 72 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={72}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Students" radius={[0, 6, 6, 0]}>
                    {sectionStats.map((entry, index) => (
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
      )}

      {/* Student Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="border-border overflow-hidden">
          <CardHeader className="pb-2 border-b border-border">
            <CardTitle className="font-display text-base flex items-center gap-2">
              HSC {year} Students ({filtered.length})
              <Badge className="bg-primary/15 text-gold border-primary/25 text-xs font-mono">
                Submitted
              </Badge>
            </CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30 hover:bg-secondary/30 border-border">
                  <TableHead className="w-10 text-xs font-display font-semibold text-muted-foreground">
                    #
                  </TableHead>
                  <TableHead className="text-xs font-display font-semibold text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="text-xs font-display font-semibold text-muted-foreground hidden sm:table-cell">
                    Section
                  </TableHead>
                  <TableHead className="text-xs font-display font-semibold text-muted-foreground">
                    Exam
                  </TableHead>
                  <TableHead className="text-xs font-display font-semibold text-muted-foreground">
                    Institution
                  </TableHead>
                  <TableHead className="text-xs font-display font-semibold text-muted-foreground text-right hidden md:table-cell">
                    Rank / Dept
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((student, i) => (
                  <TableRow
                    key={student.id}
                    style={{
                      opacity: 0,
                      animation: `fadeIn 0.3s ease-out ${Math.min(i * 0.02, 0.5)}s forwards`,
                    }}
                    className="border-border/50 hover:bg-secondary/20 bg-primary/3"
                  >
                    <TableCell className="text-xs text-muted-foreground font-mono py-2.5">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-sm py-2.5">
                      <div className="flex items-center gap-1.5">
                        {student.name}
                        <Badge className="text-xs bg-primary/15 text-gold/80 border border-primary/25 px-1.5 py-0 font-mono pointer-events-none">
                          Submitted
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 hidden sm:table-cell">
                      {student.section && student.section !== "-" ? (
                        <Badge
                          variant="outline"
                          className="text-xs font-mono px-1.5"
                        >
                          {student.section}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground/30 text-xs">
                          —
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Badge
                        variant="outline"
                        className={`text-xs font-mono px-1.5 ${
                          student.examType === "BUET"
                            ? "bg-accent/20 text-teal border-accent/30"
                            : "bg-primary/20 text-gold border-primary/30"
                        }`}
                      >
                        {student.examType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm py-2.5 max-w-[200px]">
                      <span className="text-muted-foreground text-xs truncate block">
                        {student.institution}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-2.5 hidden md:table-cell">
                      {student.rank ? (
                        <span className="font-mono text-xs text-teal font-semibold">
                          #{student.rank}
                        </span>
                      ) : student.department ? (
                        <span className="font-mono text-xs text-muted-foreground">
                          {student.department}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30 text-xs">
                          —
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No students match current filters.</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
