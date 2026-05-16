"use client";

import { useSession } from "@/hooks/use-session";

export default function AppPage() {
  const { user, loading } = useSession();

  return <h1>Message: {loading ? "loading" : JSON.stringify(user)}</h1>;
}
