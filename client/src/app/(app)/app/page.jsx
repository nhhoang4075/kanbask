"use client";

import { useSession } from "@/hooks/use-session";

export default function AppPage() {
  const { user, loading } = useSession();

  return (
    <div className="h-full w-full p-8">
      <h1>User Session:</h1>
      <pre className="whitespace-pre-wrap">
        {loading ? "loading" : JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
