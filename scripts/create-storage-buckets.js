require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Check your .env.local file.');
  process.exit(1);
}

// Create supabase admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

const buckets = [
  {
    id: 'homepage-assets',
    public: true,
    folders: ['hero', 'features', 'testimonials', 'process-steps']
  },
  {
    id: 'university-assets',
    public: true,
    folders: ['logos', 'banners', 'campus']
  },
  {
    id: 'testimonial-photos',
    public: true,
    folders: ['profiles']
  },
  {
    id: 'service-images',
    public: true,
    folders: ['icons', 'banners']
  },
  {
    id: 'site-assets',
    public: true,
    folders: ['about-us', 'contact', 'general']
  }
];

async function createBuckets() {
  try {
    console.log('Setting up storage buckets...');
    
    for (const bucket of buckets) {
      console.log(`Checking if bucket '${bucket.id}' exists...`);
      
      // Check if bucket exists
      const { data: existingBucket, error: bucketError } = await supabaseAdmin
        .storage
        .getBucket(bucket.id);

      // Create bucket if it doesn't exist
      if (bucketError) {
        console.log(`Creating bucket '${bucket.id}'...`);
        
        // Create the bucket if it doesn't exist
        const { data, error } = await supabaseAdmin
          .storage
          .createBucket(bucket.id, { 
            public: bucket.public,
            fileSizeLimit: 10485760, // 10MB
          });

        if (error) {
          throw new Error(`Error creating bucket '${bucket.id}': ${error.message}`);
        }
        
        console.log(`Created bucket '${bucket.id}' successfully`);
      } else {
        console.log(`Bucket '${bucket.id}' already exists`);
        
        // Update bucket settings if it exists to ensure it's public
        console.log(`Updating bucket '${bucket.id}' settings...`);
        const { error } = await supabaseAdmin
          .storage
          .updateBucket(bucket.id, { 
            public: bucket.public,
            fileSizeLimit: 10485760 // 10MB
          });
          
        if (error) {
          throw new Error(`Error updating bucket '${bucket.id}': ${error.message}`);
        }
        
        console.log(`Updated bucket '${bucket.id}' successfully`);
      }
      
      // Set up CORS policy for the bucket - REMOVED as it causes an error
      // const corsSettings = {
      //   "AllowedHeaders": ["*"],
      //   "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
      //   "AllowedOrigins": ["*"],
      //   "ExposeHeaders": [],
      //   "MaxAgeSeconds": 3600
      // };
      
      // await supabaseAdmin
      //   .storage
      //   .updateBucketCors(bucket.id, [corsSettings]);
      
      // console.log(`Updated CORS settings for bucket '${bucket.id}'`);

      // Add RLS policies for the bucket allowing public read - COMMENTED OUT
      /*
      if (bucket.public) {
        // Add policy for anonymous SELECT access
        const { error: policyError } = await supabaseAdmin.query(`
          CREATE POLICY IF NOT EXISTS "Allow Public Select for ${bucket.id}" ON storage.objects
            FOR SELECT
            USING (bucket_id = '${bucket.id}');
        `);
        
        if (policyError) {
          throw new Error(`Error creating public SELECT policy for '${bucket.id}': ${policyError.message}`);
        }
        
        // Add policy for authenticated INSERT access
        const { error: insertPolicyError } = await supabaseAdmin.query(`
          CREATE POLICY IF NOT EXISTS "Allow Authenticated Insert for ${bucket.id}" ON storage.objects
            FOR INSERT
            TO authenticated
            WITH CHECK (bucket_id = '${bucket.id}');
        `);
        
        if (insertPolicyError) {
          throw new Error(`Error creating authenticated INSERT policy for '${bucket.id}': ${insertPolicyError.message}`);
        }
        
        // Add policy for authenticated UPDATE access
        const { error: updatePolicyError } = await supabaseAdmin.query(`
          CREATE POLICY IF NOT EXISTS "Allow Authenticated Update for ${bucket.id}" ON storage.objects
            FOR UPDATE
            TO authenticated
            USING (bucket_id = '${bucket.id}');
        `);
        
        if (updatePolicyError) {
          throw new Error(`Error creating authenticated UPDATE policy for '${bucket.id}': ${updatePolicyError.message}`);
        }
        
        // Add policy for authenticated DELETE access
        const { error: deletePolicyError } = await supabaseAdmin.query(`
          CREATE POLICY IF NOT EXISTS "Allow Authenticated Delete for ${bucket.id}" ON storage.objects
            FOR DELETE
            TO authenticated
            USING (bucket_id = '${bucket.id}');
        `);
        
        if (deletePolicyError) {
          throw new Error(`Error creating authenticated DELETE policy for '${bucket.id}': ${deletePolicyError.message}`);
        }
        
        console.log(`Added RLS policies for bucket '${bucket.id}'`);
      }
      */
    }
    
    console.log('Storage bucket setup completed successfully!');
  } catch (error) {
    console.error('Error setting up storage buckets:', error.message);
    process.exit(1);
  }
}

createBuckets(); 