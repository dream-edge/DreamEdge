// This file is for server-side use only to load environment variables

// Hardcoded fallback values (only used if environment variables are missing)
const FALLBACK_SUPABASE_URL = 'https://xygintepfethdohbhsja.supabase.co';
const FALLBACK_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Z2ludGVwZmV0aGRvaGJoc2phIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEyNDY4MywiZXhwIjoyMDYyNzAwNjgzfQ.MfcPS6GSaLEGIGstU5DQ5k1KVIqI1vY0xBCJuXW_1kM';

// Get the environment variables
export function getServerEnv() {
  console.log('Loading server environment variables');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'exists' : 'missing');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'exists' : 'missing');

  // For Next.js server components/actions, we can access all environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_SERVICE_ROLE_KEY;

  return {
    supabaseUrl,
    supabaseServiceKey
  };
} 