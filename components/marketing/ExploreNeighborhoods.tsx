"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Home, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import SectionWrapper from "./SectionWrapper";
import { Map, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Neighborhood {
  id: string;
  name: string;
  description: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
  };
  stats: {
    avgPrice: number;
    properties: number;
    growth: number;
    population: number;
  };
}

export default function ExploreNeighborhoods() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<
    string | null
  >(null);
  const [viewState, setViewState] = useState({
    latitude: 34.0522,
    longitude: -118.2437,
    zoom: 11,
  });

  const { data: neighborhoods } = useQuery<Neighborhood[]>({
    queryKey: ["neighborhoods"],
    queryFn: async () => {
      const response = await fetch("/api/neighborhoods");
      return response.json();
    },
  });

  const handleNeighborhoodClick = useCallback(
    (id: string) => {
      const neighborhood = neighborhoods?.find((n) => n.id === id);
      if (neighborhood) {
        setSelectedNeighborhood(id);
        setViewState({
          latitude: neighborhood.location.latitude,
          longitude: neighborhood.location.longitude,
          zoom: 13,
        });
      }
    },
    [neighborhoods]
  );

  return (
    <SectionWrapper className="bg-muted/50">
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold"
          >
            Explore Popular Neighborhoods
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2"
          >
            Discover the perfect neighborhood that matches your lifestyle and
            preferences
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="h-[600px] rounded-xl overflow-hidden"
          >
            <Map
              {...viewState}
              onMove={(evt: { viewState: typeof viewState }) =>
                setViewState(evt.viewState)
              }
              mapStyle="mapbox://styles/mapbox/light-v11"
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              style={{ width: "100%", height: "100%" }}
            >
              {neighborhoods?.map((neighborhood) => (
                <Marker
                  key={neighborhood.id}
                  latitude={neighborhood.location.latitude}
                  longitude={neighborhood.location.longitude}
                >
                  <button
                    onClick={() => handleNeighborhoodClick(neighborhood.id)}
                    className={`p-2 rounded-full transition-all ${
                      selectedNeighborhood === neighborhood.id
                        ? "bg-primary text-white scale-125"
                        : "bg-white text-primary hover:scale-110"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </Marker>
              ))}
            </Map>
          </motion.div>

          <div className="space-y-4 lg:h-[600px] overflow-y-auto scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {neighborhoods?.map((neighborhood) => (
                <motion.div
                  key={neighborhood.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onClick={() => handleNeighborhoodClick(neighborhood.id)}
                  className={`group cursor-pointer rounded-xl border transition-all ${
                    selectedNeighborhood === neighborhood.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                >
                  <div className="p-4 space-y-4">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={neighborhood.image}
                          alt={neighborhood.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {neighborhood.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {neighborhood.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Home className="w-4 h-4" />
                          <span className="text-sm">Properties</span>
                        </div>
                        <p className="font-medium">
                          {neighborhood.stats.properties}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">Growth</span>
                        </div>
                        <p className="font-medium text-primary">
                          +{neighborhood.stats.growth}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">Population</span>
                        </div>
                        <p className="font-medium">
                          {neighborhood.stats.population.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <span className="text-sm">Avg. Price</span>
                        </div>
                        <p className="font-medium">
                          ${neighborhood.stats.avgPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
