"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({
  images,
  title,
}: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        {/* Main Image */}
        <div
          className="relative h-[400px] md:h-[500px] col-span-2 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={images[0]}
            alt={`${title} - Featured`}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        {/* Thumbnail Grid */}
        <div className="hidden md:grid grid-cols-4 gap-4 col-span-2">
          {images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="relative h-[150px] cursor-pointer"
              onClick={() => {
                setCurrentIndex(index + 1);
                setIsModalOpen(true);
              }}
            >
              <Image
                src={image}
                alt={`${title} - ${index + 2}`}
                fill
                className="object-cover rounded-lg hover:opacity-90 transition"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal Gallery */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={previousImage}
            className="absolute left-4 text-white hover:text-gray-300"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="relative h-[80vh] w-[80vw]">
            <Image
              src={images[currentIndex]}
              alt={`${title} - ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-4 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
