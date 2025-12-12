import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, questions, includedItems, dateCreated, isDraft, metaTitle } = req.body;

  if (!isDraft && (!name || !questions)) {
    return res.status(400).json({ message: 'Missing required fields: name, questions' });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db = client.db('test');
    const collection = db.collection('questions');

    // ⭐ IMPORTANT: assign order if not present
    const orderedQuestions = questions.map((q: any, index: number) => ({
      ...q,
      order: q.order ?? index,       // preserve existing, else assign new
    }));

    const existingDoc = await collection.findOne({ name });

    if (!existingDoc) {
      // Create new department + questions
      await collection.insertOne({
        name,
        questions: orderedQuestions,
        includedItems,
        metaTitle: metaTitle || '',
        dateCreated: dateCreated ? new Date(dateCreated) : new Date(),
      });
    } else {
      // Update existing document
      await collection.updateOne(
        { name },
        {
          $set: {
            name,
            questions: orderedQuestions.sort((a: any, b: any) => a.order - b.order),
            includedItems,
            metaTitle: metaTitle || existingDoc.metaTitle || '',
          },
        }
      );
    }

    res.status(200).json({ message: 'Department and questions saved successfully' });
  } catch (error) {
    console.error('Error saving department:', error);
    res.status(500).json({ message: 'Error saving department' });
  }
}
