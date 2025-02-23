"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Implement your registration API call
      console.log("Registration attempt:", formData);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-200 to-slate-300">
      <AuthCard>
        <motion.div layout>
          <h1 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h1>
          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
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
            <Input
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />

            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium
                       hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500
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
                "Sign Up"
              )}
            </motion.button>
          </form>

          <motion.p
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              Sign In
            </Link>
          </motion.p>
        </motion.div>
      </AuthCard>
    </div>
  );
}
