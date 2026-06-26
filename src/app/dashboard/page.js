import { Suspense } from "react";
import ReaderDashboard from "@/components/Dashboards/ReaderDashboard";

export default function Dashboard() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-slate-100">Loading...</div>}>
            <ReaderDashboard />
        </Suspense>
    );
}
