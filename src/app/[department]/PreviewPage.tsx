"use client";
import { useEffect, useState,  useCallback,useMemo ,useRef} from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Testimonials from '../components/testimonials'; 
import Header from '../components/Header'
import Footer from '../components/Footer'




type Dependency = {
  questionIndex: number;
  optionIndex: number;
};

type Option = {
  icon?: string;
  title: string;
  subtitle?: string;
  price: number | string; // allow string in API input!
};

type Question = {
  isDependent: boolean;
  dependentOn?: Dependency;
  type: string;
  questionText: string;
  questionIcon: string;
  questionSubText: string;
  options: Option[];
};

type CostItem = {
  type: string;
  label: string;
  value: string;
  price: number;
};

export default function PreviewPage() {
  const params = useParams() as { department: string };
  const department = params.department;
  const [questions, setQuestions] = useState<Question[] | null>(null);
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, Option | null>>({});
  const [visibleQuestions, setVisibleQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  // Ensure totals is always a number
  // const [totals, setTotals] = useState(0);
  const [costItems, setCostItems] = useState<CostItem[]>([]);
  const [includedItems] = useState([
    "Dedicated Project Manager", "Unlimited Revisions", " Expert Team Collaboration", "Quality Assurance Guaranteed"
  ]);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({ name: "", phone: "", email: "" });
  const [toastMessage, setToastMessage] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [disableEmailBtn, setDisableEmailBtn] = useState(false);
  const [disableCallBtn, setDisableCallBtn] = useState(false);
  const [percent, setPercent] = useState(0);
    const [currentVisibleIdx, setCurrentVisibleIdx] = useState(0);
  const [showCallForm, setShowCallForm] = useState(false);

  const totalQuestions = visibleQuestions.length;
const answeredQuestions = Object.values(selectedOptions).filter(option => option !== null).length;
const totalProgressPercentage = (answeredQuestions / totalQuestions) * 100;

const firstSectionRef = useRef<HTMLDivElement | null>(null);
const secondSectionRef = useRef<HTMLDivElement | null>(null);
const footerRef = useRef<HTMLDivElement | null>(null);

const [currentSection, setCurrentSection] = useState(0); 
// 0 = hero, 1 = second section, 2 = footer
const [isSending, setIsSending] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);


useEffect(() => {
  // Only enable touch scroll on mobile
  if (typeof window === "undefined" || window.innerWidth > 1024) return;

  let touchStartY = 0;
  let touchEndY = 0;

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartY = e.touches[0].clientY;
      touchEndY = e.touches[0].clientY;
    }
  };
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      touchEndY = e.touches[0].clientY;
    }
  };
  const handleTouchEnd = () => {
    // Swipe up
    if (touchStartY - touchEndY > 50) {
     setCurrentSection((prev) => globalThis.Math.min(prev + 1, 2));

    }
    // Swipe down
    else if (touchEndY - touchStartY > 50) {
      setCurrentSection((prev) => globalThis.Math.max(prev - 1, 0));

    }
    // Otherwise, do nothing (tap or micro scroll)
  };

  // Attach to the document (captures all swipes)
  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchmove", handleTouchMove, { passive: true });
  document.addEventListener("touchend", handleTouchEnd, { passive: true });

  // Cleanup
  return () => {
    document.removeEventListener("touchstart", handleTouchStart);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };
}, []);

useEffect(() => {
  // Now this effect actually uses currentSection!
  if (currentSection === 0) {
    firstSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  } else if (currentSection === 1) {
    secondSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  } else if (currentSection === 2) {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [currentSection]);





  const totalEstimate = useMemo(() => {
    return Object.values(selectedOptions).reduce((sum, opt) => {
      if (!opt || (opt.price == null)) return sum;
      const price = typeof opt.price === "string" ? parseFloat(opt.price) : Number(opt.price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
  }, [selectedOptions]);


  // A function to determine if a question should be displayed
const isQuestionVisible = useCallback(
  (question: Question, selected: Record<number, Option | null>): boolean => {
    // not dependent → always visible
    if (!question.isDependent || !Array.isArray(question.dependentOn) || question.dependentOn.length === 0) {
      return true;
    }

    // Group required option indices by questionIndex
    const groups: Record<number, Set<number>> = {};
    for (const dep of question.dependentOn) {
      if (!groups[dep.questionIndex]) groups[dep.questionIndex] = new Set();
      groups[dep.questionIndex].add(dep.optionIndex);
    }

    // For each required previous question (AND across different questionIndex)
    for (const qIdxStr of Object.keys(groups)) {
      const qIdx = Number(qIdxStr);
      const allowed = groups[qIdx];
      const answer = selected[qIdx];
      if (!answer) return false; // no answer for that previous question

      // find index of selected option in original questions array
      if (!questions || !questions[qIdx]) return false;
      const selectedOptIdx = questions[qIdx].options.findIndex(o => o.title === answer.title);
      if (selectedOptIdx === -1) return false;

      // this group is satisfied only if selected option is one of the allowed ones
      if (!allowed.has(selectedOptIdx)) return false;
    }

    return true; // all groups satisfied
  },
  [questions]
);




  // RECALCULATE VISIBLE QUESTIONS AND CURRENT INDEX
useEffect(() => {
  if (!questions) return;
  const visible = questions.filter(q => isQuestionVisible(q, selectedOptions));
  setVisibleQuestions(visible);

  setCurrentVisibleIdx(prev => {
    if (visible.length === 0) return 0;
    if (prev >= visible.length) return visible.length - 1;
    return prev;
  });
}, [questions, selectedOptions, isQuestionVisible]);




 useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/get-questions?dept=${department}`);
        const data = await res.json();
        if (!res.ok) {
          console.error('Failed to fetch questions:', data.message || data);
          return;
        }
        setQuestions(data.questions);
        // Correctly initialize selectedOptions to be an empty object, not an array of nulls
        setSelectedOptions({}); 
      } catch (err) {
        console.error('Error in fetch:', err);
      }
    }
    if (department) load();
  }, [department]);


  
const updateCostItems = useCallback(() => {
  if (!questions) return;

  const newCostItems = Object.entries(selectedOptions).map(([index, option]) => {
    // The keys in selectedOptions are strings, so we need to convert them to numbers
    const questionIndex = parseInt(index, 10);
    const question = questions[questionIndex];

    if (!question || !option) return null;

    return {
      type: question.type,
      label: question.questionText,
      value: option.title,
      price: typeof option.price === "string" ? parseFloat(option.price) : option.price,
    };
  }).filter(item => item !== null); // Filter out any null entries

  setCostItems(newCostItems as CostItem[]);
}, [selectedOptions, questions]);

useEffect(() => {
  updateCostItems();
}, [selectedOptions, updateCostItems]);
  // -------- Compute Progress & Totals ---------------
useEffect(() => {
  if (!questions) return;
  const visibleCount = visibleQuestions.length;
  const answeredCount = visibleQuestions.reduce((acc, q) => {
    const idx = questions.findIndex(qq => qq.questionText === q.questionText);
    if (selectedOptions[idx]) return acc + 1;
    return acc;
  }, 0);
  const newPercent = visibleCount === 0 ? 0 : Math.round((answeredCount / visibleCount) * 100);
  setPercent(newPercent);
}, [selectedOptions, visibleQuestions, currentVisibleIdx, questions]);


useEffect(() => {
  if (visibleQuestions.length === 0 || costItems.length === 0 || totalEstimate === 0) return;

  if (typeof window !== "undefined" && !localStorage.getItem("estimateId")) {
    (async () => {
      try {
        const res = await fetch("/api/submit-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceCalculator: department,
            finalPrice: totalEstimate,
            name: "N/A",
            phone: "N/A",
            email: "N/A",
            quote: costItems,
            total: totalEstimate,
          }),
        });

        const data = await res.json();
        if (res.ok && data.estimateId) {
          localStorage.setItem("estimateId", data.estimateId);
        }
      } catch (error) {
        console.error("❌ Error saving placeholder estimate:", error);
      }
    })();
  }
}, [visibleQuestions.length, costItems, totalEstimate, department]);



  // --- RENDER LOGIC STARTS HERE ---
  // Early return statements should only come after all hooks have been called
  // ------- What to render now? -----------
if (!department || !questions || questions.length === 0)
  return (
    <div className="flex items-center justify-center min-h-[100vh]  bg-white">
      <img src="/BB-web-chai-1.gif" alt="Loading..." className="w-60 h-60" />
    </div>
  );

if (visibleQuestions.length === 0)
  return (
    <div className="text-center text-lg mt-10 text-gray-400">
      No visible questions.
    </div>
  );


  const currentQuestion = visibleQuestions[currentVisibleIdx];
  // The index in the original array for this question:
  const originalIndex = questions.findIndex(
    (q) => q.questionText === currentQuestion.questionText
  );

  // -------- Option selection (always write by original index) ----------
const handleOptionSelect = (opt: Option) => {
  const updated = { ...selectedOptions, [originalIndex]: opt };
  const newVisible = questions.filter(q => isQuestionVisible(q, updated));
  const visibleIndexes = newVisible.map(q => questions.findIndex(qq => qq.questionText === q.questionText));
  const cleaned: Record<number, Option | null> = {};
  visibleIndexes.forEach(idx => {
    if (updated[idx]) cleaned[idx] = updated[idx];
  });
  setSelectedOptions(cleaned);
};


  const hasMultiLineSubtitle = currentQuestion.options.some(opt => opt.subtitle && opt.subtitle.includes('|'));

  const validate = () => {
    const tempErrors = { name: "", phone: "", email: "" };
    let isValid = true;
    if (!formData.name.trim()) { tempErrors.name = "Name is required."; isValid = false; }
    if (!formData.phone.trim()) { tempErrors.phone = "Phone number is required."; isValid = false; } else if (!/^\d{10}$/.test(formData.phone)) { tempErrors.phone = "Phone number must be 10 digits."; isValid = false; }
    if (!formData.email.trim()) { tempErrors.email = "Email is required."; isValid = false; } else if (!/\S+@\S+\.\S+/.test(formData.email)) { tempErrors.email = "Email is not valid."; isValid = false; }
    setErrors(tempErrors);
    return isValid;
  };
  


const handleSubmit = async () => {
  if (!validate()) return;

  const { name, phone, email } = formData;
  const estimateId = typeof window !== "undefined" ? localStorage.getItem("estimateId") : null;

  setIsSubmitting(true);

  try {
    const res = await fetch("/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        serviceCalculator: department,
        finalPrice: totalEstimate,
        quote: costItems,
        total: totalEstimate,
        estimateId, // important: existing lead ID
      }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log("✅ Form submitted:", formData);
      setToastMessage("✅ Thank you! We'll connect with you soon.");
      setTimeout(() => setToastMessage(""), 4000);
      setShowCallForm(false);
      setDisableCallBtn(true);

      localStorage.removeItem("estimateId"); // cleanup after submission
    } else {
      alert(`❌ Error: ${data.message}`);
    }
  } catch (err) {
    console.error("❌ Submission error:", err);
    alert("Something went wrong while submitting.");
  } finally {
    setIsSubmitting(false);
  }
};
  

const handleEmailSubmit = async () => {
  if (!email.trim()) {
    alert('Please enter a valid email address.');
    return;
  }

  if (!department.trim()) {
    alert('Please select a service.');
    return;
  }

  if (!Array.isArray(costItems) || costItems.length === 0) {
    alert('Please add cost items before sending.');
    return;
  }

  if (!totalEstimate || Number(totalEstimate) === 0) {
    alert('Total estimate cannot be empty or zero.');
    return;
  }

  setIsSending(true);

  try {
    const payload = {
      email: email.trim(),
      quote: costItems,
      total: Number(totalEstimate),
      serviceCalculator: department.trim(),
    };

    console.log('📤 Sending email payload:', payload);

    const res = await fetch('/api/send-quotation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log('✅ Email API response:', data);

    if (res.ok && data.success) {
      setToastMessage('✅ Quotation sent successfully!');
      setTimeout(() => setToastMessage(''), 4000);
      setShowEmailInput(false);
      setEmail('');
      setDisableEmailBtn(false);
    } else {
      alert(`❌ Failed to send email: ${data.message || 'Unknown error'}`);
    }
  } catch (err) {
    console.error('❌ Email send error:', err);
    alert('Something went wrong while sending the email.');
  } finally {
    setIsSending(false);
  }
};






  return (

    <div ref={firstSectionRef}>
      <Header/>
        {toastMessage && (
  <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-md z-50">
    {toastMessage}
  </div>
)}
      <div
        className="w-full h-full relative bg-no-repeat bg-center bg-cover  py-10 md:py-0 lg:px-15 px-0 "
      >
        <div 
        style={{ minHeight: "100vh", touchAction: "pan-y" /* allow vertical scroll gestures */ }}
         className=" max-w-8xl mx-auto w-full flex flex-col-reverse md:flex-row items-center justify-between gap-8 relative z-10 lg:top-0 top-10">
          

          {/* Text Section */}
          <div className="text-center md:text-left px-5 py-10 snap-start mt-20 space-y-4 w-full md:w-1/2 z-20 md:static absolute top-10 left-1/2 md:top-auto md:left-auto transform md:transform-none -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[400px] h-[300px] lg:h-[500px] -mt-10 lg:-mt-35">
  <img
    src="/images/hero2.png"
    alt="Desk Illustration"
    className="w-full h-full object-contain md:object-contain  md:opacity-100"
  />
</div>

            <h1 className="text-[34px] sm:text-[28px] md:text-5xl  text-black leading-tight">
              Estimate Your Project
              
            </h1>
      
            <div className="flex md:flex-row  items-center justify-center md:justify-start gap-3 sm:gap-5 ">
             <span
                className="relative flex items-center justify-center w-[93px] h-[43px] text-[26px] sm:text-[32px] md:text-[35px]  text-black text-center capitalize font-Poppins px-2 py-1 rounded-[5px]"
                  style={{ background: "#F9B31B", letterSpacing: "0.2px" }}
                 >
                  Cost
                 <Image
                 src="/images/Highlight.png"
                alt="highlight"
                 width={25}
                 height={25}
                 className="absolute -top-5 -right-5"
                 />
                </span>
      
              <span className="text-[24px] sm:text-[28px] md:text-5xl  text-black">
                Instantly
              </span>
            </div>      
          </div>
                              
             <section 
               className="w-full px-4  flex flex-col items-center  py-20 lg:mt-8 mt-60 ">
        <h2 className="text-center font-poppins text-[25px] sm:text-[28px] md:text-5xl  leading-normal tracking-[-0.8px] capitalize text-black">
          Plan Your Project, Step By Step
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-center font-poppins text-[20px] font-[400] leading-normal text-[#797474]">
            Calculate your digital dream
          </span>
        </div>
        <div ref={secondSectionRef} className="w-full max-w-6xl max-h-7xl lg:mt-12 mt-8">
        <div className="flex flex-col gap-2">
  {/* Progress Wrapper (relative so car is inside) */}
  <div className="flex gap-3 relative items-center">
    {/* Progress Bars */}
    {visibleQuestions.map((_, visibleIdx) => {
      const question = visibleQuestions[visibleIdx];
      const realIndex = questions.findIndex(
        (q) => q.questionText === question.questionText
      );

      return (
        <div
          key={visibleIdx}
          className="flex-1 h-[10px] rounded-[20px] border border-[#1E1E1E] bg-transparent overflow-hidden"
        >
          <div
            className="h-full bg-[#F9B31B] transition-all duration-500"
            style={{
              width: selectedOptions[realIndex] ? "100%" : "0%",
            }}
          />
        </div>
      );
    })}

    {/* Car Image */}
    <div
      className="absolute transition-all duration-500 "
      style={{
        left: `${totalProgressPercentage}%`,
        transform: "translateX(-20%)", // keeps it centered
        bottom: '1px',
      }}
    >
      <img src="/images/taxi1.png" alt="Car" className="lg:h-[65px] h-[45px] lg:w-[70px] w-[50px]" />
    </div>
  </div>
</div>

<div className="flex items-center justify-between text-sm text-gray-600 lg:mt-3 mt-1">
            <span className="text-[#797474] text-center font-[Poppins] text-[20px] italic font-light leading-none tracking-[0.2px] capitalize">
              Progress
            </span>
            <span className="text-[#797474] text-center font-[Poppins] text-[20px] not-italic font-light leading-none tracking-[0.2px] capitalize">
              {percent}%
            </span>
          </div>

        </div>

     

        {/* ... The rest of your component remains the same from the previous response ... */}
        {currentStep !== 99 ? (
          hasMultiLineSubtitle ? (
            <div
            
              className="
              
                  flex flex-col gap-6
                  lg:mt-5  mt-5 mb-5
                  w-full
                  max-w-[908px]
                  p-5 md:p-[40px_40px]
                  bg-white rounded-[8px] border border-[#1E1E1E]
                  shadow-[6px_5px_0px_0px_#262626]
                "
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="lg:text-[24px] text-[20px] font-poppins font-[700] text-black">
                      {currentQuestion.questionText}
                    </h3>
                    {currentQuestion.questionIcon?.startsWith("data:image") ? (
                      <img src={currentQuestion.questionIcon} alt="icon" className="w-6 h-6" />
                    ) : (
                      <span>{currentQuestion.questionIcon}</span>
                    )}
                  </div>
                  <p className="text-[#797474] font-poppins text-[16px] font-[400]">
                    {currentQuestion.questionSubText}
                  </p>
                </div>

                <div className="flex items-center gap-1 sm:ml-10">
                  <span className="font-poppins text-[14px] font-[400] capitalize text-[#1E1E1E]">
                    Pick One
                  </span>
                  <svg
                    className="w-[15px] h-[10px] mt-[2px]"
                    viewBox="0 0 6 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.3 1C3.3 0.834315 3.16569 0.7 3 0.7C2.83431 0.7 2.7 0.834315 2.7 1H3.3ZM2.78787 9.21213C2.90503 9.32929 3.09497 9.32929 3.21213 9.21213L5.12132 7.30294C5.23848 7.18579 5.23848 6.99584 5.12132 6.87868C5.00416 6.76152 4.81421 6.76152 4.69706 6.87868L3 8.57574L1.30294 6.87868C1.18579 6.76152 0.995837 6.76152 0.87868 6.87868C0.761522 6.99584 0.761522 7.18579 0.87868 7.30294L2.78787 9.21213ZM3 1H2.7L2.7 9H3H3.3L3.3 1H3Z"
                      fill="#1E1E1E"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-10 gap-5">
            {currentQuestion.options.map((opt, i) => {
  const active = selectedOptions[originalIndex]?.title === opt.title;
  return (
    <button
      key={i}
      type="button"
      onClick={() => handleOptionSelect(opt)}
      className={`flex flex-col justify-between gap-2 rounded-[8px] border transition-colors px-4 py-4 text-left w-full lg:w-[280px] h-[180px] relative ${
        active
          ? "bg-[#F9B31B] border-[#1E1E1E] text-white shadow-[2px_2px_0px_0px_#1E1E1E]"
          : "bg-white border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#FFE19F]"
      }`}
    >
      {/* This container ensures consistent spacing for the icon and title. */}
      <div className="flex flex-col items-center justify-center w-full relative">
        {/* This div *always* renders, reserving a fixed space for the icon. */}
        <div className="w-10 h-10 mb-2 flex items-center justify-center">
          {opt.icon && (
            opt.icon.startsWith("data:image") ? (
              <img src={opt.icon} alt="icon" className="w-full h-full object-contain" />
            ) : (
              <span>{opt.icon}</span>
            )
          )}
        </div>

        {/* This div wraps the title, allowing you to control its overflow. */}
        <div className="w-full text-center">
          {/* We've added `truncate` to handle long titles. */}
          <h4 className="md:text-[16px] lg:text-[16px] text-[12px] font-bold font-poppins text-black truncate">
            {opt.title}
          </h4>
        </div>

        {Number(opt.price) > 0 && (
          <span
            className={`absolute top-0 right-0 border rotate-[18deg] text-black border-black px-2 py-0.5 text-xs font-semibold rounded-md`}
            style={{ borderRadius: "5px", border: "2px solid #000" }}
          >
            ₹{Number(opt.price).toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {opt.subtitle && opt.subtitle.trim() !== '' ? (

  <ul className="flex flex-wrap md:text-[12px] lg:text-[14px] text-[15px] leading-tight font-poppins text-[#444] list-disc ml-5 ">
    {opt.subtitle.split("|").map((item, i) => (
      <li key={i} className="basis-1/2 flex-shrink-0 break-words">
        {item.trim()}
      </li>
    ))}
  </ul>
) : null} 
    </button>
  );
})}

{currentStep !== 99 && (
  <div className="flex justify-center max-w-4xl mx-auto gap-13 lg:hidden">
    <button
      onClick={() => {
        if (currentVisibleIdx > 0 && questions && visibleQuestions.length > 0) {
          const newSelectedOptions = { ...selectedOptions };
          const origIdx = questions.findIndex(
            (q) => q.questionText === visibleQuestions[currentVisibleIdx].questionText
          );
          newSelectedOptions[origIdx] = null;
          setSelectedOptions(newSelectedOptions);
          setCurrentVisibleIdx((prev) => prev - 1);
        }
      }}
      disabled={currentVisibleIdx === 0}
      className={` cursor-pointer w-[130px] flex items-center justify-center gap-2 py-[10px] rounded-[5px] italic
        border shadow-[2px_2px_0px_0px_#262626] transition-colors text-[16px] font-[400]
        ${
          currentVisibleIdx > 0
            ? "bg-[#F9B31B] border-[#262626] text-[#262626]"
            : "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed shadow-none"
        }`}
    >
      Previous
    </button>
    <button
      onClick={() => {
        if (currentVisibleIdx === visibleQuestions.length - 1) {
          setCurrentStep(99);
        } else {
          setCurrentVisibleIdx((prev) =>
            Math.min(visibleQuestions.length - 1, prev + 1)
          );
        }
      }}
      disabled={!selectedOptions[originalIndex]}
      className={` cursor-pointer w-[130px] flex items-center justify-center gap-2 py-[10px] rounded-[5px] font-medium
        border-2 transition-colors
        ${
          selectedOptions[originalIndex]
            ? "bg-black border-black text-white hover:bg-[#1a1a1a] shadow-[2px_2px_0px_0px_#F9B31B]"
            : "bg-black border-black text-white hover:bg-[#1a1a1a] shadow-[2px_2px_0px_0px_#F9B31B]"
        }`}
    >
      {currentVisibleIdx === visibleQuestions.length - 1
        ? "See Estimate"
        : "Next"}
    </button>
  </div>
)}

              </div>
              
            </div>
          ) : (
            <div
              className="
                  flex flex-col gap-6
                  lg:mt-5  mt-5 mb-5
                  w-full max-w-[908px]
                  p-5 md:p-[30px_30px]
                  bg-white rounded-[8px] border border-[#1E1E1E]
                  shadow-[6px_5px_0px_0px_#262626]
                "
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 lg:w-[700px]">
                    <h3 className="lg:text-[24px] text-[20px] font-poppins font-[700] text-black">
                      {currentQuestion.questionText}
                    </h3>
                    {currentQuestion.questionIcon?.startsWith("data:image") ? (
                      <img src={currentQuestion.questionIcon} alt="icon" className="w-4 h-4" />
                    ) : (
                      <span>{currentQuestion.questionIcon}</span>
                    )}
                  </div>
                  <p className="text-[#797474] font-poppins text-[16px] font-[400]">
                    {currentQuestion.questionSubText}
                  </p>
                </div>

                <div className="flex items-center gap-1 sm:ml-10">
                  <span className="font-poppins text-[14px] capitalize font-[400] text-[#1E1E1E]">
                    Pick One
                  </span>
                  <svg
                    className="w-[15px] h-[10px] mt-[2px]"
                    viewBox="0 0 6 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.3 1C3.3 0.834315 3.16569 0.7 3 0.7C2.83431 0.7 2.7 0.834315 2.7 1H3.3ZM2.78787 9.21213C2.90503 9.32929 3.09497 9.32929 3.21213 9.21213L5.12132 7.30294C5.23848 7.18579 5.23848 6.99584 5.12132 6.87868C5.00416 6.76152 4.81421 6.76152 4.69706 6.87868L3 8.57574L1.30294 6.87868C1.18579 6.76152 0.995837 6.76152 0.87868 6.87868C0.761522 6.99584 0.761522 7.18579 0.87868 7.30294L2.78787 9.21213ZM3 1H2.7L2.7 9H3H3.3L3.3 1H3Z"
                      fill="#1E1E1E"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentQuestion.options.map((opt, i) => {
            const active = selectedOptions[originalIndex]?.title === opt.title;
                  return (
                    
                    <button
                      key={i}
                      type="button"
                     onClick={() => handleOptionSelect(opt)}

                      className={`flex items-center justify-between gap-4 rounded-[8px] border transition-colors px-3 py-3 text-left w-full ${
                       opt.subtitle?.trim() ? "h-[72px]" : "h-[50px]"
                      } ${
                        active
                          ? "bg-[#F9B31B] border-[#1E1E1E] text-white shadow-[2px_2px_0px_0px_#1E1E1E]"
                          : "bg-white border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#FFE19F]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {opt.icon ? (
                          <span className="relative inline-flex items-center justify-center w-8 h-5 -top-1">
                            <div className="relative  ">
                              {opt.icon.startsWith("data:image") ? (
                                <img src={opt.icon} alt="icon" className="w-6 h-6" />
                              ) : (
                                <span>{opt.icon}</span>
                              )}
                            </div>
                          </span>
                        ) : (
                          
                          <span
                            className={`w-[12px] h-[12px] rounded-full  border-[2px] ${
                              active ? "bg-black border-black" : "border-[#F9B31B]"
                            }`}
                          />
                        )}
                        <div>
                          <h4 className="text-[#111827] font-poppins md:text-[13px] lg:text-[13px] text-[13px] font-[600]">
                            {opt.title}
                          </h4>
                          {opt.subtitle && opt.subtitle.trim() !== '' ? (
                           <p
  className={`font-poppins lowercase font-[500] 
    md:text-[10px] lg:text-[12px] text-[15px] 
    leading-[1.2] 
    ${active ? "text-[#111827]" : "text-[#111827]"}
  `}
>
                              {opt.subtitle}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <span
  className={`md:text-[13px] lg:text-[14px] font-[500] leading-normal font-poppins ${
    active ? 'text-white' : 'text-[#111827]'
  }`}
>
  {Number(opt.price) > 0 ? `₹${Number(opt.price).toLocaleString("en-IN")}` : ''}
</span>

                    </button>
                  );
                })}

                {currentStep !== 99 && (
  <div className="flex justify-center max-w-4xl mx-auto gap-13  lg:hidden">
    <button
      onClick={() => {
        if (currentVisibleIdx > 0 && questions && visibleQuestions.length > 0) {
          const newSelectedOptions = { ...selectedOptions };
          const origIdx = questions.findIndex(
            (q) => q.questionText === visibleQuestions[currentVisibleIdx].questionText
          );
          newSelectedOptions[origIdx] = null;
          setSelectedOptions(newSelectedOptions);
          setCurrentVisibleIdx((prev) => prev - 1);
        }
      }}
      disabled={currentVisibleIdx === 0}
      className={`w-[130px] flex items-center justify-center gap-2 py-[10px] rounded-[5px] italic
        border shadow-[2px_2px_0px_0px_#262626] transition-colors text-[16px] font-[400]
        ${
          currentVisibleIdx > 0
            ? "bg-[#F9B31B] border-[#262626] text-[#262626]"
            : "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed shadow-none"
        }`}
    >
      Previous
    </button>
    <button
      onClick={() => {
        if (currentVisibleIdx === visibleQuestions.length - 1) {
          setCurrentStep(99);
        } else {
          setCurrentVisibleIdx((prev) =>
            Math.min(visibleQuestions.length - 1, prev + 1)
          );
        }
      }}
      disabled={!selectedOptions[originalIndex]}
      className={`w-[130px] flex items-center justify-center gap-2 py-[10px] rounded-[5px] font-medium
        border-2 transition-colors
        ${
          selectedOptions[originalIndex]
            ? "bg-black border-black text-white hover:bg-[#1a1a1a] shadow-[2px_2px_0px_0px_#F9B31B]"
            : "bg-black border-black text-white hover:bg-[#1a1a1a] shadow-[2px_2px_0px_0px_#F9B31B]"
        }`}
    >
      {currentVisibleIdx === visibleQuestions.length - 1
        ? "See Estimate"
        : "Next"}
    </button>
  </div>
)}

              </div>
            </div>
          )
        ) : (
         <div
    className="
        flex flex-col gap-6
        lg:mt-5  mt-3 mb-10
        w-full
        max-w-[908px]
        p-4 md:p-[40px_40px]
        bg-white rounded-[8px] border border-[#1E1E1E]
        shadow-[6px_5px_0px_0px_#262626]
    "
>
            <h2 className=" text-black text-2xl md:text-[24px] font-[700] text-center ">
              Your Project Estimate
            </h2>
            <div
              className="text-center py-4 rounded-md shadow-inner border"
              style={{
                borderRadius: "8px",
                border: "1px solid #1E1E1E",
                background: "#F9B31B",
                boxShadow: "3px 3px 0px 0px #262626",
              }}
            >
              <h3 className="text-white text-center font-poppins text-[24px] font-[700] capitalize tracking-tightest">
                ₹{totalEstimate.toLocaleString()}
              </h3>
              <div className="flex items-center justify-center gap-1 text-center text-[#1E1E1E] font-[Poppins] text-[14px] font-[300] leading-normal">
                <span>Here is What It will Take to Build Your Vision</span>
                {/* <Form1 className="w-4 h-4" /> */}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 space-y-10 ">
                <div className="lg:ml-5 lg:mt-5">
                  <h4 className=" text-black font-[Poppins] text-[24px] font-[700] leading-normal tracking-[-0.8px] capitalize mb-3 flex items-center gap-2">
                    Whats Always Included
                    {/* <Star className="w-4 h-4" /> */}
                  </h4>
                  <ul className="space-y-3">
                    {includedItems.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <circle cx="4" cy="4" r="4" fill="#76CA21" />
                        </svg>
                        <span className="text-[#1E1E1E] text-center font-[Poppins] text-[14px] font-[300]  leading-normal">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
               {/* <div className="flex items-center  lg:mt-30 md:mt-20 gap-5 self-stretch rounded-[8px] border border-[#FFC250] bg-white shadow-[2px_2px_0px_0px_#F9B31B] p-5 md:p-[20px_15px]"> */}
                   <Testimonials />
                {/* </div> */}
              </div>
              <div
                className="
                    flex flex-col
                   min-h-[400px] max-w-[424px] w-full

                    p-5 md:p-[20px_20px]
                    bg-white rounded-[8px] border border-[#1E1E1E]
                    shadow-[6px_5px_0px_0px_#262626]
                  "
              >
                <h2 className=" flex text-[24px] font-[700] mb-3 gap-2  text-black font-[Poppins] leading-normal tracking-[-0.8px] capitalize">
                  Cost Summary <span>
                    {/* <img
                    src="/images/buldings.svg"
                    alt="Profile"
                    className="w-5 h-5 mt-2 "
                  /> */}
                  </span>
                </h2>
                {costItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-start mb-2">
                    <p>

                       <span className="text-[#1E1E1E] text-center font-[Poppins] text-[14px] font-[700] leading-normal not-italic">
{item.type}:
</span>
{" "}
                      <span className="text-[#1E1E1E] font-[Poppins] text-[14px] font-[300] not-italic  leading-normal">
                           {item.value}
                      </span>
                    </p>
                    <p className="whitespace-nowrap text-[#1E1E1E] text-center font-[Poppins] text-[14px] font-[500] not-italic  leading-normal">
                       ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
                <hr className="my-2 border-black" />
                <div className="flex justify-between items-center mb-5">
                  <p className="text-[#1E1E1E] text-center font-[Poppins] text-[14px] font-[700] not-italic  leading-normal">
                    Estimated Cost:
                  </p>
                  <p className="text-[#1E1E1E] text-center font-[Poppins] text-[14px] font-[700] not-italic leading-normal">
                   ₹{totalEstimate.toLocaleString()}
                  </p>
                </div>
                {!showCallForm ? (
  <button
    onClick={() => setShowCallForm(true)}
    className="cursor-pointer w-full mb-3 py-[8px] px-[23px] lg:mt-4 rounded-[5px] bg-[#262626] shadow-[2px_2px_0px_0px_#F9B31B] text-white text-[16px] font-[400] italic flex justify-center items-center gap-[10px] self-stretch transition-all"
   disabled={disableCallBtn}
  >
    Schedule Free Call
  </button>
) : (
  <>
    {/* Inline Form */}
   <div className="grid grid-cols-1 gap-3 mb-3 w-full">
  {/* Name */}
  <div className="flex flex-col gap-1 w-full">
    <label htmlFor="name" className="text-sm font-medium text-black">
      Name
    </label>
    <input
      type="text"
      id="name"
      name="name"
      value={formData.name}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }))
      }
      className={`px-3 py-2 border rounded-[8px] focus:outline-none focus:ring-2 text-[#1E1E1E] placeholder:text-[#1E1E1E] ${
        errors.name
          ? "border-red-500 focus:ring-red-300"
          : "border-[#1E1E1E] focus:ring-[#F9B31B]"
      }`}
      placeholder="Enter your name"
    />
    {errors.name && (
      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
    )}
  </div>

  {/* Phone */}
  <div className="flex flex-col gap-1 w-full">
    <label htmlFor="phone" className="text-sm font-medium text-black">
      Phone
    </label>
    <input
      type="tel"
      id="phone"
      name="phone"
      value={formData.phone}
      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#1E1E1E] placeholder:text-[#1E1E1E] ${
        errors.phone
          ? "border-red-500 focus:ring-red-300"
          : "border-[#1E1E1E] focus:ring-[#F9B31B]"
      }`}
      placeholder="Enter your phone"
    />
    {errors.phone && (
      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
    )}
  </div>

  {/* Email */}
  <div className="flex flex-col gap-1 w-full">
    <label htmlFor="email" className="text-sm font-medium text-black">
      Email
    </label>
    <input
      type="email"
      id="email"
      name="email"
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#1E1E1E] placeholder:text-[#1E1E1E] ${
        errors.email
          ? "border-red-500 focus:ring-red-300"
          : "border-[#1E1E1E] focus:ring-[#F9B31B]"
      }`}
      placeholder="Enter your email"
    />
    {errors.email && (
      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
    )}
  </div>
</div>


    {/* Submit Button */}
    <button
  onClick={handleSubmit}
  className="w-full py-[8px] px-[23px] mb-3 rounded-[5px] bg-[#262626] shadow-[2px_2px_0px_0px_#F9B31B] text-white text-[16px] font-[400] italic flex justify-center items-center gap-[10px] self-stretch transition-all disabled:opacity-50"
  disabled={isSubmitting}
>
  {isSubmitting ? "Submitting..." : "Submit"}
</button>

  </>
)} 

                {!showEmailInput ? (
                  <button
                    onClick={() => {
                      setShowEmailInput(true);
                      setDisableEmailBtn(true);
                    }}
                    className=" cursor-pointer w-full py-[8px] px-[23px] rounded-[5px] border border-[#1E1E1E] bg-white text-black text-[16px] font-[400] italic shadow-[2px_2px_0px_0px_#1E1E1E] flex justify-center items-center gap-[10px] self-stretch transition disabled:opacity-50"
                    disabled={disableEmailBtn}
                  >
                    Email Me The Quote
                  </button>
                ) : (
                  <div className="grid grid-cols-10 gap-3 items-center w-full">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="col-span-7 p-2 border  border-[#1E1E1E] rounded w-full text-[#1E1E1E] placeholder:text-[#1E1E1E]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
  onClick={handleEmailSubmit}
  className="col-span-3 py-[8px] px-[12px] rounded-[5px] bg-[#262626] text-white font-[400] italic shadow-[2px_2px_0px_0px_#F9B31B] transition w-full disabled:opacity-50"
  disabled={isSending}
>
  {isSending ? "Sending..." : "Send"}
</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
{currentStep !== 99 && (
    <div className="flex justify-center max-w-4xl mx-auto p-4 lg:gap-160 gap-10">
        {/* Previous Button */}
        <button
            onClick={() => {
                if (currentVisibleIdx > 0 && questions && visibleQuestions.length > 0) {
                    const newSelectedOptions = { ...selectedOptions };
                    const origIdx = questions.findIndex(
                        (q) =>
                            q.questionText === visibleQuestions[currentVisibleIdx].questionText
                    );
                    newSelectedOptions[origIdx] = null;
                    setSelectedOptions(newSelectedOptions);
                    setCurrentVisibleIdx((prev) => prev - 1);
                }
            }}
            disabled={currentVisibleIdx === 0}
            className={`cursor-pointer w-[130px] items-center justify-center gap-2 py-[10px] rounded-[5px] italic
                border shadow-[2px_2px_0px_0px_#262626] transition-colors text-[16px] font-[400]
                sm:flex hidden
                ${
                    currentVisibleIdx > 0
                        ? "bg-[#F9B31B] border-[#262626] text-[#262626]"
                        : "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
        >
            Previous
        </button>

        {/* Next Button */}
        <button
            onClick={() => {
                if (currentVisibleIdx === visibleQuestions.length - 1) {
                    setCurrentStep(99);
                } else {
                    setCurrentVisibleIdx((prev) =>
                        Math.min(visibleQuestions.length - 1, prev + 1)
                    );
                }
            }}
            disabled={!selectedOptions[originalIndex]}
            className={`cursor-pointer w-[130px] items-center justify-center gap-2 py-[10px] rounded-[5px] font-medium
                border-2 transition-colors
                sm:flex hidden
                ${
                    selectedOptions[originalIndex]
                        ? "bg-black border-black text-white hover:bg-[#1a1a1a] shadow-[2px_2px_0px_0px_#F9B31B]"
                        : "bg-black border-black text-white hover:bg-[#1a1a1a] shadow-[2px_2px_0px_0px_#F9B31B]"
                }`}
        >
            {currentVisibleIdx === visibleQuestions.length - 1
                ? "See Estimate"
                : "Next"}
        </button>
    </div>
)}
 
      </section>    
        </div>     
      </div>
     <div ref={footerRef}>
  <Footer />
</div>

    </div>
  );
}




