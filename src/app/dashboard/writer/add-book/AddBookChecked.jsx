"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import AddBookForm from "@/components/Dashboards/AddBookForm";

export default function AddBookGate() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending && user?.role && user.role !== "writer") {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [isPending, router, user?.role]);

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
      </div>
    );
  }

  if (user && user.role !== "writer") {
    return null;
  }

  return <AddBookForm />;
}
