import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Loader2,
  Plus,
  SendHorizontal,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

interface FormState {
  name: string;
  institution: string;
  section: string;
  department: string;
  rank: string;
  examType: string;
  year: string;
}

const initialForm: FormState = {
  name: "",
  institution: "",
  section: "",
  department: "",
  rank: "",
  examType: "Medical",
  year: "2025",
};

const EXAM_TYPE_SUGGESTIONS = [
  "Medical",
  "BUET",
  "DU Ka Unit",
  "DU Kha Unit",
  "CUET",
  "KUET",
  "RUET",
  "JU",
  "CU",
  "RU",
];

interface ExamTypeComboboxProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

function ExamTypeCombobox({
  value,
  onChange,
  disabled,
}: ExamTypeComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputVal, setInputVal] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    setInputVal(value);
  }, [value]);

  const filtered = EXAM_TYPE_SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(inputVal.toLowerCase()),
  );

  const handleSelect = (suggestion: string) => {
    setInputVal(suggestion);
    onChange(suggestion);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInputVal(v);
    onChange(v);
    setOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          value={inputVal}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder="e.g. Medical, BUET, CUET…"
          disabled={disabled}
          className="bg-secondary border-border font-body focus:border-primary/60 pr-8"
          autoComplete="off"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen((o) => !o)}
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
            transition={{ duration: 0.12 }}
            style={{ transformOrigin: "top" }}
            className="absolute z-50 mt-1 w-full bg-card border border-border rounded-md shadow-xl overflow-hidden max-h-56 overflow-y-auto"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-xs text-muted-foreground">
                Press Enter or keep typing a custom value
              </li>
            ) : (
              filtered.map((suggestion) => (
                <li
                  key={suggestion}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(suggestion);
                  }}
                  className={`px-3 py-2 text-sm cursor-pointer font-body transition-colors flex items-center gap-2
                    ${
                      suggestion === value
                        ? "bg-sky-500/20 text-sky-300 font-semibold"
                        : "hover:bg-sky-500/10 hover:text-sky-300 text-foreground"
                    }`}
                >
                  {suggestion === "Medical" && (
                    <Badge className="text-xs bg-primary/20 text-gold border-primary/30 px-1.5 py-0 pointer-events-none">
                      Medical
                    </Badge>
                  )}
                  {suggestion === "BUET" && (
                    <Badge className="text-xs bg-accent/20 text-teal border-accent/30 px-1.5 py-0 pointer-events-none">
                      BUET
                    </Badge>
                  )}
                  {suggestion !== "Medical" && suggestion !== "BUET" && (
                    <Badge className="text-xs bg-sky-500/20 text-sky-300 border-sky-500/30 px-1.5 py-0 pointer-events-none">
                      {suggestion}
                    </Badge>
                  )}
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SubmitStudentFormProps {
  onStudentSubmitted?: () => void;
}

export default function SubmitStudentForm({
  onStudentSubmitted,
}: SubmitStudentFormProps) {
  const { actor } = useActor();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.institution.trim()) errors.institution = "Institution is required";
  if (!form.examType.trim()) errors.examType = "Exam type is required";

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      if (!actor) throw new Error("Backend not ready. Please try again.");
      const rankValue = form.rank.trim()
        ? BigInt(Number.parseInt(form.rank.trim(), 10))
        : null;
      await actor.submitStudent(
        form.name.trim(),
        form.institution.trim(),
        form.section.trim(),
        form.department.trim(),
        rankValue,
        form.examType,
        BigInt(Number.parseInt(form.year, 10)),
      );
      setStatus("success");
      setForm(initialForm);
      onStudentSubmitted?.();
    } catch (err) {
      console.error("Submit failed:", err);
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/25">
            <GraduationCap className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Exam Form
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              Submit student exam results to the analytics
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <Card className="border-border shadow-lg">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
              <Plus className="w-4 h-4 text-gold" />
              Student Information
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Fill in the student's details. Name and Institution are required.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="font-display font-semibold text-sm text-foreground"
                >
                  Full Name <span className="text-gold">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Tanrum Nur Seeam"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`bg-secondary border-border font-body focus:border-primary/60 ${
                    errors.name ? "border-destructive/60" : ""
                  }`}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Institution */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="institution"
                  className="font-display font-semibold text-sm text-foreground"
                >
                  Institution <span className="text-gold">*</span>
                </Label>
                <Input
                  id="institution"
                  placeholder="e.g. Dhaka Medical College"
                  value={form.institution}
                  onChange={(e) => handleChange("institution", e.target.value)}
                  className={`bg-secondary border-border font-body focus:border-primary/60 ${
                    errors.institution ? "border-destructive/60" : ""
                  }`}
                  disabled={isSubmitting}
                />
                {errors.institution && (
                  <p className="text-xs text-destructive">
                    {errors.institution}
                  </p>
                )}
              </div>

              <Separator className="bg-border/50" />

              {/* Section + Rank row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="section"
                    className="font-display font-semibold text-sm text-foreground"
                  >
                    Section
                    <span className="text-muted-foreground font-normal ml-1 text-xs">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="section"
                    placeholder="e.g. A, B, C…"
                    maxLength={2}
                    value={form.section}
                    onChange={(e) =>
                      handleChange("section", e.target.value.toUpperCase())
                    }
                    className="bg-secondary border-border font-mono focus:border-primary/60 uppercase"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="rank"
                    className="font-display font-semibold text-sm text-foreground"
                  >
                    Rank
                    <span className="text-muted-foreground font-normal ml-1 text-xs">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="rank"
                    type="number"
                    placeholder="e.g. 143"
                    min={1}
                    value={form.rank}
                    onChange={(e) => handleChange("rank", e.target.value)}
                    className="bg-secondary border-border font-mono focus:border-primary/60"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="department"
                  className="font-display font-semibold text-sm text-foreground"
                >
                  Department
                  <span className="text-muted-foreground font-normal ml-1 text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="department"
                  placeholder="e.g. EEE, Civil Engineering, Medicine"
                  value={form.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  className="bg-secondary border-border font-body focus:border-primary/60"
                  disabled={isSubmitting}
                />
              </div>

              {/* Exam Type + Year row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-display font-semibold text-sm text-foreground">
                    Exam Type <span className="text-gold">*</span>
                  </Label>
                  <ExamTypeCombobox
                    value={form.examType}
                    onChange={(v) => handleChange("examType", v)}
                    disabled={isSubmitting}
                  />
                  {errors.examType && (
                    <p className="text-xs text-destructive">
                      {errors.examType}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="font-display font-semibold text-sm text-foreground">
                    HSC Year <span className="text-gold">*</span>
                  </Label>
                  <Select
                    value={form.year}
                    onValueChange={(v) => handleChange("year", v)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-secondary border-border w-full">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2028">HSC 2028</SelectItem>
                      <SelectItem value="2027">HSC 2027</SelectItem>
                      <SelectItem value="2026">HSC 2026</SelectItem>
                      <SelectItem value="2025">HSC 2025</SelectItem>
                      <SelectItem value="2024">HSC 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Status feedback */}
              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/25 text-green-400 text-sm font-body"
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    Student submitted successfully! They will appear in the
                    Student Profiles tab.
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive text-sm font-body"
                  >
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    {errorMsg || "Submission failed. Please try again."}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold gap-2 h-11"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <SendHorizontal className="w-4 h-4" />
                    Submit Student
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-center text-xs text-muted-foreground/60 font-body"
      >
        Submitted students appear immediately in the Student Profiles tab and
        can be removed by an admin.
      </motion.p>
    </div>
  );
}
