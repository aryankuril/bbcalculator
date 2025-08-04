// File: pages/api/users.js
// This API route handles fetching, deleting, and updating users.

// import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';
import clientPromiseUntyped from '../../lib/mongodb';

const clientPromise = clientPromiseUntyped;

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test');
  const collection = db.collection('users');

  // GET: Fetch all users
  if (req.method === 'GET') {
    try {
      const users = await collection.find({}).toArray();
      const formattedUsers = users.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        signupDate: user.signupDate || new Date().toLocaleDateString(),
        role: user.role || 'user',
      }));
      return res.status(200).json(formattedUsers);
    } catch (error) {
      console.error('[GET /api/users] Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // DELETE: Delete a specific user by ID
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid "id" parameter' });
    }

    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(`[DELETE /api/users] Error:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  // PATCH: Update a user's role by ID
  if (req.method === 'PATCH') {
    const { id } = req.query;
    const { role } = req.body;

    if (!id || typeof id !== 'string' || !role) {
      return res.status(400).json({ message: 'Missing or invalid "id" or "role" parameter' });
    }

    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { role } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
      console.error(`[PATCH /api/users] Error:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
