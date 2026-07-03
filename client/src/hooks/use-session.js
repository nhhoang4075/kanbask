"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

import { getSession, refreshSession, logout } from "@/actions/auth-actions";

// Context to hold session state and actions
const SessionContext = createContext();

// Hook for components to consume session data
export function useSession() {
  return useContext(SessionContext);
}

// Provider component encapsulates logic for session lifecycle
export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshTimerRef = useRef(null);
  const isRefreshingRef = useRef(false);

  const router = useRouter();

  const clearSession = useCallback(() => {
    setUser(null);
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    isRefreshingRef.current = false;
  }, []);

  const handleSession = useCallback(
    async (isRetry = false) => {
      // Don't refresh if we're already refreshing
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;

      try {
        let sessionData;

        if (isRetry) {
          sessionData = await refreshSession();
        } else {
          sessionData = await getSession();
        }

        if (!sessionData?.user || !sessionData?.expires_at) {
          throw new Error("Invalid session data");
        }

        setUser(sessionData.user);

        // Calculate next refresh time (60 seconds before expiration)
        const now = Date.now();
        const expiresAt = sessionData.expires_at;
        const refreshIn = Math.max(expiresAt - now - 60_000, 0);

        // Clear any existing timer
        if (refreshTimerRef.current) {
          clearTimeout(refreshTimerRef.current);
        }

        // Set up next refresh only if we have meaningful time
        if (refreshIn > 0) {
          refreshTimerRef.current = setTimeout(() => {
            handleSession(true);
          }, refreshIn);
        }
      } catch (err) {
        if (!isRetry) {
          // If this was the initial attempt, try refresh once
          return handleSession(true);
        }

        clearSession();
        router.push("/auth/login");
      } finally {
        isRefreshingRef.current = false;
      }
    },
    [clearSession]
  );

  const logoutHandler = useCallback(async () => {
    try {
      await logout();
      clearSession();
    } catch (err) {
      setError(err);
      clearSession();
    } finally {
      router.push("/auth/login");
    }
  }, [router, clearSession]);

  useEffect(() => {
    handleSession().finally(() => setLoading(false));

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [handleSession]);

  const refreshSessionHandler = useCallback(async () => {
    if (isRefreshingRef.current) return;
    try {
      await handleSession(true);
    } catch (err) {
      setError(err);
    }
  }, [handleSession]);

  const contextValue = {
    user,
    loading,
    error,
    refreshSession: refreshSessionHandler,
    logout: logoutHandler
  };

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
}
