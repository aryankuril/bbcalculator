// // File: pages/api/submit-form.js
// // This API route handles saving form submission data.

// import { MongoClient } from 'mongodb';
// import clientPromiseUntyped from '../../lib/mongodb';

// const clientPromise = clientPromiseUntyped;

// export default async function handler(req, res) {
//   // We only support the POST method for submitting data.
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   // Ensure the request body contains data.
//   if (!req.body || Object.keys(req.body).length === 0) {
//     return res.status(400).json({ message: 'Request body cannot be empty' });
//   }

//   try {
//     const client = await clientPromise;
//     const db = client.db('test');
//     const collection = db.collection('formSubmissions');

//     // Insert the submitted data into the collection.
//     const result = await collection.insertOne({
//       ...req.body,
//       createdAt: new Date(), // Add a timestamp for when the form was submitted
//     });

//     // Return a success message with the inserted document's ID.
//     return res.status(201).json({ message: 'Form submission saved successfully', id: result.insertedId });
//   } catch (error) {
//     console.error('[POST /api/submit-form] Error:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// }
