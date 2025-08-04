import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromiseUntyped from '../../lib/mongodb';
import { MongoClient } from 'mongodb';

const clientPromise = clientPromiseUntyped as Promise<MongoClient>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, questions, includedItems } = req.body;

  // Added a check for required fields to make the API more robust
  if (!name || !questions) {
    return res.status(400).json({ message: 'Missing required fields: name, questions' });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db = client.db('test');
    const collection = db.collection('questions');

    // This single operation will either:
    // 1. Find a document with a matching 'name' and update its questions and includedItems fields.
    // 2. If no document is found, it will create a new one with the provided data.
    await collection.updateOne(
      { name },
      { $set: { questions, includedItems } },
      { upsert: true }
    );

    // The logic to check for an existing department and then insert is now
    // redundant and has been removed because `upsert: true` handles it automatically.
    res.status(200).json({ message: 'Department and questions saved successfully' });
  } catch (error) {
    console.error('Error saving department:', error);
    res.status(500).json({ message: 'Error saving department' });
  }
}