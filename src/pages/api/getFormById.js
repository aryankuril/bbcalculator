import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { id } = req.query;

  if (!id) return res.status(400).json({ message: "Missing id" });

  try {
    const client = await clientPromise;
    const db = client.db("test");

    const form = await db.collection("formSubmissions").findOne({ _id: new ObjectId(id) });
    if (!form) return res.status(404).json({ message: "Form not found" });

    res.status(200).json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
