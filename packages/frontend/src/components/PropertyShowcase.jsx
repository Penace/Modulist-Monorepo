import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useScrollParallax } from "../hooks/useScrollParallax.js";
import SectionDivider from "./common/SectionDivider";
import { fetchItemsByTag } from "../services/api";

// Helper function to handle different image URL types
const getImageUrl = (imagePath) => {
  if (!imagePath) return "/assets/fallback.jpg";
  
  // Handle full external URLs (like Supabase)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/uploads/')) {
    const VITE_IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:4000";
    return `${VITE_IMAGE_BASE_URL}${imagePath}`;
  }
  
  if (imagePath.startsWith('/assets/')) {
    return imagePath;
  }
  
  return `/assets/${imagePath}`;
};

export default function PropertyShowcase({ id, images, title, description }) {
  const showcaseRef = useRef(null);

  useScrollParallax(showcaseRef, {
    parallax: true,
    scale: true,
    opacity: true,
    parallaxStrength: 30,
    scaleStrength: 0.07,
    mobileParallax: true,
    resetOffscreen: true,
  });

  const backgroundImage =
    images && images.length > 0
      ? getImageUrl(images[0])
      : "/assets/fallback.jpg";

  return (
    <Link to={`/items/${id}`} className="block">
      <div className="relative z-10 overflow-hidden mt-[1.4vh]">
        <section
          ref={showcaseRef}
          className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center transition-all duration-700 ease-out transform-gpu will-change-transform rounded-none md:rounded-3xl overflow-hidden"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#f8f8f8", // fallback color
          }}
        >
          {/* Subtle fade-in black overlay */}
          <div className="absolute inset-0 bg-black opacity-20 transition-opacity duration-1000 pointer-events-none" />

          <div className="relative z-10 bg-black/50 px-6 py-8 rounded-xl text-center shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02] w-[90%] max-w-2xl">
            <h2 className="text-4xl font-bold text-white">{title}</h2>
            <p className="text-lg text-gray-200 mt-4">{description}</p>
          </div>
        </section>
      </div>
    </Link>
  );
}
