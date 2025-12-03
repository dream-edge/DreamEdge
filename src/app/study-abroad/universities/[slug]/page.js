import React from 'react';
import { getUniversityBySlug } from '@/lib/api';
import UniversityDetailClientContent from './UniversityDetailClientContent'; // Import the new client component

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { data: university, success, notFound } = await getUniversityBySlug(slug);
  
  if (!success || notFound || !university) {
    return {
      title: 'University Not Found',
      description: 'The university you are looking for does not exist.',
    };
  }
  
  return {
    title: `${university.name} - Dream Consultancy`,
    description: university.description || `Learn about ${university.name} and how Dream Consultancy can help you apply.`,
    openGraph: {
        title: `${university.name} - Dream Consultancy`,
        description: university.description || `Learn about ${university.name} and how Dream Consultancy can help you apply.`,
        images: university.banner_image_url ? [{ url: university.banner_image_url }] : [],
    },
  };
}

export default async function UniversityDetailPage({ params }) {
  const { slug } = params;
  const { success, data: university, error, notFound } = await getUniversityBySlug(slug);
  
  // Pass all relevant data and states to the client component
  return (
    <UniversityDetailClientContent 
      university={university} 
      error={!success && error ? error : null} // Pass error only if success is false
      notFound={notFound} 
      slug={slug} 
    />
  );
} 