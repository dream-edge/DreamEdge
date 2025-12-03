import supabase from './supabase-admin';

// Helper function to insert data and log results
const insertData = async (tableName, data, onConflictColumn = null) => {
  console.log(`${onConflictColumn ? 'Upserting' : 'Inserting'} data into ${tableName}...`);
  
  let query = supabase.from(tableName);

  if (onConflictColumn) {
    query = query.upsert(data, { onConflict: onConflictColumn });
  } else {
    query = query.insert(data);
  }
  
  const { data: result, error } = await query.select();
  
  if (error) {
    console.error(`Error ${onConflictColumn ? 'upserting' : 'inserting'} into ${tableName}:`, error);
    return false;
  }
  
  console.log(`Successfully ${onConflictColumn ? 'upserted' : 'inserted'} ${result?.length || 0} rows into ${tableName}`);
  return true;
};

// Seed FAQs
const seedFaqs = async () => {
  const faqs = [
    {
      question: "What qualifications do I need to study abroad?",
      answer: "Requirements vary significantly by country, university, and program. Generally, you'll need relevant academic qualifications (e.g., high school diploma, bachelor's degree with good grades), English language proficiency (e.g., IELTS, TOEFL for English-speaking countries), and sometimes program-specific entrance exams or portfolios.",
      category: "application",
      display_order: 1
    },
    {
      question: "How much does it cost to study internationally?",
      answer: "Costs vary widely. Tuition fees can range from being free or very low in some European countries to tens of thousands of dollars per year in countries like the USA or Australia. Living expenses also differ greatly by city and country. Research specific destinations for accurate estimates.",
      category: "general",
      display_order: 2
    },
    {
      question: "Can I work while studying abroad?",
      answer: "Work rights for international students depend on the country's visa regulations. Many countries (e.g., Canada, Australia, UK, Germany) allow part-time work during studies (often up to 20 hours/week) and full-time during breaks. Always check the specific visa conditions for your destination.",
      category: "visa",
      display_order: 3
    },
    {
      question: "How does Dream Consultancy help with the visa application process?",
      answer: "We provide comprehensive visa assistance including document preparation, application review, mock interview preparation, and guidance throughout the entire process for various countries. Our experienced team aims to maximize your chances of success.",
      category: "visa",
      display_order: 4
    },
    {
      question: "What scholarship opportunities are available for international students?",
      answer: "Numerous scholarships are available globally, including government-funded scholarships (e.g., Fulbright, Chevening, DAAD), university-specific scholarships, and private organization awards. Many universities offer merit-based scholarships that can cover a portion of tuition fees.",
      category: "application",
      display_order: 5
    },
    {
      question: "When should I start my application process for international universities?",
      answer: "We recommend starting at least 12-18 months before your intended start date, as application timelines vary greatly. For example, US university applications can be due much earlier than those for some European countries. Research deadlines for your target countries and universities.",
      category: "application",
      display_order: 6
    },
    {
      question: "What accommodation options are available for students abroad?",
      answer: "Common options include university halls of residence (dormitories), private student accommodation (often purpose-built), private rentals (apartments/houses), and homestays. Availability and cost vary by location and institution.",
      category: "accommodation",
      display_order: 7
    },
    {
      question: "What support services do you provide after I receive my visa?",
      answer: "Our support continues beyond visa approval. We provide comprehensive pre-departure briefings covering aspects of your destination country like culture, weather, education system, banking, transportation, and essential items to pack. We also offer guidance on accommodation and airport pickup coordination where possible.",
      category: "general",
      display_order: 8
    },
    {
      question: "Which English proficiency tests are generally accepted by international universities?",
      answer: "Most English-speaking universities accept IELTS Academic, TOEFL iBT, and Pearson PTE Academic. Some may also accept Cambridge English qualifications or Duolingo. Always check the specific requirements of your chosen university and course, and country visa requirements.",
      category: "test_preparation",
      display_order: 9
    },
    {
      question: "What is a good IELTS score for international universities?",
      answer: "This varies. Generally, a minimum overall IELTS Academic score of 6.0 to 6.5 is required for undergraduate courses, and 6.5 to 7.0 for postgraduate courses in English-speaking countries. Highly competitive universities/courses may require higher scores.",
      category: "test_preparation",
      display_order: 10
    },
    {
      question: "How long is an IELTS/TOEFL score valid?",
      answer: "Both IELTS and TOEFL scores are generally valid for two years from the test date. Ensure your scores are valid when you apply to universities and for your visa.",
      category: "test_preparation",
      display_order: 11
    }
  ];
  
  return await insertData('faqs', faqs, 'question');
};

// Seed Services
const seedServices = async () => {
  const services = [
    {
      name: "University Application Assistance",
      slug: "university-application",
      short_description: "Expert guidance for international university applications",
      full_description: "Our comprehensive university application service helps students identify suitable universities and programs globally, prepare compelling personal statements, submit applications, and secure admission offers. We manage the entire process from start to finish for various destinations.",
      icon_name: "academic-cap",
      benefits: JSON.stringify([
        "Personalized university selection based on academic profile & destination preferences",
        "Professional review of personal statements & essays",
        "Application tracking and follow-up for multiple countries",
        "Interview preparation for competitive programs worldwide",
        "Guidance on offer acceptance strategies"
      ]),
      display_order: 1
    },
    {
      name: "Student Visa Consultancy",
      slug: "visa-consultancy",
      short_description: "Expert student visa assistance for USA, UK, Canada, Australia, Europe, New Zealand & Japan",
      full_description: "Our visa consultancy service provides comprehensive support throughout the student visa application process for Europe, Australia, New Zealand, USA, Canada, UK, and Japan. We understand the unique requirements of each country's visa process and help prepare complete documentation, review applications thoroughly, and coach students for visa interviews to maximize approval chances. From F-1 visas for USA to Tier 4 for UK, student permits for Canada, and visa types for all our destination countries.",
      icon_name: "document-text",
      benefits: JSON.stringify([
        "Country-specific document preparation for USA, UK, Canada, Australia, Europe, New Zealand & Japan",
        "Application review by experienced consultants specializing in multiple countries",
        "Mock visa interview sessions tailored to each destination country's requirements",
        "Financial documentation assistance meeting different country standards",
        "Guidance on proof of accommodation, travel insurance, and country-specific requirements"
      ]),
      display_order: 2
    },
    {
      name: "Scholarship Guidance",
      slug: "scholarship-guidance",
      short_description: "Securing scholarships & financial aid for studying in USA, UK, Canada, Australia, Europe, New Zealand & Japan",
      full_description: "Our scholarship guidance service helps students identify and apply for financial aid opportunities at universities across Europe, Australia, New Zealand, USA, Canada, UK, and Japan. We provide personalized guidance on eligibility criteria for country-specific scholarships, government-funded programs (like Fulbright, Chevening, DAAD, MEXT), university scholarships, and application procedures for various international funding opportunities.",
      icon_name: "currency-dollar",
      benefits: JSON.stringify([
        "Access to scholarships database for USA, UK, Canada, Australia, Europe, New Zealand & Japan",
        "Eligibility assessment for country-specific and international scholarships",
        "Application preparation for Fulbright, Chevening, DAAD, MEXT, and university scholarships",
        "Essay review and improvement for competitive scholarship applications",
        "Interview coaching for scholarship selection panels across different countries"
      ]),
      display_order: 3
    },
    {
      name: "Test Preparation",
      slug: "test-preparation",
      short_description: "Expert IELTS, TOEFL, PTE, GRE, GMAT coaching for studying abroad",
      full_description: "Our test preparation programs help students achieve target scores on English proficiency exams (IELTS, TOEFL, PTE) and standardized tests (GRE, GMAT, SAT) required for university admissions in USA, UK, Canada, Australia, Europe, New Zealand, and Japan. We offer expert coaching, personalized study plans, practice materials, and mock tests to ensure you meet admission requirements for your chosen destination.",
      icon_name: "pencil",
      benefits: JSON.stringify([
        "Expert instructors with proven track records in IELTS, TOEFL, PTE, GRE, GMAT",
        "Personalized study plans meeting requirements for different countries",
        "Regular practice tests and evaluations for all major exam formats",
        "Score improvement strategies for each test section",
        "Extensive study materials covering requirements for USA, UK, Canada, Australia, Europe, New Zealand & Japan"
      ]),
      display_order: 4
    },
    {
      name: "Pre-Departure Briefing",
      slug: "pre-departure-briefing",
      short_description: "Comprehensive preparation for life in USA, UK, Canada, Australia, Europe, New Zealand & Japan",
      full_description: "Our pre-departure briefing prepares students for life in their chosen study destination across Europe, Australia, New Zealand, USA, Canada, UK, or Japan. We cover important aspects including local culture, weather conditions, education system expectations, accommodation options, banking procedures, transportation systems, healthcare access, and safety guidelines specific to each country.",
      icon_name: "airplane",
      benefits: JSON.stringify([
        "Country-specific cultural adaptation guidance for your destination",
        "Practical packing advice tailored to your study country's climate and culture",
        "Banking, SIM cards, and transportation setup information for USA, UK, Canada, Australia, Europe, New Zealand & Japan",
        "Healthcare system orientation and insurance guidance for your study country",
        "Emergency contacts, safety tips, and local laws awareness for each destination"
      ]),
      display_order: 5
    }
  ];
  
  return await insertData('services', services, 'slug');
};

// Seed Testimonials
const seedTestimonials = async () => {
  const testimonials = [
    {
      name: "Anisha Sharma",
      photo_url: "https://randomuser.me/api/portraits/women/32.jpg",
      quote: "Dream Edge guided me through every step of my university application process. From selecting the right university to preparing documents and visa application, their support was exceptional. I'm now studying at the University of Manchester, UK!",
      program: "MSc International Business",
      university: "University of Manchester, UK",
      category: "University Application",
      status: "published"
    },
    {
      name: "Rajesh Poudel",
      photo_url: "https://randomuser.me/api/portraits/men/45.jpg",
      quote: "The IELTS preparation course was excellent. The instructors were knowledgeable and helped me achieve a band score of 7.5, which was more than I needed for my course requirements.",
      program: "BEng Civil Engineering",
      university: "University of Leeds",
      category: "Test Preparation",
      status: "published"
    },
    {
      name: "Smriti Thapa",
      photo_url: "https://randomuser.me/api/portraits/women/66.jpg",
      quote: "The student visa guidance from Dream Edge was invaluable. They helped me prepare all documents perfectly and my UK student visa was approved without any issues. Now I'm enjoying my studies at King's College London!",
      program: "BA Media and Communications",
      university: "King's College London, UK",
      category: "Visa Guidance",
      status: "published"
    },
    {
      name: "Nishant KC",
      photo_url: "https://randomuser.me/api/portraits/men/22.jpg",
      quote: "Dream Edge helped me secure a 50% scholarship at Cardiff University. Their team identified the right funding opportunities and guided me through the entire scholarship application process. I'm grateful for their expert support!",
      program: "MSc Computer Science",
      university: "Cardiff University, UK",
      category: "Scholarship Guidance",
      status: "published"
    },
    {
      name: "Priya Gurung",
      photo_url: "https://randomuser.me/api/portraits/women/28.jpg",
      quote: "Dream Edge made my dream of studying in Australia come true! They helped me choose the right university, prepare my application, and navigate the student visa process. I'm now studying at the University of Melbourne.",
      program: "Bachelor of Commerce",
      university: "University of Melbourne, Australia",
      category: "University Application",
      status: "published"
    },
    {
      name: "Suraj Thapa",
      photo_url: "https://randomuser.me/api/portraits/men/67.jpg",
      quote: "Thanks to Dream Edge, I'm now studying in Canada! Their guidance on the study permit application was thorough and their support throughout the process gave me confidence. Highly recommend for anyone planning to study abroad.",
      program: "Diploma in Business Administration",
      university: "Seneca College, Canada",
      category: "Visa Guidance",
      status: "published"
    },
    {
      name: "Kritika Adhikari",
      photo_url: "https://randomuser.me/api/portraits/women/54.jpg",
      quote: "Dream Edge guided me through my application to universities in the USA. Their expertise in the US admission process and SAT preparation helped me get accepted to my dream university with a scholarship!",
      program: "BS Computer Science",
      university: "University of California, USA",
      category: "University Application",
      status: "published"
    }
  ];
  
  return await insertData('testimonials', testimonials);
};

// Seed Homepage Process Steps (these are general)
const seedHomepageProcessSteps = async () => {
  const steps = [
    {
      step_number: 1,
      title: "Initial Consultation & Profile Assessment",
      description: "We start with a detailed discussion to understand your academic background, career aspirations, financial standing, and preferred study destinations among USA, UK, Canada, Australia, Europe, New Zealand, or Japan. This helps us create a tailored study abroad plan for you.",
      icon_name: "users"
    },
    {
      step_number: 2,
      title: "University & Course Selection",
      description: "Based on your profile, we shortlist suitable universities and courses across USA, UK, Canada, Australia, Europe, New Zealand, and Japan that match your goals. We guide you through prospectuses, entry requirements, and campus life for each destination.",
      icon_name: "search"
    },
    {
      step_number: 3,
      title: "Application Submission & Offer Acceptance",
      description: "We assist in meticulously preparing and submitting applications to universities worldwide, ensuring all documents meet country-specific requirements. Once offers are received from universities in your chosen destination, we help you make the best decision.",
      icon_name: "file-check"
    },
    {
      step_number: 4,
      title: "Visa Guidance & Pre-Departure Support",
      description: "Our experts provide comprehensive student visa support for USA, UK, Canada, Australia, Europe, New Zealand, or Japan, including country-specific documentation and interview preparation. We also offer pre-departure briefings covering accommodation, banking, and cultural adaptation for your destination.",
      icon_name: "briefcase"
    }
  ];
  return await insertData('homepage_process_steps', steps, 'step_number');
};

// Seed Test Prep Courses (these are general)
const seedTestPrepCourses = async () => {
  const courses = [
    {
      test_name: "IELTS Academic",
      slug: "ielts-academic",
      description: "Comprehensive preparation for the IELTS Academic test, covering all four sections: Listening, Reading, Writing, and Speaking. Widely accepted for study, work, and migration.",
      duration: "8 weeks",
      schedule_options: JSON.stringify([
        "Weekday Evenings (6PM-8PM)",
        "Weekend Mornings (9AM-1PM)",
        "Intensive (Monday-Friday, 2PM-5PM)"
      ]),
      price: "NPR 15,000",
      features: JSON.stringify([
        "Expert instructors with 7+ years of experience",
        "Small batch sizes (max 12 students)",
        "5 full-length mock tests",
        "Personalized feedback on speaking and writing",
        "Access to online practice materials",
        "Free additional support for up to 3 months"
      ]),
      display_order: 1
    },
    {
      test_name: "TOEFL iBT",
      slug: "toefl-ibt",
      description: "Structured preparation for the TOEFL iBT test, focusing on academic English skills required for university admission, particularly in North America.",
      duration: "6 weeks",
      schedule_options: JSON.stringify([
        "Weekday Evenings (6PM-8PM)",
        "Weekend Afternoons (2PM-6PM)"
      ]),
      price: "NPR 16,500",
      features: JSON.stringify([
        "Specialized instructors for each test section",
        "Computer-based practice tests",
        "Emphasis on academic speaking and integrated tasks",
        "Extensive vocabulary building",
        "Note-taking strategies for lectures",
        "Score improvement guarantee"
      ]),
      display_order: 2
    },
    {
      test_name: "PTE Academic",
      slug: "pte-academic",
      description: "Targeted preparation for the Pearson Test of English Academic, focusing on the computer-based format and quick scoring system. Accepted by many universities globally.",
      duration: "5 weeks",
      schedule_options: JSON.stringify([
        "Weekday Mornings (10AM-12PM)",
        "Weekend Full Days (10AM-4PM)"
      ]),
      price: "NPR 17,000",
      features: JSON.stringify([
        "Familiarization with computer-based testing format",
        "AI-scored practice tests with detailed analytics",
        "Focus on time management strategies",
        "Pronunciation and fluency enhancement",
        "Weekly progress assessments",
        "Extended access to online resources"
      ]),
      display_order: 3
    },
    {
      test_name: "English for Academic Purposes",
      slug: "english-academic-purposes",
      description: "Foundation course for students who need to build their English language skills before taking standardized tests or beginning university studies abroad.",
      duration: "12 weeks",
      schedule_options: JSON.stringify([
        "Flexible scheduling (10 hours per week)",
        "Customized one-on-one sessions"
      ]),
      price: "NPR 22,000",
      features: JSON.stringify([
        "Personalized learning plan",
        "Academic vocabulary development",
        "Essay writing and critical thinking for international standards",
        "Academic reading comprehension skills",
        "Presentation and discussion skills for diverse classrooms",
        "Research and citation methods commonly used internationally"
      ]),
      display_order: 4
    }
  ];
  
  return await insertData('test_prep_courses', courses, 'slug');
};

// Seed Universities
const seedUniversities = async () => {
  const universities = [
    {
      name: "University of Oxford",
      slug: "university-of-oxford",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/1200px-Oxford-University-Circlet.svg.png",
      banner_image_url: "https://www.ox.ac.uk/sites/files/oxford/styles/ow_large_feature/s3/field/field_image_main/quad.jpg",
      description: "The University of Oxford is the oldest university in the English-speaking world and is regarded as one of the world's most prestigious institutions for education and research.",
      ranking: 1,
      location: "Oxford, United Kingdom",
      country_iso_code: "GB",
      website_url: "https://www.ox.ac.uk/",
      tuition_fees_range: "£28,950 - £44,240 per year (international)",
      popular_courses: JSON.stringify([
        "Law",
        "Medicine",
        "PPE (Philosophy, Politics and Economics)",
        "Computer Science",
        "Business and Management"
      ]),
      accommodation_info: "Most Oxford students live in college accommodation for the first year. Costs range from £4,000 to £7,500 for a 9-month period."
    },
    {
      name: "University of Cambridge",
      slug: "university-of-cambridge",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/University_of_Cambridge_coat_of_arms_official.svg/1200px-University_of_Cambridge_coat_of_arms_official.svg.png",
      banner_image_url: "https://www.cam.ac.uk/sites/www.cam.ac.uk/files/page/king%27s%20college%20from%20king%27s%20parade.jpg",
      description: "The University of Cambridge is one of the world's oldest universities and leading academic centers, renowned for its research and teaching excellence across a wide range of disciplines.",
      ranking: 2,
      location: "Cambridge, United Kingdom",
      country_iso_code: "GB",
      website_url: "https://www.cam.ac.uk/",
      tuition_fees_range: "£25,734 - £67,194 per year (international)",
      popular_courses: JSON.stringify([
        "Mathematics",
        "Natural Sciences",
        "Engineering",
        "Law",
        "Medicine"
      ]),
      accommodation_info: "Cambridge guarantees most undergraduate students college-owned accommodation for at least three years. Costs typically range from £4,200 to £7,000 per year depending on the college and type of room."
    },
    {
      name: "Imperial College London",
      slug: "imperial-college-london",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Imperial_College_London_crest.svg/1200px-Imperial_College_London_crest.svg.png",
      banner_image_url: "https://www.imperial.ac.uk/media/migration/news-images-db/171953418_copy.jpg",
      description: "Imperial College London is a global top ten university with a reputation for excellence in science, engineering, medicine and business.",
      ranking: 8,
      location: "London, United Kingdom",
      country_iso_code: "GB",
      website_url: "https://www.imperial.ac.uk/",
      tuition_fees_range: "£35,100 - £37,900 per year (international for most programs)",
      popular_courses: JSON.stringify([
        "Engineering (Mechanical, Civil, Electrical)",
        "Medicine",
        "Computing & AI",
        "Life Sciences",
        "Mathematics & Finance"
      ]),
      accommodation_info: "Imperial guarantees accommodation for all first-year undergraduate students. Costs range from £7,000 to £11,000 per academic year."
    },
    {
      name: "University College London",
      slug: "university-college-london",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/UCL_logo.svg/2560px-UCL_logo.svg.png",
      banner_image_url: "https://www.ucl.ac.uk/news/sites/news/files/styles/medium_image/public/ucl-quad.jpg",
      description: "University College London (UCL) is a global leader in research and teaching, consistently ranked among the top universities worldwide. UCL is known for its academic excellence and global impact across a wide range of disciplines.",
      ranking: 9,
      location: "London, United Kingdom",
      country_iso_code: "GB",
      website_url: "https://www.ucl.ac.uk/",
      tuition_fees_range: "£26,200 - £35,100 per year (international for most programs)",
      popular_courses: JSON.stringify([
        "Architecture",
        "Economics",
        "Law",
        "Psychology",
        "Computer Science & AI"
      ]),
      accommodation_info: "UCL guarantees accommodation for first-year undergraduates. Costs range from £6,500 to £11,000 for the academic year."
    },
    // USA Universities (New)
    {
      name: "Massachusetts Institute of Technology (MIT)",
      slug: "mit",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png",
      banner_image_url: "https://news.mit.edu/sites/default/files/images/202310/MIT-Great-Dome-Night-01-PRESS.jpg",
      description: "MIT is a world-renowned private research university in Cambridge, Massachusetts, known for its strong emphasis on scientific and technological education and research.",
      ranking: 1, // Example: QS World University Rankings 2024
      location: "Cambridge, MA, USA",
      country_iso_code: "US",
      website_url: "https://web.mit.edu/",
      tuition_fees_range: "Approx. $60,000 per year (international)",
      popular_courses: JSON.stringify([
        "Computer Science & AI",
        "Engineering (Various Fields)",
        "Physical Sciences",
        "Economics",
        "Architecture"
      ]),
      accommodation_info: "On-campus housing is available for undergraduates. Costs vary, typically $12,000-$18,000 per academic year including meal plans."
    },
    {
      name: "Stanford University",
      slug: "stanford-university",
      logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Stanford_University_seal_2003.svg/1200px-Stanford_University_seal_2003.svg.png",
      banner_image_url: "https://news.stanford.edu/wp-content/uploads/2022/08/20220803_StanfordCampus-14-scaled.jpg",
      description: "Stanford University, located in Stanford, California, is one of the world's leading teaching and research institutions, known for its entrepreneurial spirit and close ties to Silicon Valley.",
      ranking: 5, // Example: QS World University Rankings 2024
      location: "Stanford, CA, USA",
      country_iso_code: "US",
      website_url: "https://www.stanford.edu/",
      tuition_fees_range: "Approx. $62,000 per year (international)",
      popular_courses: JSON.stringify([
        "Computer Science",
        "Engineering",
        "Business (MBA)",
        "Humanities & Sciences",
        "Law"
      ]),
      accommodation_info: "Stanford guarantees on-campus housing for undergraduates. Room and board costs are approximately $18,000-$20,000 per academic year."
    },
    // Canadian University (New)
    {
      name: "University of Toronto",
      slug: "university-of-toronto",
      logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/0/02/University_of_Toronto_coa.svg/1200px-University_of_Toronto_coa.svg.png",
      banner_image_url: "https://www.utoronto.ca/sites/default/files/U-of-T-St-George-Fall-Credit-David-Lee.jpg",
      description: "The University of Toronto is a public research university in Toronto, Ontario, Canada. It is Canada's largest university and a global leader in research and teaching.",
      ranking: 21, // Example: QS World University Rankings 2024
      location: "Toronto, ON, Canada",
      country_iso_code: "CA",
      website_url: "https://www.utoronto.ca/",
      tuition_fees_range: "CAD $45,000 - CAD $70,000 per year (international)",
      popular_courses: JSON.stringify([
        "Computer Science & AI",
        "Engineering",
        "Life Sciences & Medicine",
        "Commerce & Management",
        "Humanities"
      ]),
      accommodation_info: "Various on-campus residence options are available across its three campuses. Costs range from CAD $10,000 to CAD $18,000 for an academic year, including meal plans."
    },
    // Australian University (New)
    {
      name: "The University of Melbourne",
      slug: "university-of-melbourne",
      logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/University_of_Melbourne_logo.svg/1200px-University_of_Melbourne_logo.svg.png",
      banner_image_url: "https://www.unimelb.edu.au/__data/assets/image/0005/100715/Old-Quad-Courtyard-1440x500.jpg",
      description: "The University of Melbourne is an Australian public research university located in Melbourne, Victoria. It is Australia's second oldest university and consistently ranks among the leading universities in Australia and the world.",
      ranking: 14, // Example: QS World University Rankings 2024
      location: "Melbourne, VIC, Australia",
      country_iso_code: "AU",
      website_url: "https://www.unimelb.edu.au/",
      tuition_fees_range: "AUD $40,000 - AUD $55,000 per year (international)",
      popular_courses: JSON.stringify([
        "Medicine, Dentistry & Health Sciences",
        "Business & Economics",
        "Engineering & IT",
        "Arts & Humanities",
        "Law"
      ]),
      accommodation_info: "Offers a range of accommodation options including residential colleges and university apartments. Costs vary, typically AUD $15,000 - AUD $25,000 per year."
    }
  ];
  
  return await insertData('universities', universities, 'slug');
};

// Seed Site Settings
const seedSiteSettings = async () => {
  const settings = {
    id: 1,
    site_name: "Dream Edge",
    primary_phone: "+977-1-4412345",
    primary_email: "info@dreamedge.com.np",
    primary_address_line1: "Putalisadak, Kathmandu",
    primary_address_line2: "Nepal",
    office_hours: "Sun - Fri, 10:00 AM - 6:00 PM",
    logo_url: "/logos/logo.png",
    facebook_url: "https://facebook.com/dreamedgenepal",
    instagram_url: "https://instagram.com/dreamedgenepal",
    linkedin_url: "https://linkedin.com/company/dreamedgenepal",
    twitter_url: "https://twitter.com/dreamedge",
    map_embed_url_main_office: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.47375792869!2d85.3169518150678!3d27.702700982793273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18e94f717a31%3A0x7a7b8c9f0cf31c8!2sPutalisadak%2C%20Kathmandu%2044600%2C%20Nepal!5e0!3m2!1sen!2snp!4v1627898123456",
    footer_about_text: "Dream Edge is Nepal's trusted overseas education consultancy, helping students study abroad in Europe, Australia, New Zealand, USA, Canada, UK & Japan. Expert guidance for university admissions, student visa assistance, and test preparation.",
    copyright_year_start: 2015,
    hero_title: "Study Abroad from Nepal with Dream Edge",
    hero_subtitle: "Your trusted overseas education consultancy for Europe, Australia, New Zealand, USA, Canada, UK & Japan. Expert study abroad guidance, university admissions, and student visa assistance.",
    hero_cta_text: "Book a Free Consultation",
    hero_cta_link: "/book-consultation",
    hero_background_image_url: "/images/hero-banner-students-global.jpg",
    why_choose_us_title: "Why Choose Dream Edge?",
    why_choose_us_subtitle: "Nepal's leading education consultancy for overseas studies with proven expertise in student visa assistance and university placements worldwide.",
    proven_process_title: "Our Proven Process to Study Abroad Success",
    about_hero_title: "About Dream Edge - Nepal's Leading Education Consultancy",
    about_hero_subtitle: "Empowering Nepali students to achieve their dream of studying abroad in top universities worldwide.",
    about_us_story_title: "Our Story",
    about_us_story_content: "Dream Edge was founded with a clear mission: to make quality international education accessible to deserving Nepali students. What started as a small consultancy in Kathmandu has grown into Nepal's most trusted overseas education partner, helping thousands of students successfully navigate their journey to study in Europe, Australia, New Zealand, USA, Canada, UK, and Japan. Our experienced team of education consultants brings deep knowledge of international admission processes, visa requirements, and scholarship opportunities. We pride ourselves on providing honest, personalized guidance that puts student success first. Every success story of our students studying at prestigious universities worldwide motivates us to continue our mission of transforming dreams into reality.",
    about_us_mission_title: "Our Mission",
    about_us_mission_content: "To empower Nepali students with comprehensive guidance, resources, and support to access quality international education in Europe, Australia, New Zealand, USA, Canada, UK & Japan, enabling them to build successful global careers.",
    about_us_vision_title: "Our Vision",
    about_us_vision_content: "To be recognized as the most trusted name in international education consultancy in Nepal, known for our ethical practices, student-centered approach, and the exceptional success of our alumni who contribute positively to society as global citizens.",
    about_us_image_url: "/about/office-placeholder.jpg"
  };

  return await insertData('site_settings', settings, 'id');
};

// Seed Consultation Time Slots (general)
const seedConsultationTimeSlots = async () => {
  const timeSlots = [
    { time_range_display: "09:00 AM - 10:00 AM", is_active: true, display_order: 1 },
    { time_range_display: "10:00 AM - 11:00 AM", is_active: true, display_order: 2 },
    { time_range_display: "11:00 AM - 12:00 PM", is_active: true, display_order: 3 },
    { time_range_display: "02:00 PM - 03:00 PM", is_active: true, display_order: 4 },
    { time_range_display: "03:00 PM - 04:00 PM", is_active: true, display_order: 5 },
  ];
  return await insertData('consultation_time_slots', timeSlots, 'time_range_display');
};

// Seed Education Level Options (general)
const seedEducationLevelOptions = async () => {
  const educationLevels = [
    { level_name: "SEE/O-Levels/High School Diploma", is_active: true, display_order: 1 },
    { level_name: "Plus 2/A-Levels/Associate Degree", is_active: true, display_order: 2 },
    { level_name: "Bachelor's Degree", is_active: true, display_order: 3 },
    { level_name: "Master's Degree", is_active: true, display_order: 4 },
    { level_name: "Doctoral Degree (PhD)", is_active: true, display_order: 5 },
    { level_name: "Other", is_active: false, display_order: 6 },
  ];
  return await insertData('education_levels_options', educationLevels, 'level_name');
};

// Seed Study Interest Options (general)
const seedStudyInterestOptions = async () => {
  const studyInterests = [
    { interest_name: "Business & Management", is_active: true, display_order: 1 },
    { interest_name: "Engineering & Technology", is_active: true, display_order: 2 },
    { interest_name: "Health & Medicine", is_active: true, display_order: 3 },
    { interest_name: "Arts & Humanities", is_active: true, display_order: 4 },
    { interest_name: "Computer Science & IT", is_active: true, display_order: 5 },
    { interest_name: "Social Sciences & Law", is_active: true, display_order: 6 },
    { interest_name: "Pure & Applied Sciences", is_active: true, display_order: 7 },
    { interest_name: "Architecture & Design", is_active: true, display_order: 8 },
    { interest_name: "Hospitality & Tourism", is_active: true, display_order: 9 },
    { interest_name: "Other", is_active: false, display_order: 10 },
  ];
  return await insertData('study_interest_options', studyInterests, 'interest_name');
};

// Seed Study Destinations - Dream Edge's target countries
const seedStudyDestinations = async () => {
  const destinations = [
    {
      country_slug: "uk",
      display_name: "United Kingdom",
      is_active: true,
      display_order: 1,
      hero_title: "Study in UK - World-Class Education from Nepal",
      hero_subtitle: "Explore prestigious UK universities and experience rich cultural heritage while studying abroad from Nepal.",
      overview_content: "The United Kingdom is home to some of the world's oldest and most prestigious universities. With a strong academic tradition, diverse programs, and excellent research opportunities, the UK attracts students from Nepal and around the globe. Cities like London, Edinburgh, Manchester, and Oxford offer vibrant student life alongside world-class education.",
      why_study_here: JSON.stringify([
        "World-renowned universities with global recognition",
        "Shorter degree programs (1-year Master's programs)",
        "Post-study work visa opportunities (2-3 years)",
        "Rich cultural heritage and multicultural environment",
        "English-speaking country with quality education system",
        "Strong alumni networks and career prospects"
      ]),
      popular_courses: JSON.stringify([
        "Business & Management",
        "Engineering & Technology",
        "Medicine & Healthcare",
        "Law & Social Sciences",
        "Computer Science & IT",
        "Arts & Humanities"
      ]),
      admission_requirements: "Typically requires completion of A-levels or equivalent, IELTS 6.0-7.0 for undergraduate, and a bachelor's degree with 60%+ for postgraduate programs.",
      visa_requirements: "Student visa (Tier 4) requires university admission offer, proof of funds (tuition + living costs for one year), tuberculosis test, and valid passport.",
      estimated_costs: "Tuition: £10,000-£38,000/year; Living expenses: £12,000-£15,000/year in London, £9,000-£12,000 elsewhere.",
      work_opportunities: "Students can work up to 20 hours/week during term and full-time during holidays. Post-study work visa allows 2 years (3 years for PhD) to work in the UK."
    },
    {
      country_slug: "usa",
      display_name: "United States of America",
      is_active: true,
      display_order: 2,
      hero_title: "Study in USA - American Dream Education from Nepal",
      hero_subtitle: "Access world-leading universities and cutting-edge research opportunities in the land of innovation.",
      overview_content: "The United States offers unparalleled opportunities for higher education with its flexible curriculum, diverse campus culture, and emphasis on research and innovation. With thousands of universities and programs, students from Nepal can find the perfect fit for their academic and career goals. The USA is known for its technology hubs, business schools, and vibrant campus life.",
      why_study_here: JSON.stringify([
        "Home to many of the world's top-ranked universities",
        "Flexible education system with diverse course options",
        "Strong emphasis on research and practical learning",
        "Optional Practical Training (OPT) work opportunities",
        "Diverse cultural experience and networking opportunities",
        "State-of-the-art facilities and resources"
      ]),
      popular_courses: JSON.stringify([
        "Computer Science & Engineering",
        "Business Administration (MBA)",
        "Data Science & Analytics",
        "Medicine & Healthcare",
        "Biotechnology & Life Sciences",
        "Liberal Arts & Sciences"
      ]),
      admission_requirements: "Requires high school diploma with good grades, SAT/ACT for undergrad, GRE/GMAT for postgrad, TOEFL/IELTS (minimum 79-100 iBT), letters of recommendation, and statement of purpose.",
      visa_requirements: "F-1 student visa requires university I-20 form, SEVIS fee payment, visa interview, proof of financial support, and valid passport.",
      estimated_costs: "Tuition: $20,000-$70,000/year depending on institution; Living expenses: $10,000-$18,000/year.",
      work_opportunities: "On-campus work up to 20 hours/week. Optional Practical Training (OPT) allows 12 months work, extendable to 36 months for STEM graduates."
    },
    {
      country_slug: "canada",
      display_name: "Canada",
      is_active: true,
      display_order: 3,
      hero_title: "Study in Canada - Quality Education & Immigration Pathways",
      hero_subtitle: "Experience affordable world-class education with excellent post-study work and immigration opportunities for Nepali students.",
      overview_content: "Canada is one of the most popular study destinations for Nepali students, offering high-quality education at affordable costs, a welcoming multicultural society, and excellent immigration pathways. Canadian universities are known for their research excellence and industry connections. With safe cities, beautiful landscapes, and a high standard of living, Canada provides an ideal environment for international students.",
      why_study_here: JSON.stringify([
        "Affordable tuition fees compared to USA/UK",
        "Excellent post-graduation work permit (up to 3 years)",
        "Clear pathways to permanent residency",
        "Welcoming and safe multicultural society",
        "High-quality education with global recognition",
        "Co-op and internship opportunities in many programs"
      ]),
      popular_courses: JSON.stringify([
        "Computer Science & IT",
        "Engineering (Civil, Mechanical, Electrical)",
        "Business & Management",
        "Healthcare & Nursing",
        "Hospitality & Tourism Management",
        "Environmental Sciences"
      ]),
      admission_requirements: "High school completion with 60%+, IELTS 6.0-6.5 for diploma/undergraduate, bachelor's degree with 60%+ for postgraduate, IELTS 6.5-7.0.",
      visa_requirements: "Study permit requires university acceptance letter, proof of funds (CAD $10,000+ for living expenses plus tuition), medical exam, and valid passport.",
      estimated_costs: "Tuition: CAD $15,000-$35,000/year; Living expenses: CAD $10,000-$15,000/year.",
      work_opportunities: "Work up to 20 hours/week during studies, full-time during breaks. Post-Graduation Work Permit (PGWP) offers 1-3 years work authorization."
    },
    {
      country_slug: "australia",
      display_name: "Australia",
      is_active: true,
      display_order: 4,
      hero_title: "Study in Australia - World-Class Education Down Under",
      hero_subtitle: "Discover innovative education, beautiful landscapes, and excellent career opportunities for Nepali students.",
      overview_content: "Australia offers world-class education with a practical, research-focused approach. Known for its high quality of life, beautiful weather, and multicultural cities, Australia attracts thousands of Nepali students every year. With strong industries in mining, healthcare, IT, and business, Australia provides excellent post-study employment opportunities and pathways to permanent residency.",
      why_study_here: JSON.stringify([
        "Top-quality universities with global reputation",
        "Post-study work rights (2-4 years)",
        "Opportunities for permanent residency",
        "Safe and multicultural environment",
        "Beautiful climate and outdoor lifestyle",
        "Strong job market in key industries"
      ]),
      popular_courses: JSON.stringify([
        "Engineering & Mining",
        "Business & Accounting",
        "Information Technology",
        "Nursing & Healthcare",
        "Hospitality & Culinary Arts",
        "Environmental Sciences"
      ]),
      admission_requirements: "Completion of 12 years education with 60%+, IELTS 6.0-6.5 for undergraduate, bachelor's degree for postgraduate with IELTS 6.5-7.0.",
      visa_requirements: "Subclass 500 student visa requires Confirmation of Enrollment (CoE), Overseas Student Health Cover (OSHC), proof of funds (AUD $21,041/year), GTE statement.",
      estimated_costs: "Tuition: AUD $20,000-$45,000/year; Living expenses: AUD $21,000-$26,000/year.",
      work_opportunities: "Work up to 48 hours fortnightly during studies, unlimited during breaks. Temporary Graduate visa (subclass 485) offers 2-4 years post-study work rights."
    },
    {
      country_slug: "new-zealand",
      display_name: "New Zealand",
      is_active: true,
      display_order: 5,
      hero_title: "Study in New Zealand - Innovation & Natural Beauty",
      hero_subtitle: "Experience world-class education in a stunning natural environment with excellent student support.",
      overview_content: "New Zealand offers high-quality education in a safe, welcoming environment with breathtaking natural beauty. Known for its research-led teaching, practical approach to learning, and strong support for international students, New Zealand is an excellent choice for Nepali students. With a focus on innovation, sustainability, and work-life balance, New Zealand provides a unique study abroad experience.",
      why_study_here: JSON.stringify([
        "High-quality education with research focus",
        "Safe and friendly environment",
        "Post-study work visa opportunities (up to 3 years)",
        "Stunning natural landscapes and outdoor activities",
        "Smaller class sizes and personalized attention",
        "Pathways to permanent residency"
      ]),
      popular_courses: JSON.stringify([
        "Agriculture & Horticulture",
        "Information Technology",
        "Business & Tourism Management",
        "Engineering",
        "Healthcare & Nursing",
        "Environmental Studies"
      ]),
      admission_requirements: "Completion of 12 years education, IELTS 6.0 for diploma/undergraduate, bachelor's degree for postgraduate with IELTS 6.5.",
      visa_requirements: "Student visa requires university offer, proof of funds (NZD $15,000/year), medical certificate, police clearance, and valid passport.",
      estimated_costs: "Tuition: NZD $22,000-$32,000/year; Living expenses: NZD $15,000-$18,000/year.",
      work_opportunities: "Work up to 20 hours/week during semester, full-time during holidays. Post-study work visa offers 1-3 years depending on qualification level."
    },
    {
      country_slug: "europe",
      display_name: "Europe",
      is_active: true,
      display_order: 6,
      hero_title: "Study in Europe - Diverse Cultures & Affordable Education",
      hero_subtitle: "Explore world-renowned universities across Germany, France, Netherlands, and other European countries.",
      overview_content: "Europe offers diverse educational opportunities across numerous countries, many with low or no tuition fees at public universities. From the engineering excellence of Germany to the business schools of France and the liberal education system of the Netherlands, Europe provides high-quality education, rich cultural experiences, and excellent travel opportunities. Many programs are now offered in English, making Europe increasingly accessible to international students from Nepal.",
      why_study_here: JSON.stringify([
        "Low or no tuition fees in many countries (Germany, Norway, Austria)",
        "High-quality education with global recognition",
        "Schengen visa allows travel across 27 countries",
        "Rich cultural heritage and diverse experiences",
        "Growing number of English-taught programs",
        "Post-study work opportunities in many countries"
      ]),
      popular_courses: JSON.stringify([
        "Engineering (especially in Germany)",
        "Business & Management",
        "Computer Science & Data Science",
        "Arts & Design",
        "Renewable Energy & Sustainability",
        "International Relations"
      ]),
      admission_requirements: "Requirements vary by country. Generally requires 12 years education, IELTS/TOEFL for English programs (6.0-6.5), motivational letter, and previous degree for masters.",
      visa_requirements: "Student visa/residence permit requirements vary by country. Generally requires university admission, proof of funds (€8,000-€11,000/year), health insurance, and accommodation proof.",
      estimated_costs: "Tuition: €0-€20,000/year (varies greatly); Living expenses: €800-€1,200/month depending on country and city.",
      work_opportunities: "Work rights vary by country. Germany allows 120 full days or 240 half days per year. Most countries offer 18-24 months post-study work visa."
    },
    {
      country_slug: "japan",
      display_name: "Japan",
      is_active: true,
      display_order: 7,
      hero_title: "Study in Japan - Technology, Culture & Innovation",
      hero_subtitle: "Experience cutting-edge technology education and unique cultural immersion in the Land of the Rising Sun.",
      overview_content: "Japan offers a unique blend of ancient traditions and modern innovation, with world-leading universities in technology, engineering, and robotics. The Japanese government actively welcomes international students through scholarships and support programs. Studying in Japan provides not only excellent education but also the opportunity to learn Japanese language and culture, opening doors to careers in Japanese corporations worldwide.",
      why_study_here: JSON.stringify([
        "World-leading technology and engineering programs",
        "MEXT and other generous scholarship opportunities",
        "Safe, clean, and efficient society",
        "Unique cultural experience and language learning",
        "Opportunities in Japanese global corporations",
        "Advanced research facilities and innovation hubs"
      ]),
      popular_courses: JSON.stringify([
        "Robotics & Automation",
        "Computer Science & AI",
        "Engineering (Mechanical, Electrical, Civil)",
        "Business & International Relations",
        "Japanese Language & Culture",
        "Biotechnology & Life Sciences"
      ]),
      admission_requirements: "High school completion, entrance exam (EJU for undergrad), bachelor's degree for postgraduate, Japanese language proficiency (JLPT N2-N3) or English (TOEFL 79+) depending on program.",
      visa_requirements: "Student visa requires Certificate of Eligibility (CoE) from university, proof of financial support (¥1.2-1.5 million/year), valid passport, and health certificate.",
      estimated_costs: "Tuition: ¥535,800-¥1,000,000/year (public universities); Living expenses: ¥100,000-¥150,000/month including accommodation.",
      work_opportunities: "Part-time work up to 28 hours/week with permission. Post-study designated activities visa offers 6-12 months for job hunting, then work visa upon employment."
    }
  ];
  
  return await insertData('study_destination_details', destinations, 'country_slug');
};

// Main seed function
export const seedDatabase = async () => {
  let allSuccessful = true;

  console.log("Starting database seeding process...");

  if (!await seedFaqs()) allSuccessful = false;
  if (!await seedServices()) allSuccessful = false;
  if (!await seedTestimonials()) allSuccessful = false;
  if (!await seedTestPrepCourses()) allSuccessful = false;
  if (!await seedUniversities()) allSuccessful = false;
  if (!await seedSiteSettings()) allSuccessful = false;
  if (!await seedConsultationTimeSlots()) allSuccessful = false;
  if (!await seedEducationLevelOptions()) allSuccessful = false;
  if (!await seedStudyInterestOptions()) allSuccessful = false;
  if (!await seedHomepageProcessSteps()) allSuccessful = false;
  if (!await seedStudyDestinations()) allSuccessful = false;

  if (allSuccessful) {
    console.log("Database seeding completed successfully.");
    return { success: true, message: 'Database seeded successfully.' };
  } else {
    console.error(`Database seeding failed.`);
    return { success: false, message: 'Failed to seed database.' };
  }
};

// Export a function to run the seeding
export default async function runSeed() {
  return await seedDatabase();
} 