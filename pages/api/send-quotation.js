import nodemailer from 'nodemailer';
import { renderToBuffer } from '@react-pdf/renderer';
import QuotationPDF from '../../lib/QuotationPDF';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, quote, total, serviceCalculator } = req.body;

  if (!email || !quote || !total || !serviceCalculator) {
    return res.status(400).json({ message: 'Missing email, quote, total, or serviceCalculator' });
  }

  try {
    const pdfBuffer = await renderToBuffer(<QuotationPDF costItems={quote} total={total} />);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER || 'aryankuril09@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password',
      },
    });

    // Clean up service name for filename and subject
    const serviceNameSlug = serviceCalculator.trim().toLowerCase().replace(/\s+/g, '-');
    const serviceNameTitle = serviceCalculator.trim();

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'aryankuril09@gmail.com',
      to: email,
      subject: `Your ${serviceNameTitle} Quotation from Bombay Blokes`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <p>Hi,</p>

          <p>Thank you for your interest in our services. Please find your detailed quotation attached as a PDF for your reference.</p>

          <p>At <strong>Bombay Blokes</strong>, we are committed to helping businesses like yours reach new heights. With over 9 years of experience and 200+ successful brand partnerships, our expert team specializes in Marketing, Design, Production, and Development. We work passionately to deliver profitable solutions that help your business grow faster and smarter.</p>

          <p>We believe that a partnership with us will take your company to the next level and help you achieve outstanding results in today's competitive market.</p>

          <p>If you have any questions or need further assistance, feel free to get in touch.</p>

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

          <div style="margin-top: 20px;">
            <img src="cid:emailsign" alt="Signature" style="max-width:400px; height:auto; display:block;" />
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `${serviceNameSlug}-quotation.pdf`,  // e.g., website-development-quotation.pdf
          content: pdfBuffer,
        },
        {
          filename: 'emailsign.png',
          path: 'public/images/emailsign.png',
          cid: 'emailsign',
        },
      ],
    });

    return res.status(200).json({ message: 'Quotation sent successfully!' });
  } catch (error) {
    console.error('❌ Email send error:', error);
    return res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
};
