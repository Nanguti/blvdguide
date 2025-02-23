"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Implement your forgot password API call
      console.log("Reset password attempt for:", email);
      setIsEmailSent(true);
    } catch (error) {
      console.error("Reset password error:", error);
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
            Reset Password
          </h1>
          {!isEmailSent ? (
            <>
              <p className="text-gray-600 text-center mb-6">
                Enter your email address and we will send you instructions to
                reset your password.
              </p>
              <form onSubmit={handleSubmit}>
                <Input
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                />

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
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </form>
            </>
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
              <p className="text-lg mb-4">Check your email</p>
              <p className="text-gray-600 mb-6">
                We have sent you instructions to reset your password.
              </p>
            </motion.div>
          )}

          <motion.p
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-cyan-600 hover:text-cyan-800 font-medium transition-colors"
            >
              Sign In
            </Link>
          </motion.p>
        </motion.div>
      </AuthCard>
    </div>
  );
}
