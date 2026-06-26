import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/signin");
  }

  const role = session.user.role;
  const displayRole = role === "user" ? "reader" : role;
  redirect(`/dashboard/${displayRole}`);
}
