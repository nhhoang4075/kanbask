"use client";

import { createContext, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useSession } from "@/hooks/use-session";

// Create a Context to share socket instance
const SocketContext = createContext(null);

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}

export function SocketProvider({ children }) {
  const { user, loading } = useSession(); // get current user from session
  const socketRef = useRef(null);

  useEffect(() => {
    // Only connect when session is loaded and user is present
    if (!loading && user) {
      // Initialize Socket.IO client with credentials
      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL, {
        withCredentials: true
      });

      // Emit setup event with userId to authenticate socket
      socketRef.current.emit("setup");
    }

    // On unmount or when user changes, disconnect previous socket
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [loading, user]); // rerun when loading or user changes

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
}
