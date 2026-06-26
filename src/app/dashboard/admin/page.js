import { Suspense } from "react";
import AdminDashboard from "@/components/Dashboards/AdminDashboard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/signin");
  }

  const role = session.user.role;
  if (role !== "admin") {
    const displayRole = role === "user" ? "reader" : role;
    redirect(`/dashboard/${displayRole}`);
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-slate-100">Loading...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
