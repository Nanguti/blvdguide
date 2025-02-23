"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  Building2,
  Calendar,
  MessageSquare,
  Settings,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "Overview", href: "/dashboard" },
  { icon: Building2, label: "Properties", href: "/dashboard/properties" },
  { icon: Users, label: "Agents", href: "/dashboard/agents" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/schedule" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={
          isOpen || (typeof window !== "undefined" && window.innerWidth >= 768)
            ? "open"
            : "closed"
        }
        variants={sidebarVariants}
        className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r z-40 
            md:relative md:translate-x-0 md:block"
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="font-semibold text-xl">BLVD GUIDE</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                          ${
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "hover:bg-gray-100"
                          }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1 h-full absolute right-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      layout: { duration: 0.2 },
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}
