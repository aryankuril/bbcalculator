// File: pages/api/questions.js
// This API route handles fetching, deleting, and editing questions/routes.

// import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';
import clientPromiseUntyped from '../../lib/mongodb';

const clientPromise = clientPromiseUntyped;

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');
  const collection = db.collection('questions');

  // GET: Fetch all questions/routes
  if (req.method === 'GET') {
    try {
      const allRoutes = await collection.find({}).toArray();
      const formattedRoutes = allRoutes.map(route => ({
        id: route._id.toString(),
        name: route.name,
      }));
      return res.status(200).json(formattedRoutes);
    } catch (error) {
      console.error('[GET /api/questions] Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // DELETE: Delete a specific route by ID
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid "id" parameter' });
    }

    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Route not found' });
      }
      return res.status(200).json({ message: 'Route deleted successfully' });
    } catch (error) {
      console.error(`[DELETE /api/questions] Error:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // PUT: Update a route
  if (req.method === 'PUT') {
    return res.status(200).json({ message: 'Route update functionality not yet implemented' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
