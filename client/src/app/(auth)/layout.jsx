import { ToastContainer } from "react-toastify";

import { SessionProvider } from "@/hooks/use-session";

export default function AuthLayout({ children }) {
  return (
    <SessionProvider>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </SessionProvider>
  );
}
