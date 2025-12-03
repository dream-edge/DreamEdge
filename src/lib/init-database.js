import supabaseAdmin from './supabase-admin';
import seedData from './seed-data';

/**
 * Create all database tables based on the schema
 */
export const createTables = async () => {
  try {
    // Create admin_users table
    const { error: adminUsersError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY REFERENCES auth.users(id),
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (adminUsersError) throw adminUsersError;
    console.log('admin_users table created or already exists');

    // Create services table
    const { error: servicesError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS services (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        short_description TEXT,
        full_description TEXT,
        icon_name TEXT,
        image_url TEXT,
        benefits JSONB,
        display_order INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (servicesError) throw servicesError;
    console.log('services table created or already exists');

    // Create universities table
    const { error: universitiesError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS universities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        logo_url TEXT,
        banner_image_url TEXT,
        location TEXT,
        ranking INTEGER,
        tuition_fees_range TEXT,
        accommodation_info TEXT,
        popular_courses JSONB,
        website_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (universitiesError) throw universitiesError;
    console.log('universities table created or already exists');

    // Create testimonials table
    const { error: testimonialsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        quote TEXT NOT NULL,
        photo_url TEXT,
        university TEXT,
        program TEXT,
        category TEXT,
        status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (testimonialsError) throw testimonialsError;
    console.log('testimonials table created or already exists');

    // Create faqs table
    const { error: faqsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category TEXT,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (faqsError) throw faqsError;
    console.log('faqs table created or already exists');

    // Create test_prep_courses table
    const { error: testPrepCoursesError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS test_prep_courses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        test_name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        price TEXT,
        duration TEXT,
        features JSONB,
        schedule_options JSONB,
        display_order INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (testPrepCoursesError) throw testPrepCoursesError;
    console.log('test_prep_courses table created or already exists');

    // Create contact_inquiries table
    const { error: contactInquiriesError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        interest TEXT,
        status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
        admin_notes TEXT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (contactInquiriesError) throw contactInquiriesError;
    console.log('contact_inquiries table created or already exists');

    // Create consultations table
    const { error: consultationsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        preferred_date DATE NOT NULL,
        preferred_time TEXT NOT NULL,
        alt_date DATE NULL,
        alt_time TEXT,
        education_level TEXT NOT NULL,
        study_interest TEXT NOT NULL,
        message TEXT,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (consultationsError) throw consultationsError;
    console.log('consultations table created or already exists');

    // Create consultation_time_slots table
    const { error: consultationTimeSlotsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS consultation_time_slots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        time_range_display TEXT NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT TRUE,
        display_order INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    if (consultationTimeSlotsError) throw consultationTimeSlotsError;
    console.log('consultation_time_slots table created or already exists');

    // Create education_levels_options table
    const { error: educationLevelsOptionsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS education_levels_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        level_name TEXT NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT TRUE,
        display_order INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    if (educationLevelsOptionsError) throw educationLevelsOptionsError;
    console.log('education_levels_options table created or already exists');

    // Create site_settings table
    // Assuming id is the primary key and it's a single row table, often with id = 1
    // For simplicity, using INTEGER PRIMARY KEY. If text or UUID is used, adjust accordingly.
    const { error: siteSettingsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY CHECK (id = 1), -- Enforce single row with id = 1
        site_name TEXT,
        primary_phone TEXT,
        primary_email TEXT,
        primary_address_line1 TEXT,
        primary_address_line2 TEXT,
        office_hours TEXT,
        logo_url TEXT,
        facebook_url TEXT,
        instagram_url TEXT,
        linkedin_url TEXT,
        twitter_url TEXT,
        map_embed_url_main_office TEXT,
        footer_about_text TEXT,
        copyright_year_start INTEGER,
        hero_title TEXT,
        hero_subtitle TEXT,
        hero_cta_text TEXT,
        hero_cta_link TEXT,
        hero_background_image_url TEXT,
        why_choose_us_title TEXT,
        why_choose_us_subtitle TEXT,
        proven_process_title TEXT,
        about_hero_title TEXT,
        about_hero_subtitle TEXT,
        about_us_story_title TEXT,
        about_us_story_content TEXT,
        about_us_mission_title TEXT,
        about_us_mission_content TEXT,
        about_us_vision_title TEXT,
        about_us_vision_content TEXT,
        about_us_image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    if (siteSettingsError) throw siteSettingsError;
    console.log('site_settings table created or already exists');

    // Create study_interests_options table
    const { error: studyInterestsOptionsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS study_interests_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        interest_name TEXT NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT TRUE,
        display_order INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    if (studyInterestsOptionsError) throw studyInterestsOptionsError;
    console.log('study_interests_options table created or already exists');

    // Create study_destination_details table
    const { error: studyDestinationDetailsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS study_destination_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        country_slug TEXT NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        meta_title TEXT,
        meta_description TEXT,
        hero_image_url TEXT,
        intro_text TEXT,
        quick_facts JSONB,
        why_study_here_content TEXT,
        education_system_content TEXT,
        popular_courses_content TEXT,
        admission_requirements_content TEXT,
        cost_studying_living_content TEXT,
        visa_requirements_content TEXT,
        scholarships_content TEXT,
        country_specific_faqs JSONB,
        additional_sections JSONB,
        sidebar_nav_links JSONB,
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER,
        seo_keywords TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    if (studyDestinationDetailsError) throw studyDestinationDetailsError;
    console.log('study_destination_details table created or already exists');

    // Create homepage_process_steps table
    const { error: homepageProcessStepsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS homepage_process_steps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        step_number INTEGER NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon_name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    if (homepageProcessStepsError) throw homepageProcessStepsError;
    console.log('homepage_process_steps table created or already exists');

    return { success: true };
  } catch (error) {
    console.error('Error creating tables:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Seed the database with initial data
 */
export const seedDatabase = async () => {
  try {
    // Check if data already exists in any of the tables
    const { data: existingServices, error: servicesError } = await supabaseAdmin
      .from('services')
      .select('id')
      .limit(1);
    
    if (servicesError) throw servicesError;
    
    // Only seed if no data exists
    if (existingServices && existingServices.length === 0) {
      // Insert services
      if (seedData.services && seedData.services.length > 0) {
        const { error: insertServicesError } = await supabaseAdmin
          .from('services')
          .insert(seedData.services);
        
        if (insertServicesError) throw insertServicesError;
        console.log(`${seedData.services.length} services inserted`);
      }
      
      // Insert universities
      if (seedData.universities && seedData.universities.length > 0) {
        const { error: insertUniversitiesError } = await supabaseAdmin
          .from('universities')
          .insert(seedData.universities);
        
        if (insertUniversitiesError) throw insertUniversitiesError;
        console.log(`${seedData.universities.length} universities inserted`);
      }
      
      // Insert testimonials
      if (seedData.testimonials && seedData.testimonials.length > 0) {
        const { error: insertTestimonialsError } = await supabaseAdmin
          .from('testimonials')
          .insert(seedData.testimonials);
        
        if (insertTestimonialsError) throw insertTestimonialsError;
        console.log(`${seedData.testimonials.length} testimonials inserted`);
      }
      
      // Insert FAQs
      if (seedData.faqs && seedData.faqs.length > 0) {
        const { error: insertFaqsError } = await supabaseAdmin
          .from('faqs')
          .insert(seedData.faqs);
        
        if (insertFaqsError) throw insertFaqsError;
        console.log(`${seedData.faqs.length} FAQs inserted`);
      }
      
      // Insert test prep courses
      if (seedData.testPrepCourses && seedData.testPrepCourses.length > 0) {
        const { error: insertTestPrepCoursesError } = await supabaseAdmin
          .from('test_prep_courses')
          .insert(seedData.testPrepCourses);
        
        if (insertTestPrepCoursesError) throw insertTestPrepCoursesError;
        console.log(`${seedData.testPrepCourses.length} test prep courses inserted`);
      }
      
      return { success: true, message: 'Database seeded successfully' };
    } else {
      return { success: true, message: 'Database already contains data, skipping seed' };
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Initialize the database (create tables and seed with initial data)
 */
export const initializeDatabase = async () => {
  try {
    // Create tables
    const createTablesResult = await createTables();
    if (!createTablesResult.success) {
      throw new Error(`Failed to create tables: ${createTablesResult.error}`);
    }
    
    // Seed database with initial data
    const seedResult = await seedDatabase();
    if (!seedResult.success) {
      throw new Error(`Failed to seed database: ${seedResult.error}`);
    }
    
    return { 
      success: true, 
      message: 'Database initialized successfully',
      createTablesResult,
      seedResult
    };
  } catch (error) {
    console.error('Database initialization failed:', error);
    return { success: false, error: error.message };
  }
}; 