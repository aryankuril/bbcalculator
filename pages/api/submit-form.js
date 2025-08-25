// pages/api/submitForm.js (or wherever your handler is)

import clientPromise from "../../lib/mongodb";
import nodemailer from "nodemailer";
import { renderToStream } from "@react-pdf/renderer";
// import QuotationPDF from "../../lib/QuotationPDF";
import quotationTableHTML from "../../lib/quotationTableHTML";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, phone, email, quote, total, estimateId, serviceCalculator, finalPrice } = req.body;

  if (!quote || !total) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("test");

    // Case 1: Blank estimate
    if (!estimateId && (!name || !phone || !email)) {
      const result = await db.collection("formSubmissions").insertOne({
        name: null,
        phone: null,
        email: null,
        quote,
        total,
        serviceCalculator,
        finalPrice,
        createdAt: new Date(),
      });

      return res.status(200).json({ message: "Blank estimate stored", estimateId: result.insertedId });
    }

    // Case 2: Update existing estimate
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
            serviceCalculator,
            finalPrice,
            updatedAt: new Date(),
          },
        }
      );

      // Generate PDF
      // const pdfStream = await renderToStream(<QuotationPDF costItems={quote} total={total} />);
      // const chunks = [];
      // for await (const chunk of pdfStream) chunks.push(chunk);
      // const pdfBuffer = Buffer.concat(chunks);

      // Send Email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,          // sender (your account)
        to: "aryankuril09@gmail.com",          // admin inbox
        replyTo: email,                        // 👈 when admin replies, it goes to user
        subject: "New Inquiry - " + serviceCalculator,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service:</strong> ${serviceCalculator}</p>
          <p><strong>Final Price:</strong> ₹${Number(finalPrice).toLocaleString("en-IN")}</p>
          ${quotationTableHTML(quote, total)}
         
        `,
      });

      return res.status(200).json({ message: "Form updated and email sent!", estimateId });
    }

    return res.status(400).json({ message: "Invalid submission" });

  } catch (err) {
    console.error("❌ Server Error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
