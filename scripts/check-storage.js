require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Checking Supabase connection...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'NOT SET');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'NOT SET');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env.local file.');
  process.exit(1);
}

// Create supabase client (same as in the app)
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

async function checkStorage() {
  try {
    // List buckets (requires anon key with rights or service key)
    console.log('\nAttempting to list buckets using anon key...');
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return;
    }
    
    console.log('Available buckets:', buckets.length);
    buckets.forEach(bucket => {
      console.log(`- ${bucket.id}`);
    });
    
    // Try to access the site-assets bucket specifically
    console.log('\nChecking site-assets bucket...');
    const { data: bucketInfo, error: bucketError } = await supabase.storage
      .getBucket('site-assets');
    
    if (bucketError) {
      console.error('Error getting site-assets bucket:', bucketError);
      return;
    }
    
    console.log('site-assets bucket info:', bucketInfo);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkStorage(); 