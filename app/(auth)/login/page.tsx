"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import { authService } from "@/lib/services/auth";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.login(
        formData.email,
        formData.password
      );
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-200 to-slate-300">
      <AuthCard>
        <motion.div layout>
          <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <motion.div
              className="flex justify-between items-center mb-6 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.remember}
                  onChange={(e) =>
                    setFormData({ ...formData, remember: e.target.checked })
                  }
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-cyan-600 hover:text-cyan-800 transition-colors"
              >
                Forgot Password?
              </Link>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-cyan-600 text-white rounded-lg font-medium
                       hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500
                       disabled:opacity-50 transition-all"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
            >
              {isLoading ? (
                <motion.div
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <motion.p
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Do not have an account?{" "}
            <Link
              href="/register"
              className="text-cyan-600 hover:text-cyan-800 font-medium transition-colors"
            >
              Sign Up
            </Link>
          </motion.p>
        </motion.div>
      </AuthCard>
    </div>
  );
}
