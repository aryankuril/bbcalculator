import fs from 'fs';
import path from 'path';
import quotationTableHTML from '../../lib/quotationTableHTML';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, quote, total, serviceCalculator } = req.body;

  console.log('📥 Request body:', req.body);
  console.log('🌟 Type Checks:', {
    emailType: typeof email,
    quoteIsArray: Array.isArray(quote),
    totalType: typeof total,
    serviceCalculatorType: typeof serviceCalculator,
  });

  // Validate inputs
  if (
    typeof email !== 'string' ||
    !Array.isArray(quote) ||
    quote.length === 0 ||
    typeof total !== 'number' ||
    isNaN(total) ||
    typeof serviceCalculator !== 'string'
  ) {
    return res.status(400).json({
      success: false,
      message: 'Missing or invalid email, quote, total, or serviceCalculator',
      received: { email, quote, total, serviceCalculator }
    });
  }

  try {
    const serviceNameTitle = serviceCalculator
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');


    const payload = {
      app_id: process.env.ONESIGNAL_APP_ID,
      include_email_tokens: [email],
      email_subject: `Your ${serviceNameTitle} Quotation from Bombay Blokes`,
      email_body: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <p>Hi,</p>

          <p>Thank you for your interest in our services. Please find your detailed quotation below for your reference.</p>

          <p>At <strong>Bombay Blokes</strong>, we are committed to helping businesses like yours reach new heights. With over 9 years of experience and 200+ successful brand partnerships, our expert team specializes in Performancemarketing, Social Media, Design, SEO, and Development.</p>

          <p>If you have any questions or need further assistance, feel free to get in touch.</p>
          
          ${quotationTableHTML(quote, total)}

          <div style="margin-top: 30px;">
            <p style="margin:0;">Warm regards,</p>
            <p style="margin:0;"><strong>Priyank Shah</strong></p>
            <p style="margin:0;">Head Bloke, Bombay Blokes</p>
            <p style="margin:0;">📞 +91 98191 67856</p>
            <p style="margin:0;">
              Follow us on Instagram: 
              <a href="https://www.instagram.com/bombay_blokes/" target="_blank" style="color:#0073e6; text-decoration:none;">
                @bombay_blokes
              </a>
            </p>
          </div>

          
        </div>
      `,     
    };

    console.log('🌐 Sending OneSignal API request with payload:', payload);

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.ONESIGNAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('✅ OneSignal API Response:', data);

    if (response.ok) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(response.status).json({ success: false, data });
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
