"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000"
const socketOptions = {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
};

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initSocket = () => {
      const newSocket = io(socketUrl, socketOptions);
      setSocket(newSocket);

      newSocket.on("connect", () => {
        setIsConnected(true);
        console.log("Connected to socket server");
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
        console.log("Disconnected from socket server");
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      newSocket.on("connect_timeout", (timeout) => {
        console.error("Socket connection timeout:", timeout);
      });
    };
    initSocket();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}