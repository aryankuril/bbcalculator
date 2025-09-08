import nodemailer from 'nodemailer';
import { renderToBuffer } from '@react-pdf/renderer';
import QuotationPDF from '../../lib/QuotationPDF';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, quote, total, serviceCalculator } = req.body;

  if (!email || !quote || !total || !serviceCalculator) {
    return res.status(400).json({ message: 'Missing email, quote, total, or serviceCalculator' });
  }

  try {
    console.log('Generating PDF...');
    const pdfBuffer = await renderToBuffer(<QuotationPDF costItems={quote} total={total} />);
    console.log('PDF generated successfully');

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log('Transporter verified');

    const serviceNameSlug = serviceCalculator.trim().toLowerCase().replace(/\s+/g, '-');
    const serviceNameTitle = serviceCalculator
  .trim()
  .toLowerCase()
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

    const imagePath = path.join(process.cwd(), 'public', 'images', 'emailsign.png');

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your ${serviceNameTitle} Quotation from Bombay Blokes`,
      html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
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
        </div>`,
      attachments: [
        { filename: `${serviceNameSlug}-quotation.pdf`, content: pdfBuffer },
        { filename: 'emailsign.png', path: imagePath, cid: 'emailsign' },
      ],
    });

    return res.status(200).json({ message: 'Quotation sent successfully!' });
  } catch (error) {
    console.error('❌ Email send error:', error);
    return res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
};
