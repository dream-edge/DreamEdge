"use server";

import { seedDatabase } from "@/lib/seed-data";

// Server actions have direct access to environment variables
// Debug the environment variables
function debugEnvironment() {
  console.log('Environment in server action:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'exists' : 'missing');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'exists' : 'missing');
  
  // If the service key exists, log a bit of it for debugging
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('- Service key starts with:', process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + '...');
  }
}

// This is a server action that will be called from the client component
export async function seedDatabaseAction() {
  console.log('Server action seedDatabaseAction called');
  debugEnvironment();
  
  try {
    const result = await seedDatabase();
    console.log('Seed result:', result);
    return result;
  } catch (error) {
    console.error('Error in seedDatabaseAction:', error);
    return {
      success: false,
      message: `Error: ${error.message}`,
    };
  }
} 