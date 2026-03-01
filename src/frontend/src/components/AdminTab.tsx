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
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";

interface AdminTabProps {
  sessionToken: string;
}

interface RegisterForm {
  collegeId: string;
  email: string;
  password: string;
  name: string;
}

const initialForm: RegisterForm = {
  collegeId: "",
  email: "",
  password: "",
  name: "",
};

export default function AdminTab({ sessionToken }: AdminTabProps) {
  const { actor } = useActor();
  const [admins, setAdmins] = useState<Array<[string, string]>>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [isRegistering, setIsRegistering] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchAdmins = useCallback(async () => {
    if (!actor) return;
    setIsFetching(true);
    try {
      const list = await actor.getAdminList(sessionToken);
      setAdmins(list);
    } catch {
      // fail silently
    } finally {
      setIsFetching(false);
    }
  }, [actor, sessionToken]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleChange = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== "idle") setStatus("idle");
  };

  const isValid =
    form.collegeId.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.name.trim();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !isValid || isRegistering) return;
    setIsRegistering(true);
    setStatus("idle");
    setErrorMsg("");
    try {
      const ok = await actor.registerAdmin(
        form.collegeId.trim(),
        form.email.trim(),
        form.password.trim(),
        form.name.trim(),
        sessionToken,
      );
      if (ok) {
        setStatus("success");
        setForm(initialForm);
        fetchAdmins();
      } else {
        setStatus("error");
        setErrorMsg(
          "Registration failed. College ID or email may already be in use.",
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="p-2.5 rounded-lg bg-primary/15 border border-primary/30">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Admin Panel
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Manage admin accounts and system access
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-blue" />
                  <CardTitle className="font-display text-base">
                    Current Admins
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchAdmins}
                  disabled={isFetching}
                  className="h-8 w-8 p-0"
                >
                  {isFetching ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
              <CardDescription className="text-xs text-muted-foreground font-body">
                {admins.length} admin account{admins.length !== 1 ? "s" : ""}{" "}
                registered
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isFetching && admins.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : admins.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No admins found</p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {admins.map(([collegeId, email], i) => (
                    <motion.li
                      key={collegeId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-sky-blue truncate">
                            {collegeId}
                          </span>
                          <Badge className="text-xs bg-primary/15 text-primary border-primary/30 px-1.5 py-0 pointer-events-none">
                            ADMIN
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-body truncate mt-0.5">
                          {email}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Register New Admin */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-accent" />
                <CardTitle className="font-display text-base">
                  Register New Admin
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground font-body">
                Add a new staff member with admin access
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-name"
                    className="font-display font-semibold text-sm text-foreground"
                  >
                    Full Name <span className="text-gold">*</span>
                  </Label>
                  <Input
                    id="reg-name"
                    placeholder="e.g. Dr. Rahman"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="bg-secondary border-border font-body focus:border-primary/60"
                    disabled={isRegistering}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-college-id"
                    className="font-display font-semibold text-sm text-foreground"
                  >
                    College ID <span className="text-gold">*</span>
                  </Label>
                  <Input
                    id="reg-college-id"
                    placeholder="e.g. CCPC-ADMIN-002"
                    value={form.collegeId}
                    onChange={(e) => handleChange("collegeId", e.target.value)}
                    className="bg-secondary border-border font-mono focus:border-primary/60"
                    disabled={isRegistering}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-email"
                    className="font-display font-semibold text-sm text-foreground"
                  >
                    Email <span className="text-gold">*</span>
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="staff@ccpc.edu.bd"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-secondary border-border font-body focus:border-primary/60"
                    disabled={isRegistering}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-password"
                    className="font-display font-semibold text-sm text-foreground"
                  >
                    Password <span className="text-gold">*</span>
                  </Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="bg-secondary border-border font-mono focus:border-primary/60"
                    disabled={isRegistering}
                    autoComplete="new-password"
                  />
                </div>

                <AnimatePresence>
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/25 text-accent text-sm font-body overflow-hidden"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      Admin registered successfully!
                    </motion.div>
                  )}
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive text-sm font-body overflow-hidden"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={!isValid || isRegistering}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold gap-2 h-11"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registering…
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Register Admin
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
