"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Building2,
  MapPin,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import api from "@/lib/services/api";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [user, setUser] = useState<{ role?: string }>({});

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isAdmin = user.role === "admin";

  const locationItems = [
    { href: "/admin/countries", label: "Countries" },
    { href: "/admin/states", label: "Areas" },
  ];

  // Filter property items based on user role
  const propertyItems = [
    { href: "/admin/properties", label: "Properties List", adminOnly: false },
    { href: "/admin/property-types", label: "Property Types", adminOnly: true },
    {
      href: "/admin/property-statuses",
      label: "Property Statuses",
      adminOnly: true,
    },
    { href: "/admin/features", label: "Features", adminOnly: true },
  ].filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform bg-white transition-transform duration-300 ease-in-out border-r",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="h-full overflow-y-auto px-3 py-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100",
                  pathname === "/dashboard" && "bg-gray-100"
                )}
              >
                <Home className="h-5 w-5" />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>

            {/* Properties Menu */}
            <li>
              <button
                onClick={() => setPropertiesOpen(!propertiesOpen)}
                className="flex w-full items-center justify-between rounded-lg p-2 text-gray-900 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Building2 className="h-5 w-5" />
                  <span className="ml-3">Properties</span>
                </div>
                {propertiesOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {propertiesOpen && (
                <ul className="ml-6 space-y-2 py-2">
                  {propertyItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100",
                          pathname === item.href && "bg-gray-100"
                        )}
                      >
                        <span className="ml-3">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Locations Menu */}
            <li>
              <button
                onClick={() => setLocationsOpen(!locationsOpen)}
                className="flex w-full items-center justify-between rounded-lg p-2 text-gray-900 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <MapPin className="h-5 w-5" />
                  <span className="ml-3">Locations</span>
                </div>
                {locationsOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {locationsOpen && (
                <ul className="ml-6 space-y-2 py-2">
                  {locationItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100",
                          pathname === item.href && "bg-gray-100"
                        )}
                      >
                        <span className="ml-3">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <Link
                href="/admin/agencies"
                className={cn(
                  "flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100",
                  pathname === "/admin/agencies" && "bg-gray-100"
                )}
              >
                <Building2 className="h-5 w-5" />
                <span className="ml-3">Agencies</span>
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  href="/admin/amenities"
                  className={cn(
                    "flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100",
                    pathname === "/admin/amenities" && "bg-gray-100"
                  )}
                >
                  <Building2 className="h-5 w-5" />
                  <span className="ml-3">Amenities</span>
                </Link>
              </li>
            )}

            {isAdmin && (
              <li>
                <Link
                  href="/admin/users"
                  className={cn(
                    "flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100",
                    pathname === "/admin/users" && "bg-gray-100"
                  )}
                >
                  <Users className="h-5 w-5" />
                  <span className="ml-3">Users</span>
                </Link>
              </li>
            )}

            <li>
              <Link
                href="/admin/settings"
                className={cn(
                  "flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100",
                  pathname === "/admin/settings" && "bg-gray-100"
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="ml-3">Settings</span>
              </Link>
            </li>

            <li>
              <button
                onClick={async () => {
                  try {
                    // Call the logout API endpoint
                    await api.post("/logout");

                    // Clear local storage
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    // Redirect to login page
                    window.location.href = "/login";
                  } catch (error) {
                    console.error("Logout failed:", error);
                    // Still remove items and redirect even if API call fails
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }
                }}
                className="flex w-full items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
