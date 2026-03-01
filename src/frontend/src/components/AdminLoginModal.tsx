import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminLoginModal({
  open,
  onOpenChange,
}: AdminLoginModalProps) {
  const { login } = useAuth();
  const [collegeId, setCollegeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeId.trim() || !email.trim() || !password.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      await login(collegeId.trim(), email.trim(), password);
      onOpenChange(false);
      setCollegeId("");
      setEmail("");
      setPassword("");
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (next: boolean) => {
    if (!isLoading) {
      onOpenChange(next);
      if (!next) setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px] bg-card border border-primary/40 shadow-2xl shadow-primary/20 p-0 overflow-hidden">
        {/* Red accent top stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/80 to-transparent" />

        <div className="px-6 pt-5 pb-6">
          <DialogHeader className="mb-5">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-lg bg-primary/15 border border-primary/30">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="font-display text-xl font-bold text-foreground">
                  Admin Login
                </DialogTitle>
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  Restricted access — staff only
                </p>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* College ID */}
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-college-id"
                className="font-display font-semibold text-sm text-foreground"
              >
                College ID
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="admin-college-id"
                  placeholder="College ID"
                  value={collegeId}
                  onChange={(e) => {
                    setCollegeId(e.target.value);
                    setError("");
                  }}
                  className="pl-9 bg-secondary border-border font-mono focus:border-primary/60 focus:ring-primary/30"
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-email"
                className="font-display font-semibold text-sm text-foreground"
              >
                Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="bg-secondary border-border font-body focus:border-primary/60"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-password"
                className="font-display font-semibold text-sm text-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="pr-10 bg-secondary border-border font-mono focus:border-primary/60"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-body overflow-hidden"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <Button
              type="submit"
              disabled={
                isLoading ||
                !collegeId.trim() ||
                !email.trim() ||
                !password.trim()
              }
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold h-11 gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Sign In as Admin
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground/50 font-body mt-4">
            CCPC Administrative Portal — Authorized Personnel Only
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
