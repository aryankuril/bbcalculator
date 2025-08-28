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

//    await transporter.sendMail({
//   from: process.env.EMAIL_USER || 'aryankuril09@gmail.com',
//   to: email,
//   subject: 'Your Quotation Estimate',
//   html: `
//     <div style="font-family: Arial, sans-serif;">
//       <p style="margin:0;">Hii,</p>
//       <br>
//       <p style="margin:0;">Please find your quotation in the attached PDF.</p>
//       <br>
//       <p style="margin:0;">Regards,</p>
//       <p style="margin:0;">Priyank Shah | <strong>Head Bloke</strong></p>
//       <p style="margin:0;">+91 98191 67856 | Follow <a href="https://www.instagram.com/bombay_blokes/" target="_blank" style="color:#0073e6; text-decoration:none;">@bombay_blokes</a>. Stay Updated!</p>
//       <br>
//       <img src="https://i.postimg.cc/J4X4Bx6Q/BB-Email-Sign.png" alt="Bombay Blokes Signature" style="display:block; width:100%; max-width:600px; height:auto; border:0;">
//     </div>
//   `,
//   attachments: [
//     {
//       filename: 'quotation.pdf',
//       content: pdfBuffer,
//     },
//   ],
// });


await transporter.sendMail({
  from: process.env.EMAIL_USER || 'aryankuril09@gmail.com',
  to: email,
  subject: 'Your Quotation Estimate',
  html: `
    <div style="font-family: Arial, sans-serif; color: #212121;">
      <p style="margin:0;">Hi,</p>
      <p style="margin:10px 0 10px 0;">Please find your quotation in the attached PDF.</p>
      <div style="margin-bottom:18px;">
        <p style="margin:0;">Regards,</p>
        <p style="margin:0;">Priyank Shah | <strong>Head Bloke</strong></p>
        <p style="margin:0;">+91 98191 67856 | Follow <a href="https://www.instagram.com/bombay_blokes/" target="_blank" style="color:#0073e6; text-decoration:none;">@bombay_blokes</a>. Stay Updated!</p>
      </div>
      <img src="https://i.postimg.cc/J4X4Bx6Q/BB-Email-Sign.png" 
           alt="Bombay Blokes Signature" 
           style="display:block; width:100%; max-width:500px; height:auto; border:0; margin:0 0 10px 0;">
      <p style="color:#888; font-size:12px; margin:8px 0 0 0;">Thank you for your business!</p>
    </div>
  `,
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