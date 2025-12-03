const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
  process.exit(1);
}

// Create supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Function to download an image from URL
async function downloadImage(url) {
  try {
    console.log(`Downloading image from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type');
    const buffer = await response.buffer();
    return { buffer, contentType };
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    return null;
  }
}

// Function to upload image to Supabase Storage
async function uploadImageToSupabase(buffer, contentType, fileName, bucketName, folderName) {
  try {
    const filePath = folderName ? `${folderName}/${fileName}` : fileName;
    console.log(`Uploading to ${bucketName}/${filePath}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType,
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error(`Error uploading image ${fileName}:`, error);
    return null;
  }
}

// Function to update study destination record with new image URL
async function updateStudyDestination(id, heroImageUrl) {
  try {
    const { data, error } = await supabase
      .from('study_destination_details')
      .update({ hero_image_url: heroImageUrl })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    console.log(`Updated study destination with ID ${id}`);
    return true;
  } catch (error) {
    console.error(`Error updating study destination ${id}:`, error);
    return false;
  }
}

// Main migration function
async function migrateCountryImages() {
  try {
    console.log('Starting country image migration...');
    
    // Get all study destinations
    const { data: destinations, error } = await supabase
      .from('study_destination_details')
      .select('id, country_slug, display_name, hero_image_url');
    
    if (error) {
      throw error;
    }

    console.log(`Found ${destinations.length} study destinations`);
    
    // Process each destination
    for (const destination of destinations) {
      if (!destination.hero_image_url || destination.hero_image_url.includes('supabase.co')) {
        console.log(`Skipping ${destination.display_name} - no external image or already migrated`);
        continue;
      }
      
      console.log(`Processing ${destination.display_name} with image: ${destination.hero_image_url}`);
      
      // Download image
      const imageData = await downloadImage(destination.hero_image_url);
      if (!imageData) {
        console.log(`Failed to download image for ${destination.display_name}, skipping...`);
        continue;
      }
      
      // Generate filename
      const fileExt = path.extname(new URL(destination.hero_image_url, 'https://example.com').pathname) || '.jpg';
      const fileName = `${destination.country_slug}_hero${fileExt}`;
      
      // Upload to Supabase
      const newImageUrl = await uploadImageToSupabase(
        imageData.buffer, 
        imageData.contentType, 
        fileName, 
        'destination-assets', 
        'hero'
      );
      
      if (!newImageUrl) {
        console.log(`Failed to upload image for ${destination.display_name}, skipping...`);
        continue;
      }
      
      // Update destination record
      const updated = await updateStudyDestination(destination.id, newImageUrl);
      if (updated) {
        console.log(`Successfully migrated image for ${destination.display_name}`);
        console.log(`  Old URL: ${destination.hero_image_url}`);
        console.log(`  New URL: ${newImageUrl}`);
      }
    }
    
    console.log('Country image migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateCountryImages(); 