import supabase from './supabase';

/**
 * Contact form API functions
 */
export const submitContactForm = async (formData) => {
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
          interest: formData.subject || null,
          status: 'new'
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Consultation booking API functions
 */
export const bookConsultation = async (formData) => {
  try {
    // Save to database
    const { data, error } = await supabase
      .from('consultations')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          preferred_date: formData.preferred_date,
          preferred_time: formData.preferred_time,
          alt_date: formData.alt_date || null,
          alt_time: formData.alt_time || null,
          education_level: formData.education_level,
          study_interest: formData.study_interests,
          message: formData.message || null,
          status: 'scheduled'
        }
      ])
      .select();

    if (error) throw error;
    
    // Send email notification (don't block on this - run in background)
    try {
      await fetch('/api/send-consultation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          preferred_location: formData.preferred_location || 'online'
        }),
      });
    } catch (emailError) {
      // Log email error but don't fail the booking
      console.error('Failed to send email notification:', emailError);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error booking consultation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * FAQ API functions
 */
export const getFaqs = async (filters = {}) => {
  try {
    let query = supabase
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true });
    
    // Filter by category if provided
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Filter by country - include general FAQs for all countries
    if (filters.country && filters.country !== 'all') {
      query = query.or(`country.eq.${filters.country},country.eq.general`);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Services API functions
 */
export const getServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching services:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get a single service by its slug for client-facing page
 */
export const getServiceBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single(); // Expecting one row
    
    if (error) {
      if (error.code === 'PGRST116') { // PostgREST error for zero rows with .single()
        return { success: false, error: 'Service not found', notFound: true };
      }
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching service by slug ${slug}:`, error);
    return { success: false, error: error.message, notFound: error.message.includes('not found') };
  }
};

/**
 * Testimonials API functions
 */
export const getTestimonials = async () => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'published');
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Universities API functions
 */
export const getUniversities = async (adminView = false, filters = {}) => {
  try {
    let query = supabase
      .from('universities')
      .select('*')
      .order('ranking', { ascending: true });
    
    // Apply filters if provided
    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    
    if (filters.location) {
      query = query.eq('location', filters.location);
    }
    
    if (filters.rankingGroup) {
      // Handle ranking group filter based on the ranking field
      if (filters.rankingGroup === 'Top 10') {
        query = query.lte('ranking', 10);
      } else if (filters.rankingGroup === 'Top 20') {
        query = query.gt('ranking', 10).lte('ranking', 20);
      } else if (filters.rankingGroup === 'Top 30') {
        query = query.gt('ranking', 20).lte('ranking', 30);
      } else if (filters.rankingGroup === 'Top 100') {
        query = query.gt('ranking', 30).lte('ranking', 100);
      }
    }
    
    // Apply country filter using ilike on the location field
    if (filters.country) {
      query = query.ilike('location', `%${filters.country}%`);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching universities:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Test Preparation Courses API functions
 */
export const getTestPrepCourses = async () => {
  try {
    const { data, error } = await supabase
      .from('test_prep_courses')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching test prep courses:', error);
    return { success: false, error: error.message };
  }
};

/**
 * ===== ADMIN API FUNCTIONS =====
 */

/**
 * Services Admin API functions
 */
export const getServiceById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    return { success: false, error: error.message };
  }
};

export const createService = async (serviceData) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating service:', error);
    return { success: false, error: error.message };
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating service:', error);
    return { success: false, error: error.message };
  }
};

export const deleteService = async (id) => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Universities Admin API functions
 */
export const getUniversityById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching university by ID:', error);
    return { success: false, error: error.message };
  }
};

export const createUniversity = async (universityData) => {
  try {
    const { data, error } = await supabase
      .from('universities')
      .insert([universityData])
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating university:', error);
    return { success: false, error: error.message };
  }
};

export const updateUniversity = async (id, universityData) => {
  try {
    console.log(`Updating university with ID: ${id}`);
    console.log('University data to update:', universityData);
    
    if (!id) {
      const errorMessage = 'Missing university ID for update';
      console.error(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    // Make a copy of the data to avoid modifying the original object
    const sanitizedData = { ...universityData };
    
    // Make sure logo_url and banner_image_url are properly formatted or null
    if (sanitizedData.logo_url === '') sanitizedData.logo_url = null;
    if (sanitizedData.banner_image_url === '') sanitizedData.banner_image_url = null;
    
    // Log the final data before sending to Supabase
    console.log('Final university update data:', sanitizedData);
    
    const { data, error } = await supabase
      .from('universities')
      .update(sanitizedData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Supabase error updating university:', error);
      throw error;
    }
    
    console.log('University update successful, returned data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error updating university:', error);
    return { success: false, error: error.message };
  }
};

export const deleteUniversity = async (id) => {
  try {
    const { error } = await supabase
      .from('universities')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting university:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Testimonials Admin API functions
 */
export const getAllTestimonials = async () => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    return { success: false, error: error.message };
  }
};

export const getTestimonialById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching testimonial by ID:', error);
    return { success: false, error: error.message };
  }
};

export const createTestimonial = async (testimonialData) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{
        ...testimonialData,
        status: testimonialData.status || 'draft'
      }])
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return { success: false, error: error.message };
  }
};

export const updateTestimonial = async (id, testimonialData) => {
  try {
    console.log(`Updating testimonial with ID: ${id}`);
    console.log('Testimonial data to update:', testimonialData);
    
    if (!id) {
      const errorMessage = 'Missing testimonial ID for update';
      console.error(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    // Make a copy of the data to avoid modifying the original object
    const sanitizedData = { ...testimonialData };
    
    // Make sure photo_url is properly formatted or null
    if (sanitizedData.photo_url === '') sanitizedData.photo_url = null;
    
    // Log the final data before sending to Supabase
    console.log('Final testimonial update data:', sanitizedData);
    
    const { data, error } = await supabase
      .from('testimonials')
      .update(sanitizedData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Supabase error updating testimonial:', error);
      throw error;
    }
    
    console.log('Testimonial update successful, returned data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return { success: false, error: error.message };
  }
};

export const deleteTestimonial = async (id) => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return { success: false, error: error.message };
  }
};

/**
 * FAQ Admin API functions
 */
export const getFaqById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching FAQ by ID:', error);
    return { success: false, error: error.message };
  }
};

export const createFaq = async (faqData) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .insert([faqData])
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return { success: false, error: error.message };
  }
};

export const updateFaq = async (id, faqData) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .update(faqData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return { success: false, error: error.message };
  }
};

export const deleteFaq = async (id) => {
  try {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Test Prep Courses Admin API functions
 */
export const getTestPrepCourseById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('test_prep_courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching test prep course by ID:', error);
    return { success: false, error: error.message };
  }
};

export const createTestPrepCourse = async (courseData) => {
  try {
    const { data, error } = await supabase
      .from('test_prep_courses')
      .insert([courseData])
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating test prep course:', error);
    return { success: false, error: error.message };
  }
};

export const updateTestPrepCourse = async (id, courseData) => {
  try {
    const { data, error } = await supabase
      .from('test_prep_courses')
      .update(courseData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating test prep course:', error);
    return { success: false, error: error.message };
  }
};

export const deleteTestPrepCourse = async (id) => {
  try {
    const { error } = await supabase
      .from('test_prep_courses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting test prep course:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Consultation Form Options - Time Slots Admin API functions
 */
export const getConsultationTimeSlots = async (admin = false) => {
  try {
    let query = supabase
      .from('consultation_time_slots')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (!admin) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching consultation time slots:', error);
    return { success: false, error: error.message };
  }
};

export const getConsultationTimeSlotById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('consultation_time_slots')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching consultation time slot by ID:', error);
    return { success: false, error: error.message };
  }
};

export const createConsultationTimeSlot = async (slotData) => {
  try {
    const { data, error } = await supabase
      .from('consultation_time_slots')
      .insert([slotData])
      .select()
      .single(); // Assuming you want the created object back
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating consultation time slot:', error);
    return { success: false, error: error.message };
  }
};

export const updateConsultationTimeSlot = async (id, slotData) => {
  try {
    const { data, error } = await supabase
      .from('consultation_time_slots')
      .update(slotData)
      .eq('id', id)
      .select()
      .single(); // Assuming you want the updated object back
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating consultation time slot:', error);
    return { success: false, error: error.message };
  }
};

export const deleteConsultationTimeSlot = async (id) => {
  try {
    const { error } = await supabase
      .from('consultation_time_slots')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting consultation time slot:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Consultation Form Options - Education Levels Admin API functions
 */
export const getEducationLevelOptions = async (admin = false) => {
  try {
    let query = supabase
      .from('education_levels_options')
      .select('*')
      .order('display_order', { ascending: true });
    if (!admin) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching education level options:', error);
    return { success: false, error: error.message };
  }
};

export const getEducationLevelOptionById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('education_levels_options')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching education level option by ID:', error);
    return { success: false, error: error.message };
  }
};

export const createEducationLevelOption = async (optionData) => {
  try {
    const { data, error } = await supabase
      .from('education_levels_options')
      .insert([optionData])
      .select()
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating education level option:', error);
    return { success: false, error: error.message };
  }
};

export const updateEducationLevelOption = async (id, optionData) => {
  try {
    const { data, error } = await supabase
      .from('education_levels_options')
      .update(optionData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating education level option:', error);
    return { success: false, error: error.message };
  }
};

export const deleteEducationLevelOption = async (id) => {
  try {
    const { error } = await supabase
      .from('education_levels_options')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting education level option:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Consultation Form Options - Study Interests Admin API functions
 */
export const getStudyInterestOptions = async (admin = false) => {
  try {
    let query = supabase
      .from('study_interests_options')
      .select('*')
      .order('display_order', { ascending: true });
    if (!admin) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching study interest options:', error);
    return { success: false, error: error.message };
  }
};

export const getStudyInterestOptionById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('study_interests_options')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching study interest option by ID:', error);
    return { success: false, error: error.message };
  }
};

export const createStudyInterestOption = async (optionData) => {
  try {
    const { data, error } = await supabase
      .from('study_interests_options')
      .insert([optionData])
      .select()
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating study interest option:', error);
    return { success: false, error: error.message };
  }
};

export const updateStudyInterestOption = async (id, optionData) => {
  try {
    const { data, error } = await supabase
      .from('study_interests_options')
      .update(optionData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating study interest option:', error);
    return { success: false, error: error.message };
  }
};

export const deleteStudyInterestOption = async (id) => {
  try {
    const { error } = await supabase
      .from('study_interests_options')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting study interest option:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get a single university by its slug for client-facing page
 */
export const getUniversityBySlug = async (slug) => {
  try {
    // As university slugs might not be unique in the DB or not exist as a dedicated field,
    // and the list page generates them from the name, we first fetch all, then filter.
    // This is not ideal for performance with many universities but matches the current slug generation.
    // A dedicated, unique 'slug' field in the 'universities' table would be better.
    const { data, error: allUniError } = await supabase
      .from('universities')
      .select('*');

    if (allUniError) throw allUniError;

    const foundUniversity = data.find(uni => 
      (uni.name ? uni.name.toLowerCase().replace(/\s+/g, '-') : '-') === slug
    );

    if (!foundUniversity) {
      return { success: false, error: 'University not found', notFound: true };
    }
    return { success: true, data: foundUniversity };

  } catch (error) {
    console.error(`Error fetching university by slug ${slug}:`, error);
    return { success: false, error: error.message, notFound: error.message.includes('not found') };
  }
};

/**
 * Get a single test prep course by its slug
 */
export const getTestPrepCourseBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('test_prep_courses')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Test preparation course not found', notFound: true };
      }
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching test prep course by slug ${slug}:`, error);
    return { success: false, error: error.message, notFound: error.message.includes('not found') };
  }
};

/**
 * Site Settings API functions
 */

// Fetches the single row of site settings.
// Creates a default row if none exists.
export const getSiteSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*') // Select all columns by default
      .maybeSingle(); // Use maybeSingle as there should be 0 or 1 row

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Site Settings Admin API functions
 * Update site settings - expects a single row identified by id: 1
 */
export const updateSiteSettings = async (settingsDataFromForm) => {
  try {
    // Ensure all fields from SiteSettings type are included,
    // even if null, to correctly update the database.
    // The form might only send changed values, so we fetch current settings first.
    
    const { data: currentSettings, error: fetchError } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (fetchError) {
      console.error('Error fetching current site settings for update:', fetchError);
      // If settings don't exist, perhaps try to insert? For now, error out.
      // This usually means seed data wasn't run or was deleted.
      if (fetchError.code === 'PGRST116') { // Not found
         return { success: false, error: 'Site settings not found. Please ensure they are seeded.' };
      }
      throw fetchError;
    }

    // Create the complete object for update, merging new data with existing
    // This ensures all fields are present in the update payload
    const updatedSettingsData = {
      ...currentSettings, // Start with all existing settings
      ...settingsDataFromForm, // Override with any new values from the form
      updated_at: new Date().toISOString(), // Always update the timestamp
    };

    // Remove id from the update payload as it should not be changed
    // and it is part of the key for the update.
    const { id, ...payload } = updatedSettingsData;

    const { data, error } = await supabase
      .from('site_settings')
      .update(payload)
      .eq('id', 1) // Ensure we update the correct (and only) row
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] }; // Return the updated settings object
  } catch (error) {
    console.error('Error updating site settings:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Homepage Process Steps Admin API functions
 */
export const getHomepageProcessSteps = async () => {
  try {
    const { data, error } = await supabase
      .from('homepage_process_steps')
      .select('*')
      .order('step_number', { ascending: true });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching homepage process steps:', error);
    return { success: false, error: error.message };
  }
};

export const createHomepageProcessStep = async (stepData) => {
  try {
    const { data, error } = await supabase
      .from('homepage_process_steps')
      .insert([stepData])
      .select()
      .single(); // Expecting the created row back
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating homepage process step:', error);
    return { success: false, error: error.message };
  }
};

export const updateHomepageProcessStep = async (id, stepData) => {
  try {
    const { data, error } = await supabase
      .from('homepage_process_steps')
      .update(stepData)
      .eq('id', id)
      .select()
      .single(); // Expecting the updated row back
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating homepage process step:', error);
    return { success: false, error: error.message };
  }
};

export const deleteHomepageProcessStep = async (id) => {
  try {
    const { error } = await supabase
      .from('homepage_process_steps')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting homepage process step:', error);
    return { success: false, error: error.message };
  }
};

/**
 * ===== ADMIN API FUNCTIONS - LEADS =====
 */

/**
 * Contact Inquiries Admin API functions
 */
export const getContactInquiries = async (adminView = true) => {
  // adminView is to keep consistency with other admin functions, but for now, it always fetches all for admin.
  // RLS will ensure only admins can access if this is ever called client-side without appropriate checks.
  try {
    let query = supabase
      .from('contact_inquiries')
      .select('*');

    // Default sort by created_at descending
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    return { success: false, error: error.message };
  }
};

export const getContactInquiryById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Contact inquiry not found', notFound: true };
      }
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching contact inquiry by ID ${id}:`, error);
    return { success: false, error: error.message, notFound: error.message.includes('not found') };
  }
};

export const updateContactInquiry = async (id, updateData) => {
  try {
    // Ensure only specific fields are updatable, e.g., status and admin_notes
    // For now, allowing direct updateData but this should be reviewed for security.
    const { data, error } = await supabase
      .from('contact_inquiries')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error(`Error updating contact inquiry ${id}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Consultations Admin API functions
 */
export const getConsultations = async (adminView = true) => {
  // adminView is for consistency, RLS handles actual access control.
  try {
    let query = supabase
      .from('consultations')
      .select('*');

    // Default sort by created_at descending, can be changed based on UI needs (e.g., preferred_date)
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return { success: false, error: error.message };
  }
};

export const getConsultationById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Consultation not found', notFound: true };
      }
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching consultation by ID ${id}:`, error);
    return { success: false, error: error.message, notFound: error.message.includes('not found') };
  }
};

export const updateConsultation = async (id, updateData) => {
  try {
    // Ensure only specific fields are updatable, e.g., status and notes.
    // For now, allowing direct updateData but this should be reviewed for security.
    const { data, error } = await supabase
      .from('consultations')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error(`Error updating consultation ${id}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Study Destinations API functions
 */
export const getStudyDestinations = async (adminView = false) => {
  try {
    let query = supabase
      .from('study_destination_details')
      .select('id, country_slug, display_name, is_active, display_order, updated_at')
      .order('display_order', { ascending: true });
    
    if (!adminView) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching study destinations:', error);
    return { success: false, error: error.message };
  }
};

export const getStudyDestinationBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('study_destination_details')
      .select('*')
      .eq('country_slug', slug)
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Study destination not found', notFound: true };
      }
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching study destination by slug ${slug}:`, error);
    return { success: false, error: error.message, notFound: error.message.includes('not found') };
  }
};

export const getStudyDestinationById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('study_destination_details')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Study destination not found', notFound: true };
      }
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching study destination by ID ${id}:`, error);
    return { success: false, error: error.message };
  }
};

export const createStudyDestination = async (destinationData) => {
  try {
    // Ensure proper timestamps
    const dataWithTimestamp = {
      ...destinationData,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const { data, error } = await supabase
      .from('study_destination_details')
      .insert(dataWithTimestamp)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating study destination:', error);
    return { success: false, error: error.message };
  }
};

export const updateStudyDestination = async (id, destinationData) => {
  try {
    // Add updated timestamp
    const dataWithTimestamp = {
      ...destinationData,
      updated_at: new Date()
    };
    
    const { data, error } = await supabase
      .from('study_destination_details')
      .update(dataWithTimestamp)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating study destination:', error);
    return { success: false, error: error.message };
  }
};

export const deleteStudyDestination = async (id) => {
  try {
    const { error } = await supabase
      .from('study_destination_details')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting study destination:', error);
    return { success: false, error: error.message };
  }
}; 