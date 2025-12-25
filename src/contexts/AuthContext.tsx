import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  tc: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (tc: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (tc: string, password: string) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tc, password }),
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();

      if (!data.success) {
        return false;
      }

      setUser(data.user);
      return true;
    } catch (err) {
      console.error("[Auth] Login error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
