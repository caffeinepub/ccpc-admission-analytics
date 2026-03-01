import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Hash, Loader2, Star, StarOff, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Student } from "../data";

interface StudentCardProps {
  student: Student;
  index: number;
  isAdmin?: boolean;
  onDelete?: () => void | Promise<void>;
  onGrantStar?: (note: string) => void | Promise<void>;
  onRemoveStar?: () => void | Promise<void>;
  isDeleting?: boolean;
  isStarring?: boolean;
}

const sectionColors: Record<string, string> = {
  A: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  B: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  C: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  D: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  E: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  F: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  G: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  H: "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

const deptColors: Record<string, string> = {
  EEE: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  ME: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  "Civil Engineering": "bg-green-500/20 text-green-300 border-green-500/30",
  "Chemical Engineering": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  NCE: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

export default function StudentCard({
  student,
  index,
  isAdmin = false,
  onDelete,
  onGrantStar,
  onRemoveStar,
  isDeleting = false,
  isStarring = false,
}: StudentCardProps) {
  const isHighlight = !!student.highlight || !!student.hasStarAchievement;
  const hasStar = !!student.hasStarAchievement;
  const initials = student.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const [showNoteInput, setShowNoteInput] = useState(false);
  const [starNote, setStarNote] = useState("");

  const handleGrantStar = async () => {
    if (!onGrantStar) return;
    await onGrantStar(starNote);
    setShowNoteInput(false);
    setStarNote("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.6), duration: 0.35 }}
    >
      <Card
        className={`relative overflow-hidden card-hover border transition-all ${
          hasStar
            ? "star-achievement border-orange/40"
            : isHighlight
              ? "border-primary/50 bg-primary/5 glow-gold"
              : "border-border hover:border-border/80"
        }`}
      >
        {hasStar && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange to-transparent" />
        )}
        {!hasStar && isHighlight && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
        )}

        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-bold ${
                hasStar
                  ? "bg-orange/20 text-orange border border-orange/40"
                  : isHighlight
                    ? "bg-primary/25 text-gold border border-primary/40"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              {/* Name */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`font-display font-semibold text-sm truncate ${
                    hasStar
                      ? "text-orange"
                      : isHighlight
                        ? "text-gold"
                        : "text-foreground"
                  }`}
                >
                  {student.name}
                </span>
                {hasStar && (
                  <Star className="w-3.5 h-3.5 text-orange flex-shrink-0 fill-orange" />
                )}
                {!hasStar && isHighlight && (
                  <Star className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                )}
                {student.quota && (
                  <Badge className="text-xs bg-violet-500/20 text-violet-300 border-violet-500/30 px-1.5 py-0">
                    Tribal
                  </Badge>
                )}
                {student.isSubmitted && (
                  <Badge className="text-xs bg-primary/15 text-gold/80 border border-primary/25 px-1.5 py-0 font-mono pointer-events-none">
                    Submitted
                  </Badge>
                )}
              </div>

              {/* Star Achievement Badge */}
              {hasStar && (
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange/15 border border-orange/30 text-orange font-semibold glow-star">
                    <Star className="w-3 h-3 fill-orange" />
                    {student.starNote ? student.starNote : "Star Achievement"}
                  </span>
                </div>
              )}

              {/* Section & Year */}
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                {student.section && student.section !== "-" && (
                  <Badge
                    variant="outline"
                    className={`text-xs px-1.5 py-0 font-mono ${sectionColors[student.section] ?? "bg-muted text-muted-foreground"}`}
                  >
                    Sec-{student.section}
                  </Badge>
                )}
                {student.department && (
                  <Badge
                    variant="outline"
                    className={`text-xs px-1.5 py-0 font-mono ${deptColors[student.department] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {student.department}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={`text-xs px-1.5 py-0 font-mono ${
                    student.examType === "BUET"
                      ? "bg-teal/10 text-teal border-teal/30"
                      : "bg-primary/10 text-gold border-primary/30"
                  }`}
                >
                  {student.examType}
                </Badge>
              </div>

              {/* Institution */}
              <div className="flex items-center gap-1 mt-1.5">
                <BookOpen className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground truncate">
                  {student.institution}
                </span>
              </div>

              {/* Rank / Roll */}
              {(student.rank ?? student.rollNo) && (
                <div className="flex items-center gap-1 mt-1">
                  <Hash className="w-3 h-3 text-teal flex-shrink-0" />
                  <span className="text-xs font-mono text-teal">
                    {student.rank
                      ? `Rank ${student.rank}`
                      : `Roll ${student.rollNo}`}
                  </span>
                </div>
              )}

              {/* Highlight text */}
              {!hasStar && isHighlight && student.highlight && (
                <p className="text-xs text-gold/80 mt-1.5 font-semibold">
                  {student.highlight}
                </p>
              )}

              {/* Admin actions for submitted students */}
              {student.isSubmitted &&
                (onDelete || (isAdmin && (onGrantStar || onRemoveStar))) && (
                  <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-border/30">
                    {/* Delete button — visible to all who have onDelete */}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={onDelete}
                        disabled={isDeleting || isStarring}
                        title="Delete student"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        Delete
                      </Button>
                    )}

                    {/* Star buttons — admin only */}
                    {isAdmin && !hasStar && onGrantStar && !showNoteInput && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 gap-1.5 text-xs text-muted-foreground hover:text-orange hover:bg-orange/10"
                        onClick={() => setShowNoteInput(true)}
                        disabled={isStarring || isDeleting}
                        title="Grant star achievement"
                      >
                        <Star className="w-3 h-3" />
                        Grant Star
                      </Button>
                    )}
                    {isAdmin && hasStar && onRemoveStar && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 gap-1.5 text-xs text-orange hover:text-muted-foreground hover:bg-secondary"
                        onClick={onRemoveStar}
                        disabled={isStarring || isDeleting}
                        title="Remove star achievement"
                      >
                        {isStarring ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <StarOff className="w-3 h-3" />
                        )}
                        Remove Star
                      </Button>
                    )}
                  </div>
                )}

              {/* Note input for star grant */}
              {showNoteInput && isAdmin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2 mt-2.5 pt-2 border-t border-border/30 overflow-hidden"
                >
                  <Input
                    placeholder="Achievement note (optional)"
                    value={starNote}
                    onChange={(e) => setStarNote(e.target.value)}
                    className="h-7 text-xs bg-secondary border-border font-body focus:border-orange/40 flex-1"
                    disabled={isStarring}
                  />
                  <Button
                    size="sm"
                    className="h-7 px-2.5 gap-1 text-xs bg-orange hover:bg-orange/90 text-white border-0"
                    onClick={handleGrantStar}
                    disabled={isStarring}
                  >
                    {isStarring ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Star className="w-3 h-3 fill-current" />
                    )}
                    Award
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setShowNoteInput(false);
                      setStarNote("");
                    }}
                    disabled={isStarring}
                  >
                    ✕
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
