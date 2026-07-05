"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AppHeader from "@/components/app/app-header";
import { AdminProvider } from "@/hooks/use-admin";
import { useSession } from "@/hooks/use-session";

export default function AdminLayout({ children }) {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      router.replace("/app");
    }
  }, [loading, user, router]);

  if (loading || user?.role !== "admin") {
    return null;
  }

  return (
    <AdminProvider>
      <div className="flex flex-col gap-2 w-full h-[98dvh] overflow-hidden rounded-md">
        <AppHeader name="Admin" />
        <div className="flex-1 overflow-auto rounded-md">{children}</div>
      </div>
    </AdminProvider>
  );
}
