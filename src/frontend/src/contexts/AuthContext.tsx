import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useActor } from "../hooks/useActor";

export type Role = "admin" | "public" | null;

interface AuthContextValue {
  role: Role;
  sessionToken: string | null;
  isInitializing: boolean;
  login: (collegeId: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  role: null,
  sessionToken: null,
  isInitializing: true,
  login: async () => {},
  logout: () => {},
});

const STORAGE_KEY = "ccpc_admin_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { actor, isFetching } = useActor();
  const [role, setRole] = useState<Role>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // On mount: initialize default admin and validate stored token
  useEffect(() => {
    if (!actor || isFetching) return;

    let cancelled = false;

    const init = async () => {
      // Always initialize default admin
      try {
        await actor.initializeDefaultAdmin();
      } catch {
        // ignore
      }

      // Check for stored token
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const valid = await actor.isSessionValid(stored);
          if (!cancelled && valid) {
            setSessionToken(stored);
            setRole("admin");
          } else if (!cancelled) {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch {
          if (!cancelled) localStorage.removeItem(STORAGE_KEY);
        }
      }

      if (!cancelled) setIsInitializing(false);
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching]);

  const login = useCallback(
    async (collegeId: string, email: string, password: string) => {
      if (!actor) throw new Error("Backend not ready");
      let token: string | null = null;
      try {
        token = await actor.adminLogin(collegeId, email, password);
      } catch {
        throw new Error(
          "Invalid credentials. Please check your College ID, email, and password.",
        );
      }
      if (!token) {
        throw new Error(
          "Invalid credentials. Please check your College ID, email, and password.",
        );
      }
      localStorage.setItem(STORAGE_KEY, token);
      setSessionToken(token);
      setRole("admin");
    },
    [actor],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSessionToken(null);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ role, sessionToken, isInitializing, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
