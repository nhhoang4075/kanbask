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
  const { user, loading } = useSession(); // get current user from session
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

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
      }
    };
  }, [loading, user]); // rerun when loading or user changes

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
}
