import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import clientPromise from "../../lib/mongodb";

// -----------------------------
// ⭐ Define Proper Types
// -----------------------------

type QuestionOption = {
  label: string;
  value: string | number | boolean;
};

type Question = {
  questionText: string;
  type: string;
  options?: QuestionOption[];
  order?: number; // optional because you add it later
};

type IncludedItem = {
  title: string;
  description?: string;
};

type RequestBody = {
  name: string;
  questions: Question[];
  includedItems?: IncludedItem[];
  dateCreated?: string;
  isDraft?: boolean;
  metaTitle?: string;
};

// -----------------------------
// ⭐ API Handler
// -----------------------------

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    name,
    questions,
    includedItems,
    dateCreated,
    isDraft,
    metaTitle,
  }: RequestBody = req.body;

  if (!isDraft && (!name || !questions)) {
    return res
      .status(400)
      .json({ message: "Missing required fields: name, questions" });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db = client.db("test");
    const collection = db.collection("questions");

    // ⭐ Assign order properly
    const orderedQuestions: Question[] = questions.map(
      (q: Question, index: number) => ({
        ...q,
        order: q.order ?? index,
      })
    );

    const existingDoc = await collection.findOne({ name });

    if (!existingDoc) {
      await collection.insertOne({
        name,
        questions: orderedQuestions,
        includedItems,
        metaTitle: metaTitle || "",
        dateCreated: dateCreated ? new Date(dateCreated) : new Date(),
      });
    } else {
      await collection.updateOne(
        { name },
        {
          $set: {
            name,
            questions: orderedQuestions.sort(
              (a, b) => (a.order ?? 0) - (b.order ?? 0)
            ),
            includedItems,
            metaTitle: metaTitle || existingDoc.metaTitle || "",
          },
        }
      );
    }

    res
      .status(200)
      .json({ message: "Department and questions saved successfully" });
  } catch (error) {
    console.error("Error saving department:", error);
    res.status(500).json({ message: "Error saving department" });
  }
}
