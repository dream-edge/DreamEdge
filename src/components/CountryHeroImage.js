"use client";

import { useState } from 'react';
import Image from 'next/image';

/**
 * CountryHeroImage component with fallback mechanism
 * 
 * @param {Object} props
 * @param {string} props.imageUrl - URL of the hero image
 * @param {string} props.countrySlug - Slug of the country
 * @param {string} props.countryName - Display name of the country
 * @param {string} props.className - Additional CSS classes
 */
export default function CountryHeroImage({ imageUrl, countrySlug, countryName, className = "" }) {
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const [hasError, setHasError] = useState(false);
  
  // Fallback order:
  // 1. Original image URL (from database)
  // 2. Country-specific local fallback
  // 3. Default gradient background
  
  const handleImageError = () => {
    if (!hasError) {
      console.log(`Failed to load image for ${countryName}, trying local fallback`);
      setImgSrc(`/images/countries/${countrySlug || 'default'}.jpg`);
      setHasError(true);
    }
  };
  
  if (!imageUrl && !hasError) {
    return (
      <div className={`absolute inset-0 z-0 bg-gradient-to-br from-brand-primary-400 to-brand-primary-700 ${className}`} />
    );
  }
  
  return (
    <>
      <Image 
        src={imgSrc}
        alt={`Study in ${countryName}`}
        fill
        style={{ objectFit: "cover" }}
        className={`absolute inset-0 z-0 opacity-40 ${className}`}
        priority
        onError={handleImageError}
      />
      {/* Add a gradient overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-brand-primary-900/40" />
    </>
  );
} 