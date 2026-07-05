"use client";

import { useRef, useState } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useSession } from "@/hooks/use-session";

export function QueryProvider({ children }) {
  const { refreshSession } = useSession();
  // A ref so the cache's onError (bound once, at client creation) always
  // calls the latest refreshSession function instead of closing over a stale one.
  const refreshSessionRef = useRef(refreshSession);
  refreshSessionRef.current = refreshSession;

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            // A background query 401ing usually just means the access token
            // expired before its scheduled refresh fired — try to refresh
            // once. If the session was actually revoked (disabled account,
            // force-logout), refreshSession's own failure path already
            // clears the session and redirects to login.
            if (error?.status === 401) {
              refreshSessionRef.current?.();
            }
          }
        }),
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: true,
            retry: 1
          }
        }
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
