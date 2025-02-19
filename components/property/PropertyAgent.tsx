"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Agent } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  Star,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PropertyAgentProps {
  agent: Agent;
}

export default function PropertyAgent({ agent }: PropertyAgentProps) {
  const [activeTab, setActiveTab] = useState<"contact" | "schedule">("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    date: "",
    time: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const socialLinks = [
    { icon: Facebook, href: agent.social?.facebook },
    { icon: Twitter, href: agent.social?.twitter },
    { icon: Linkedin, href: agent.social?.linkedin },
    { icon: Instagram, href: agent.social?.instagram },
  ].filter((link) => link.href);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Agent Profile Header */}
      <div className="relative h-32 bg-gradient-to-r from-primary to-primary/80">
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={agent.avatar}
              alt={agent.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
            {agent.agency && (
              <p className="text-white/80 text-sm">{agent.agency.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Agent Stats */}
      <div className="mt-16 px-6">
        <div className="flex justify-between items-center py-4 border-b">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-medium">4.9</span>
            <span className="text-gray-500 text-sm">(128 reviews)</span>
          </div>
          <div className="flex gap-4">
            {socialLinks.map(({ icon: Icon, href }, index) => (
              <Link
                key={index}
                href={href!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Tabs */}
      <div className="p-6">
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === "contact" ? "default" : "outline"}
            onClick={() => setActiveTab("contact")}
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact
          </Button>
          <Button
            variant={activeTab === "schedule" ? "default" : "outline"}
            onClick={() => setActiveTab("schedule")}
            className="flex-1"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Visit
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "contact" ? (
            <motion.form
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="pl-9"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="pl-9"
                      placeholder="Your email"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="pl-9"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="I'm interested in this property..."
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Schedule form fields */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Schedule Visit
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
