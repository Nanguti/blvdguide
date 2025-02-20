"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.2]);

  return (
    <motion.section className="relative h-[90vh] flex items-center justify-center">
      <motion.div
        style={{ scale }}
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <Image
          src="/images/main-hero-banner.jpg"
          alt="Luxury home exterior"
          fill
          priority
          className="object-cover"
        />
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 bg-black/40"
        />
      </motion.div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center text-white space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold">
            Find Your Dream Home
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Discover the perfect property in your ideal location
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter a location or property type..."
                className="w-full pl-12 pr-32 h-14 text-lg rounded-full bg-white/95 backdrop-blur-sm border-0 focus:ring-2 focus:ring-primary"
              />
              <Button
                size="lg"
                className="absolute right-2 rounded-full hover:scale-105 transition-transform"
              >
                Search
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute mt-4 left-4 flex gap-2 text-sm"
            >
              <span className="text-white/80">Popular:</span>
              {["Apartments", "Houses", "Villas", "Office"].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="text-white hover:text-primary transition-colors"
                >
                  {term}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
      />
    </motion.section>
  );
}
