import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  icon: String,
  title: String,
  subtitle: String,
  price: String,
});

const QuestionSchema = new mongoose.Schema({
  questionText: String,
  questionIcon: String,
  questionSubText: String,
  options: [OptionSchema],
});

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  questions: [QuestionSchema],
});

export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
