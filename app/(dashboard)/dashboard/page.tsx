"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      icon: Building2,
      label: "Total Properties",
      value: "2,543",
      trend: "+12.5%",
      color: "bg-blue-500",
    },
    {
      icon: Users,
      label: "Active Agents",
      value: "125",
      trend: "+4.3%",
      color: "bg-green-500",
    },
    {
      icon: Calendar,
      label: "Appointments",
      value: "89",
      trend: "+28.4%",
      color: "bg-purple-500",
    },
    {
      icon: DollarSign,
      label: "Revenue",
      value: "Kes. 284.5k",
      trend: "+15.2%",
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-500">{stat.trend}</span>
                <span className="text-gray-600">vs last month</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add more dashboard content here */}
    </div>
  );
}
