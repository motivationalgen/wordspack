import { useState, useCallback, useEffect } from "react";

const AUTH_KEY = "wordspack_admin_session";
const ADMINS_KEY = "wordspack_admins";

export type AdminUser = {
  id: string;
  email: string;
  password?: string;
  role: "admin";
  createdAt: number;
};

const DEFAULT_ADMIN: AdminUser = {
  id: "1",
  email: "admin@wordspack.com",
  password: "admin",
  role: "admin",
  createdAt: Date.now(),
};

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load admins from localStorage or use default
    const storedAdmins = localStorage.getItem(ADMINS_KEY);
    if (storedAdmins) {
      setAdmins(JSON.parse(storedAdmins));
    } else {
      const initial = [DEFAULT_ADMIN];
      setAdmins(initial);
      localStorage.setItem(ADMINS_KEY, JSON.stringify(initial));
    }

    // Check session
    const session = sessionStorage.getItem(AUTH_KEY);
    if (session) {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  const login = useCallback((email: string, pass: string) => {
    const allAdmins: AdminUser[] = JSON.parse(localStorage.getItem(ADMINS_KEY) || "[]");
    const found = allAdmins.find((a) => a.email === email && a.password === pass);
    
    if (found) {
      const { password, ...safeUser } = found;
      setUser(safeUser as AdminUser);
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(AUTH_KEY);
  }, []);

  const addAdmin = useCallback((newAdmin: Omit<AdminUser, "id" | "createdAt" | "role">) => {
    const admin: AdminUser = {
      ...newAdmin,
      id: Math.random().toString(36).substr(2, 9),
      role: "admin",
      createdAt: Date.now(),
    };
    const next = [...admins, admin];
    setAdmins(next);
    localStorage.setItem(ADMINS_KEY, JSON.stringify(next));
  }, [admins]);

  const removeAdmin = useCallback((id: string) => {
    if (admins.length <= 1) return false; // Prevent deleting the last admin
    const next = admins.filter((a) => a.id !== id);
    setAdmins(next);
    localStorage.setItem(ADMINS_KEY, JSON.stringify(next));
    return true;
  }, [admins]);

  return { user, admins, login, logout, addAdmin, removeAdmin, loading };
}
