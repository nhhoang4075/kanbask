"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { getSession, logout } from "@/actions/auth-actions";

// Context to hold session state and actions
const SessionContext = createContext({
  user: null,
  loading: true,
  refreshSession: async () => {},
  logout: () => {}
});

// Hook for components to consume session data
export function useSession() {
  return useContext(SessionContext);
}

// Provider component encapsulates logic for session lifecycle
export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * refreshSession: uses imported getSession()
   * - tries to load user from access_token
   * - getSession internally handles refresh flow
   */
  const refreshSession = useCallback(async () => {
    setLoading(true);
    try {
      const sessionData = await getSession();
      setUser(sessionData?.user || null);
    } catch (error) {
      console.error("refreshSession error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * logoutHandler: calls external logout() to clear cookies
   * and resets local user state
   */
  const logoutHandler = useCallback(async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (err) {
      console.error("logout error:", err);
    } finally {
      setUser(null);
    }
  }, []);

  // When provider mounts, attempt to load current session
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        refreshSession,
        logout: logoutHandler
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
