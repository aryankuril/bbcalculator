// src/pages/api/save-question.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromiseUntyped from '../../lib/mongodb';
import { MongoClient } from 'mongodb';

const clientPromise = clientPromiseUntyped as Promise<MongoClient>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

const { name, questions, includedItems } = req.body;

  try {
    const client: MongoClient = await clientPromise;
    const db = client.db('test'); // replace with your DB name
    const collection = db.collection('questions'); // or whatever collection

        // ✅ Update or Insert the department
    await collection.updateOne(
      { name },
  { $set: { questions, includedItems } },
      { upsert: true } // <== this is the key line
    );


       const existing = await collection.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: 'Department already exists' });
    }





    await collection.insertOne({ name, questions });

    res.status(200).json({ message: 'Question saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving question' });
  }
}
