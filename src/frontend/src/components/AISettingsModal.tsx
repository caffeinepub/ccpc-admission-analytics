import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Eye, EyeOff, KeyRound, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { type AIProvider, AI_PROVIDERS } from "../utils/aiService";

const STORAGE_KEY = "ccpc-ai-keys";

type AIKeys = Record<AIProvider, string>;

const emptyKeys: AIKeys = {
  grok: "",
  gemini: "",
  perplexity: "",
  deepseek: "",
};

const PROVIDER_EMOJIS: Record<AIProvider, string> = {
  grok: "⚡",
  gemini: "✨",
  perplexity: "🔍",
  deepseek: "🌊",
};

interface AISettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AISettingsModal({
  open,
  onOpenChange,
}: AISettingsModalProps) {
  const [keys, setKeys] = useState<AIKeys>(emptyKeys);
  const [showKey, setShowKey] = useState<Record<AIProvider, boolean>>({
    grok: false,
    gemini: false,
    perplexity: false,
    deepseek: false,
  });
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount / open
  useEffect(() => {
    if (open) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AIKeys>;
          setKeys({
            grok: parsed.grok ?? "",
            gemini: parsed.gemini ?? "",
            perplexity: parsed.perplexity ?? "",
            deepseek: parsed.deepseek ?? "",
          });
        } else {
          setKeys(emptyKeys);
        }
      } catch {
        setKeys(emptyKeys);
      }
      setSaved(false);
    }
  }, [open]);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    setSaved(true);
    setTimeout(() => {
      onOpenChange(false);
      setSaved(false);
    }, 600);
  };

  const handleClearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setKeys(emptyKeys);
  };

  const toggleShow = (provider: AIProvider) => {
    setShowKey((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const providers = Object.keys(AI_PROVIDERS) as AIProvider[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card border border-primary/40 shadow-2xl shadow-primary/20 p-0 overflow-hidden">
        {/* Accent stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-gold via-primary/80 to-transparent" />

        <div className="px-6 pt-5 pb-6">
          <DialogHeader className="mb-5">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-lg bg-primary/15 border border-primary/30">
                <KeyRound className="w-5 h-5 text-gold" />
              </div>
              <div>
                <DialogTitle className="font-display text-xl font-bold text-foreground">
                  AI Provider Settings
                </DialogTitle>
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  Configure API keys for AI auto-update
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {providers.map((provider) => {
              const config = AI_PROVIDERS[provider];
              const emoji = PROVIDER_EMOJIS[provider];
              return (
                <div key={provider} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={`ai-key-${provider}`}
                      className="font-display font-semibold text-sm text-foreground flex items-center gap-2"
                    >
                      <span className="text-base">{emoji}</span>
                      {config.label}
                    </Label>
                    <a
                      href={config.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary/60 hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      Get key
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id={`ai-key-${provider}`}
                      type={showKey[provider] ? "text" : "password"}
                      placeholder={config.placeholder}
                      value={keys[provider]}
                      onChange={(e) =>
                        setKeys((prev) => ({
                          ...prev,
                          [provider]: e.target.value,
                        }))
                      }
                      className="pr-10 bg-secondary border-border font-mono text-xs focus:border-primary/60 focus:ring-primary/30"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShow(provider)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                      aria-label={showKey[provider] ? "Hide key" : "Show key"}
                    >
                      {showKey[provider] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Privacy note */}
          <p className="mt-5 text-xs text-muted-foreground/70 bg-secondary/40 border border-border rounded-lg p-3 leading-relaxed">
            🔒 API keys are stored locally in your browser only and never sent
            to our servers. They are used only for direct requests to the
            respective AI providers.
          </p>

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="gap-1.5 text-muted-foreground hover:text-destructive border-border hover:border-destructive/50 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold gap-2"
            >
              {saved ? (
                "✓ Saved!"
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Save Keys
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
