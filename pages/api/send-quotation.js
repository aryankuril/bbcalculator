// pages/api/send-quotation.js
import nodemailer from 'nodemailer';
import { renderToBuffer } from '@react-pdf/renderer';
import QuotationPDF from '../../lib/QuotationPDF';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, quote, total } = req.body;
  if (!email || !quote || !total) {
    return res.status(400).json({ message: 'Missing email, quote, or total' });
  }

  try {
    const pdfBuffer = await renderToBuffer(<QuotationPDF costItems={quote} total={total} />);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER || 'aryankuril09@gmail.com',
        pass: process.env.EMAIL_PASS || 'dtwp tcvv bcel pkym',
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'aryankuril09@gmail.com',
      to: email,
      subject: 'Your Quotation Estimate',
      text: 'Please find attached your project quotation.',
      attachments: [
        {
          filename: 'quotation.pdf',
          content: pdfBuffer,
        },
      ],
    });

    return res.status(200).json({ message: 'Quotation sent successfully!' });
  } catch (error) {
    console.error('❌ Email send error:', error);
    return res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
}
