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
  type: String,
  options: [OptionSchema],
  isDependent: { type: Boolean, default: false },  // ✅ new
  dependsOnQuestionIndex: Number,                  // ✅ new
  dependsOnOptionIndex: Number,
  order: { type: Number, default: 0 } ,                 // ✅ new
});


const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  questions: [QuestionSchema],
  includedItems: [String],
  dateCreated: { type: Date, default: Date.now },   // Add this
});


export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);