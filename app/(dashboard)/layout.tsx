"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { Buda } from "next/font/google";
import "../globals.css";

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

  return (
    <html lang="en" className={buda.className}>
      <body className="min-h-screen bg-gray-50">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex min-h-screen">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <main className="flex-1 p-4 md:p-6 pt-20">
            <div className="max-w-7xl mx-auto">{children}</div>
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
