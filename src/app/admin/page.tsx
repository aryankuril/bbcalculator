"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FormInput,
  FolderOpen,
  Users,
  LogOut,
  ExternalLink,
  Edit,
  Trash,
  ChevronDown,
   ChevronRight,
  Building,
   BarChart3,   // ✅ icon
} from 'lucide-react';

import { motion } from "framer-motion";
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area,  // ✅ add these
  XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

import { format } from "date-fns"; // install if not already



type DependentOn = {
  questionIndex: number;
  optionIndex: number;
};

type Question = {
  id: string;
  questionText: string;
  questionIcon: string;
  questionSubText: string;
  type: string;
  isDependent: boolean;
  dependentOn?: DependentOn[]; // now an array
  options: Option[];
};

type Option = {
  icon: string;
  title: string;
  subtitle: string;
  price: string;
};

type FormSubmission = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    // These fields are the ones you added to the database, so the frontend needs to know about them.
    serviceCalculator?: string; 
    finalPrice?: number; 
};

type QuestionsRoute = {
  link: string;
  id: string;
  name: string;
  dateCreated: string;
  questions: Question[]; // <-- all question objects for this route
  metaTitle?: string; // <-- add this line
};

type User = {
  id: string; // required to identify each user uniquely
  name: string;
  email: string;
  signupDate: string;
  role: string;
};

// Main AdminPanel component
const AdminPanel = () => {
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
const [metaTitles, setMetaTitles] = useState<Record<string, string>>({});

  const [usersData, setUsersData] = useState<User[]>([]);
// const [questionsData, setQuestionsData] = useState<QuestionData[]>([]);
const [formsData, setFormsData] = useState<FormSubmission[]>([]);
const [questionsData, setQuestionsData] = useState<QuestionsRoute[]>([]);

 const [questionForm, setQuestionForm] = useState<{
    text: string;
    icon: string;
    subText: string;
    type: string;
    isDependent: boolean;
    dependentOn?: DependentOn[];
  }>({
    text: '',
    icon: '',
    subText: '',
    type: '',
    isDependent: false,
    dependentOn: undefined,
  });

  const [option, setOption] = useState({
    icon: '',
    title: '',
    subtitle: '',
    price: '',
  });

 const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);
  const [selectedDependencyOptions, setSelectedDependencyOptions] = useState<number[]>([]);
  const [selectedDependencyQuestion, setSelectedDependencyQuestion] = useState<number | null>(null);
  const [showCalculators, setShowCalculators] = useState(false);
  const [activeTab, setActiveTab] = useState<'forms' | 'questions' | 'users' | 'departments' | 'dashboard'>('dashboard');
  
  // State for a custom modal to handle confirmations, etc.
  const [modal, setModal] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  
  // State to handle loading status
  const [isLoading, setIsLoading] = useState(false);

const [searchTerm, setSearchTerm] = useState("");
const [dateFilter, setDateFilter] = useState("");
const [serviceFilter, setServiceFilter] = useState("");

// 📌 Filtering logic
const filteredForms = formsData.filter((form) => {
  const nameMatch = form.name?.toLowerCase().includes(searchTerm.toLowerCase());

  // Date filter
  let dateMatch = true;
  if (dateFilter) {
    const formDate = new Date(form.createdAt);
    const now = new Date();
    const cutoff = new Date();

    if (dateFilter === "1y") cutoff.setFullYear(now.getFullYear() - 1);
    if (dateFilter === "6m") cutoff.setMonth(now.getMonth() - 6);
    if (dateFilter === "3m") cutoff.setMonth(now.getMonth() - 3);
    if (dateFilter === "1m") cutoff.setMonth(now.getMonth() - 1);
    if (dateFilter === "1w") cutoff.setDate(now.getDate() - 7);

    dateMatch = formDate >= cutoff;
  }

  // Service filter
  let serviceMatch = true;
  if (serviceFilter) {
    serviceMatch = form.serviceCalculator === serviceFilter;
  }

  return nameMatch && dateMatch && serviceMatch;
});




const handleEditRoute = (route: QuestionsRoute) => {
  setActiveTab('departments');
  setSelectedDept(route.name); // marks edit mode
  setNewDept(route.name);      // fills input with department name
  setFormState(prev => ({ ...prev, [route.name]: route.questions || [] }));
setMetaTitles(prev => ({ ...prev, [route.name]: route.metaTitle || "" }));

  setEditingQuestionIndex(null);
  setEditingOptionIndex(null);
  window.scrollTo(0, 0);
};




const handleDeleteQuestion = (dept: string, questionIndex: number) => {
  setFormState(prev => {
    const updated = [...prev[dept]];
    updated.splice(questionIndex, 1);
    return { ...prev, [dept]: updated };
  });
  setLastSavedDept(dept); // so autoSaveToMongo runs
};


  // A useEffect hook to fetch data from the backend when the activeTab changes
 useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response;
        if (activeTab === 'forms') {
          response = await fetch('/api/forms');
          if (!response.ok) throw new Error('Failed to fetch form data');
          const data = await response.json();
          const sortedData = data.sort((a: FormSubmission, b: FormSubmission) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setFormsData(sortedData);
          
        } else if (activeTab === 'questions') {
          response = await fetch('/api/questions');
          if (!response.ok) throw new Error('Failed to fetch questions data');
          const data = await response.json();
          const sortedData = data.sort((a: QuestionsRoute, b: QuestionsRoute) =>
            new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
          );
          setQuestionsData(sortedData);

        } else if (activeTab === 'users') {
          response = await fetch('/api/users');
          if (!response.ok) throw new Error('Failed to fetch user data');
          const data = await response.json();
          const sortedData = data.sort((a: User, b: User) =>
            new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime()
          );
          setUsersData(sortedData);
          
        } else if (activeTab === 'dashboard') {
          const [usersResponse, questionsResponse, formsResponse] = await Promise.all([
            fetch('/api/users'),
            fetch('/api/questions'),
            fetch('/api/forms')
          ]);

          const usersData = await usersResponse.json();
          const questionsData = await questionsResponse.json();
          const formsData = await formsResponse.json();
          
          // Apply sorting for all three datasets
          const sortedUsers = usersData.sort((a: User, b: User) =>
            new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime()
          );
          const sortedQuestions = questionsData.sort((a: QuestionsRoute, b: QuestionsRoute) =>
            new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
          );
          const sortedForms = formsData.sort((a: FormSubmission, b: FormSubmission) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setUsersData(sortedUsers);
          setQuestionsData(sortedQuestions);
          setFormsData(sortedForms);
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);


  const autoSaveToMongo = async (selectedDept: string , dateCreated:string ) => {
  const questions = formState[selectedDept];
  const metaTitle = metaTitles[selectedDept] || "";

  if (!selectedDept || !questions) {
    console.warn("Skipping auto-save - missing department or questions");
    return;
  }
  try {
    await fetch("/api/save-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: selectedDept,
        questions,
        metaTitle,
        dateCreated,
        isDraft: true,
      }),
    });
    // Handle success/failure as needed
  } catch (error) {
    console.error("Auto-save error:", error);
  }
};


  const handleDeptInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/[^a-z]/.test(value)) {
      alert('Only lowercase letters (a–z) are allowed. No spaces, numbers, or special characters.');
    }
    const onlySmallLetters = value.replace(/[^a-z]/g, '');
    setNewDept(onlySmallLetters);
  };

const handleAddDepartment = () => {
  if (!newDept) return;
  if (departments.includes(newDept)) {
    alert(`Department "${newDept}" already exists.`);
    return;
  }

  const now = new Date().toISOString();

  const newRoute = {
    link: '',
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    name: newDept,
    dateCreated: now,
    questions: [],
  };

  setQuestionsData(prev => [...prev, newRoute]);

  const updatedForm = { ...formState, [newDept]: [] };
  setDepartments([...departments, newDept]);
  setFormState(updatedForm);
  setNewDept('');
  setSelectedDept(newDept);

  // ✅ Call after updating formState so questions is not undefined
  autoSaveToMongo(newDept, now);
};




const handleAddOrUpdateQuestion = () => {
  if (!selectedDept || !questionForm.text.trim() || !questionForm.type.trim()) {
    alert('Please fill in both the Main Question and Type fields.');
    return;
  }

  if (questionForm.isDependent && 
      (selectedDependencyQuestion === null || selectedDependencyOptions.length === 0)) {
    alert('Please select a dependency question and at least one option.');
    return;
  }

  setFormState(prev => {
    const updatedQuestions = [...(prev[selectedDept] || [])];

    const newQuestion: Question = {
      questionText: questionForm.text,
      questionIcon: questionForm.icon,
      questionSubText: questionForm.subText,
      type: questionForm.type,
      isDependent: questionForm.isDependent,
      dependentOn: questionForm.isDependent
        ? selectedDependencyOptions.map(optIdx => ({
            questionIndex: selectedDependencyQuestion as number,
            optionIndex: optIdx,
          }))
        : undefined,
      options: editingQuestionIndex !== null
        ? updatedQuestions[editingQuestionIndex]?.options || []
        : [],
      id: ''
    };

    if (editingQuestionIndex !== null) {
      updatedQuestions[editingQuestionIndex] = newQuestion;
    } else {
      updatedQuestions.push(newQuestion);
    }

    return { ...prev, [selectedDept]: updatedQuestions };
  });

  setLastSavedDept(selectedDept);
  setEditingQuestionIndex(null);
  setQuestionForm({ text: '', icon: '', subText: '', type: '', isDependent: false, dependentOn: undefined });
  setSelectedDependencyQuestion(null);
  setSelectedDependencyOptions([]);
};


  const handleAddOrUpdateOption = (questionIndex: number) => {
    if (!selectedDept) return;
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
    const updatedForm = { ...formState, [selectedDept]: updatedQuestions };
    setFormState(updatedForm);
    autoSaveToMongo(selectedDept, new Date().toISOString());
    setOption({ icon: '', title: '', subtitle: '', price: '' });
  };

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
      autoSaveToMongo(lastSavedDept, new Date().toISOString());
      setLastSavedDept(null);
    }
  }, [formState, lastSavedDept]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  
    interface CustomModalProps {
    message: string;
    onConfirm: () => void;
    onClose: () => void;
  }
   const CustomModal: React.FC<CustomModalProps> = ({ message, onConfirm, onClose }) => {
    return (
      <div  style={{ background: "linear-gradient(153deg, #EBEBEB 23.63%, #FFD54F 140.11%)" }} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75">
        <div className="bg-black p-8 rounded-xl shadow-lg border border-gray-700 w-full max-w-sm mx-4">
          <p className="text-white text-lg font-medium mb-6">{message}</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Custom alert to display messages to the user without using `alert()`
  const showAlert = (message: string, onConfirm = () => {}) => {
    setModal({
      isOpen: true,
      message,
      onConfirm: () => {
        onConfirm();
        setModal({ isOpen: false, message: '', onConfirm: () => {} });
      }
    });
  };

  // Handler for the logout button
  // const handleLogout = () => {
  //   showAlert('Are you sure you want to log out?', () => {
  //     // In a real app, you would clear the user session/token here
  //     console.log('User logged out.');
  //     // Redirect to login page or home page
  //   });
  // };

  // Handler for deleting a route/question
  const handleDeleteRoute = (id: string | number) => {
    showAlert(`Are you sure you want to delete route with ID: ${id}?`, async () => {
      console.log(`Attempting to delete route with ID: ${id}`);
      try {
        // Correctly passing the ID as a query parameter
        const response = await fetch(`/api/questions?id=${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete route');
        
        // After success, update the state to remove the item
        setQuestionsData(prev => prev.filter(q => q.id !== id));
      } catch (error) {
        console.error('Error deleting route:', error);
        showAlert('Failed to delete route. Please try again.');
      }
    });
  };
  

  // Handler for deleting a user
  const handleDeleteUser = (id: string | number) => {
    showAlert(`Are you sure you want to delete user with ID: ${id}?`, async () => {
      console.log(`Attempting to delete user with ID: ${id}`);
      try {
        // Correctly passing the ID as a query parameter
        const response = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete user');

        setUsersData(prev => prev.filter(u => u.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
        showAlert('Failed to delete user. Please try again.');
      }
    });
  };

  // Handler for changing a user's role
  const handleRoleChange = (id: string | number, newRole: string) => {
    showAlert(`Are you sure you want to change user role to '${newRole}' for user with ID: ${id}?`, async () => {
      console.log(`Attempting to change role for user ${id} to ${newRole}`);
      try {
        // Correctly passing the ID as a query parameter
        const response = await fetch(`/api/users?id=${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        });
        if (!response.ok) throw new Error('Failed to update user role');
        
        setUsersData(prevData => 
          prevData.map(user => 
            user.id === id ? { ...user, role: newRole } : user
          )
        );
      } catch (error) {
        console.error('Error changing user role:', error);
        showAlert('Failed to update user role. Please try again.');
      }
    });
  };




  return (
  <div className="flex min-h-screen text-gray-900 font-sans antialiased"
     style={{ background: "linear-gradient(153deg, #EBEBEB 23.63%, #FFD54F 140.11%)" }}>
  {modal.isOpen && (
    <CustomModal
      message={modal.message}
      onConfirm={modal.onConfirm}
      onClose={() => setModal({ ...modal, isOpen: false })}
    />
  )}

  {/* Logout Button */}
<button
  onClick={handleLogout}
  className="absolute top-4 right-6 rounded-[5px] bg-[#262626] shadow-[2px_2px_0px_0px_#F9B31B] 
             flex justify-center items-center gap-[10px] px-[30px] py-[10px] 
             text-[#F9B31B] font-semibold transition-colors w-full sm:w-auto"
>
  <LogOut size={18} />
  Logout
</button>


       

      {/* Sidebar */}
       <aside className="w-full md:w-64 bg-black text-white p-6 flex flex-col justify-between rounded-r-2xl shadow-xl">
      <div>
        <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD54F] to-[#EBEBEB]">
            Admin Panel
          </h2>

        <nav className="flex flex-col gap-2">
          {/* Dashboard */} 
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 py-3 px-2 rounded-lg font-semibold transition-colors ${
              activeTab === "dashboard"
                ? "bg-gray-800 text-[#F9B31B] "
                : "hover:bg-gray-800"
            }`}
          >
            <BarChart3 size={20} />
            Dashboard
          </button>

          {/* Form Submissions */}
          <button
            onClick={() => setActiveTab("forms")}
            className={`flex items-center gap-3 py-3 px-2 rounded-lg font-semibold transition-colors ${
              activeTab === "forms"
                ? "bg-gray-800 text-[#F9B31B]"
                : "hover:bg-gray-800"
            }`}
          >
            <FormInput size={20} />
            Manage Submissions
          </button>

          {/* Manage Calculators (Dropdown) */}
          <div>
            <button
              onClick={() => setShowCalculators(!showCalculators)}
              className="flex items-center justify-between gap-3 py-3 px-2 w-full rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              <span className="flex items-center gap-3">
                
              {showCalculators ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                Manage Calculators
              </span>
            </button>

            {showCalculators && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                <button
                  onClick={() => setActiveTab("questions")}
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "questions"
                      ? "bg-gray-800 text-[#F9B31B]"
                      : "hover:bg-gray-800"
                  }`}
                >
                    <FolderOpen size={20} />
                  All Calculators
                </button>

                <button
                  onClick={() => setActiveTab("departments")}
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "departments"
                      ? "bg-gray-800 text-[#F9B31B]"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <Building size={20} />
                  Services
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-3">
        {/* BB Users */}
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-3 py-3 px-4 rounded-lg font-semibold transition-colors ${
            activeTab === "users"
              ? "bg-gray-800 text-[#F9B31B] "
              : "hover:bg-gray-800"
          }`}
        >
          <Users size={20} />
          BB Users
        </button>

      </div>
    </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-auto">
        {/* Title for the current section */}
        <h1 className="text-4xl font-bold mb-8">
          {activeTab === 'dashboard' && 'Dashbord'}
          {activeTab === 'forms' && 'Form Submissions'}
          {activeTab === 'questions' && 'All Calculators'}
          {activeTab === 'users' && 'User Management'}
          {activeTab === 'departments' && 'Services Builder'}
        </h1>
         
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500 border-opacity-25"></div>
            <p className="ml-4 text-xl text-blue-400">Loading data...</p>
          </div>
        )}


      
        {/* Conditional Rendering for Tables */}




{!isLoading && activeTab === 'forms' && (
  <div className="bg-[#ffffff] p-2 rounded-2xl shadow-lg">
    {formsData.length > 0 ? (
      <div>
        {/* 🔎 Search + Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          {/* Search Field */}
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#262626]"
          />

          {/* Filters */}
          <div className="flex gap-3">
            {/* Filter by Date */}
            <select
  value={dateFilter}
  onChange={(e) => setDateFilter(e.target.value)}
  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#262626]"
>
  <option value="" disabled hidden>
    Filter by Date
  </option>
  <option value="1y">All</option>
  <option value="1y">Last 1 Year</option>
  <option value="6m">Last 6 Months</option>
  <option value="3m">Last 3 Months</option>
  <option value="1m">Last 1 Month</option>
  <option value="1w">Last 1 Week</option>
</select>


            {/* Filter by Service */}
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#262626]"
            >
              <option value="" disabled hidden>
    Filter by Date
  </option>
              {[...new Set(formsData.map((form) => form.serviceCalculator))].map(
                (service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* 📌 Table or No User Found */}
        {filteredForms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-center">
              <thead className="border-b bg-[#ffffff] text-[#1D1D1B]">
                <tr>
                  <th className="py-3 px-4">SR No.</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Final Price</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="bg-[#fcfcf9] text-[#000]">
                {filteredForms.map((form, index) => (
                  <tr
                    key={form._id}
                    className="border-b border-gray-800 last:border-b-0"
                  >
                    <td className="py-4 px-4">{index + 1}</td>
                    <td className="py-4 px-4">
                      {format(new Date(form.createdAt), "dd/MM/yyyy")}
                    </td>
                    <td className="py-4 px-4 capitalize">
                      {form.name || "N/A"}
                    </td>
                    <td className="py-4 px-4 capitalize">
                      {form.serviceCalculator || "N/A"}
                    </td>
                    <td className="py-4 px-4">
                      {form.finalPrice
                        ? `₹${form.finalPrice.toLocaleString("en-IN")}`
                        : "N/A"}
                    </td>
                    <td className="py-4 px-4">
                      <div>{form.email || "N/A"}</div>
                      <div>{form.phone || "N/A"}</div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() =>
                          window.open(`/admin/form-preview/${form._id}`, "_blank")
                        }
                        className="rounded-[5px] bg-[#262626] shadow-[2px_2px_0px_0px_#F9B31B] 
                                   flex justify-center items-center gap-[10px] px-[20px] py-[6px] 
                                   text-[#F9B31B] font-semibold transition-colors"
                      >
                        Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 font-medium">
            No user found with this name.
          </div>
        )}
      </div>
    ) : (
      <div className="text-center py-10 text-gray-400">
        <p>No form submissions found.</p>
      </div>
    )}
  </div>
)}






        {!isLoading && activeTab === 'questions' && ( 
          <div className="bg-[#ffffff] p-2 rounded-2xl shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead className="border-b bg-[#ffffff] text-[#1D1D1B]">
                  <tr>
                    <th className="py-3 px-4">SR No.</th>
                    <th className="py-3 px-4">Calculators Name</th>
                    <th className="py-3 px-4">Preview Link</th>
                    <th className="py-3 px-4">Date Created</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className=" bg-[#fcfcf9] text-[#000]">
            
  {questionsData.map((route, idx) => (
    
    <React.Fragment key={route.id}>
      {/* Main route row */}
      <tr className="border-b border-gray-800 last:border-b-0">
        <td className="py-4 px-4 align-top">{idx + 1}</td>
        <td className="py-4 px-4 align-top">{route.name}</td>
        <td className="py-4 px-4 align-top">
          <a href={route.link || `/${route.name}`} target="_blank" rel="noopener noreferrer"
             className="text-[#F9B31B] flex items-center gap-2">
            {route.link || `${route.name}`}
             <ExternalLink size={16} />
          </a>
        </td>
<td className="py-4 px-4">
  {route.dateCreated
    ? format(new Date(route.dateCreated), 'dd/MM/yyyy')
    : "Unknown"}
</td>





        <td className="py-4 px-4 align-top text-center">
          <button
            onClick={() => handleEditRoute(route)}
            className=" text-[#F9B31B] px-3 py-1 rounded-lg  transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
                          onClick={() => handleDeleteRoute(route.id)}
                          className="p-2 rounded-lg text-red-400"
                          title="Delete"
                        >
                          <Trash size={18} />
                        </button>
        </td>
      </tr>
      {/* Expanded row for questions (single cell spanning all columns) */}
      <tr>

      </tr>
    </React.Fragment>
  ))}


                </tbody>
              </table>
            </div>
          </div>
        )}

  {!isLoading && activeTab === 'dashboard' && (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="grid grid-cols-1 md:grid-cols-2 gap-8"
  >
    {/* Users Growth (Bar Chart now, Top Left) */}
    <div className="bg-[#ffffff] p-2  rounded-2xl shadow-lg  text-black">
  <h2 className="text-xl font-semibold mb-4 ml-5">User Signups</h2>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={usersData.map(u => ({
        name: u.name,
        signups: 1
      }))}
    >
      <XAxis dataKey="name" hide />
      <YAxis stroke="black" /> {/* light gray axis */}
      <Tooltip
        contentStyle={{
          backgroundColor: "#1D1D1B", // dark tooltip background
          border: "none",
          borderRadius: "0.5rem",
          color: "#fff"
        }}
        itemStyle={{ color: "#fff" }} // tooltip text color
        cursor={{ fill: "rgba(255,255,255,0.1)" }} // soft hover cursor
      />
      <Legend wrapperStyle={{ color: "#fff" }} />
      <Bar dataKey="signups" fill="#3b82f6" radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>


    {/* Routes Distribution (Top Right) */}
   <div className="bg-[#ffffff] p-2 rounded-2xl shadow-lg text-black">
  <h2 className="text-xl font-semibold mb-4 ml-5">Calculators Overview</h2>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={questionsData.map((q) => ({
          name: q.name,
          value: q.questions.length,
        }))}
        dataKey="value"
        outerRadius={100}
        fill="#3b82f6"
        label
      >
        {questionsData.map((_, index) => (
          <Cell
            key={index}
            fill={[
              "#3b82f6", "#22c55e", "#eab308", "#ef4444", "#8b5cf6",
              "#ec4899", "#14b8a6", "#f97316", "#0ea5e9", "#84cc16",
              "#f43f5e", "#6366f1", "#06b6d4", "#d946ef", "#f59e0b",
              "#10b981", "#4b5563", "#71717a", "#a855f7", "#f87171"
            ][index % 20]}
          />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{
          backgroundColor: "#1D1D1B", // dark tooltip background
          border: "none",
          borderRadius: "0.5rem",
          color: "#fff",
        }}
        itemStyle={{ color: "#fff" }} // tooltip text color
        cursor={{ fill: "rgba(255,255,255,0.1)" }} // soft hover cursor
      />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>

 
    {/* Form Submissions (Bottom, Full Width, Area Chart) */}
 {/* Form Submissions (Bottom, Full Width, Area Chart) */}
<div className=" text-black bg-[#ffffff] p-2 rounded-2xl shadow-lg  col-span-1 md:col-span-2">
  <h2 className="text-xl font-semibold mb-4 ml-5">Form Submissions</h2>
  <ResponsiveContainer width="100%" height={300}>
<AreaChart
  data={Object.values(
    formsData.reduce((acc: Record<string, { name: string; submissions: number }>, f) => {
      const date = format(new Date(f.createdAt), "MMM dd"); // e.g., "Aug 18"
      if (!acc[date]) {
        acc[date] = { name: date, submissions: 0 };
      }
      acc[date].submissions += 1; // count submissions for that date
      return acc;
    }, {})
  )}
>

      
      <defs>
        <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis dataKey="name" stroke="black" />
       <YAxis stroke="black" />
     <Tooltip
        contentStyle={{
          backgroundColor: "#1D1D1B", // dark tooltip background
          border: "none",
          borderRadius: "0.5rem",
          color: "#fff"
        }}
        itemStyle={{ color: "#fff" }} // tooltip text color
        cursor={{ fill: "rgba(255,255,255,0.1)" }} // soft hover cursor
      />
      <Area
        type="monotone"
        dataKey="submissions"
        stroke="#3b82f6"
        strokeWidth={2}
        fillOpacity={1}
        fill="url(#colorSubmissions)"
      />
    </AreaChart>
  </ResponsiveContainer>
</div>

  </motion.div>
)}



        {!isLoading && activeTab === 'users' && (
          <div className="bg-[#ffffff] p-2 rounded-2xl shadow-lg borde">
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead className=" border-b bg-[#ffffff] text-[#1D1D1B]">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Signed Up</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead >
                <tbody className=" bg-[#fcfcf9] text-[#000]">
                  {usersData.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800 last:border-b-0">
                      <td className="py-4 px-4">{user.name}</td>
                      <td className="py-4 px-4">{user.email}</td>
                      <td className="py-4 px-4">
  {user.signupDate !== "Unknown" ? user.signupDate : "No Date Available"}
</td>

                      <td className="py-4 px-4">
                        <div className="relative inline-block text-left">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-black text-white rounded-md pl-3 pr-8 py-2 appearance-none cursor-pointer"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-white" />
                        </div>
                      </td>
                      <td className="py-4 px-4 flex justify-center">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-900 transition-colors"
                          title="Delete User"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

       {!isLoading && activeTab === 'departments' && (
          <div className="bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-300">
            <h2 className="text-2xl font-semibold mb-4">Services Management</h2>
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Add or edit department"
                value={newDept}
                onChange={handleDeptInput}
                className="border border-gray-300 bg-white p-2 rounded-lg text-black w-full sm:w-auto focus:ring-2 focus:ring-[#FFD54F] focus:border-transparent"
              />
              {selectedDept ? (
                <button
                  onClick={() => {
                    if (!newDept.trim()) {
                      showAlert("Please enter a department name.");
                      return;
                    }
                    autoSaveToMongo(newDept, new Date().toISOString());
                    setSelectedDept(null);
                    setNewDept('');
                    showAlert("✅ Department updated successfully!");
                  }}
  className="rounded-[5px] bg-[#F9B31B] shadow-[2px_2px_0_0_#262626] flex justify-center items-center gap-[10px] px-[30px] py-[10px] text-[#262626] font-semibold transition-colors w-full sm:w-auto"
                >
                  Update Department
                </button>
              ) : (
                <button
  onClick={handleAddDepartment}
  className="rounded-[5px] bg-[#262626] shadow-[2px_2px_0px_0px_#F9B31B] flex justify-center items-center gap-[10px] px-[30px] py-[10px] text-[#F9B31B] font-semibold transition-colors w-full sm:w-auto"
>
  Add Department
</button>

              )}
            </div>

            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${selectedDept === dept ? 'bg-black text-[#FFD54F] shadow-[2px_2px_0px_0px_#262626]' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {selectedDept && (
              <div className="bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-gray-300">
                <div className="mb-6">
                  <label className="block text-black mb-2 font-semibold">
                    Meta Title for {selectedDept}
                  </label>
                  <input
                    type="text"
                    value={metaTitles[selectedDept] || ""}
                    onChange={e =>
                      setMetaTitles(prev => ({ ...prev, [selectedDept]: e.target.value }))
                    }
                    className="w-full p-2 rounded bg-white border border-gray-300 text-black"
                    placeholder="Enter SEO Page Title"
                  />
                  <button
  onClick={() => {
    if (!selectedDept) return;
    autoSaveToMongo(selectedDept, new Date().toISOString());
    showAlert("✅ Meta title saved successfully!");
  }}
  className={`mt-3 rounded-[5px] shadow-[2px_2px_0px_0px] flex justify-center items-center gap-[10px] px-[30px] py-[10px] font-semibold transition-colors w-full sm:w-auto
    ${
      metaTitles[selectedDept]
        ? "bg-[#F9B31B] shadow-[2px_2px_0px_0px_#262626] text-[#262626]"
        : "bg-[#262626] shadow-[2px_2px_0px_0px_#F9B31B] text-[#F9B31B]"
    }`}
>
  {metaTitles[selectedDept] ? "Update Meta Title" : "Add Meta Title"}
</button>

                </div>

                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold capitalize">{selectedDept} Questions</h2>
                  <a href={`/${selectedDept}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline flex items-center gap-2 hover:text-purple-800">
                    Preview Page <ExternalLink size={16} />
                  </a>
                </div>

                <div className="mb-8 p-4 bg-white rounded-lg border border-gray-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const result = reader.result;
                            setQuestionForm(prev => ({
                              ...prev,
                              icon: typeof result === "string" ? result : ""
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FFD54F] file:text-black hover:file:bg-yellow-400"
                    />

                    <input
                      type="text"
                      placeholder="Main Question"
                      value={questionForm.text}
                      required
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, text: e.target.value }))}
                      className="bg-white border border-gray-300 p-2 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Subtitle"
                      value={questionForm.subText}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, subText: e.target.value }))}
                      className="bg-white border border-gray-300 p-2 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Type of question that links to estimates page"
                      value={questionForm.type}
                      required
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, type: e.target.value }))}
                      className="bg-white border border-gray-300 p-2 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="dependency-type"
                        checked={!questionForm.isDependent}
                        onChange={() => {
                          setQuestionForm(prev => ({ ...prev, isDependent: false }));
                          setSelectedDependencyQuestion(null);
                          setSelectedDependencyOptions([]);
                        }}
                      />
                      <span>Independent Question</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="dependency-type"
                        checked={questionForm.isDependent}
                        onChange={() => setQuestionForm(prev => ({ ...prev, isDependent: true }))}
                      />
                      <span>Dependent Question</span>
                    </label>
                  </div>

                  {questionForm.isDependent && (
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <select
                        className="bg-white/50 backdrop-blur-md border border-gray-300 p-2 rounded-lg w-full text-black"
                        value={selectedDependencyQuestion ?? ''}
                        onChange={(e) => {
                          const index = parseInt(e.target.value);
                          setSelectedDependencyQuestion(index);
                          setSelectedDependencyOptions([]);
                        }}
                      >
                        <option value="">Select dependency question</option>
                        {formState[selectedDept]?.map((q, idx) => (
                          <option key={idx} value={idx}>{q.questionText}</option>
                        ))}
                      </select>
                      {selectedDependencyQuestion !== null && (
                        <select
                          multiple
                          className="bg-gray-200 border border-gray-300 p-2 rounded-lg w-full text-black"
                          value={selectedDependencyOptions.map(String)}
                          onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, opt => parseInt(opt.value));
                            setSelectedDependencyOptions(values);
                          }}
                        >
                          {formState[selectedDept]?.[selectedDependencyQuestion]?.options.map((opt, idx) => (
                            <option key={idx} value={idx}>{opt.title}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  <button
                   onClick={handleAddOrUpdateQuestion}
  className={`rounded-[5px] flex justify-center items-center gap-[10px] px-[30px] py-[10px] font-semibold transition-colors w-full sm:w-auto
    ${
      editingQuestionIndex !== null
        ? "bg-[#F9B31B] text-[#262626] shadow-[2px_2px_0_0_#262626]" // Update (Save)
        : "bg-[#262626] text-[#F9B31B] shadow-[2px_2px_0px_0px_#F9B31B]" // Add
    }`}
                  >
                    {editingQuestionIndex !== null ? 'Save Question' : 'Add Question'}
                  </button>
                </div>

                {formState[selectedDept]?.map((q, qIndex) => (
                  <div key={qIndex} className="mb-6 p-6 border border-gray-300  rounded-2xl bg-white/50 backdrop-blur-md relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        className="p-2 rounded-lg text-[#FFD54F] hover:bg-gray-300 transition-colors"
                        title="Edit Question"
                        onClick={() => {
                          setQuestionForm({
                            text: q.questionText,
                            icon: q.questionIcon,
                            subText: q.questionSubText,
                            type: q.type,
                            isDependent: q.isDependent,
                            dependentOn: q.dependentOn,
                          });
                          if (q.isDependent && Array.isArray(q.dependentOn) && q.dependentOn.length > 0) {
                            const qIdx = q.dependentOn[0].questionIndex;
                            setSelectedDependencyQuestion(qIdx);
                            setSelectedDependencyOptions(q.dependentOn.map(dep => dep.optionIndex));
                          } else {
                            setSelectedDependencyQuestion(null);
                            setSelectedDependencyOptions([]);
                          }
                          setEditingQuestionIndex(qIndex);
                        }}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-2 rounded-lg text-red-600 hover:bg-gray-300 transition-colors"
                        title="Delete Question"
                        onClick={() => {
                          showAlert('Are you sure you want to delete this question?', () => {
                            handleDeleteQuestion(selectedDept, qIndex);
                          });
                        }}
                      >
                        <Trash size={18} />
                      </button>
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                      {q.questionIcon && (
                        q.questionIcon?.startsWith("data:image") ? (
                          <img src={q.questionIcon} alt="icon" className="w-10 h-10 object-contain rounded-lg" />
                        ) : (
                          <span className="text-4xl">{q.questionIcon}</span>
                        )
                      )}
                      <div>
                        <h3 className="text-xl font-bold">Q{qIndex + 1}: {q.questionText}</h3>
                        <p className="text-gray-600">{q.questionSubText}</p>
                        <p className="text-gray-600 font-semibold text-sm">Type: {q.type}</p>
                        {q.isDependent && Array.isArray(q.dependentOn) && q.dependentOn.length > 0 && (
                          <p className="text-sm text-gray-500 mt-1">
                            Depends on Q{q.dependentOn[0].questionIndex + 1} — Option(s): {q.dependentOn.map(d => d.optionIndex + 1).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>

                    <hr className="border-gray-300 my-4" />

                    <div className="p-4 bg-white rounded-lg border border-gray-300 mb-4">
                      <h4 className="text-lg font-semibold mb-3">
                        {editingOptionIndex !== null ? 'Edit Option' : 'Add New Option'} for Q{qIndex + 1}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 mb-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const result = reader.result;
                                setOption(prev => ({
                                  ...prev,
                                  icon: typeof result === "string" ? result : ""
                                }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FFD54F] file:text-black hover:file:bg-yellow-400"
                        />
                        <input
                          type="text"
                          placeholder="Title"
                          value={option.title}
                          onChange={(e) => setOption({ ...option, title: e.target.value })}
                          className="bg-white border border-gray-300 p-2 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Subtitle"
                          value={option.subtitle}
                          onChange={(e) => setOption({ ...option, subtitle: e.target.value })}
                          className="bg-white border border-gray-300 p-2 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Price"
                          value={option.price}
                          onChange={(e) => setOption({ ...option, price: e.target.value })}
                          className="bg-white border border-gray-300 p-2 rounded-lg"
                        />
                      </div>
                      <button
                      onClick={() => handleAddOrUpdateOption(qIndex)}
  className={`rounded-[5px] flex justify-center items-center gap-[10px] px-[30px] py-[10px] font-semibold transition-colors w-full sm:w-auto
    ${
      editingOptionIndex !== null
        ? "bg-[#F9B31B] shadow-[2px_2px_0px_0px_#262626] text-[#262626]"
        : "bg-[#262626] shadow-[2px_2px_0px_0px_#F9B31B] text-[#F9B31B]"
    }`}
                      >
                        {editingOptionIndex !== null ? 'Save Option' : 'Add Option'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {q.options.map((opt, idx) => (
                        <div key={idx} className="relative p-4 rounded-xl shadow-md bg-white border border-gray-300">
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button
                              className="p-1 rounded-md text-[#FFD54F] hover:bg-gray-300 transition-colors"
                              title="Edit Option"
                              onClick={() => {
                                setOption(opt);
                                setEditingOptionIndex(idx);
                              }}
                            >
                              <Edit size={16} />
                            </button>
                             <button
  className="p-1 rounded-md text-red-400 hover:bg-gray-700 transition-colors"
  title="Delete Option"
  onClick={() => {
    showAlert('Are you sure you want to delete this option?', () => {
      // Remove option from local state
      const updatedOptions = q.options.filter((_, i) => i !== idx);
      const updatedQuestions = [...formState[selectedDept]];
      updatedQuestions[qIndex].options = updatedOptions;
      setFormState({ ...formState, [selectedDept]: updatedQuestions });

      // ✅ Save updated department data to backend
      autoSaveToMongo(selectedDept, new Date().toISOString());
    });
  }}
>
  <Trash size={16} />
</button>
                          </div>
                          {opt.icon && (
                            opt.icon.startsWith("data:image") ? (
                              <img src={opt.icon} alt="icon" className="w-12 h-12 object-contain rounded-lg mb-2" />
                            ) : (
                              <span className="text-4xl mb-2 block">{opt.icon}</span>
                            )
                          )}
                          <h5 className="font-semibold text-lg">{opt.title}</h5>
                          <p className="text-sm text-gray-500">{opt.subtitle}</p>
                          <p className="text-xl font-bold mt-2 text-[#FFD54F]">₹{opt.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
