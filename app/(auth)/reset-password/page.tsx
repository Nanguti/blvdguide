"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Implement your reset password API call
      console.log("Password reset attempt:", formData);
      setIsSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br
     from-slate-200 to-slate-300"
    >
      <AuthCard>
        <motion.div layout>
          <h1 className="text-2xl font-bold text-center mb-6">
            Set New Password
          </h1>
          {!isSuccess ? (
            <form onSubmit={handleSubmit}>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <Input
                label="New Password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter new password"
              />
              <Input
                label="Confirm Password"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirm new password"
              />

              <motion.button
                type="submit"
                className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg font-medium
                         hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500
                         disabled:opacity-50 transition-all"
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.01 }}
              >
                {isLoading ? (
                  <motion.div
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <p className="text-lg mb-4">Password Reset Successfully!</p>
              <p className="text-gray-600">Redirecting you to login page...</p>
            </motion.div>
          )}
        </motion.div>
      </AuthCard>
    </div>
  );
}
