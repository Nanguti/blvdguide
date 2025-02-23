"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Award, Users, Home, Target, ArrowRight } from "lucide-react";

const stats = [
  {
    value: "15+",
    label: "Years Experience",
    icon: Award,
  },
  {
    value: "2.5K+",
    label: "Properties Sold",
    icon: Home,
  },
  {
    value: "12K+",
    label: "Happy Clients",
    icon: Users,
  },
  {
    value: "99%",
    label: "Client Satisfaction",
    icon: Target,
  },
];

const values = [
  {
    title: "Trust & Transparency",
    description:
      "We believe in complete transparency in every transaction, building lasting trust with our clients.",
  },
  {
    title: "Client-First Approach",
    description:
      "Your goals are our priority. We tailor our services to meet your unique real estate needs.",
  },
  {
    title: "Market Expertise",
    description:
      "Our deep understanding of local markets ensures you make informed decisions.",
  },
  {
    title: "Innovation",
    description:
      "We leverage cutting-edge technology to provide a seamless real estate experience.",
  },
];

const teamMembers = [
  {
    name: "John Smith",
    role: "CEO & Founder",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800",
    bio: "20+ years of real estate experience, pioneering innovative solutions in property marketing.",
  },
  {
    name: "Emily Johnson",
    role: "Chief Operations Officer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=800",
    bio: "Former tech executive bringing digital transformation to real estate operations.",
  },
  {
    name: "Michael Chen",
    role: "Head of Property Management",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=800",
    bio: "Expert in property management and client relations with 15 years experience.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920"
          alt="Modern building"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Redefining Real Estate
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Building trust, delivering excellence, and creating lasting
            relationships since 2008
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600">
              To revolutionize the real estate industry through innovation,
              integrity, and exceptional service, making property dreams
              accessible to everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Meet Our Leadership
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Driven by innovation and committed to excellence, our leadership
              team brings decades of experience in real estate and technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-80">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mt-1">{member.role}</p>
                  <p className="text-gray-600 mt-4">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let&apos;s work together to find your perfect property or sell
              your current one.
            </p>
            <button
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold
             hover:bg-gray-100 transition-colors"
            >
              Contact Us Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
