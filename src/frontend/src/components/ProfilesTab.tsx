import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  Search,
  Star,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SubmittedStudent } from "../backend.d.ts";
import { type Student, allStudents } from "../data";
import { useActor } from "../hooks/useActor";
import StudentCard from "./StudentCard";

type SortKey = "name" | "year" | "examType" | "institution" | "section";
type SortDir = "asc" | "desc";

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

interface ProfilesTabProps {
  isAdmin?: boolean;
  sessionToken?: string | null;
}

export default function ProfilesTab({
  isAdmin = false,
  sessionToken = null,
}: ProfilesTabProps) {
  const { actor, isFetching: isActorFetching } = useActor();
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("All");
  const [examFilter, setExamFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<SortKey>("year");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const [submittedRaw, setSubmittedRaw] = useState<SubmittedStudent[]>([]);
  const [isFetchingSubmitted, setIsFetchingSubmitted] = useState(false);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [starringId, setStarringId] = useState<bigint | null>(null);

  const fetchSubmitted = useCallback(async () => {
    if (!actor) return;
    setIsFetchingSubmitted(true);
    try {
      const data = await actor.getSubmittedStudents();
      setSubmittedRaw(data);
    } catch (err) {
      console.error("Failed to fetch submitted students:", err);
    } finally {
      setIsFetchingSubmitted(false);
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

  const combinedStudents = useMemo(
    () => [...allStudents, ...submittedStudents],
    [submittedStudents],
  );

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    setDeletingId(id);
    try {
      await actor.deleteSubmittedStudent(id);
      setSubmittedRaw((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleGrantStar = async (id: bigint, note: string) => {
    if (!actor || !sessionToken) return;
    setStarringId(id);
    try {
      await actor.grantStarAchievement(id, sessionToken, note);
      await fetchSubmitted();
    } catch (err) {
      console.error("Grant star failed:", err);
    } finally {
      setStarringId(null);
    }
  };

  const handleRemoveStar = async (id: bigint) => {
    if (!actor || !sessionToken) return;
    setStarringId(id);
    try {
      await actor.removeStarAchievement(id, sessionToken);
      await fetchSubmitted();
    } catch (err) {
      console.error("Remove star failed:", err);
    } finally {
      setStarringId(null);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return combinedStudents
      .filter((s) => {
        const matchSearch =
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.institution.toLowerCase().includes(q);
        const matchYear = yearFilter === "All" || String(s.year) === yearFilter;
        const matchExam = examFilter === "All" || s.examType === examFilter;
        return matchSearch && matchYear && matchExam;
      })
      .sort((a, b) => {
        let va: string | number = "";
        let vb: string | number = "";
        if (sortKey === "name") {
          va = a.name;
          vb = b.name;
        } else if (sortKey === "year") {
          va = a.year;
          vb = b.year;
        } else if (sortKey === "examType") {
          va = a.examType;
          vb = b.examType;
        } else if (sortKey === "institution") {
          va = a.institution;
          vb = b.institution;
        } else if (sortKey === "section") {
          va = a.section ?? "";
          vb = b.section ?? "";
        }

        if (typeof va === "number" && typeof vb === "number") {
          return sortDir === "asc" ? va - vb : vb - va;
        }
        const cmp = String(va).localeCompare(String(vb));
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [search, yearFilter, examFilter, sortKey, sortDir, combinedStudents]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-gold" />
    ) : (
      <ChevronDown className="w-3 h-3 text-gold" />
    );
  };

  const getExamBadgeClass = (type: Student["examType"]) =>
    type === "BUET"
      ? "bg-accent/20 text-teal border-accent/30"
      : "bg-primary/20 text-gold border-primary/30";

  const getRawId = (student: Student) =>
    submittedRaw.find((r) => 10000 + Number(r.id) === student.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-gold" />
            Student Profiles
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Complete searchable database of all CCPC admitted students
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg border border-border">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-3 text-xs font-display ${viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("table")}
            >
              Table
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-3 text-xs font-display ${viewMode === "cards" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("cards")}
            >
              Cards
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSubmitted}
            disabled={isFetchingSubmitted}
            className="gap-2 border-border hover:border-primary/40 font-body text-sm"
          >
            {isFetchingSubmitted ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="border-border">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or institution..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary border-border font-body"
            />
          </div>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-32 bg-secondary border-border">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Years</SelectItem>
              {Array.from(new Set(combinedStudents.map((s) => s.year)))
                .sort((a, b) => b - a)
                .map((yr) => (
                  <SelectItem key={yr} value={String(yr)}>
                    HSC {yr}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select value={examFilter} onValueChange={setExamFilter}>
            <SelectTrigger className="w-36 bg-secondary border-border">
              <SelectValue placeholder="Exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Exams</SelectItem>
              <SelectItem value="BUET">BUET</SelectItem>
              <SelectItem value="Medical">Medical</SelectItem>
            </SelectContent>
          </Select>
          <Badge
            variant="outline"
            className="self-center px-3 py-2 font-mono whitespace-nowrap"
          >
            {filtered.length} found
          </Badge>
        </CardContent>
      </Card>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-display font-bold text-gold">
              {combinedStudents.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Students</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-display font-bold text-teal">
              {combinedStudents.filter((s) => s.examType === "BUET").length}
            </div>
            <div className="text-xs text-muted-foreground">BUET</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-display font-bold text-gold">
              {combinedStudents.filter((s) => s.examType === "Medical").length}
            </div>
            <div className="text-xs text-muted-foreground">Medical</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-display font-bold text-orange flex items-center justify-center gap-1">
              {submittedStudents.filter((s) => s.hasStarAchievement).length >
              0 ? (
                <>
                  <Star className="w-5 h-5 fill-orange text-orange" />
                  {submittedStudents.filter((s) => s.hasStarAchievement).length}
                </>
              ) : isFetchingSubmitted ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                submittedStudents.length
              )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Upload className="w-3 h-3" />
              {submittedStudents.filter((s) => s.hasStarAchievement).length > 0
                ? "Star Achievements"
                : "Submitted"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards View */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p>No students found matching your search.</p>
            </div>
          ) : (
            filtered.map((student, i) => {
              const rawEntry = getRawId(student);
              return (
                <StudentCard
                  key={student.id}
                  student={student}
                  index={i}
                  isAdmin={isAdmin}
                  onDelete={
                    student.isSubmitted && rawEntry
                      ? () => handleDelete(rawEntry.id)
                      : undefined
                  }
                  onGrantStar={
                    isAdmin && student.isSubmitted && rawEntry
                      ? (note) => handleGrantStar(rawEntry.id, note)
                      : undefined
                  }
                  onRemoveStar={
                    isAdmin && student.isSubmitted && rawEntry
                      ? () => handleRemoveStar(rawEntry.id)
                      : undefined
                  }
                  isDeleting={
                    rawEntry !== undefined && deletingId === rawEntry.id
                  }
                  isStarring={
                    rawEntry !== undefined && starringId === rawEntry.id
                  }
                />
              );
            })
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card className="border-border overflow-hidden">
          <CardHeader className="pb-2 border-b border-border">
            <CardTitle className="font-display text-base">
              All Students ({filtered.length})
            </CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30 hover:bg-secondary/30 border-border">
                  <TableHead className="w-10 text-xs font-display font-semibold text-muted-foreground">
                    #
                  </TableHead>
                  <TableHead
                    className="text-xs font-display font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Name <SortIcon col="name" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-xs font-display font-semibold text-muted-foreground cursor-pointer hover:text-foreground hidden sm:table-cell"
                    onClick={() => handleSort("section")}
                  >
                    <div className="flex items-center gap-1">
                      Sec <SortIcon col="section" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-xs font-display font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("year")}
                  >
                    <div className="flex items-center gap-1">
                      Year <SortIcon col="year" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-xs font-display font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("examType")}
                  >
                    <div className="flex items-center gap-1">
                      Exam <SortIcon col="examType" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-xs font-display font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("institution")}
                  >
                    <div className="flex items-center gap-1">
                      Institution <SortIcon col="institution" />
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-display font-semibold text-muted-foreground text-right hidden md:table-cell">
                    Rank / Roll
                  </TableHead>
                  <TableHead className="w-24 text-xs font-display font-semibold text-muted-foreground text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((student, i) => {
                  const rawEntry = getRawId(student);
                  const isBeingDeleted =
                    rawEntry !== undefined && deletingId === rawEntry.id;
                  const isBeingStarred =
                    rawEntry !== undefined && starringId === rawEntry.id;

                  return (
                    <TableRow
                      key={student.id}
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.3s ease-out ${Math.min(i * 0.015, 0.4)}s forwards`,
                      }}
                      className={`border-border/50 hover:bg-secondary/20 ${
                        student.hasStarAchievement
                          ? "bg-orange/3"
                          : student.isSubmitted
                            ? "bg-primary/3"
                            : ""
                      }`}
                    >
                      <TableCell className="text-xs text-muted-foreground font-mono py-2.5">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-sm py-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {student.hasStarAchievement ? (
                            <span className="text-orange font-display font-semibold text-sm">
                              {student.name}
                            </span>
                          ) : (
                            <span>{student.name}</span>
                          )}
                          {student.hasStarAchievement && (
                            <Star className="w-3.5 h-3.5 text-orange fill-orange flex-shrink-0" />
                          )}
                          {student.highlight && !student.hasStarAchievement && (
                            <span className="ml-1 text-gold text-xs">⭐</span>
                          )}
                          {student.isSubmitted && (
                            <Badge className="text-xs bg-primary/15 text-gold/80 border border-primary/25 px-1.5 py-0 font-mono pointer-events-none">
                              Submitted
                            </Badge>
                          )}
                        </div>
                        {student.hasStarAchievement && student.starNote && (
                          <span className="text-xs text-orange/70 font-body mt-0.5 block">
                            {student.starNote}
                          </span>
                        )}
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
                          className="text-xs font-mono px-1.5"
                        >
                          {student.year}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge
                          variant="outline"
                          className={`text-xs font-mono px-1.5 ${getExamBadgeClass(student.examType)}`}
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
                        ) : student.rollNo ? (
                          <span className="font-mono text-xs text-muted-foreground">
                            {student.rollNo}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/30 text-xs">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-2.5 text-center w-24">
                        <div className="flex items-center justify-center gap-1">
                          {/* Delete — available to all on submitted students */}
                          {student.isSubmitted && rawEntry && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-7 h-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(rawEntry.id)}
                              disabled={deletingId !== null || isBeingStarred}
                              title="Delete submitted student"
                            >
                              {isBeingDeleted ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          )}

                          {/* Star grant / remove — admin only */}
                          {isAdmin &&
                            student.isSubmitted &&
                            rawEntry &&
                            (student.hasStarAchievement ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-7 h-7 p-0 text-orange hover:text-muted-foreground hover:bg-secondary"
                                onClick={() => handleRemoveStar(rawEntry.id)}
                                disabled={isBeingStarred || isBeingDeleted}
                                title="Remove star achievement"
                              >
                                {isBeingStarred ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Star className="w-3.5 h-3.5 fill-orange" />
                                )}
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-7 h-7 p-0 text-muted-foreground hover:text-orange hover:bg-orange/10"
                                onClick={() => handleGrantStar(rawEntry.id, "")}
                                disabled={isBeingStarred || isBeingDeleted}
                                title="Grant star achievement"
                              >
                                {isBeingStarred ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Star className="w-3.5 h-3.5" />
                                )}
                              </Button>
                            ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p>No students found matching your search.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
