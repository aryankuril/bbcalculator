
import quotationTableHTML from '../../lib/quotationTableHTML';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, phone, email, quote, total, estimateId, serviceCalculator, finalPrice } = req.body;

  console.log('📥 Request body:', req.body);

  // Validate inputs
  if (
    typeof email !== 'string' ||
    !Array.isArray(quote) ||
    quote.length === 0 ||
    typeof total !== 'number' ||
    isNaN(total) ||
    typeof serviceCalculator !== 'string'
  ) {
    return res.status(400).json({
      success: false,
      message: 'Missing or invalid email, quote, total, or serviceCalculator',
      received: { email, quote, total, serviceCalculator }
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db('test');

    // Case 1: Placeholder estimate (user just started)
    if (!estimateId) {
      const result = await db.collection('formSubmissions').insertOne({
        name: name || 'N/A',
        phone: phone || 'N/A',
        email: email || 'N/A',
        quote,
        total,
        serviceCalculator,
        finalPrice,
        createdAt: new Date(),
      });

      return res.status(200).json({
        message: 'Placeholder estimate stored',
        estimateId: result.insertedId,
      });
    }

    // Case 2: Update estimate and send email
    if (estimateId) {
      await db.collection('formSubmissions').updateOne(
        { _id: new ObjectId(estimateId) },
        {
          $set: {
            name: name || 'N/A',
            phone: phone || 'N/A',
            email: email || 'N/A',
            quote,
            total,
            serviceCalculator,
            finalPrice,
            updatedAt: new Date(),
          },
        }
      );

      const serviceNameTitle = serviceCalculator
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const payload = {
        app_id: process.env.ONESIGNAL_APP_ID,
        include_email_tokens: ['aryan@bombayblokes.com'],  // Admin's email
        email_subject: `New Inquiry - ${serviceNameTitle}`,
        email_body: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <p><strong>Name:</strong> ${name || 'N/A'}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Email:</strong> ${email || 'N/A'}</p>
            <p><strong>Service:</strong> ${serviceCalculator}</p>
            <p><strong>Final Price:</strong> ₹${Number(finalPrice).toLocaleString('en-IN')}</p>
            ${quotationTableHTML(quote, total)}
          </div>
        `,
        email_reply_to: email,
      };

      console.log('🌐 Sending OneSignal API request with payload:', payload);

      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${process.env.ONESIGNAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('✅ OneSignal API Response:', data);

      if (response.ok) {
        return res.status(200).json({ success: true, message: 'Form updated and email sent via OneSignal', data });
      } else {
        return res.status(response.status).json({ success: false, data });
      }
    }

    return res.status(400).json({ message: 'Invalid submission' });

  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
