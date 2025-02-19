"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Property } from "@/types/property";

interface PropertyLocationProps {
  property: Property;
}

export default function PropertyLocation({ property }: PropertyLocationProps) {
  const coordinates: [number, number] = [
    property.location.latitude,
    property.location.longitude,
  ];

  return (
    <div className="h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        center={coordinates}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>{property.title}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
