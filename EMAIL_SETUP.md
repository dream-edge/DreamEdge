# Email Integration Setup Guide

## ✅ Email Functionality Added!

Your consultation booking form now sends professional emails to both the admin and the student when a consultation is booked.

## 📧 Features

### Admin Notification Email
- Receives complete consultation booking details
- Formatted in a professional HTML template
- Includes:
  - Student contact information
  - Preferred date and time
  - Alternative date/time (if provided)
  - Consultation method (Online/In-office)
  - Academic background
  - Any additional messages

### Student Confirmation Email
- Professional confirmation email sent to the student
- Includes:
  - Booking confirmation
  - Consultation details summary
  - What to expect
  - Preparation tips
  - Contact information
  - Link to explore study destinations

## 🚀 Setup Instructions

### Step 1: Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Get Your API Key

1. Log in to your Resend dashboard
2. Navigate to "API Keys" section
3. Click "Create API Key"
4. Give it a name like "Dream Edge Production"
5. Copy the API key (it starts with `re_`)

### Step 3: Configure Environment Variables

Open your `.env.local` file and update these values:

```env
# Resend Email API
RESEND_API_KEY=re_your_actual_api_key_here

# Email Configuration
EMAIL_FROM=Dream Edge <your-verified-email@yourdomain.com>
ADMIN_EMAIL=your-admin-email@dreamedge.com.np
CONTACT_EMAIL=info@dreamedge.com.np
CONTACT_PHONE=+977-1-4412345

# Site URL (update for production)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Step 4: Verify Your Domain (For Production)

**For Development/Testing:**
- Resend provides a test email `onboarding@resend.dev` 
- You can send up to 100 emails/day for testing
- Emails can only be sent to your verified email address

**For Production:**
1. Go to Resend Dashboard → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `dreamedge.com.np`)
4. Add the provided DNS records to your domain registrar
5. Wait for verification (usually 24-48 hours)
6. Once verified, update `EMAIL_FROM` to use your domain:
   ```
   EMAIL_FROM=Dream Edge <noreply@dreamedge.com.np>
   ```

### Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/book-consultation`

3. Fill out the consultation form with your email address

4. Submit the form

5. Check both:
   - Admin email inbox (ADMIN_EMAIL)
   - Student email inbox (your test email)

## 📝 Email Templates

### Admin Email Features:
- ✅ Clean, professional design
- ✅ Color-coded sections
- ✅ Clickable email and phone links
- ✅ Formatted dates (e.g., "Monday, December 4, 2025")
- ✅ Highlights important information
- ✅ Mobile-responsive

### Student Confirmation Email Features:
- ✅ Friendly, welcoming tone
- ✅ Booking confirmation with details
- ✅ "What's Next" section
- ✅ Preparation checklist
- ✅ Call-to-action button to explore destinations
- ✅ Full contact information
- ✅ Mobile-responsive

## 🔧 Customization

### Update Email Templates

Email templates are in: `src/app/api/send-consultation-email/route.js`

You can customize:
- Colors and styling
- Email content and messaging
- Add your logo
- Modify layout

### Update Contact Information

Update these in `.env.local`:
- `CONTACT_EMAIL` - Your consultancy email
- `CONTACT_PHONE` - Your phone number
- `ADMIN_EMAIL` - Where booking notifications should go

### Add Multiple Admin Recipients

To send to multiple people, modify the API route:

```javascript
// In src/app/api/send-consultation-email/route.js
to: ['admin1@dreamedge.com.np', 'admin2@dreamedge.com.np'],
```

## 💡 Resend Free Tier

**Free Plan Includes:**
- ✅ 100 emails per day
- ✅ 3,000 emails per month
- ✅ API access
- ✅ Email logs and analytics
- ✅ Webhooks support

**Paid Plans:**
- $20/month: 50,000 emails
- Custom plans for higher volume

## 🔐 Security Notes

1. **Never commit your API key to Git**
   - `.env.local` is already in `.gitignore`
   - Always use environment variables

2. **Use different keys for development and production**
   - Create separate API keys in Resend dashboard
   - Label them clearly

3. **Monitor email usage**
   - Check Resend dashboard regularly
   - Set up usage alerts if available

## 🐛 Troubleshooting

### Emails not being sent?

1. **Check API Key:**
   ```bash
   # In terminal, check if key is set
   echo $RESEND_API_KEY
   ```

2. **Check Browser Console:**
   - Open Developer Tools → Console
   - Look for email-related errors

3. **Check Server Logs:**
   - Look for "Failed to send email notification" errors
   - Check if API endpoint is being called

4. **Verify Resend Account:**
   - Log in to Resend dashboard
   - Check "Logs" section to see delivery status
   - Ensure you're not over the rate limit

### Emails going to spam?

1. Verify your domain in Resend
2. Set up SPF and DKIM records
3. Use a recognizable sender name
4. Avoid spam trigger words in subject/content

### HTML not rendering properly?

1. Test emails in multiple clients
2. Use inline styles (already implemented)
3. Check email previews in Resend dashboard

## 📊 Monitoring

### Check Email Delivery

1. Log in to Resend Dashboard
2. Go to "Logs" section
3. See:
   - Sent emails
   - Delivery status
   - Open rates (if enabled)
   - Bounce rates

### Email Logs

All email attempts are logged in:
- Browser console (development)
- Server logs (production)
- Resend dashboard (all environments)

## 🚀 Production Deployment

Before deploying to production:

1. ✅ Verify your domain in Resend
2. ✅ Update all environment variables in hosting platform
3. ✅ Test with real email addresses
4. ✅ Update `NEXT_PUBLIC_SITE_URL` to production URL
5. ✅ Update `EMAIL_FROM` to use your domain
6. ✅ Test the entire booking flow
7. ✅ Set up monitoring/alerts

## 📝 Environment Variables Checklist

```env
✅ RESEND_API_KEY          - Your Resend API key
✅ EMAIL_FROM              - Verified sender email
✅ ADMIN_EMAIL             - Where notifications go
✅ CONTACT_EMAIL           - Display in footer
✅ CONTACT_PHONE           - Display in footer
✅ NEXT_PUBLIC_SITE_URL    - Your website URL
```

## 🎯 Next Steps

1. **Get Resend API Key** - Sign up at resend.com
2. **Update `.env.local`** - Add your API key and email settings
3. **Test locally** - Book a test consultation
4. **Verify domain** - For production use
5. **Deploy** - Push changes and configure production environment

---

**Need Help?**
- Resend Documentation: https://resend.com/docs
- Resend Support: support@resend.com
- Check the API route: `src/app/api/send-consultation-email/route.js`

**Status:** ✅ Email integration is ready! Just add your Resend API key to start receiving emails.
