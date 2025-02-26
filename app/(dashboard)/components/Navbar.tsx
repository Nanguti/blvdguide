"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Menu, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/services/api";

interface User {
  name: string;
  // add other user properties as needed
}

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(user ? JSON.parse(user) : null);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-30">
      <div className="px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/dashboard" className="font-semibold text-xl">
            Dashboard
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div
            className="hidden md:flex items-center gap-2
           bg-gray-100 px-3 py-2 rounded-lg"
          >
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none focus:outline-none text-sm w-40"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border py-2"
                >
                  <div className="px-4 py-2 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  {/* Add notification items here */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2"
            >
              <User className="w-5 h-5" />
              <span className="hidden md:block">{user?.name}</span>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2"
                >
                  <Link
                    href="/dashboard/profile"
                    className="px-4 py-2 hover:bg-gray-100 block"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="px-4 py-2 hover:bg-gray-100 block"
                  >
                    Settings
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={async () => {
                      try {
                        // Call the logout API endpoint
                        await api.post("/logout");

                        // Clear local storage
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");

                        window.location.href = "/login";
                      } catch (error) {
                        console.error("Logout failed:", error);
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                      }
                    }}
                    className="px-4 py-2 hover:bg-gray-100 block w-full text-left text-red-600"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
