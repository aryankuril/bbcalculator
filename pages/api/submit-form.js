// pages/api/submit-form.js
import clientPromise from "../../lib/mongodb";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";
import generateQuoteHTML from "../../lib/quotationTemplate"; // ✅ your custom function

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, phone, email, quote, total } = req.body;

  if (!name || !phone || !email || !quote || !total) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // 1. Store in MongoDB
    const client = await clientPromise;
    const db = client.db("test");
    const result = await db.collection("formSubmissions").insertOne({
      name,
      phone,
      email,
      quote,
      total,
      createdAt: new Date(),
    });

    console.log("✅ Mongo Inserted ID:", result.insertedId);

    // 2. Generate HTML & PDF from generateQuoteHTML
    const htmlContent = generateQuoteHTML({ costItems: quote, total });

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // 3. Email with attached PDF
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "aryankuril09@gmail.com", // or dynamic email
      subject: "New Schedule Free Call + Cost Estimate",
      html: `
        <h2>New Inquiry from Schedule Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>Cost summary is attached as PDF.</p>
      `,
      attachments: [
        {
          filename: "quotation-summary.pdf",
          content: pdfBuffer,
        },
      ],
    });

    return res.status(200).json({ message: "Form submitted and PDF emailed!" });

  } catch (err) {
    console.error("❌ Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
