import "@/app/globals.css";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  return (
    <div lang="en">
      <div className="flex items-center min-h-screen min-w-screen">
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
