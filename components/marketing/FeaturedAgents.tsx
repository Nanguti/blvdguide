"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import SectionWrapper from "./SectionWrapper";
import { Agent } from "@/types/property";

const sampleAgents: Agent[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@BLVD GUIDE.com",
    phone: "(123) 456-7890",
    avatar: "/images/agents/1.jpg",
    social: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    experience: 8,
    properties: 124,
    rating: 4.9,
    specialization: "Luxury Homes",
    languages: ["English", "Spanish"],
    about:
      "Sarah is a top-performing agent with over 8 years of experience in luxury real estate. She specializes in high-end properties and has a proven track record of successful transactions.",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@BLVD GUIDE.com",
    phone: "(123) 456-7891",
    avatar: "/images/agents/2.jpg",
    social: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    experience: 12,
    properties: 156,
    rating: 4.8,
    specialization: "Commercial Properties",
    languages: ["English", "Mandarin", "Cantonese"],
    about:
      "Michael is an expert in commercial real estate with extensive knowledge of the market. His multilingual abilities help him serve a diverse client base effectively.",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily@BLVD GUIDE.com",
    phone: "(123) 456-7892",
    avatar: "/images/agents/3.jpg",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    experience: 5,
    properties: 98,
    rating: 4.7,
    specialization: "Residential Properties",
    languages: ["English", "Spanish", "Portuguese"],
    about:
      "Emily specializes in helping families find their perfect homes. Her attention to detail and dedication to client satisfaction have earned her numerous referrals.",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@BLVD GUIDE.com",
    phone: "(123) 456-7893",
    avatar: "/images/agents/4.jpg",
    social: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
    experience: 15,
    properties: 210,
    rating: 5.0,
    specialization: "Investment Properties",
    languages: ["English", "Korean"],
    about:
      "David is a veteran in real estate investment consulting. His expertise in market analysis and investment strategies has helped numerous clients build successful property portfolios.",
  },
];

export default function FeaturedAgents() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <SectionWrapper>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold">Meet Our Agents</h2>
        <p className="text-muted-foreground mt-2">
          Work with the best real estate professionals in the industry
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleAgents.map((agent) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
            onClick={() => setSelectedAgent(agent)}
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4">
              <Image
                src={agent.avatar}
                alt={agent.name}
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">
              {agent.specialization}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-sm">
                <span className="font-medium">{agent.properties}</span>{" "}
                <span className="text-muted-foreground">Properties</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{agent.experience}+</span>{" "}
                <span className="text-muted-foreground">Years</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog
        open={!!selectedAgent}
        onOpenChange={() => setSelectedAgent(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedAgent && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                <Image
                  src={selectedAgent.avatar}
                  alt={selectedAgent.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">
                  {selectedAgent.name}
                </h3>
                <p className="text-primary font-medium mb-4">
                  {selectedAgent.specialization}
                </p>
                <p className="text-muted-foreground mb-6">
                  {selectedAgent.about}
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Languages
                    </div>
                    <div className="flex gap-2">
                      {selectedAgent.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-1 bg-muted rounded text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Contact
                    </div>
                    <div className="space-y-1">
                      <p>{selectedAgent.email}</p>
                      <p>{selectedAgent.phone}</p>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Social Media
                    </div>
                    <div className="flex gap-2">
                      {selectedAgent.social &&
                        Object.entries(selectedAgent.social).map(
                          ([platform, url]) =>
                            url && (
                              <Link
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                              >
                                {platform === "facebook" && (
                                  <Facebook className="w-4 h-4" />
                                )}
                                {platform === "twitter" && (
                                  <Twitter className="w-4 h-4" />
                                )}
                                {platform === "linkedin" && (
                                  <Linkedin className="w-4 h-4" />
                                )}
                                {platform === "instagram" && (
                                  <Instagram className="w-4 h-4" />
                                )}
                              </Link>
                            )
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  );
}
