import nodemailer from 'nodemailer';
import generateQuoteHTML from '../../lib/quotationTemplate';

let puppeteer;
let executablePath;
let args;
let headless;

if (process.env.NODE_ENV === 'production') {
  const chromium = await import('chrome-aws-lambda');
  puppeteer = await import('puppeteer-core');
  executablePath = await chromium.executablePath;
  args = chromium.args;
  headless = chromium.headless;
} else {
  puppeteer = await import('puppeteer');
  executablePath = undefined; // Use default path
  args = ['--no-sandbox', '--disable-setuid-sandbox'];
  headless = 'new';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, quote, total } = req.body;

  if (!email || !quote || !total) {
    return res.status(400).json({ message: 'Missing email, quote, or total' });
  }

  try {
    const htmlContent = generateQuoteHTML({ costItems: quote, total });

    const browser = await puppeteer.launch({
      args,
      executablePath,
      headless,
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

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
