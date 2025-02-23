"use client";

import { motion } from "framer-motion";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = ({ label, type, error, ...props }: InputProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="mb-4"
  >
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all"
      {...props}
    />
    {error && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 text-sm mt-1"
      >
        {error}
      </motion.p>
    )}
  </motion.div>
);

export default Input;
