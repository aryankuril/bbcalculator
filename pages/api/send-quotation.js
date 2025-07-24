import nodemailer from 'nodemailer';
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";


import generateQuoteHTML from '../../lib/quotationTemplate'; // Make sure this path is correct

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, quote, total } = req.body;

  if (!email || !quote || !total) {
    return res.status(400).json({ message: 'Missing email, quote, or total' });
  }

  try {
    // 1. Generate HTML from data
    const htmlContent = generateQuoteHTML({ costItems: quote, total });



const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath,
  headless: chromium.headless,
});


    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    // 3. Send Email with PDF attached
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'aryankuril09@gmail.com',
        pass: 'dtwp tcvv bcel pkym', // Use your Gmail App Password here
      },
    });

    await transporter.sendMail({
      from: 'aryankuril09@gmail.com',
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
