// pages/api/submit-form.js
import clientPromise from "../../lib/mongodb";
import nodemailer from "nodemailer";
import { renderToStream } from "@react-pdf/renderer";
import QuotationPDF from "../../lib/QuotationPDF";

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
    console.log("✅ MongoDB: Inserted ID:", result.insertedId);

    // 2. Generate PDF using @react-pdf/renderer
    const pdfStream = await renderToStream(<QuotationPDF costItems={quote} total={total} />);

    const chunks = [];
    for await (const chunk of pdfStream) {
      chunks.push(chunk);
    }

    const pdfBuffer = Buffer.concat(chunks);

    // 3. Send Email with form data + PDF
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "aryankuril09@gmail.com", // or use the user's email
      subject: "New Schedule Form Submission + Quotation",
      html: `
        <h2>New Schedule Call Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><em>Quotation summary is attached as PDF.</em></p>
      `,
      attachments: [
        {
          filename: "quotation-summary.pdf",
          content: pdfBuffer,
        },
      ],
    });

    return res.status(200).json({ message: "Form submitted and email sent with PDF!" });

  } catch (err) {
    console.error("❌ Server Error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
