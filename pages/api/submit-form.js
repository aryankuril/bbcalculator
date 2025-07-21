import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, phone, email } = req.body;
  console.log("▶ API Hit");
  console.log("▶ Data received:", req.body);

  try {
    const client = await clientPromise;
    console.log("✅ Mongo Connected");

    const db = client.db("test"); // ✅ make sure "test" matches your MongoDB database name
    const result = await db.collection("formSubmissions").insertOne({
      name,
      phone,
      email,
      createdAt: new Date(),
    });

    console.log("✅ Data Inserted:", result.insertedId);
    res.status(200).json({ message: "Form submitted successfully!" });

  } catch (err) {
    console.error("❌ DB Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
