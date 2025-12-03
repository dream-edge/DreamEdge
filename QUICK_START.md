# Dream Edge - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database)

### Installation Steps

1. **Install Dependencies** (if not already done)
```bash
cd consultancy
npm install
```

2. **Environment Setup**
The `.env.local` file has been created with Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://xygintepfethdohbhsja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Access the Application**
Open your browser and navigate to:
```
http://localhost:3000
```

### Seed the Database

1. Start the development server (step 3 above)

2. Navigate to the admin seed page:
```
http://localhost:3000/admin/seed
```

3. Click the "Seed Database" button

This will populate your Supabase database with:
- ✅ Study destinations (UK, USA, Canada, Australia, New Zealand, Europe, Japan)
- ✅ Sample universities
- ✅ Services offered
- ✅ FAQs
- ✅ Testimonials
- ✅ Test preparation courses
- ✅ Site settings (Dream Edge branding)
- ✅ Homepage process steps
- ✅ Form options (education levels, study interests, time slots)

## 📖 Available Pages

### Public Pages
- `/` - Homepage
- `/about` - About Dream Edge
- `/services` - Services overview
- `/study-abroad` - Study abroad information
- `/study-abroad/universities` - University listings
- `/study-abroad/[country]` - Country-specific pages (uk, usa, canada, australia, new-zealand, europe, japan)
- `/test-preparation` - Test prep courses (IELTS, PTE, TOEFL)
- `/contact` - Contact form
- `/book-consultation` - Consultation booking form
- `/faq` - Frequently asked questions

### Admin Pages
- `/admin` - Admin dashboard (requires authentication)
- `/admin/seed` - Database seeding utility
- `/admin/universities` - Manage universities
- `/admin/services` - Manage services
- `/admin/testimonials` - Manage testimonials
- `/admin/faqs` - Manage FAQs
- `/admin/study-destinations` - Manage countries
- `/admin/settings` - Site settings

## 🎨 Customization

### Update Logo
Replace the logo file:
```
/public/logos/logo.png
```

### Update Images
Add images to:
```
/public/images/
/public/countries/
/public/testimonials/
```

### Modify Site Settings
After seeding, you can update site settings via:
- Database directly (Supabase dashboard)
- Admin settings page at `/admin/settings` (after authentication is set up)

### Update Colors/Theme
Edit Tailwind configuration:
```
/consultancy/tailwind.config.js
```

Brand colors are defined as:
- `brand-primary` - Main brand color
- `brand-accent` - Accent/CTA color
- `brand-secondary` - Secondary color

## 📝 Content Management

### Add New University
1. Go to `/admin/universities`
2. Click "Add University"
3. Fill in details (name, location, country, courses, etc.)
4. Upload logo
5. Save

### Add New Service
1. Go to `/admin/services`
2. Click "Add Service"
3. Enter service details
4. Save

### Add New Testimonial
1. Go to `/admin/testimonials`
2. Click "Add Testimonial"
3. Enter student details and quote
4. Upload photo (optional)
5. Save

### Manage FAQs
1. Go to `/admin/faqs`
2. Add/Edit/Delete questions
3. Organize by category

## 🔧 Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🌐 Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🐛 Troubleshooting

### Pages showing "Loading..."
- Ensure Supabase credentials are correct
- Check database is seeded
- Verify network connection

### Images not loading
- Check image paths in `/public` folder
- Verify image URLs in database
- Check file permissions

### Database errors
- Verify Supabase connection
- Check database tables exist
- Run seeding script again if needed

## 📱 Mobile Testing

Test responsive design at different breakpoints:
- Mobile: 375px, 414px
- Tablet: 768px, 1024px  
- Desktop: 1280px, 1920px

## 🔐 Security Notes

- Never commit `.env.local` to version control (already in .gitignore)
- Use environment variables for sensitive data
- Implement authentication before enabling admin features in production
- Enable RLS (Row Level Security) in Supabase for production

## 📊 Analytics Setup (Recommended)

Add Google Analytics or similar:
1. Create GA4 property
2. Add tracking code to `src/app/layout.js`
3. Track page views and conversions

## 🎯 Next Steps

1. ✅ Review the changes document: `DREAM_EDGE_CHANGES.md`
2. ✅ Run `npm run dev` to start development server
3. ✅ Access `/admin/seed` to populate database
4. ✅ Replace logo and images with Dream Edge branding
5. ✅ Test all pages and forms
6. ✅ Update social media links when available
7. ✅ Configure actual contact information
8. ✅ Test on mobile devices
9. ✅ Deploy to production

## 💬 Support

For technical issues:
- Check the documentation
- Review error logs in console
- Verify database connections
- Test with clean browser cache

---

**Application**: Dream Edge Education Consultancy  
**Version**: 0.1.0  
**Last Updated**: December 3, 2025  
**Status**: Ready for development and testing ✅
