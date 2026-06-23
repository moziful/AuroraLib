"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdErrorOutline } from "react-icons/md";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        if (!isPending && session?.user) {
            const role = (session.user.role || "user").toLowerCase();

            if (role === "admin") {
                router.replace("/dashboard/admin");
            } else if (role === "writer") {
                router.replace("/dashboard/writer");
            } else {
                router.replace("/dashboard/reader");
            }
        }
    }, [session, isPending, router]);
    if (isPending || session?.user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
            </div>
        );
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const { data, error: authError } = await authClient.signIn.email(formData);
        if (authError) {
            setError(authError.message || "Sign in failed. Please check your credentials.");
            setLoading(false);
            return;
        }
        const role = data?.user?.role;
        window.location.href = role === "admin" ? "/dashboard/admin" : role === "writer" ? "/dashboard/writer" : "/dashboard/reader";
    };
    const handleGoogleSignIn = async () => {
        try {
            await authClient.signIn.social({ provider: "google" });
        } catch (error) {
            toast.error("Google sign in failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md space-y-4 rounded-2xl border border-slate-900 bg-slate-900/50 p-8 backdrop-blur-xl shadow-2xl shadow-sky-400/5"
            >
                <div className="text-center ">
                    <h2 className="text-xl font-bold text-slate-200">Welcome back to <span className="text-sky-400">Aurora</span>Lib</h2>
                    <p className="mt-1 text-xs text-slate-400">
                        Discover &amp; read your favorite books
                    </p>
                </div>
                <form className="space-y-5 " onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400" htmlFor="email">
                            Email Address
                        </label>
                        <div className="relative flex items-center">
                            <MdEmail className="absolute left-4 h-4 w-4 text-slate-500" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter Your Email"
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/30"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-400" htmlFor="password">
                                Password
                            </label>
                            <Link
                                href="/auth/forgot-password"
                                className="text-xs font-bold text-sky-400 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative flex items-center">
                            <MdLock className="absolute left-4 h-4 w-4 text-slate-500" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter Your Password"
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-11 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/30"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-slate-500 hover:text-slate-400"
                            >
                                {showPassword ? (
                                    <MdVisibilityOff className="h-4 w-4" />
                                ) : (
                                    <MdVisibility className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3"
                            >
                                <MdErrorOutline className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                                <p className="text-xs font-medium leading-relaxed text-red-300">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className=" flex w-full items-center justify-center rounded-xl bg-sky-400 py-3 text-sm font-black text-slate-950 transition-all duration-200 hover:bg-[#7dd3fc] disabled:opacity-50 shadow-lg shadow-sky-400/10"
                    >
                        {loading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                        ) : (
                            "Sign In"
                        )}
                    </motion.button>
                </form>
                <div className="relative flex items-center justify-center ">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800"></div>
                    </div>
                    <span className="relative bg-slate-950 rounded-full px-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                        Or continue with
                    </span>
                </div>
                <div className="">
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white"
                    >
                        <FcGoogle className="h-5 w-5" />
                        Sign in with Google
                    </button>
                </div>
                <p className=" text-center text-xs text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="font-bold text-sky-400 hover:underline">
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}