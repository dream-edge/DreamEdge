/**
 * Supabase Row Level Security (RLS) Setup Script
 * 
 * This script sets up the RLS policies for the Dream Consultancy app database.
 * It defines who can access what data and perform what operations.
 * 
 * To run this script, you need to be authenticated with appropriate permissions.
 */

import supabaseAdmin from './supabase-admin';

/**
 * Function to create RLS policy for a table
 */
const createPolicy = async (table, policyName, policyDefinition) => {
  try {
    const { data, error } = await supabaseAdmin.rpc('create_policy', {
      table_name: table,
      policy_name: policyName,
      definition: policyDefinition
    });

    if (error) {
      console.error(`Error creating policy ${policyName} for ${table}:`, error);
      return false;
    }

    console.log(`Successfully created policy ${policyName} for ${table}`);
    return true;
  } catch (error) {
    console.error(`Unexpected error creating policy ${policyName} for ${table}:`, error);
    return false;
  }
};

/**
 * Enable RLS on all tables
 */
const enableRLS = async () => {
  const tables = [
    'services',
    'universities',
    'testimonials',
    'faqs',
    'test_prep_courses',
    'contact_inquiries',
    'consultations',
    'admin_users'
  ];

  for (const table of tables) {
    try {
      const { error } = await supabaseAdmin.rpc('alter_table_enable_rls', {
        table_name: table
      });

      if (error) {
        console.error(`Error enabling RLS for ${table}:`, error);
      } else {
        console.log(`Successfully enabled RLS for ${table}`);
      }
    } catch (error) {
      console.error(`Unexpected error enabling RLS for ${table}:`, error);
    }
  }
};

/**
 * Set up all RLS policies
 */
export const setupRLS = async () => {
  try {
    // First enable RLS on all tables
    await enableRLS();

    // Public content tables - Anyone can SELECT
    const publicReadTables = [
      'services',
      'universities',
      'testimonials',
      'faqs',
      'test_prep_courses'
    ];

    for (const table of publicReadTables) {
      await createPolicy(
        table,
        'public_read',
        "FOR SELECT USING (true)"
      );
    }
    
    // Testimonials - Only published testimonials are publicly visible
    await createPolicy(
      'testimonials',
      'only_published',
      "FOR SELECT USING (status = 'published')"
    );

    // Contact forms - Anyone can INSERT, only admins can SELECT, UPDATE, DELETE
    await createPolicy(
      'contact_inquiries',
      'public_insert',
      "FOR INSERT WITH CHECK (true)"
    );
    
    await createPolicy(
      'consultations',
      'public_insert',
      "FOR INSERT WITH CHECK (true)"
    );

    // Admin-only tables - Only authenticated admins can manage
    const adminTables = [
      'services',
      'universities',
      'testimonials',
      'faqs',
      'test_prep_courses',
      'contact_inquiries',
      'consultations'
    ];

    for (const table of adminTables) {
      await createPolicy(
        table,
        'admin_all',
        "FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users WHERE role = 'admin'))"
      );
    }

    // Admin users table - Admins can only manage other admins
    await createPolicy(
      'admin_users',
      'admin_select',
      "FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_users WHERE role = 'admin'))"
    );
    
    await createPolicy(
      'admin_users',
      'admin_insert',
      "FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM admin_users WHERE role = 'admin'))"
    );
    
    await createPolicy(
      'admin_users',
      'admin_update',
      "FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_users WHERE role = 'admin'))"
    );
    
    await createPolicy(
      'admin_users',
      'admin_delete',
      "FOR DELETE USING (auth.uid() IN (SELECT id FROM admin_users WHERE role = 'admin'))"
    );

    return { success: true };
  } catch (error) {
    console.error('Error setting up RLS policies:', error);
    return { success: false, error: error.message };
  }
}; 