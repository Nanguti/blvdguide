"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface AuthCardProps {
  children: React.ReactNode;
}

const AuthCard = ({ children }: AuthCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full max-w-md mx-auto"
  >
    <Card className="p-6 shadow-xl bg-white/90 backdrop-blur-sm border-opacity-50">
      {children}
    </Card>
  </motion.div>
);

export default AuthCard;
