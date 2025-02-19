"use client";

import { Suspense } from "react";
import Hero from "@/components/marketing/Hero";
import FeaturedProperties from "@/components/marketing/FeaturedProperties";
import PropertySearch from "@/components/marketing/PropertySearch";
import AboutUs from "@/components/marketing/AboutUs";
// import ExploreNeighborhoods from "@/components/marketing/ExploreNeighborhoods";
import FeaturedAgents from "@/components/marketing/FeaturedAgents";
import HowItWorks from "@/components/marketing/HowItWorks";
import Testimonials from "@/components/marketing/Testimonials";
import MarketInsights from "@/components/marketing/MarketInsights";
import LeadCapture from "@/components/marketing/LeadCapture";
// import Partners from "@/components/marketing/Partners";
import { Loader } from "@/components/ui/loader";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />

      <Suspense fallback={<Loader className="my-8" />}>
        <PropertySearch />
      </Suspense>

      <Suspense fallback={<Loader className="my-8" />}>
        <FeaturedProperties />
      </Suspense>

      <AboutUs />

      {/* <Suspense fallback={<Loader className="my-8" />}>
        <ExploreNeighborhoods />
      </Suspense> */}

      <Suspense fallback={<Loader className="my-8" />}>
        <FeaturedAgents />
      </Suspense>

      <HowItWorks />
      <Testimonials />

      <Suspense fallback={<Loader className="my-8" />}>
        <MarketInsights />
      </Suspense>

      <LeadCapture />
      {/* <Partners /> */}
    </main>
  );
}
