// pages/api/get-questions.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import clientPromiseUntyped from '../../lib/mongodb';
// /
const clientPromise = clientPromiseUntyped as Promise<MongoClient>;
type Question = {
  question: string;
  options: string[];
  answer: string;
};

type DataResponse = {
  questions: Question[];
};

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const dept = req.query.dept;

  if (!dept || typeof dept !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid "dept" parameter' });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db = client.db('test');
    const collection = db.collection('questions'); 

    // Match document where "name" field equals dept (case-insensitive)
    const result = await collection.findOne({
      name: { $regex: new RegExp(`^${dept.trim()}$`, 'i') }
    });

    const questions = result?.questions || [];

    return res.status(200).json({ questions });
  } catch (error) {
    console.error('[GET /api/get-questions] Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
