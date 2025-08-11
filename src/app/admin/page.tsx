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
  Building,
} from 'lucide-react';




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
};
type QuestionsRoute = {
  link: string;
  id: string;
  name: string;
  dateCreated: string;
  questions: Question[]; // <-- all question objects for this route
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
  const [ setSelectedDependencyOption] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'forms' | 'questions' | 'users' | 'departments'>('forms');
  // const [newDeptMeta, setNewDeptMeta] = useState('');
  // State to hold data for each section
 

  // State for a custom modal to handle confirmations, etc.
  const [modal, setModal] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  
  // State to handle loading status
  const [isLoading, setIsLoading] = useState(false);




const handleEditRoute = (route: QuestionsRoute) => {
  // Go to the "departments" tab and load the selected route's data into editing form
  setActiveTab('departments');
  setSelectedDept(route.name);

  // Populate the formState for editing from this route's questions
  setFormState(prev => ({
    ...prev,
    [route.name]: route.questions || []
  }));

  // Reset or clear editing indexes
  setEditingQuestionIndex(null);
  setEditingOptionIndex(null);

  // Optional: scroll to top or focus form
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
          // Fetch data from the new forms.js API route
          response = await fetch('/api/forms');
          if (!response.ok) throw new Error('Failed to fetch form data');
          const data = await response.json();
          setFormsData(data);
        } else if (activeTab === 'questions') {
          // Fetch data from the questions.js API route
          response = await fetch('/api/questions');
          if (!response.ok) throw new Error('Failed to fetch questions data');
          const data = await response.json();
          setQuestionsData(data);


          // setQuestionsData(formattedData);
        } else if (activeTab === 'users') {
          // Fetch data from the users.js API route
          response = await fetch('/api/users');
          if (!response.ok) throw new Error('Failed to fetch user data');
          const data = await response.json();
          setUsersData(data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // You might want to show an error message to the user here
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);


  const autoSaveToMongo = async (selectedDept: string , dateCreated:string ) => {
      const questions = formState[selectedDept];

  if (!selectedDept || !questions) {
    console.warn("⚠️ Skipping auto-save — missing department or questions");
    return;
  }
    try {
      const res = await fetch("/api/save-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
  name: selectedDept || null,
  questions: formState[selectedDept] || [],
  dateCreated,
  isDraft: true
})

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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 w-full max-w-sm mx-4">
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
  
// const handleEditRoute = (routeName: string) => {
//   setActiveTab('departments');
//   setSelectedDept(routeName);
//   setEditingQuestionIndex(null);
//   setEditingOptionIndex(null);
//   setQuestionForm({ text: '', icon: '', subText: '', type: '', isDependent: false, dependentOn: undefined });
//   setOption({ icon: '', title: '', subtitle: '', price: '' });
// };

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
     <div className="flex min-h-screen bg-gray-950 text-gray-100 font-sans antialiased">
      {modal.isOpen && (
        <CustomModal
          message={modal.message}
          onConfirm={modal.onConfirm}
          onClose={() => setModal({ ...modal, isOpen: false })}
        />
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col justify-between rounded-r-2xl shadow-xl">
        <div>
          <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Admin Panel
          </h2>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('forms')}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg font-semibold transition-colors ${activeTab === 'forms' ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800'}`}
            >
              <FormInput size={20} />
              Form Submissions
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg font-semibold transition-colors ${activeTab === 'questions' ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800'}`}
            >
              <FolderOpen size={20} />
              Questions/Routes
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg font-semibold transition-colors ${activeTab === 'users' ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800'}`}
            >
              <Users size={20} />
              Users
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg font-semibold transition-colors ${activeTab === 'departments' ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800'}`}
            >
              <Building size={20} />
              Departments
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg font-semibold transition-colors `}
            >
              <LogOut size={20} />
          Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-auto">
        {/* Title for the current section */}
        <h1 className="text-4xl font-bold mb-8">
          {activeTab === 'forms' && 'Form Submissions'}
          {activeTab === 'questions' && 'Questions / Routes'}
          {activeTab === 'users' && 'User Management'}
          {activeTab === 'departments' && 'Department & Route Builder'}
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
          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Latest Submissions</h2>
            </div>
            {formsData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                  <thead className="text-gray-400 border-b border-gray-700">
                    <tr>
                      <th className="py-3 px-4">SR No.</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">Submission Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formsData.map((form, index) => (
                      <tr key={form._id} className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800 transition-colors">
                        <td className="py-4 px-4">{index + 1}</td>
                        <td className="py-4 px-4">{form.name || "N/A"}</td>
      <td className="py-4 px-4">{form.email || "N/A"}</td>
      <td className="py-4 px-4">{form.phone || "N/A"}</td>
                        <td className="py-4 px-4">{new Date(form.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p>No form submissions found.</p>
              </div>
            )}
          </div>
        )}  

        {!isLoading && activeTab === 'questions' && ( 
          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
            <h2 className="text-2xl font-semibold mb-4">Routes and Questions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead className="text-gray-400 border-b border-gray-700">
                  <tr>
                    <th className="py-3 px-4">SR No.</th>
                    <th className="py-3 px-4">Route Name</th>
                    <th className="py-3 px-4">Preview Link</th>
                    <th className="py-3 px-4">Date Created</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
            
  {questionsData.map((route, idx) => (
    
    <React.Fragment key={route.id}>
      {/* Main route row */}
      <tr className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800 transition-colors">
        <td className="py-4 px-4 align-top">{idx + 1}</td>
        <td className="py-4 px-4 align-top">{route.name}</td>
        <td className="py-4 px-4 align-top">
          <a href={route.link || `/${route.name}`} target="_blank" rel="noopener noreferrer"
             className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
            {route.link || `${route.name}`}
             <ExternalLink size={16} />
          </a>
        </td>
  <td>
 {route.dateCreated
  ? new Date(route.dateCreated).toLocaleDateString()
  : "Unknown"}

</td>





        <td className="py-4 px-4 align-top text-center">
          <button
            onClick={() => handleEditRoute(route)}
            className=" text-blue-400 hover:text-blue-300 px-3 py-1 rounded-lg  transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
                          onClick={() => handleDeleteRoute(route.id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-900 transition-colors"
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

        {!isLoading && activeTab === 'users' && (
          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
            <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead className="text-gray-400 border-b border-gray-700">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Signed Up</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800 transition-colors">
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
                            className="bg-gray-800 text-white rounded-md pl-3 pr-8 py-2 appearance-none cursor-pointer"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
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
          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
            <h2 className="text-2xl font-semibold mb-4">Department Management</h2>
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Add new department"
                value={newDept}
                onChange={handleDeptInput}
                className="border border-gray-700 bg-gray-800 p-2 rounded-lg text-gray-100 w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddDepartment}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                Add Department
              </button>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Select Department to Edit</h3>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${selectedDept === dept ? 'bg-blue-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {selectedDept && (
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold capitalize">{selectedDept} Questions</h2>
                  <a href={`/${selectedDept}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 underline flex items-center gap-2 hover:text-purple-300">
                    Preview Page <ExternalLink size={16} />
                  </a>
                </div>
                
                {/* Question Builder Form */}
                <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4">
                    {editingQuestionIndex !== null ? 'Edit Question' : 'Add New Question'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Narrow reader.result to string or fallback to empty string
        const result = reader.result;
        setQuestionForm(prev => ({
          ...prev,
          icon: typeof result === "string" ? result : ""
        }));
      };
      reader.readAsDataURL(file);
    }
  }}
  className="text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
/>

                    <input
                      type="text"
                      placeholder="Main Question"
                      value={questionForm.text}
                      required
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, text: e.target.value }))}
                      className="bg-gray-800 border border-gray-700 p-2 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Sub Question Text"
                      value={questionForm.subText}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, subText: e.target.value }))}
                      className="bg-gray-800 border border-gray-700 p-2 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Type (e.g., 'Development Cost')" 
                      value={questionForm.type}
                      required
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, type: e.target.value }))}
                      className="bg-gray-800 border border-gray-700 p-2 rounded-lg"
                    />
                  </div>
                  
                  {/* Dependency Inputs */}
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="dependency-type"
                        checked={!questionForm.isDependent}
                        onChange={() => {
                          setQuestionForm(prev => ({ ...prev, isDependent: false }));
                          setSelectedDependencyQuestion(null);
                          setSelectedDependencyOption(null);
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
      className="bg-gray-800 border border-gray-700 p-2 rounded-lg w-full text-gray-300"
      value={selectedDependencyQuestion ?? ''}
      onChange={(e) => {
        const index = parseInt(e.target.value);
        setSelectedDependencyQuestion(index);
        setSelectedDependencyOptions([]); // reset when question changes
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
        className="bg-gray-800 border border-gray-700 p-2 rounded-lg w-full text-gray-300"
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
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    {editingQuestionIndex !== null ? 'Save Question' : 'Add Question'}
                  </button>
                </div>

                {/* Questions and Options Display */}
                {formState[selectedDept]?.map((q, qIndex) => (
                  <div key={qIndex} className="mb-6 p-6 border border-gray-700 rounded-2xl bg-gray-900 relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        className="p-2 rounded-lg text-blue-400 hover:bg-gray-700 transition-colors"
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
  // your UI only supports picking one previous question, so take the first questionIndex
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
                        className="p-2 rounded-lg text-red-400 hover:bg-gray-700 transition-colors"
                        title="Delete Question"
                       onClick={() => {
  setModal({
    isOpen: true,
    message: 'Are you sure you want to delete this question?',
    onConfirm: () => handleDeleteQuestion(selectedDept, qIndex),
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
                        <p className="text-gray-400">{q.questionSubText}</p>
                        <p className="text-gray-400 font-semibold text-sm">Type: {q.type}</p>
                       {q.isDependent && Array.isArray(q.dependentOn) && q.dependentOn.length > 0 && (
  <p className="text-sm text-gray-500 mt-1">
    Depends on Q{q.dependentOn[0].questionIndex + 1} — Option(s): {q.dependentOn.map(d => d.optionIndex + 1).join(', ')}
  </p>
)}

                      </div>
                    </div>

                    <hr className="border-gray-700 my-4" />

                    {/* Option Builder Form */}
                    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 mb-4">
                      <h4 className="text-lg font-semibold mb-3">
                        {editingOptionIndex !== null ? 'Edit Option' : 'Add New Option'} for Q{qIndex + 1}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
  className="text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
/>

                        <input
                          type="text"
                          placeholder="Title"
                          value={option.title}
                          onChange={(e) => setOption({ ...option, title: e.target.value })}
                          className="bg-gray-800 border border-gray-700 p-2 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Subtitle"
                          value={option.subtitle}
                          onChange={(e) => setOption({ ...option, subtitle: e.target.value })}
                          className="bg-gray-800 border border-gray-700 p-2 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Price"
                          value={option.price}
                          onChange={(e) => setOption({ ...option, price: e.target.value })}
                          className="bg-gray-800 border border-gray-700 p-2 rounded-lg"
                        />
                      </div>
                      <button
                        onClick={() => handleAddOrUpdateOption(qIndex)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        {editingOptionIndex !== null ? 'Save Option' : 'Add Option'}
                      </button>
                    </div>

                    {/* Option Cards Display */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {q.options.map((opt, idx) => (
                        <div key={idx} className="relative p-4 rounded-xl shadow-md bg-gray-800 border border-gray-700">
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button
                              className="p-1 rounded-md text-blue-400 hover:bg-gray-700 transition-colors"
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
                                setModal({
                                  isOpen: true,
                                  message: `Are you sure you want to delete this option?`,
                                  onConfirm: () => {
                                    const updatedOptions = q.options.filter((_, i) => i !== idx);
                                    const updatedQuestions = [...formState[selectedDept]];
                                    updatedQuestions[qIndex].options = updatedOptions;
                                    setFormState({ ...formState, [selectedDept]: updatedQuestions });
                                  },
                                });
                              }}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                          <div className="flex items-start gap-4">
                            {opt.icon && (
                              opt.icon?.startsWith("data:image") ? (
                                <img src={opt.icon} alt="icon" className="w-10 h-10 object-contain rounded-lg" />
                              ) : (
                                <span className="text-4xl">{opt.icon}</span>
                              )
                            )}
                            <div>
                              <h4 className="text-lg font-semibold">{opt.title}</h4>
                              <p className="text-gray-400 text-sm">{opt.subtitle}</p>
                              <div className="text-right text-green-400 font-bold mt-2 text-lg">
                                ₹{opt.price}
                              </div>
                            </div>
                          </div>
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
