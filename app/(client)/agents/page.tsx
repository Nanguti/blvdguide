"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Mail,
  Phone,
  MapPin,
  Star,
  MessageSquare,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import Image from "next/image";

interface Agent {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  reviews: number;
  properties: number;
  experience: number;
  location: string;
  email: string;
  phone: string;
  bio: string;
  specializations: string[];
  social: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  featured: boolean;
}

const sampleAgents: Agent[] = [
  {
    id: 1,
    name: "Sarah Anderson",
    role: "Luxury Property Specialist",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    rating: 4.9,
    reviews: 127,
    properties: 45,
    experience: 8,
    location: "Manhattan, NY",
    email: "sarah.anderson@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Specializing in luxury properties with over 8 years of experience in Manhattan's high-end real estate market.",
    specializations: ["Luxury Homes", "Penthouses", "Investment Properties"],
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
    featured: true,
  },
];

const AgentCard = ({ agent }: { agent: Agent }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute top-4 right-4 z-10 space-y-2">
        {agent.featured && (
          <span className="block px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-white text-sm font-medium rounded-lg">
            Featured
          </span>
        )}
        <div className="flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-primary rounded-lg">
          <Star className="w-4 h-4 fill-primary" />
          <span className="text-sm font-medium">{agent.rating}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start gap-6">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden">
            <Image
              src={agent.avatar}
              alt={agent.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
              {agent.name}
            </h3>
            <p className="text-primary font-medium mt-1">{agent.role}</p>
            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{agent.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 py-6 border-y border-gray-100">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {agent.properties}
            </div>
            <div className="text-sm text-gray-600 mt-1">Properties</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {agent.experience}+
            </div>
            <div className="text-sm text-gray-600 mt-1">Years</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {agent.reviews}
            </div>
            <div className="text-sm text-gray-600 mt-1">Reviews</div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-600">{agent.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-600">{agent.phone}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          {agent.social.linkedin && (
            <a
              href={agent.social.linkedin}
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {agent.social.twitter && (
            <a
              href={agent.social.twitter}
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          )}
          {agent.social.instagram && (
            <a
              href={agent.social.instagram}
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          )}
          <button className="ml-auto bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function AgentsPage() {
  const { data: agents, isLoading } = useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: () =>
      new Promise((resolve) => setTimeout(() => resolve(sampleAgents), 1000)),
    placeholderData: [],
    initialData: [],
  });

  const agentsList = Array.isArray(agents) ? agents : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Meet Our Expert Agents
          </h1>
          <p className="text-xl text-gray-600">
            Connect with our team of professional real estate agents who are
            dedicated to helping you find your perfect property
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="agents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {agentsList.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AgentCard agent={agent} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
