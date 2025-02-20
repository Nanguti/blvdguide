"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Home,
  Users,
  Building,
} from "lucide-react";
import SectionWrapper from "./SectionWrapper";

const marketData = {
  trends: [
    {
      title: "Average Home Price",
      value: "Ksh.725,000",
      change: "+5.2%",
      isPositive: true,
      icon: DollarSign,
      description: "Year over year increase in property values",
    },
    {
      title: "Properties Sold",
      value: "1,234",
      change: "+12.3%",
      isPositive: true,
      icon: Home,
      description: "More properties sold compared to last quarter",
    },
    {
      title: "Days on Market",
      value: "45",
      change: "-18.5%",
      isPositive: true,
      icon: Building,
      description: "Average days properties spend on market",
    },
    {
      title: "New Listings",
      value: "856",
      change: "-2.8%",
      isPositive: false,
      icon: Users,
      description: "New properties listed this month",
    },
  ],
  hotAreas: [
    {
      name: "Downtown",
      priceChange: "+8.5%",
      avgPrice: "Ksh.850,000",
      demand: "High",
    },
    {
      name: "Beachfront",
      priceChange: "+12.3%",
      avgPrice: "Ksh.1,250,000",
      demand: "Very High",
    },
    {
      name: "Suburbs",
      priceChange: "+4.2%",
      avgPrice: "Ksh.550,000",
      demand: "Moderate",
    },
  ],
};

export default function MarketInsights() {
  return (
    <SectionWrapper>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold">Market Insights</h2>
        <p className="text-muted-foreground mt-2">
          Stay informed with the latest real estate market trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {marketData.trends.map((trend, index) => (
          <motion.div
            key={trend.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-6 border"
          >
            <div className="flex items-start justify-between mb-4">
              <trend.icon className="w-8 h-8 text-primary" />
              <div
                className={`flex items-center gap-1 text-sm ${
                  trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {trend.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{trend.value}</h3>
            <p className="font-medium mb-2">{trend.title}</p>
            <p className="text-sm text-muted-foreground">{trend.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Hot Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketData.hotAreas.map((area, index) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-lg p-4 border"
            >
              <h4 className="font-medium mb-2">{area.name}</h4>
              <div className="space-y-1 text-sm">
                <p className="flex items-center justify-between">
                  Price Change
                  <span className="text-green-500">{area.priceChange}</span>
                </p>
                <p className="flex items-center justify-between">
                  Average Price
                  <span className="font-medium">{area.avgPrice}</span>
                </p>
                <p className="flex items-center justify-between">
                  Demand
                  <span className="font-medium">{area.demand}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
