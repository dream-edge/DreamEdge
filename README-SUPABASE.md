# Dream Consultancy - Supabase Setup

This document provides instructions for setting up the Supabase backend for the Dream Consultancy website.

## Database Setup

### Option 1: Using the SQL Editor in Supabase Dashboard

1. Log in to your Supabase dashboard at https://app.supabase.com/
2. Select your project: `xygintepfethdohbhsja`
3. Navigate to the SQL Editor
4. Create a new query
5. Copy and paste the entire contents of the `supabase-setup.sql` file
6. Click "Run" to execute the script

### Option 2: Using Supabase CLI

If you prefer using the Supabase CLI:

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Log in to Supabase:
   ```bash
   supabase login
   ```

3. Run the SQL script:
   ```bash
   supabase db execute --project-ref xygintepfethdohbhsja --file supabase-setup.sql
   ```

## Database Schema Overview

The script sets up the following tables:

1. **universities** - For storing university details
2. **services** - For consultant services offered
3. **testimonials** - For student testimonials
4. **faqs** - For frequently asked questions
5. **test_prep_courses** - For test preparation courses
6. **contact_inquiries** - For storing contact form submissions
7. **consultations** - For booking consultation sessions
8. **admin_users** - For admin panel user management

## Row Level Security (RLS) Policies

The script also sets up RLS policies for each table:

- Public users can view universities, services, published testimonials, FAQs, and test prep courses
- Public users can submit contact inquiries and book consultations
- Authenticated users (admins) can view and manage all content

## Next Steps After Setup

After successfully running the script:

1. **Verify Table Creation**: Check each table in the Table Editor
2. **Test RLS Policies**: Verify that RLS policies are correctly applied
3. **Create Admin User**: 
   - Register a user in Supabase Auth
   - Manually insert a record in the admin_users table
   ```sql
   INSERT INTO public.admin_users (id, email, role)
   VALUES ('auth_user_id_here', 'admin@example.com', 'admin');
   ```

## Connecting Frontend to Supabase

Add the following environment variables to your Next.js app:

```
NEXT_PUBLIC_SUPABASE_URL=https://xygintepfethdohbhsja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Z2ludGVwZmV0aGRvaGJoc2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMjQ2ODMsImV4cCI6MjA2MjcwMDY4M30.Sk6fNEKljOehiwZ0dIM-KABTo9uQz9G8R-9quSKGlM4
```

## Troubleshooting

If you encounter any errors while running the script:

1. **Sequence Errors**: If tables already exist, you might need to drop them first
2. **Permission Errors**: Ensure you have the necessary privileges
3. **RLS Policy Conflicts**: If you're rerunning the script, existing policies might need to be dropped first 