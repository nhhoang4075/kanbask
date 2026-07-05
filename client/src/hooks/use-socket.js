"use client";

import { createContext, useContext, useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "@/hooks/use-session";

// Create a Context to share socket instance
const SocketContext = createContext(null);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const { user, loading, logout } = useSession(); // get current user from session
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());

  useEffect(() => {
    // Only connect when session is loaded and user is present
    if (!loading && user) {
      // Initialize Socket.IO client with credentials
      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL, {
        withCredentials: true
      });

      socketRef.current.on("connect", () => {
        setConnected(true);
      });

      // An admin disabled/force-logged-out this account — the server has
      // already killed this socket connection; drop the client-side session
      // and send the user to login right away instead of leaving them on a
      // page whose API calls now silently 401.
      socketRef.current.on("force_logout", () => {
        logout();
      });

      // Full snapshot on connect, then incremental updates as people
      // connect/disconnect elsewhere.
      socketRef.current.on("online_users", (userIds) => {
        setOnlineUserIds(new Set(userIds));
      });

      socketRef.current.on("user_status_changed", ({ user_id, is_active }) => {
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          if (is_active) {
            next.add(user_id);
          } else {
            next.delete(user_id);
          }
          return next;
        });
      });

      // Emit setup event with userId to authenticate socket
      socketRef.current.emit("setup");
      setConnected(true);
    }

    // On unmount or when user changes, disconnect previous socket
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
        setOnlineUserIds(new Set());
      }
    };
  }, [loading, user]); // rerun when loading or user changes

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, onlineUserIds }}>
      {children}
    </SocketContext.Provider>
  );
}
