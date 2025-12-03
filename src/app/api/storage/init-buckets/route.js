import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabase-admin';

// Define all buckets needed by the app
const REQUIRED_BUCKETS = [
  { 
    name: 'site-assets', 
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  },
  { 
    name: 'homepage-assets', 
    public: true,
    fileSizeLimit: 10485760,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  },
  { 
    name: 'university-assets', 
    public: true,
    fileSizeLimit: 10485760,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  },
  { 
    name: 'service-images', 
    public: true,
    fileSizeLimit: 10485760,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  },
  { 
    name: 'testimonial-photos', 
    public: true,
    fileSizeLimit: 10485760,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  { 
    name: 'destination-assets', 
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  }
];

export async function GET() {
  try {
    // Get existing buckets
    const { data: existingBuckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return NextResponse.json({ 
        success: false, 
        error: listError.message,
        message: 'Failed to list existing buckets'
      }, { status: 500 });
    }

    const existingBucketNames = existingBuckets.map(bucket => bucket.name);
    const results = [];

    // Create any missing buckets
    for (const bucket of REQUIRED_BUCKETS) {
      if (!existingBucketNames.includes(bucket.name)) {
        try {
          const { data, error } = await supabaseAdmin.storage.createBucket(
            bucket.name,
            {
              public: bucket.public,
              fileSizeLimit: bucket.fileSizeLimit,
              allowedMimeTypes: bucket.allowedMimeTypes
            }
          );
          
          if (error) {
            results.push({
              bucket: bucket.name,
              status: 'error',
              message: error.message
            });
          } else {
            results.push({
              bucket: bucket.name,
              status: 'created'
            });
          }
        } catch (err) {
          results.push({
            bucket: bucket.name,
            status: 'error',
            message: err.message
          });
        }
      } else {
        results.push({
          bucket: bucket.name,
          status: 'exists'
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      results,
      message: 'Storage buckets checked/created'
    });
    
  } catch (error) {
    console.error('Unexpected error initializing buckets:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      message: 'Unexpected error initializing buckets'
    }, { status: 500 });
  }
} 