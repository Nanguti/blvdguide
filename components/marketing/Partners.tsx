"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionWrapper from "./SectionWrapper";

const partners = [
  { name: "Partner 1", logo: "/images/partners/logo1.png" },
  { name: "Partner 2", logo: "/images/partners/logo2.png" },
  { name: "Partner 3", logo: "/images/partners/logo3.png" },
  { name: "Partner 4", logo: "/images/partners/logo4.png" },
];

export default function Partners() {
  return (
    <SectionWrapper className="bg-muted/50">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold"
        >
          Our Partners
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2"
        >
          Trusted by industry leaders
        </motion.p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
        {partners.map((partner) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative h-16 grayscale hover:grayscale-0 transition-all"
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              fill
              className="object-contain"
            />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
