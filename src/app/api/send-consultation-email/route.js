import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      preferred_date, 
      preferred_time,
      alt_date,
      alt_time,
      education_level, 
      study_interests,
      preferred_location,
      message 
    } = body;

    // Format dates for better readability
    const formatDate = (dateStr) => {
      if (!dateStr) return 'Not specified';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    // Admin notification email
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
              color: white;
              padding: 30px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .info-section {
              background: white;
              padding: 20px;
              margin-bottom: 20px;
              border-radius: 8px;
              border-left: 4px solid #3b82f6;
            }
            .info-row {
              margin-bottom: 15px;
            }
            .label {
              font-weight: bold;
              color: #1e40af;
              display: inline-block;
              width: 180px;
            }
            .value {
              color: #4b5563;
            }
            .message-box {
              background: #eff6ff;
              padding: 15px;
              border-radius: 8px;
              margin-top: 15px;
              border-left: 4px solid #60a5fa;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎓 New Consultation Booking</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Dream Edge - Education Consultancy</p>
            </div>
            
            <div class="content">
              <p style="font-size: 16px; color: #1f2937; margin-top: 0;">
                A new consultation has been booked through the website. Please review the details below:
              </p>

              <div class="info-section">
                <h3 style="margin-top: 0; color: #1e40af;">Personal Information</h3>
                <div class="info-row">
                  <span class="label">Name:</span>
                  <span class="value">${name}</span>
                </div>
                <div class="info-row">
                  <span class="label">Email:</span>
                  <span class="value"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></span>
                </div>
                <div class="info-row">
                  <span class="label">Phone:</span>
                  <span class="value"><a href="tel:${phone}" style="color: #3b82f6;">${phone}</a></span>
                </div>
              </div>

              <div class="info-section">
                <h3 style="margin-top: 0; color: #1e40af;">Consultation Details</h3>
                <div class="info-row">
                  <span class="label">Preferred Date:</span>
                  <span class="value"><strong>${formatDate(preferred_date)}</strong></span>
                </div>
                <div class="info-row">
                  <span class="label">Preferred Time:</span>
                  <span class="value"><strong>${preferred_time}</strong></span>
                </div>
                ${alt_date ? `
                  <div class="info-row">
                    <span class="label">Alternative Date:</span>
                    <span class="value">${formatDate(alt_date)}</span>
                  </div>
                ` : ''}
                ${alt_time ? `
                  <div class="info-row">
                    <span class="label">Alternative Time:</span>
                    <span class="value">${alt_time}</span>
                  </div>
                ` : ''}
                <div class="info-row">
                  <span class="label">Consultation Method:</span>
                  <span class="value">${preferred_location === 'online' ? '💻 Online (Zoom/Google Meet)' : '🏢 In-Office Visit'}</span>
                </div>
              </div>

              <div class="info-section">
                <h3 style="margin-top: 0; color: #1e40af;">Academic Background</h3>
                <div class="info-row">
                  <span class="label">Education Level:</span>
                  <span class="value">${education_level}</span>
                </div>
                <div class="info-row">
                  <span class="label">Study Interest:</span>
                  <span class="value">${study_interests}</span>
                </div>
              </div>

              ${message ? `
                <div class="info-section">
                  <h3 style="margin-top: 0; color: #1e40af;">Additional Message</h3>
                  <div class="message-box">
                    <p style="margin: 0; color: #1f2937;">${message.replace(/\n/g, '<br>')}</p>
                  </div>
                </div>
              ` : ''}

              <div class="footer">
                <p style="margin: 5px 0;">This email was sent from Dream Edge consultation booking form</p>
                <p style="margin: 5px 0;">Please respond to the student within 24 hours</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Student confirmation email
    const studentEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
              color: white;
              padding: 30px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .info-box {
              background: white;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
              border-left: 4px solid #10b981;
            }
            .details-box {
              background: #eff6ff;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .detail-row {
              margin-bottom: 12px;
              padding-bottom: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            .detail-row:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .label {
              font-weight: bold;
              color: #1e40af;
            }
            .cta-button {
              display: inline-block;
              background: #3b82f6;
              color: white !important;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">✅ Consultation Booked Successfully!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Dream Edge - Education Consultancy</p>
            </div>
            
            <div class="content">
              <div class="info-box">
                <p style="font-size: 18px; color: #059669; margin: 0; font-weight: bold;">
                  Thank you for booking a consultation with Dream Edge!
                </p>
              </div>

              <p style="font-size: 16px; color: #1f2937;">
                Dear ${name},
              </p>

              <p style="font-size: 16px; color: #4b5563;">
                We're excited to help you on your journey to study abroad in USA, UK, Canada, Australia, Europe, New Zealand, or Japan. 
                Your consultation request has been received and our team will contact you shortly to confirm your appointment.
              </p>

              <div class="details-box">
                <h3 style="margin-top: 0; color: #1e40af;">Your Booking Details:</h3>
                <div class="detail-row">
                  <div class="label">📅 Preferred Date:</div>
                  <div style="color: #1f2937; font-size: 16px; margin-top: 5px;">${formatDate(preferred_date)}</div>
                </div>
                <div class="detail-row">
                  <div class="label">🕐 Preferred Time:</div>
                  <div style="color: #1f2937; font-size: 16px; margin-top: 5px;">${preferred_time}</div>
                </div>
                <div class="detail-row">
                  <div class="label">💻 Consultation Method:</div>
                  <div style="color: #1f2937; font-size: 16px; margin-top: 5px;">${preferred_location === 'online' ? 'Online (Zoom/Google Meet)' : 'In-Office Visit'}</div>
                </div>
                <div class="detail-row">
                  <div class="label">📚 Area of Interest:</div>
                  <div style="color: #1f2937; font-size: 16px; margin-top: 5px;">${study_interests}</div>
                </div>
              </div>

              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <p style="margin: 0; color: #92400e;">
                  <strong>⏰ What's Next?</strong><br>
                  Our consultant will reach out to you within 24 hours via email or phone to confirm your consultation appointment and share the meeting details.
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/study-abroad" class="cta-button">
                  Explore Study Destinations
                </a>
              </div>

              <h3 style="color: #1e40af; margin-top: 30px;">Prepare for Your Consultation:</h3>
              <ul style="color: #4b5563;">
                <li>Have your academic documents ready (transcripts, certificates)</li>
                <li>Think about your preferred study destinations and career goals</li>
                <li>Prepare any specific questions you'd like to discuss</li>
                <li>Consider your budget and timeline for studying abroad</li>
              </ul>

              <div class="footer">
                <p style="margin: 5px 0;"><strong>Dream Edge - Education Consultancy</strong></p>
                <p style="margin: 5px 0;">Kathmandu, Nepal</p>
                <p style="margin: 5px 0;">
                  📧 Email: ${process.env.CONTACT_EMAIL || 'info@dreamedge.com.np'} | 
                  📞 Phone: ${process.env.CONTACT_PHONE || '+977-1-4412345'}
                </p>
                <p style="margin: 15px 0 5px 0;">
                  Need to reschedule? Contact us at least 24 hours in advance.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send emails
    const emailsToSend = [];

    // Always send to admin/consultancy email
    const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || 'info@dreamedge.com.np';
    
    emailsToSend.push(
      resend.emails.send({
        from: process.env.EMAIL_FROM || 'Dream Edge <onboarding@resend.dev>',
        to: adminEmail,
        subject: `🎓 New Consultation Booking - ${name}`,
        html: adminEmailHtml,
      })
    );

    // Send confirmation to student
    emailsToSend.push(
      resend.emails.send({
        from: process.env.EMAIL_FROM || 'Dream Edge <onboarding@resend.dev>',
        to: email,
        subject: '✅ Your Consultation is Booked - Dream Edge',
        html: studentEmailHtml,
      })
    );

    await Promise.all(emailsToSend);

    return NextResponse.json({ 
      success: true, 
      message: 'Emails sent successfully' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send email',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
