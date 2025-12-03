export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
          updated_at?: string
        }
      }
      consultation_time_slots: {
        Row: {
          id: string
          time_range_display: string
          is_active: boolean | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          time_range_display: string
          is_active?: boolean | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          time_range_display?: string
          is_active?: boolean | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      consultations: {
        Row: {
          alt_date: string | null
          alt_time: string | null
          created_at: string
          education_level: string
          email: string
          id: string
          message: string | null
          name: string
          notes: string | null
          phone: string
          preferred_date: string
          preferred_time: string
          status: "scheduled" | "completed" | "cancelled" | "rescheduled"
          study_interest: string
          updated_at: string
        }
        Insert: {
          alt_date?: string | null
          alt_time?: string | null
          created_at?: string
          education_level: string
          email: string
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          phone: string
          preferred_date: string
          preferred_time: string
          status?: "scheduled" | "completed" | "cancelled" | "rescheduled"
          study_interest: string
          updated_at?: string
        }
        Update: {
          alt_date?: string | null
          alt_time?: string | null
          created_at?: string
          education_level?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string
          preferred_date?: string
          preferred_time?: string
          status?: "scheduled" | "completed" | "cancelled" | "rescheduled"
          study_interest?: string
          updated_at?: string
        }
      }
      contact_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          interest: string | null
          message: string
          name: string
          phone: string | null
          status: "new" | "read" | "replied" | "closed"
          updated_at: string
          admin_notes: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interest?: string | null
          message: string
          name: string
          phone?: string | null
          status?: "new" | "read" | "replied" | "closed"
          updated_at?: string
          admin_notes?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interest?: string | null
          message?: string
          name?: string
          phone?: string | null
          status?: "new" | "read" | "replied" | "closed"
          updated_at?: string
          admin_notes?: string | null
        }
      }
      education_levels_options: {
        Row: {
          id: string
          level_name: string
          is_active: boolean | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          level_name: string
          is_active?: boolean | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          level_name?: string
          is_active?: boolean | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          category: string | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          category?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          benefits: Json | null
          created_at: string
          display_order: number | null
          full_description: string | null
          icon_name: string | null
          id: string
          image_url: string | null
          name: string
          short_description: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          benefits?: Json | null
          created_at?: string
          display_order?: number | null
          full_description?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          name: string
          short_description?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          benefits?: Json | null
          created_at?: string
          display_order?: number | null
          full_description?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          name?: string
          short_description?: string | null
          slug?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: number
          site_name: string | null
          primary_phone: string | null
          primary_email: string | null
          primary_address_line1: string | null
          primary_address_line2: string | null
          office_hours: string | null
          facebook_url: string | null
          instagram_url: string | null
          linkedin_url: string | null
          twitter_url: string | null
          map_embed_url_main_office: string | null
          footer_about_text: string | null
          copyright_year_start: number | null
          updated_at: string
          hero_title: string | null
          hero_subtitle: string | null
          hero_cta_text: string | null
          hero_cta_link: string | null
          hero_background_image_url: string | null
          why_choose_us_title: string | null
          why_choose_us_subtitle: string | null
          proven_process_title: string | null
          about_hero_title: string | null
          about_hero_subtitle: string | null
          about_us_story_title: string | null
          about_us_story_content: string | null
          about_us_mission_title: string | null
          about_us_mission_content: string | null
          about_us_vision_title: string | null
          about_us_vision_content: string | null
          about_us_image_url: string | null
        }
        Insert: {
          id?: number
          site_name?: string | null
          primary_phone?: string | null
          primary_email?: string | null
          primary_address_line1?: string | null
          primary_address_line2?: string | null
          office_hours?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          map_embed_url_main_office?: string | null
          footer_about_text?: string | null
          copyright_year_start?: number | null
          updated_at?: string
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_cta_text?: string | null
          hero_cta_link?: string | null
          hero_background_image_url?: string | null
          why_choose_us_title?: string | null
          why_choose_us_subtitle?: string | null
          proven_process_title?: string | null
          about_hero_title?: string | null
          about_hero_subtitle?: string | null
          about_us_story_title?: string | null
          about_us_story_content?: string | null
          about_us_mission_title?: string | null
          about_us_mission_content?: string | null
          about_us_vision_title?: string | null
          about_us_vision_content?: string | null
          about_us_image_url?: string | null
        }
        Update: {
          id?: number
          site_name?: string | null
          primary_phone?: string | null
          primary_email?: string | null
          primary_address_line1?: string | null
          primary_address_line2?: string | null
          office_hours?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          map_embed_url_main_office?: string | null
          footer_about_text?: string | null
          copyright_year_start?: number | null
          updated_at?: string
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_cta_text?: string | null
          hero_cta_link?: string | null
          hero_background_image_url?: string | null
          why_choose_us_title?: string | null
          why_choose_us_subtitle?: string | null
          proven_process_title?: string | null
          about_hero_title?: string | null
          about_hero_subtitle?: string | null
          about_us_story_title?: string | null
          about_us_story_content?: string | null
          about_us_mission_title?: string | null
          about_us_mission_content?: string | null
          about_us_vision_title?: string | null
          about_us_vision_content?: string | null
          about_us_image_url?: string | null
        }
      }
      study_interests_options: {
        Row: {
          id: string
          interest_name: string
          is_active: boolean | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          interest_name: string
          is_active?: boolean | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          interest_name?: string
          is_active?: boolean | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      study_destination_details: {
        Row: {
          id: string
          country_slug: string
          display_name: string
          meta_title: string | null
          meta_description: string | null
          hero_image_url: string | null
          intro_text: string | null
          quick_facts: Json | null
          why_study_here_content: string | null
          education_system_content: string | null
          popular_courses_content: string | null
          admission_requirements_content: string | null
          cost_studying_living_content: string | null
          visa_requirements_content: string | null
          scholarships_content: string | null
          country_specific_faqs: Json | null
          additional_sections: Json | null
          sidebar_nav_links: Json | null
          is_active: boolean | null
          display_order: number | null
          seo_keywords: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          country_slug: string
          display_name: string
          meta_title?: string | null
          meta_description?: string | null
          hero_image_url?: string | null
          intro_text?: string | null
          quick_facts?: Json | null
          why_study_here_content?: string | null
          education_system_content?: string | null
          popular_courses_content?: string | null
          admission_requirements_content?: string | null
          cost_studying_living_content?: string | null
          visa_requirements_content?: string | null
          scholarships_content?: string | null
          country_specific_faqs?: Json | null
          additional_sections?: Json | null
          sidebar_nav_links?: Json | null
          is_active?: boolean | null
          display_order?: number | null
          seo_keywords?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          country_slug?: string
          display_name?: string
          meta_title?: string | null
          meta_description?: string | null
          hero_image_url?: string | null
          intro_text?: string | null
          quick_facts?: Json | null
          why_study_here_content?: string | null
          education_system_content?: string | null
          popular_courses_content?: string | null
          admission_requirements_content?: string | null
          cost_studying_living_content?: string | null
          visa_requirements_content?: string | null
          scholarships_content?: string | null
          country_specific_faqs?: Json | null
          additional_sections?: Json | null
          sidebar_nav_links?: Json | null
          is_active?: boolean | null
          display_order?: number | null
          seo_keywords?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      test_prep_courses: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          duration: string | null
          features: Json | null
          id: string
          price: string | null
          schedule_options: Json | null
          slug: string
          test_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration?: string | null
          features?: Json | null
          id?: string
          price?: string | null
          schedule_options?: Json | null
          slug: string
          test_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration?: string | null
          features?: Json | null
          id?: string
          price?: string | null
          schedule_options?: Json | null
          slug?: string
          test_name?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          name: string
          quote: string
          photo_url: string | null
          university: string | null
          program: string | null
          category: string | null
          status: "draft" | "published" | "archived"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          quote: string
          photo_url?: string | null
          university?: string | null
          program?: string | null
          category?: string | null
          status?: "draft" | "published" | "archived"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          quote?: string
          photo_url?: string | null
          university?: string | null
          program?: string | null
          category?: string | null
          status?: "draft" | "published" | "archived"
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      universities: {
        Row: {
          accommodation_info: string | null
          banner_image_url: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          logo_url: string | null
          name: string
          popular_courses: Json | null
          ranking: number | null
          slug: string
          tuition_fees_range: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          accommodation_info?: string | null
          banner_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          name: string
          popular_courses?: Json | null
          ranking?: number | null
          slug: string
          tuition_fees_range?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          accommodation_info?: string | null
          banner_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          name?: string
          popular_courses?: Json | null
          ranking?: number | null
          slug: string
          tuition_fees_range?: string | null
          updated_at?: string
          website_url?: string | null
        }
      }
      homepage_process_steps: {
        Row: {
          id: string
          step_number: number
          title: string
          description: string
          icon_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          step_number: number
          title: string
          description: string
          icon_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          step_number?: number
          title?: string
          description?: string
          icon_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
  }
}

// Convenience types for specific tables
export type FAQ = Database['public']['Tables']['faqs']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type University = Database['public']['Tables']['universities']['Row'];
export type TestPrepCourse = Database['public']['Tables']['test_prep_courses']['Row'];
export type ContactInquiry = Database['public']['Tables']['contact_inquiries']['Row'];
export type Consultation = Database['public']['Tables']['consultations']['Row'];
export type AdminUser = Database['public']['Tables']['admin_users']['Row'];
export type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
export type ConsultationTimeSlot = Database['public']['Tables']['consultation_time_slots']['Row'];
export type EducationLevelOption = Database['public']['Tables']['education_levels_options']['Row'];
export type StudyInterestOption = Database['public']['Tables']['study_interests_options']['Row'];
export type StudyDestinationDetails = Database['public']['Tables']['study_destination_details']['Row'];
export type HomepageProcessStep = Database['public']['Tables']['homepage_process_steps']['Row']; 