"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionWrapper from "./SectionWrapper";

export default function LeadCapture() {
  return (
    <SectionWrapper>
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold"
        >
          Get Started Today
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2 mb-8"
        >
          Subscribe to our newsletter for exclusive property updates
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex gap-2"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            className="max-w-sm"
          />
          <Button>Subscribe</Button>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
