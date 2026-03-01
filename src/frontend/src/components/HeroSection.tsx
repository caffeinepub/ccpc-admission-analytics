import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Award,
  Check,
  Edit2,
  GraduationCap,
  Plus,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { buet2024, medical2024, medical2025 } from "../data";

const stats = [
  {
    label: "BUET Admissions",
    value: buet2024.length,
    year: "HSC 2024",
    icon: GraduationCap,
    color: "text-gold",
    bg: "bg-primary/10",
    border: "border-primary/30",
  },
  {
    label: "Medical Admissions",
    value: medical2024.length,
    year: "HSC 2024",
    icon: Award,
    color: "text-teal",
    bg: "bg-accent/10",
    border: "border-accent/30",
  },
  {
    label: "Medical Admissions",
    value: medical2025.length,
    year: "HSC 2025",
    icon: TrendingUp,
    color: "text-gold",
    bg: "bg-primary/10",
    border: "border-primary/30",
  },
];

interface HeroSectionProps {
  starAnnouncements: Array<{ id: number; emoji: string; text: string }>;
  isAdmin?: boolean;
  onAddAnnouncement?: (emoji: string, text: string) => void;
  onEditAnnouncement?: (id: number, emoji: string, text: string) => void;
  onRemoveAnnouncement?: (id: number) => void;
}

export default function HeroSection({
  starAnnouncements,
  isAdmin = false,
  onAddAnnouncement,
  onEditAnnouncement,
  onRemoveAnnouncement,
}: HeroSectionProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftEmoji, setDraftEmoji] = useState("");
  const [draftText, setDraftText] = useState("");

  // Inline add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addEmoji, setAddEmoji] = useState("⭐");
  const [addText, setAddText] = useState("");

  const startEditing = (id: number, emoji: string, text: string) => {
    setEditingId(id);
    setDraftEmoji(emoji);
    setDraftText(text);
  };

  const saveEditing = (id: number) => {
    onEditAnnouncement?.(id, draftEmoji, draftText);
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  return (
    <header className="relative overflow-hidden border-b border-border">
      {/* Background grid pattern */}
      <div className="absolute inset-0 hero-grid opacity-40" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative container max-w-7xl mx-auto px-4 pt-12 pb-10">
        {/* College Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-4"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono font-semibold text-gold tracking-widest uppercase">
              Official Analytics Dashboard
            </span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            <span className="text-foreground">Chattogram Cantonment</span>
            <br />
            <span className="text-gold">Public College</span>
          </h1>
          <p className="mt-3 text-muted-foreground font-body text-lg md:text-xl max-w-2xl">
            Excellence in Education —{" "}
            <span className="text-teal font-semibold">
              Admission Analytics Dashboard
            </span>
          </p>
          <p className="mt-1 text-muted-foreground/60 text-sm font-mono">
            CCPC · Tracking Success Across Bangladesh's Premier Institutions
          </p>
        </motion.div>

        {/* Stat Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={`${stat.label}-${stat.year}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className={`relative glass rounded-xl border ${stat.border} p-5 overflow-hidden`}
            >
              <div className={`inline-flex p-2.5 rounded-lg ${stat.bg} mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="stat-counter text-4xl font-display font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm font-body font-semibold text-muted-foreground mt-1">
                {stat.label}
              </div>
              <div className={`text-xs font-mono ${stat.color} mt-0.5`}>
                {stat.year}
              </div>
              {/* Decorative corner */}
              <div
                className={`absolute top-0 right-0 w-16 h-16 ${stat.bg} rounded-bl-3xl opacity-50`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Achievement Announcements */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 space-y-2"
        >
          <AnimatePresence mode="popLayout">
            {starAnnouncements.map((announcement) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                layout
              >
                {editingId === announcement.id ? (
                  /* Inline edit mode */
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/30 max-w-2xl flex-wrap">
                    <Input
                      value={draftEmoji}
                      onChange={(e) => setDraftEmoji(e.target.value)}
                      maxLength={2}
                      className="w-12 h-8 text-center text-lg bg-secondary border-primary/30 focus:border-primary px-1 font-mono shrink-0"
                      aria-label="Emoji"
                    />
                    <Input
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      className="flex-1 min-w-[160px] h-8 text-sm bg-secondary border-primary/30 focus:border-primary px-2 font-body"
                      aria-label="Announcement text"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEditing(announcement.id);
                        if (e.key === "Escape") cancelEditing();
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => saveEditing(announcement.id)}
                      className="text-green-500 hover:text-green-400 transition-colors shrink-0"
                      aria-label="Save"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      aria-label="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Display mode */
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/25 max-w-fit group">
                    <span className="text-xl shrink-0">
                      {announcement.emoji}
                    </span>
                    <p className="text-sm font-body text-foreground/80">
                      {announcement.text}
                    </p>
                    {isAdmin && (
                      <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            startEditing(
                              announcement.id,
                              announcement.emoji,
                              announcement.text,
                            )
                          }
                          className="p-1 rounded text-orange-400 hover:text-orange-300 hover:bg-orange-400/10 transition-colors"
                          aria-label="Edit announcement"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onRemoveAnnouncement?.(announcement.id)
                          }
                          className="p-1 rounded text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label="Remove announcement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Announcement — admin only */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <AnimatePresence mode="wait">
                {showAddForm ? (
                  <motion.div
                    key="add-form"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-orange-400/10 border border-orange-400/30 max-w-2xl flex-wrap mt-1"
                  >
                    <Input
                      value={addEmoji}
                      onChange={(e) => setAddEmoji(e.target.value)}
                      maxLength={2}
                      className="w-12 h-8 text-center text-lg bg-secondary border-orange-400/30 focus:border-orange-400 px-1 font-mono shrink-0"
                      aria-label="Emoji"
                      placeholder="⭐"
                    />
                    <Input
                      value={addText}
                      onChange={(e) => setAddText(e.target.value)}
                      className="flex-1 min-w-[160px] h-8 text-sm bg-secondary border-orange-400/30 focus:border-orange-400 px-2 font-body"
                      aria-label="Announcement text"
                      placeholder="Enter announcement text..."
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && addText.trim()) {
                          onAddAnnouncement?.(addEmoji || "⭐", addText.trim());
                          setAddEmoji("⭐");
                          setAddText("");
                          setShowAddForm(false);
                        }
                        if (e.key === "Escape") {
                          setShowAddForm(false);
                          setAddEmoji("⭐");
                          setAddText("");
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (addText.trim()) {
                          onAddAnnouncement?.(addEmoji || "⭐", addText.trim());
                          setAddEmoji("⭐");
                          setAddText("");
                          setShowAddForm(false);
                        }
                      }}
                      className="text-green-500 hover:text-green-400 transition-colors shrink-0"
                      aria-label="Save announcement"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setAddEmoji("⭐");
                        setAddText("");
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      aria-label="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="add-btn">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddForm(true)}
                      className="gap-1.5 text-orange-400 hover:text-orange-300 hover:bg-orange-400/10 border border-dashed border-orange-400/40 hover:border-orange-400/70 h-8 px-3 text-xs font-display transition-colors mt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Announcement
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </header>
  );
}
