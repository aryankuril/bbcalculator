// File: pages/api/forms.js
// This API route handles fetching form submission data.

// import { MongoClient } from 'mongodb';
import clientPromiseUntyped from '../../../lib/mongodb';

const clientPromise = clientPromiseUntyped;

export default async function handler(req, res) {
  // We only support the GET method for fetching data.
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('test');
    // Ensure the collection name matches the one in submit-form.js
    const collection = db.collection('formSubmissions');

    // Find all documents in the 'form-submissions' collection.
    const forms = await collection.find({}).toArray();

    return res.status(200).json(forms);
  } catch (error) {
    console.error('[GET /api/forms] Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
