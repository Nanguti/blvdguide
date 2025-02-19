"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Home, Users, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import SectionWrapper from "./SectionWrapper";
import CountUp from "react-countup";

const stats = [
  {
    icon: Home,
    value: 1500,
    label: "Properties Sold",
    suffix: "+",
  },
  {
    icon: Users,
    value: 2000,
    label: "Happy Clients",
    suffix: "+",
  },
  {
    icon: Award,
    value: 15,
    label: "Years Experience",
    suffix: "",
  },
  {
    icon: TrendingUp,
    value: 99,
    label: "Client Satisfaction",
    suffix: "%",
  },
];

export default function AboutUs() {
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(statsRef, { once: true, margin: "-100px" });

  return (
    <SectionWrapper>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative aspect-square md:aspect-[4/3]"
        >
          <Image
            src="/images/about-main.jpg"
            alt="Modern living room"
            fill
            className="object-cover rounded-2xl"
          />
          <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl overflow-hidden border-8 border-background">
            <Image
              src="/images/about-main.jpg"
              alt="Happy family"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold">
              Your Trusted Partner in Real Estate Excellence
            </h2>
            <p className="text-muted-foreground">
              With over 15 years of experience, we've helped thousands of
              clients find their dream homes. Our commitment to excellence and
              customer satisfaction sets us apart in the real estate industry.
            </p>
          </motion.div>

          <motion.div
            ref={statsRef}
            className="grid grid-cols-2 gap-6"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    {isInView && (
                      <CountUp
                        end={stat.value}
                        duration={2}
                        suffix={stat.suffix}
                      />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" className="flex-1">
              Explore Properties
            </Button>
            <Button size="lg" variant="outline" className="flex-1">
              Meet Our Team
            </Button>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
