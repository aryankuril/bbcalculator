'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Option = {
  icon: string;
  title: string;
  subtitle: string;
  price: string;
};

type Question = {
  questionText: string;
  questionIcon: string;
  questionSubText: string;
  type: string; // <-- NEW FIELD
  options: Option[];
};

export default function AdminPage() {
  const router = useRouter();

  // Access control
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("Access denied: Admins only");
      router.push("/login");
    }
  }, []);

  const [departments, setDepartments] = useState<string[]>([]);
  const [newDept, setNewDept] = useState('');
  const [formState, setFormState] = useState<Record<string, Question[]>>({});

  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [lastSavedDept, setLastSavedDept] = useState<string | null>(null);

  const [questionForm, setQuestionForm] = useState({
    text: '',
    icon: '',
    subText: '',
    type: '', // <-- NEW FIELD
  });

  const [option, setOption] = useState({
    icon: '',
    title: '',
    subtitle: '',
    price: '',
  });

  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);


  // 🔁 Auto-save to MongoDB
  const autoSaveToMongo = async (selectedDept: string) => {
    try {
      const res = await fetch("/api/save-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedDept,
          questions: formState[selectedDept]
        }),
      });

      if (!res.ok) {
        console.error("❌ Failed to auto-save:", await res.text());
      } else {
        console.log("✅ Auto-save successful");
      }
    } catch (error) {
      console.error("❌ Auto-save error:", error);
    }
  };

// Input handler: allows only lowercase letters
const handleDeptInput = (e: { target: { value: any; }; }) => {
  const value = e.target.value;

  // Check if user typed any invalid character
  if (/[^a-z]/.test(value)) {
    alert('Only lowercase letters (a–z) are allowed. No spaces, numbers, or special characters.');
  }

  // Remove all invalid characters and keep only lowercase letters
  const onlySmallLetters = value.replace(/[^a-z]/g, '');
  setNewDept(onlySmallLetters);
};

// Add department handler
const handleAddDepartment = () => {
  if (!newDept) return;

  const deptExists = departments.includes(newDept);

  if (deptExists) {
    alert(`Department "${newDept}" already exists.`);
    return;
  }

  const updatedForm = { ...formState, [newDept]: [] };
  setDepartments([...departments, newDept]);
  setFormState(updatedForm);
  setNewDept('');
  setSelectedDept(newDept);

  autoSaveToMongo(newDept); // 🔁 auto-save
};



const handleAddOrUpdateQuestion = () => {
  if (
    !selectedDept ||
    !questionForm.text.trim() ||
    !questionForm.type.trim()
  ) {
    alert('Please fill in both the Main Question and Type fields.');
    return;
  }

  setFormState(prev => {
    const updatedQuestions = [...(prev[selectedDept] || [])];

    const newQuestion: Question = {
      questionText: questionForm.text,
      questionIcon: questionForm.icon,
      questionSubText: questionForm.subText,
      type: questionForm.type, // required
      options:
        editingQuestionIndex !== null
          ? updatedQuestions[editingQuestionIndex]?.options || []
          : [],
    };

    if (editingQuestionIndex !== null) {
      updatedQuestions[editingQuestionIndex] = newQuestion;
    } else {
      updatedQuestions.push(newQuestion);
    }

    return {
      ...prev,
      [selectedDept]: updatedQuestions,
    };
  });

  setLastSavedDept(selectedDept); // ✅ trigger auto-save via effect
  setEditingQuestionIndex(null);
  setQuestionForm({ text: '', icon: '', subText: '', type: '' });
};


const handleAddOrUpdateOption = (questionIndex: number) => {
  if (!selectedDept) return;

  // Validation checks
  if (!option.title.trim()) {
    alert("Title is required.");
    return;
  }

  if (!option.price.trim()) {
    alert("Price is required.");
    return;
  }

  if (isNaN(Number(option.price))) {
    alert("Price must be a valid number.");
    return;
  }

  const updatedQuestions = [...formState[selectedDept]];
  const options = [...updatedQuestions[questionIndex].options];

  if (editingOptionIndex !== null) {
    options[editingOptionIndex] = option;
    setEditingOptionIndex(null);
  } else {
    options.push({ ...option });
  }

  updatedQuestions[questionIndex].options = options;

  const updatedForm = {
    ...formState,
    [selectedDept]: updatedQuestions,
  };

  setFormState(updatedForm);
  autoSaveToMongo(selectedDept);

  setOption({ icon: '', title: '', subtitle: '', price: '' });
};


  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem('formState');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormState(parsed);
      setDepartments(Object.keys(parsed));
      setSelectedDept(Object.keys(parsed)[0] || null);
    }
  }, []);

  useEffect(() => {
    if (lastSavedDept) {
      autoSaveToMongo(lastSavedDept);
      setLastSavedDept(null); // reset trigger
    }
  }, [formState, lastSavedDept]); // Add lastSavedDept to dependencies

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 mt-6 md:mt-auto"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

        {/* Department Creation */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Add new department"
            value={newDept}
              onChange={handleDeptInput}
            className="border p-2 rounded w-full sm:w-auto"
          />
          <button
            onClick={handleAddDepartment}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Add Department
          </button>
        </div>

        {/* Department Preview Link */}
    {selectedDept && (
  <button
    onClick={() => window.open(`/${selectedDept}`, '_blank')}
    className="text-purple-600 underline mb-6"
  >
    🔍 Preview {selectedDept}
  </button>
)}


        {/* Question Builder */}
        {selectedDept && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {selectedDept} – Questions
            </h2>

            {/* Question Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setQuestionForm(prev => ({ ...prev, icon: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="border p-2 rounded"
              />

              <input
                placeholder="Main Question"
                value={questionForm.text}
                 required
                onChange={(e) =>
                  setQuestionForm(prev => ({ ...prev, text: e.target.value }))
                }
                className="border p-2 rounded"
              />
              <input
                placeholder="Sub Question Text"
                value={questionForm.subText}
                onChange={(e) =>
                  setQuestionForm(prev => ({ ...prev, subText: e.target.value }))
                }
                className="border p-2 rounded"
              />
              <input
                placeholder="Type (e.g., 'Development Cost')" // <-- NEW INPUT
                value={questionForm.type}
                 required
                onChange={(e) =>
                  setQuestionForm(prev => ({ ...prev, type: e.target.value }))
                }
                className="border p-2 rounded"
              />
            </div>

            <button
              onClick={handleAddOrUpdateQuestion}
              className="bg-green-600 text-white px-4 py-2 rounded mb-6"
            >
              {editingQuestionIndex !== null ? 'Save Question' : 'Add Question'}
            </button>

            {/* Questions Display */}
            {formState[selectedDept]?.map((q, qIndex) => (
              <div key={qIndex} className="mb-6 p-4 border rounded bg-gray-50 relative">
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-lg"
                    onClick={() => {
                      setQuestionForm({
                        text: q.questionText,
                        icon: q.questionIcon,
                        subText: q.questionSubText,
                        type: q.type, // <-- Pass type to form for editing
                      });
                      setEditingQuestionIndex(qIndex);
                    }}
                  >
                    Edit ✏️
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 text-lg"
                    onClick={() => {
                      const updated = formState[selectedDept].filter((_, i) => i !== qIndex);
                      setFormState(prev => ({
                        ...prev,
                        [selectedDept]: updated,
                      }));
                      setLastSavedDept(selectedDept); // ✅ trigger save via useEffect
                    }}
                  >
                    Delete 🗑️
                  </button>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  {q.questionIcon?.startsWith("data:image") ? (
                    <img
                      src={q.questionIcon}
                      alt="icon"
                      className="w-10 h-10 object-contain rounded"
                    />
                  ) : (
                    <span className="text-3xl">{q.questionIcon}</span>
                  )}
                  <div>
                    <h3 className="text-lg font-bold">{q.questionText}</h3>
                    <p className="text-gray-600">{q.questionSubText}</p>
                    <p className="text-gray-600 font-semibold">Type: {q.type}</p>
                  </div>
                </div>

                {/* Option Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setOption({ ...option, icon: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="border p-2 rounded"
                  />
                  <input
                    placeholder="Title"
                    value={option.title}
                    onChange={(e) => setOption({ ...option, title: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    placeholder="Subtitle"
                    value={option.subtitle}
                    onChange={(e) => setOption({ ...option, subtitle: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    placeholder="Price"
                    value={option.price}
                    onChange={(e) => setOption({ ...option, price: e.target.value })}
                    className="border p-2 rounded"
                  />
                </div>

                <button
                  onClick={() => handleAddOrUpdateOption(qIndex)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingOptionIndex !== null ? 'Save Option' : 'Add Option'}
                </button>

                {/* Option Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {q.options.map((opt, idx) => (
                    <div key={idx} className="relative border p-4 rounded shadow bg-white">
                      <div className="absolute top-5 right-2 flex flex-col items-end gap-1">
                        <button
                          className="text-blue-600 text-sm "
                          onClick={() => {
                            setOption(opt);
                            setEditingOptionIndex(idx);
                          }}
                        >
                          Edit ✏️
                        </button>
                        <button
                          className="text-red-600 text-sm "
                          onClick={() => {
                            const updatedOptions = q.options.filter((_, i) => i !== idx);
                            const updatedQuestions = [...formState[selectedDept]];
                            updatedQuestions[qIndex].options = updatedOptions;
                            const updatedForm = { ...formState, [selectedDept]: updatedQuestions };
                            setFormState(updatedForm);
                            setLastSavedDept(selectedDept); // trigger useEffect save
                          }}
                        >
                          Delete 🗑️
                        </button>
                      </div>
                      <div className="flex items-start gap-2 ">
                        {opt.icon?.startsWith("data:image") ? (
                          <img
                            src={opt.icon}
                            alt="icon"
                            className="w-10 h-10 object-contain rounded"
                          />
                        ) : (
                          <span className="text-3xl">{opt.icon}</span>
                        )}
                        <div>
                          <h4 className="text-lg font-semibold">{opt.title}</h4>
                          <p className="text-gray-600">{opt.subtitle}</p>
                        </div>
                      </div>
                      <div className="text-right text-green-600 font-bold mt-4">
                        ₹{opt.price}
                      </div>
                    </div>
                  ))}
                </div>
                
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}