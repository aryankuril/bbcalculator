"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BsQuestionCircle } from 'react-icons/bs';

type Option = {
  icon: string;
  title: string;
  subtitle: string;
  price: number;
};

type Question = {
  questionText: string;
  questionIcon: string;
  questionSubText: string;
  options: Option[];
};

export default function PreviewPage() {
  const { department } = useParams();
const [questions, setQuestions] = useState<Question[] | null>(null);


  const [selectedOption, setSelectedOption] = useState<string | null>(null);

useEffect(() => {
  async function load() {
    try {
      const res = await fetch(`/api/get-questions?dept=${department}`);
      const data = await res.json();

      if (!res.ok) {
        console.error('Failed to fetch questions:', data.message || data);
        return;
      }

      console.log('Fetched questions:', data.questions);
      setQuestions(data.questions); // ✅ This will now run
    } catch (err) {
      console.error('Error in fetch:', err);
    }
  }

  if (department) {
    console.log("department from URL:", department);
    load();
  }
}, [department]);


if (!department || !questions) {
  return <p className="text-gray-500">Loading questions...</p>;
}
if (questions.length === 0) {
  return <p className="text-gray-500">No questions found for this department.</p>;
}



  return (
    <div>
      {questions.length === 0 ? (
        <p className="text-gray-500">No questions added yet.</p>
      ) : (
        questions.map((q, index) => (
  <div
    key={index}
    className="
      w-full
      max-w-[908px]
      p-5 md:p-[30px_30px]
      bg-white rounded-[8px] border border-[#1E1E1E]
      shadow-[6px_5px_0px_0px_#262626]
      mx-auto flex flex-col gap-4
    "
  >
         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="flex items-start gap-3 mb-4">
 
  <div>
    <div className="flex items-center gap-2">
      <h3 className="text-[24px] font-poppins font-[700] text-black capitalize">
        {q.questionText}
      </h3>
       {q.questionIcon?.startsWith("data:image") ? (
  <img
    src={q.questionIcon}
    alt="icon"
    className="w-4 h-4 object-contain rounded"
  />
) : (
  <span className="text-3xl">{q.questionIcon}</span>
)}
    </div>
    <p className="text-[#797474] font-poppins text-[16px] font-[400]">
      {q.questionSubText}
    </p>
  </div>
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              {q.options.map((opt: Option, i: number) => {
                const id = `q${index}-opt${i}`;
                const active = selectedOption === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedOption(id)}
                    className={`flex items-center justify-between gap-4 rounded-[8px] border transition-colors px-3 py-3 text-left w-full lg:w-[280px] h-[72px] ${
                      active
                        ? 'bg-[#F9B31B] border-[#1E1E1E] text-white shadow-[2px_2px_0px_0px_#1E1E1E]'
                        : 'bg-white border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#FFE19F]'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="relative inline-flex items-center justify-center w-10 h-10 -top-1">
                        {/* <span
                          className={`w-6 h-6 rounded-full right-0 top-1 -mr-8 ${
                            active ? 'bg-white' : 'bg-[#F9B31B]'
                          }`}
                        ></span> */}
                       {opt.icon?.startsWith("data:image") ? (
  <img
    src={opt.icon}
    alt="icon"
    className="w-10 h-10 object-contain rounded"
  />
) : (
  <span className="text-3xl">{opt.icon}</span>
)}
                      </span>
                      <div>
                        <h4 className="text-[#111827] font-poppins md:text-[13px] lg:text-[14px] font-[600]">
                          {opt.title}
                        </h4>
                        <p
                          className={`font-poppins lowercase font-[500] md:text-[10px] lg:text-[12px] text-[#111827]`}
                        >
                          {opt.subtitle}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`md:text-[13px] lg:text-[14px] font-[500] leading-normal font-poppins ${
                        active ? 'text-white' : 'text-[#111827]'
                      }`}
                    >
                      ₹{opt.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
