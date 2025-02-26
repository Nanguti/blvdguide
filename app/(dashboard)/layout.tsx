"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { Buda } from "next/font/google";
import "../globals.css";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const buda = Buda({
  weight: "300", // Buda has only 300 weight
  subsets: ["latin"],
});

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <html lang="en" className={buda.className}>
        <body className="min-h-screen bg-gray-50">
          {isAuthenticated ? (
            <div className="flex min-h-screen flex-col">
              <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              <div className="flex flex-1 pt-16">
                <Sidebar
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                />
                <main className="flex-1 p-4 md:p-6 md:ml-64">
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      style: {
                        padding: "8px",
                        margin: "8px",
                        background: "#333",
                        color: "#fff",
                        borderRadius: "8px",
                      },
                      success: {
                        style: {
                          background: "#38B000",
                        },
                      },
                      error: {
                        style: {
                          background: "red",
                        },
                      },
                    }}
                  />
                  <div className="max-w-7xl mx-auto">{children}</div>
                  <Footer />
                </main>
              </div>
            </div>
          ) : null}
        </body>
      </html>
    </QueryClientProvider>
  );
}
