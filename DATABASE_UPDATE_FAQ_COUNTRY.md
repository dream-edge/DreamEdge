# Database Update Required: Add Country Field to FAQs

## Overview
The FAQ system has been updated to support country-specific FAQs. Users can now filter FAQs by country (UK, USA, Canada, Australia, New Zealand, Europe, Japan, or General).

## Database Schema Change Required

You need to add a `country` column to the `faqs` table in Supabase.

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to "SQL Editor" in the left sidebar
4. Click "New query"
5. Paste the following SQL:

```sql
-- Add country column to faqs table
ALTER TABLE faqs 
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'general';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_faqs_country ON faqs(country);

-- Update existing FAQs to have 'general' country if null
UPDATE faqs 
SET country = 'general' 
WHERE country IS NULL;

-- Add comment to document the column
COMMENT ON COLUMN faqs.country IS 'Country-specific FAQ filter: general, uk, usa, canada, australia, newzealand, europe, japan';
```

6. Click "Run" (or press Ctrl+Enter)
7. Verify the column was added successfully

### Option 2: Using Supabase Table Editor

1. Go to "Table Editor" in Supabase Dashboard
2. Select the `faqs` table
3. Click the "+" button to add a new column
4. Configure:
   - **Name:** `country`
   - **Type:** `text`
   - **Default Value:** `'general'`
   - **Allow nullable:** No
5. Click "Save"

## Verify the Update

After adding the column, verify it works:

1. Go to your admin panel: http://localhost:3001/admin/faqs
2. Edit an existing FAQ
3. You should see a "Country" dropdown with options
4. Select a country and save
5. Go to the public FAQ page: http://localhost:3001/faq
6. You should see country filter buttons at the top

## Reseed the Database (Optional)

To populate country-specific FAQs with sample data:

1. Go to: http://localhost:3001/admin/seed
2. Click "Seed Database"
3. This will add comprehensive country-specific FAQs for all destinations

## Features Added

### Admin Panel
- ✅ Country dropdown in FAQ form (Create/Edit)
- ✅ Country column in FAQ list table
- ✅ Color-coded country badges

### Public FAQ Page
- ✅ Country filter tabs with flag emojis
- ✅ Topic/category filter (secondary filter)
- ✅ Shows general FAQs + country-specific FAQs
- ✅ Beautiful, responsive design

### Supported Countries
- 🌍 General (All Countries)
- 🇬🇧 United Kingdom
- 🇺🇸 United States
- 🇨🇦 Canada
- 🇦🇺 Australia
- 🇳🇿 New Zealand
- 🇪🇺 Europe
- 🇯🇵 Japan

## Sample FAQs Included

The seed data now includes:
- **4 General FAQs** - Applicable to all countries
- **4 UK-specific FAQs** - Tuition, work rights, post-study visa, IELTS requirements
- **4 USA-specific FAQs** - Costs, work authorization, OPT, entrance exams
- **4 Canada-specific FAQs** - Fees, work permit, PGWP, provinces
- **4 Australia-specific FAQs** - Costs, work rights, graduate visa, Go8 universities
- **3 New Zealand-specific FAQs** - Tuition, work rights, post-study visa
- **4 Europe-specific FAQs** - Free education, work rights, language requirements, Schengen
- **4 Japan-specific FAQs** - Costs, part-time work, language, post-graduation opportunities

**Total: 31 comprehensive FAQs**

## How It Works

### Filtering Logic
When a user selects a country (e.g., "UK"):
- Shows all FAQs with `country = 'uk'`
- **Plus** all FAQs with `country = 'general'` (applicable to everyone)

Example: Selecting "USA" shows USA-specific FAQs + General FAQs

### API Update
The `getFaqs()` function in `src/lib/api.js` now supports:
```javascript
// Get all FAQs
getFaqs({ country: 'all' })

// Get UK-specific + General FAQs
getFaqs({ country: 'uk' })

// Get FAQs filtered by country AND category
getFaqs({ country: 'canada', category: 'visa' })
```

## Troubleshooting

### "Column does not exist" error
- The `country` column hasn't been added to the database yet
- Run the SQL migration above in Supabase SQL Editor

### FAQs not showing country filter
- Clear your browser cache
- Make sure the dev server has restarted after code changes
- Check browser console for errors

### Country column not appearing in admin
- Refresh the page
- Check that FAQForm.js was updated correctly
- Verify no JavaScript errors in console

## Testing Checklist

- [ ] SQL migration runs successfully
- [ ] Can create new FAQ with country selection
- [ ] Can edit existing FAQ and change country
- [ ] Country appears in admin FAQ list
- [ ] Public FAQ page shows country filter tabs
- [ ] Selecting a country filters FAQs correctly
- [ ] "All Countries" shows all FAQs
- [ ] General FAQs appear in all country filters
- [ ] Category filter works alongside country filter
- [ ] Mobile responsive design works

---

**Status:** ✅ Code changes complete. Database migration required to activate feature.
