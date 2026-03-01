import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart2,
  Check,
  ExternalLink,
  Info,
  Loader2,
  Pencil,
  Sparkles,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
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
  medical2024,
  medical2025,
  collegeComparisons as rawCollegeComparisons,
} from "../data";
import {
  type AIProvider,
  AI_PROVIDERS,
  CCPC_ANALYSIS_PROMPT,
  callAIProvider,
  parseAIResponse,
} from "../utils/aiService";
import AISettingsModal from "./AISettingsModal";

const AI_KEYS_STORAGE = "ccpc-ai-keys";
const COMPARISON_STORAGE = "ccpc-comparison-data";

interface CollegeComparison {
  college: string;
  city: string;
  buet2025Est: number;
  medical2025Est: number;
  isHighlighted: boolean;
}

interface AchievementItem {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface TopCollegeItem {
  name: string;
  count: number;
  full: string;
}

interface ComparisonState {
  achievements: AchievementItem[];
  comparisonData: CollegeComparison[];
  topColleges: TopCollegeItem[];
  dataSourceNote: string;
  aiSummary: string;
  lastAiRefresh: number;
  lastAiProvider: string;
}

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

const initialAchievements: AchievementItem[] = [
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

const initialTopColleges: TopCollegeItem[] = [
  { name: "CMC", count: 13, full: "Chattogram Medical College" },
  { name: "CBMC", count: 4, full: "Cox's Bazar Medical College" },
  { name: "ChMC", count: 4, full: "Chandpur Medical College" },
  { name: "SOMC", count: 2, full: "MAG Osmani Medical College" },
  { name: "RaMC", count: 2, full: "Rangamati Medical College" },
];

const initialComparisonData: CollegeComparison[] = rawCollegeComparisons.map(
  (c) => ({
    college: c.college,
    city: c.city,
    buet2025Est: c.buet2025Est,
    medical2025Est: c.medical2025Est,
    isHighlighted: c.isHighlighted ?? false,
  }),
);

const ACHIEVEMENT_COLORS = [
  "border-primary/30 bg-primary/8",
  "border-accent/30 bg-accent/8",
  "border-primary/30 bg-primary/8",
  "border-accent/30 bg-accent/8",
];

interface ComparisonTabProps {
  isAdmin?: boolean;
  sessionToken?: string | null;
}

export default function ComparisonTab({
  isAdmin = false,
  sessionToken: _sessionToken,
}: ComparisonTabProps) {
  const [achievements, setAchievements] =
    useState<AchievementItem[]>(initialAchievements);
  const [comparisonData, setComparisonData] = useState<CollegeComparison[]>(
    initialComparisonData,
  );
  const [topColleges, setTopColleges] =
    useState<TopCollegeItem[]>(initialTopColleges);
  const [dataSourceNote, setDataSourceNote] = useState(
    "Comparison data for other colleges is estimated from publicly available Udvash-Unmesh rankings (2025). CCPC data is exact as reported.",
  );

  // AI state
  const [aiSummary, setAiSummary] = useState("");
  const [lastAiRefresh, setLastAiRefresh] = useState(0);
  const [lastAiProvider, setLastAiProvider] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>("grok");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [showAISettings, setShowAISettings] = useState(false);

  // Editing state
  const [editingDataSource, setEditingDataSource] = useState(false);
  const [draftDataSource, setDraftDataSource] = useState(dataSourceNote);
  const [editingAchIdx, setEditingAchIdx] = useState<number | null>(null);
  const [achDraft, setAchDraft] = useState<AchievementItem | null>(null);
  const [editingColIdx, setEditingColIdx] = useState<number | null>(null);
  const [colDraftBuet, setColDraftBuet] = useState("");
  const [colDraftMed, setColDraftMed] = useState("");
  const [editingTopIdx, setEditingTopIdx] = useState<number | null>(null);
  const [topDraftCount, setTopDraftCount] = useState("");

  // Load persisted data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COMPARISON_STORAGE);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ComparisonState>;
        if (parsed.achievements) setAchievements(parsed.achievements);
        if (parsed.comparisonData) setComparisonData(parsed.comparisonData);
        if (parsed.topColleges) setTopColleges(parsed.topColleges);
        if (parsed.dataSourceNote) setDataSourceNote(parsed.dataSourceNote);
        if (parsed.aiSummary) setAiSummary(parsed.aiSummary);
        if (parsed.lastAiRefresh) setLastAiRefresh(parsed.lastAiRefresh);
        if (parsed.lastAiProvider) setLastAiProvider(parsed.lastAiProvider);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  function persistState(overrides: Partial<ComparisonState> = {}) {
    const state: ComparisonState = {
      achievements: overrides.achievements ?? achievements,
      comparisonData: overrides.comparisonData ?? comparisonData,
      topColleges: overrides.topColleges ?? topColleges,
      dataSourceNote: overrides.dataSourceNote ?? dataSourceNote,
      aiSummary: overrides.aiSummary ?? aiSummary,
      lastAiRefresh: overrides.lastAiRefresh ?? lastAiRefresh,
      lastAiProvider: overrides.lastAiProvider ?? lastAiProvider,
    };
    localStorage.setItem(COMPARISON_STORAGE, JSON.stringify(state));
  }

  const handleRunAI = async () => {
    const rawKeys = localStorage.getItem(AI_KEYS_STORAGE);
    let apiKey = "";
    if (rawKeys) {
      try {
        const parsed = JSON.parse(rawKeys) as Record<string, string>;
        apiKey = parsed[selectedProvider] ?? "";
      } catch {
        // ignore
      }
    }

    if (!apiKey.trim()) {
      setAiError(
        `No API key set for ${AI_PROVIDERS[selectedProvider].label}. Click "AI Settings" to add your key.`,
      );
      return;
    }

    setIsAiLoading(true);
    setAiError("");

    try {
      const raw = await callAIProvider(
        selectedProvider,
        apiKey,
        CCPC_ANALYSIS_PROMPT,
      );
      const result = parseAIResponse(raw);

      if (result) {
        const updatedAchievements: AchievementItem[] = result.achievements.map(
          (a, i) => ({
            icon: a.icon,
            title: a.title,
            description: a.description,
            color: ACHIEVEMENT_COLORS[i % ACHIEVEMENT_COLORS.length],
          }),
        );

        const updatedComparisons: CollegeComparison[] =
          result.collegeComparisons.map((c) => ({
            college: c.college,
            city: c.city,
            buet2025Est: c.buet2025Est,
            medical2025Est: c.medical2025Est,
            isHighlighted: c.college === "CCPC",
          }));

        const now = Date.now();
        const providerLabel = AI_PROVIDERS[selectedProvider].label;

        setAchievements(updatedAchievements);
        setComparisonData(updatedComparisons);
        setAiSummary(result.summary);
        setLastAiRefresh(now);
        setLastAiProvider(providerLabel);
        setAiError("");

        persistState({
          achievements: updatedAchievements,
          comparisonData: updatedComparisons,
          aiSummary: result.summary,
          lastAiRefresh: now,
          lastAiProvider: providerLabel,
        });
      } else {
        setAiError(
          "Could not parse AI response. The model may not have returned valid JSON.",
        );
      }
    } catch (err) {
      setAiError(
        err instanceof Error
          ? err.message
          : "Unknown error calling AI provider",
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const chartData = comparisonData.map((c) => ({
    college: c.college,
    "BUET (Est.)": c.buet2025Est,
    "Medical (Est.)": c.medical2025Est,
    isHighlighted: c.isHighlighted,
  }));

  const maxTopCount = Math.max(...topColleges.map((c) => c.count), 1);

  const formattedRefreshDate =
    lastAiRefresh > 0
      ? new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(lastAiRefresh))
      : "";

  const providers = Object.keys(AI_PROVIDERS) as AIProvider[];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-gold" />
          Comparison &amp; Analysis
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          CCPC performance vs other leading colleges in Bangladesh
        </p>
      </div>

      {/* Data Source Note */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground group relative">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        {isAdmin && editingDataSource ? (
          <div className="flex-1 flex items-start gap-2">
            <Textarea
              value={draftDataSource}
              onChange={(e) => setDraftDataSource(e.target.value)}
              className="text-xs bg-secondary border-primary/30 focus:border-primary resize-none min-h-[60px] flex-1"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setDataSourceNote(draftDataSource);
                setEditingDataSource(false);
                persistState({ dataSourceNote: draftDataSource });
              }}
              className="text-green-500 hover:text-green-400 mt-0.5"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setEditingDataSource(false)}
              className="text-muted-foreground hover:text-destructive mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <p className="flex-1">
            {dataSourceNote}{" "}
            <span className="text-foreground/60">
              Sources: udvash-unmesh.com BUET, DU-Ka, DU-Kha college-wise PDFs.
            </span>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setDraftDataSource(dataSourceNote);
                  setEditingDataSource(true);
                }}
                className="ml-2 text-primary/40 hover:text-primary transition-colors"
              >
                <Pencil className="w-3 h-3 inline" />
              </button>
            )}
          </p>
        )}
      </div>

      {/* AI Auto-Update Section — admin only */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-gold/30 bg-card shadow-lg shadow-gold/5">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                AI Auto-Update
                <Badge className="ml-auto text-xs bg-gold/15 text-gold border border-gold/30 font-mono">
                  Admin
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Use AI to automatically refresh comparison data and achievement
                summaries
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Provider selector tabs */}
              <div>
                <p className="text-xs font-display font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Select AI Provider
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {providers.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedProvider(p)}
                      className={`rounded-lg border px-3 py-2 text-xs font-display font-semibold transition-all text-left ${
                        selectedProvider === p
                          ? "bg-primary/20 border-primary text-primary shadow-sm shadow-primary/20"
                          : "bg-secondary/40 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <span className="block text-base mb-1">
                        {p === "grok"
                          ? "⚡"
                          : p === "gemini"
                            ? "✨"
                            : p === "perplexity"
                              ? "🔍"
                              : "🌊"}
                      </span>
                      {AI_PROVIDERS[p].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider info row */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border">
                <span className="text-xs text-muted-foreground">
                  Using:{" "}
                  <span className="text-foreground font-semibold">
                    {AI_PROVIDERS[selectedProvider].label}
                  </span>
                </span>
                <a
                  href={AI_PROVIDERS[selectedProvider].docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary/60 hover:text-primary flex items-center gap-1 transition-colors"
                >
                  Docs
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Error display */}
              {aiError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                  <span className="flex-1">{aiError}</span>
                  <button
                    type="button"
                    onClick={() => setAiError("")}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                    aria-label="Dismiss error"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Run button */}
              <Button
                type="button"
                onClick={() => void handleRunAI()}
                disabled={isAiLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold gap-2 h-10"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analysing…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Run AI Analysis
                  </>
                )}
              </Button>

              {/* Bottom row: last refresh info + settings button */}
              <div className="flex items-center justify-between">
                {lastAiRefresh > 0 ? (
                  <p className="text-xs text-muted-foreground/70">
                    Last updated via{" "}
                    <span className="text-foreground/60 font-medium">
                      {lastAiProvider}
                    </span>{" "}
                    · {formattedRefreshDate}
                  </p>
                ) : (
                  <span />
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAISettings(true)}
                  className="gap-1.5 border-border text-muted-foreground hover:text-foreground hover:border-primary/40 text-xs h-7 px-2.5"
                >
                  ⚙️ AI Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* AI Summary card */}
      {aiSummary && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-gold/40 bg-gradient-to-br from-card to-gold/5 shadow-sm shadow-gold/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="text-xs bg-gold/20 text-gold border border-gold/40 font-display font-semibold">
                  ✨ AI-Generated Analysis
                </Badge>
                {lastAiProvider && (
                  <Badge
                    variant="outline"
                    className="text-xs border-border text-muted-foreground font-mono"
                  >
                    via {lastAiProvider}
                  </Badge>
                )}
                {formattedRefreshDate && (
                  <span className="text-xs text-muted-foreground/60 ml-auto">
                    Last updated: {formattedRefreshDate}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 leading-relaxed font-body">
                {aiSummary}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Achievement Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {achievements.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className={`border ${a.color} card-hover group relative`}>
              <CardContent className="p-4">
                {isAdmin && editingAchIdx === i && achDraft ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={achDraft.icon}
                        onChange={(e) =>
                          setAchDraft({ ...achDraft, icon: e.target.value })
                        }
                        className="h-7 w-16 text-sm bg-secondary border-primary/30 focus:border-primary text-center"
                        placeholder="emoji"
                      />
                      <Input
                        value={achDraft.title}
                        onChange={(e) =>
                          setAchDraft({ ...achDraft, title: e.target.value })
                        }
                        className="h-7 flex-1 text-sm bg-secondary border-primary/30 focus:border-primary"
                        placeholder="Title"
                      />
                    </div>
                    <Textarea
                      value={achDraft.description}
                      onChange={(e) =>
                        setAchDraft({
                          ...achDraft,
                          description: e.target.value,
                        })
                      }
                      className="text-xs bg-secondary border-primary/30 focus:border-primary resize-none min-h-[70px]"
                      placeholder="Description"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const updated = [...achievements];
                          updated[i] = achDraft;
                          setAchievements(updated);
                          setEditingAchIdx(null);
                          setAchDraft(null);
                          persistState({ achievements: updated });
                        }}
                        className="h-7 text-xs bg-green-600/80 hover:bg-green-600 text-white gap-1"
                      >
                        <Check className="w-3 h-3" /> Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingAchIdx(null);
                          setAchDraft(null);
                        }}
                        className="h-7 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-foreground text-sm">
                        {a.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {a.description}
                      </p>
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAchIdx(i);
                          setAchDraft({ ...a });
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-primary/50 hover:text-primary flex-shrink-0 self-start"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
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
                College Comparison: BUET &amp; Medical 2025
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
                {topColleges.map((col, i) => (
                  <div key={col.name} className="flex items-center gap-3 group">
                    <span className="text-xs font-mono text-muted-foreground w-4">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-foreground">
                          {col.full}
                        </span>
                        {isAdmin && editingTopIdx === i ? (
                          <span className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={topDraftCount}
                              onChange={(e) => setTopDraftCount(e.target.value)}
                              className="h-6 w-16 text-xs font-mono bg-secondary border-primary/30 focus:border-primary px-1.5"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const n = Number(topDraftCount);
                                  if (!Number.isNaN(n) && n > 0) {
                                    const updated = [...topColleges];
                                    updated[i] = { ...updated[i], count: n };
                                    setTopColleges(updated);
                                    persistState({ topColleges: updated });
                                  }
                                  setEditingTopIdx(null);
                                }
                                if (e.key === "Escape") setEditingTopIdx(null);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const n = Number(topDraftCount);
                                if (!Number.isNaN(n) && n > 0) {
                                  const updated = [...topColleges];
                                  updated[i] = { ...updated[i], count: n };
                                  setTopColleges(updated);
                                  persistState({ topColleges: updated });
                                }
                                setEditingTopIdx(null);
                              }}
                              className="text-green-500 hover:text-green-400"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTopIdx(null)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : (
                          <span
                            className={`text-xs font-mono text-gold font-bold flex items-center gap-1 ${isAdmin ? "cursor-pointer" : ""}`}
                            onClick={() => {
                              if (isAdmin) {
                                setEditingTopIdx(i);
                                setTopDraftCount(String(col.count));
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                isAdmin &&
                                (e.key === "Enter" || e.key === " ")
                              ) {
                                setEditingTopIdx(i);
                                setTopDraftCount(String(col.count));
                              }
                            }}
                          >
                            {col.count}
                            {isAdmin && (
                              <Pencil className="w-2.5 h-2.5 text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </span>
                        )}
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(col.count / maxTopCount) * 100}%`,
                          }}
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
                  {isAdmin && (
                    <th className="text-center px-4 py-3 text-xs font-display font-semibold text-muted-foreground w-10">
                      <Pencil className="w-3 h-3 mx-auto text-primary/50" />
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((col, idx) => (
                  <tr
                    key={col.college}
                    className={`border-b border-border/50 transition-colors group ${
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
                      {isAdmin && editingColIdx === idx ? (
                        <Input
                          type="number"
                          value={colDraftBuet}
                          onChange={(e) => setColDraftBuet(e.target.value)}
                          className="h-7 w-20 text-sm bg-secondary border-primary/30 focus:border-primary ml-auto px-2"
                          autoFocus
                        />
                      ) : (
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
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {isAdmin && editingColIdx === idx ? (
                        <Input
                          type="number"
                          value={colDraftMed}
                          onChange={(e) => setColDraftMed(e.target.value)}
                          className="h-7 w-20 text-sm bg-secondary border-primary/30 focus:border-primary ml-auto px-2"
                        />
                      ) : (
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
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-center">
                        {editingColIdx === idx ? (
                          <span className="flex items-center gap-1 justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                const buetN = Number(colDraftBuet);
                                const medN = Number(colDraftMed);
                                if (
                                  !Number.isNaN(buetN) &&
                                  !Number.isNaN(medN)
                                ) {
                                  const updated = [...comparisonData];
                                  updated[idx] = {
                                    ...updated[idx],
                                    buet2025Est: buetN,
                                    medical2025Est: medN,
                                  };
                                  setComparisonData(updated);
                                  persistState({ comparisonData: updated });
                                }
                                setEditingColIdx(null);
                              }}
                              className="text-green-500 hover:text-green-400"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingColIdx(null)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingColIdx(idx);
                              setColDraftBuet(String(col.buet2025Est));
                              setColDraftMed(String(col.medical2025Est));
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-primary/50 hover:text-primary"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* AI Settings Modal */}
      <AISettingsModal open={showAISettings} onOpenChange={setShowAISettings} />
    </div>
  );
}
