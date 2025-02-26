"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { Buda } from "next/font/google";
import "../globals.css";
import { useRouter } from "next/navigation";

const buda = Buda({
  weight: "300", // Buda has only 300 weight
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  return (
    <html lang="en" className={buda.className}>
      <body className="min-h-screen bg-gray-50">
        {isAuthenticated ? (
          <>
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex min-h-screen">
              <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
              <main className="flex-1 p-4 md:p-6 pt-20">
                <div className="max-w-7xl mx-auto">{children}</div>
                <Footer />
              </main>
            </div>
          </>
        ) : null}
      </body>
    </html>
  );
}
