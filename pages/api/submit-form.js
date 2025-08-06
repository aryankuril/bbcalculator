import clientPromise from "../../lib/mongodb";
import nodemailer from "nodemailer";
import { renderToStream } from "@react-pdf/renderer";
import QuotationPDF from "../../lib/QuotationPDF";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, phone, email, quote, total, estimateId } = req.body;

  if (!quote || !total) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("test");

    let insertedId = estimateId;

    // Case 1: if no estimateId, insert a new blank entry
    if (!estimateId && (!name || !phone || !email)) {
      const result = await db.collection("formSubmissions").insertOne({
        name: null,
        phone: null,
        email: null,
        quote,
        total,
        createdAt: new Date(),
      });

      return res.status(200).json({ message: "Blank estimate stored", estimateId: result.insertedId });
    }

    // Case 2: if estimateId is present & name, email, phone filled → update
    if (estimateId && name && phone && email) {
      await db.collection("formSubmissions").updateOne(
        { _id: new ObjectId(estimateId) },
        {
          $set: {
            name,
            phone,
            email,
            quote,
            total,
            updatedAt: new Date(),
          },
        }
      );

      // Generate PDF
      const pdfStream = await renderToStream(<QuotationPDF costItems={quote} total={total} />);
      const chunks = [];
      for await (const chunk of pdfStream) chunks.push(chunk);
      const pdfBuffer = Buffer.concat(chunks);

      // Send Email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: "aryankuril09@gmail.com",
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

      return res.status(200).json({ message: "Form updated and email sent!", estimateId });
    }

    return res.status(400).json({ message: "Invalid submission" });

  } catch (err) {
    console.error("❌ Server Error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
