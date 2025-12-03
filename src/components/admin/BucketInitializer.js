'use client';

import { useEffect, useState } from 'react';

export default function BucketInitializer() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function initializeBuckets() {
      try {
        const response = await fetch('/api/storage/init-buckets');
        if (!response.ok) {
          throw new Error(`Failed to initialize buckets: ${response.statusText}`);
        }
        const result = await response.json();
        console.log('Storage buckets initialized:', result);
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing storage buckets:', error);
      }
    }

    // Only run once when the application starts
    if (!initialized) {
      initializeBuckets();
    }
  }, [initialized]);

  // This is a utility component that doesn't render anything visible
  return null;
} 