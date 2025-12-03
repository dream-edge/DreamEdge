import { createClient } from '@supabase/supabase-js';

// Supabase project configuration with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a supabase client with service role permissions
// This should ONLY be used in server-side contexts, never exposed to the client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default supabaseAdmin; 