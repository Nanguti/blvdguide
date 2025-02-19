"use client";

import { motion } from "framer-motion";
import {
  Search,
  Home,
  FileCheck,
  Key,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionWrapper from "./SectionWrapper";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Search,
    title: "Search Properties",
    description:
      "Browse through our extensive collection of properties and find the perfect match for your needs.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Home,
    title: "Schedule Viewings",
    description:
      "Book appointments to visit your favorite properties at your convenience with our expert agents.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: FileCheck,
    title: "Documentation",
    description:
      "We handle all the paperwork and legal requirements to ensure a smooth transaction process.",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: Key,
    title: "Get Your Keys",
    description:
      "Complete the purchase process and receive the keys to your new property.",
    color: "bg-orange-500/10 text-orange-500",
  },
];

export default function HowItWorks() {
  return (
    <SectionWrapper className="bg-muted/50">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2"
        >
          Your journey to finding the perfect property in four simple steps
        </motion.p>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-[45%] left-0 right-0 h-0.5 bg-muted hidden lg:block">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-card p-6 rounded-xl border relative z-10"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                    step.color
                  )}
                >
                  <step.icon className="w-6 h-6" />
                </div>

                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    Step {index + 1} of 4
                  </span>
                </div>
              </motion.div>

              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-20">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                    className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <Button size="lg" className="px-8">
          Get Started Now
        </Button>
      </motion.div>
    </SectionWrapper>
  );
}
