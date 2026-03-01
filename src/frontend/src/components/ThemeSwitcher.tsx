import { Check, Palette } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const THEME_KEY = "ccpc-theme";

interface ThemeOption {
  id: string;
  name: string;
  swatch1: string;
  swatch2: string;
  className: string;
}

const THEMES: ThemeOption[] = [
  {
    id: "default",
    name: "CCPC Default",
    swatch1: "oklch(0.10 0.018 265)",
    swatch2: "oklch(0.62 0.22 27)",
    className: "",
  },
  {
    id: "ocean",
    name: "Ocean Blue",
    swatch1: "oklch(0.12 0.04 230)",
    swatch2: "oklch(0.55 0.20 230)",
    className: "theme-ocean",
  },
  {
    id: "forest",
    name: "Forest Green",
    swatch1: "oklch(0.11 0.03 150)",
    swatch2: "oklch(0.55 0.18 150)",
    className: "theme-forest",
  },
  {
    id: "sunset",
    name: "Sunset Orange",
    swatch1: "oklch(0.11 0.03 40)",
    swatch2: "oklch(0.65 0.22 40)",
    className: "theme-sunset",
  },
  {
    id: "purple",
    name: "Royal Purple",
    swatch1: "oklch(0.11 0.04 300)",
    swatch2: "oklch(0.58 0.22 300)",
    className: "theme-purple",
  },
  {
    id: "rose",
    name: "Rose Gold",
    swatch1: "oklch(0.11 0.03 10)",
    swatch2: "oklch(0.65 0.18 10)",
    className: "theme-rose",
  },
  {
    id: "midnight",
    name: "Midnight Navy",
    swatch1: "oklch(0.09 0.03 265)",
    swatch2: "oklch(0.50 0.18 265)",
    className: "theme-midnight",
  },
];

const ALL_THEME_CLASSES = THEMES.filter((t) => t.className).map(
  (t) => t.className,
);

function applyTheme(themeId: string) {
  const root = document.documentElement;
  // Remove all theme classes
  root.classList.remove(...ALL_THEME_CLASSES);
  const theme = THEMES.find((t) => t.id === themeId);
  if (theme?.className) {
    root.classList.add(theme.className);
  }
  localStorage.setItem(THEME_KEY, themeId);
}

export function getStoredTheme(): string {
  return localStorage.getItem(THEME_KEY) ?? "default";
}

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>("default");
  const containerRef = useRef<HTMLDivElement>(null);

  // On mount: read from localStorage and apply
  useEffect(() => {
    const stored = getStoredTheme();
    setActiveTheme(stored);
    applyTheme(stored);
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  const handleSelect = (themeId: string) => {
    setActiveTheme(themeId);
    applyTheme(themeId);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute bottom-14 right-0 w-52 rounded-xl border border-border bg-card shadow-2xl shadow-black/40 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-border">
              <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">
                Color Theme
              </p>
            </div>
            <div className="py-1.5">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelect(theme.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-secondary/60 transition-colors text-left"
                >
                  {/* Color swatches */}
                  <div className="flex gap-0.5 shrink-0">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/10"
                      style={{ background: theme.swatch1 }}
                    />
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/10"
                      style={{ background: theme.swatch2 }}
                    />
                  </div>
                  <span className="flex-1 text-xs font-body text-foreground">
                    {theme.name}
                  </span>
                  {activeTheme === theme.id && (
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="w-11 h-11 rounded-full bg-card border border-border shadow-lg shadow-black/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
        aria-label="Change color theme"
        title="Change color theme"
      >
        <Palette className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
