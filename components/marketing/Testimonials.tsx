"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  propertyType: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "First-time Homebuyer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=800",
    content:
      "The team made my first home buying experience incredibly smooth. Their expertise and patience in explaining every step was invaluable.",
    rating: 5,
    propertyType: "Apartment",
    location: "Brooklyn, NY",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Property Investor",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800",
    content:
      "Outstanding market insights and professional service. They helped me secure multiple investment properties with great potential.",
    rating: 5,
    propertyType: "Commercial",
    location: "Manhattan, NY",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Luxury Home Buyer",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=800",
    content:
      "Their attention to detail and understanding of luxury market trends helped us find our dream home. Exceptional service!",
    rating: 5,
    propertyType: "Villa",
    location: "Los Angeles, CA",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600">
            Real stories from real clients who found their perfect properties
            with us
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-primary text-sm">{testimonial.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <blockquote className="text-gray-600 mb-6">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {testimonial.propertyType}
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {testimonial.location}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Join our community of satisfied clients
          </p>
          <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            View More Reviews
          </button>
        </motion.div>
      </div>
    </section>
  );
}
