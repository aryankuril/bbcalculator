// models/Department.ts
import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  icon: String,
  title: String,
  subtitle: String,
  price: Number,
});

const QuestionSchema = new mongoose.Schema({
  questionText: String,
  questionIcon: String,
  questionSubText: String,
  type: String, // <-- NEW FIELD
  options: [OptionSchema],
});

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  questions: [QuestionSchema],
  includedItems: [String], // ✅ New Field
});


export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);