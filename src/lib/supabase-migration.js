import supabaseAdmin from './supabase-admin';

// Create admin_users table if it doesn't exist
export async function setupAdminUsersTable() {
  try {
    // Check if the table exists
    const { data: tables, error: tableError } = await supabaseAdmin
      .rpc('pg_catalog.pg_tables', { tablename: 'admin_users' });
    
    if (tableError) {
      console.error('Error checking for admin_users table:', tableError);
      return;
    }
    
    if (!tables || tables.length === 0) {
      // Create the admin_users table
      const { error: createError } = await supabaseAdmin
        .rpc('create_admin_users_table');
      
      if (createError) {
        console.error('Error creating admin_users table:', createError);
        
        // Alternative direct SQL approach
        const { error: sqlError } = await supabaseAdmin.query(`
          CREATE TABLE IF NOT EXISTS public.admin_users (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT NOT NULL UNIQUE,
            role TEXT NOT NULL CHECK (role IN ('admin')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
          );
          
          -- Set up RLS
          ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
          
          -- Create policy for admins to manage other admins
          CREATE POLICY "Admins can manage other admins"
          ON public.admin_users
          USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE role = 'admin'))
          WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users WHERE role = 'admin'));
        `);
        
        if (sqlError) {
          console.error('Error with direct SQL creation:', sqlError);
        } else {
          console.log('Admin users table created successfully via SQL');
        }
      } else {
        console.log('Admin users table created successfully');
      }
    } else {
      console.log('Admin users table already exists');
    }
  } catch (error) {
    console.error('Unexpected error setting up admin users table:', error);
  }
}

const supabaseMigration = { setupAdminUsersTable };
export default supabaseMigration; 