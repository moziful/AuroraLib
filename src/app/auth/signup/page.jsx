"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdMenuBook,
  MdCreate,
  MdErrorOutline,
} from "react-icons/md";
import { authClient } from "@/lib/auth-client";

export default function SignUp() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [step, setStep] = useState(1); // Step 1: Account Creation, Step 2: Role Assignment
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!isPending && session?.user) {
      const role = session.user.role;
      router.replace(
        role === "writer" ? "/dashboard/writer" : "/dashboard/reader",
      );
    }
  }, [session, isPending, router]);
  if (isPending || session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
      </div>
    );
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error on input change
  };
  const handleNextStep = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    setStep(2);
  };
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({ provider: "google" });
    } catch (error) {
      toast.error("Google sign up failed");
    }
  };
  const handleRoleSelect = async (selectedRole) => {
    setLoading(true);
    setError("");

    const { name, email, password } = formData;
    // Sign up without a role – better‑auth will assign the default (reader)
    const { data, error: authError } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (authError) {
      setError(authError.message || "Sign up failed. Please try again.");
      setLoading(false);
      return;
    }

    // If the user chose writer, upgrade the role via our new endpoint
    if (selectedRole === "writer") {
      try {
        let token = data?.accessToken || data?.session?.accessToken;
        let userId = data?.id || data?.user?.id;
        
        if (!token) {
          const { data: signInData, error: signInError } = await authClient.signIn.email({
            email,
            password,
          });
          if (!signInError) {
            token = signInData?.accessToken || signInData?.session?.accessToken || signInData?.token;
            userId = signInData?.id || signInData?.user?.id || userId;
          }
        }

        if (token && userId) {
          const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
          const url = `${apiBase}/users/${userId}/role`;
          await fetch(url, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ role: "writer" }),
          });
        }
      } catch (e) {
        console.warn("Role upgrade failed:", e);
      }
    }

    // Redirect to the appropriate dashboard
    window.location.href =
      selectedRole === "writer" ? "/dashboard/writer" : "/dashboard/reader";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50 p-8 backdrop-blur-xl shadow-2xl shadow-sky-400/5"
      >
        <div className="text-center">
          <div className="inline-block text-3xl font-black tracking-wider text-slate-900 dark:text-white hover:opacity-90">
            <span className="text-sky-400">Aurora</span>Lib
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-200">
            {step === 1 ? "Create your account" : "Choose your identity"}
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {step === 1
              ? "Join our global ebook network"
              : "Tell us how you want to experience AuroraLib"}
          </p>
        </div>
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <form className="space-y-4" onSubmit={handleNextStep}>
                <div className="space-y-2">
                  <label
                    className="text-xs font-bold text-slate-600 dark:text-slate-400"
                    htmlFor="name"
                  >
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <MdPerson className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter Your Full Name"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-600 outline-none transition-all duration-200 focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="text-xs font-bold text-slate-600 dark:text-slate-400"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <MdEmail className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Your Email"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-600 outline-none transition-all duration-200 focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="text-xs font-bold text-slate-600 dark:text-slate-400"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <MdLock className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter Your Password"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 py-3 pl-11 pr-11 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-600 outline-none transition-all duration-200 focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
                    >
                      {showPassword ? (
                        <MdVisibilityOff className="h-4 w-4" />
                      ) : (
                        <MdVisibility className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="text-xs font-bold text-slate-600 dark:text-slate-400"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <MdLock className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Retype Your Password"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 py-3 pl-11 pr-11 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-600 outline-none transition-all duration-200 focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/30"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
                    >
                      {showConfirmPassword ? (
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
                      <p className="text-xs font-medium leading-relaxed text-red-300">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-sky-400 py-3 text-sm font-black text-slate-950 transition-all duration-200 hover:bg-sky-500 shadow-lg shadow-sky-400/10 mt-2"
                >
                  Continue
                </button>
              </form>
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-800"></div>
                </div>
                <span className="relative bg-white dark:bg-slate-950 px-3 text-xs rounded-full font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500">
                  Or continue with
                </span>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-300 transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white"
              >
                <FcGoogle className="h-5 w-5" />
                Sign up with Google
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleRoleSelect("reader")}
                  className="group flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950 p-6 text-center transition-all duration-200 hover:border-sky-400/40 hover:bg-slate-900 disabled:opacity-50"
                >
                  <div className="mb-3 rounded-full bg-sky-400/10 p-3 text-sky-400 group-hover:scale-110 transition-transform">
                    <MdMenuBook className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">Reader</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Discover, purchase, and read premium ebooks.
                  </p>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleRoleSelect("writer")}
                  className="group flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950 p-6 text-center transition-all duration-200 hover:border-sky-400/40 hover:bg-slate-900 disabled:opacity-50"
                >
                  <div className="mb-3 rounded-full bg-sky-400/10 p-3 text-sky-400 group-hover:scale-110 transition-transform">
                    <MdCreate className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">Writer</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Publish creations and track your sales analytics.
                  </p>
                </button>
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
                    <p className="text-xs font-medium leading-relaxed text-red-300">
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              {loading && (
                <div className="flex justify-center py-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
                </div>
              )}
              <button
                type="button"
                disabled={loading}
                onClick={() => setStep(1)}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors pt-2"
              >
                ← Back to profile details
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-bold text-sky-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
