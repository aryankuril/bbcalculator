import { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    text: `“Had an amazing journey working with Bombay Blokes, never felt like I was working with an outside agency!”`,
    name: "Kaushik Shah",
    company: "India Grooming Club",
       img: "/images/Ellipse.png",
  },
  {
    text: `“The team delivered outstanding results on time and exceeded our expectations!”`,
    name: "Anita Patel",
    company: "Creative Minds",
       img: "/images/Ellipse.png",
  },
  {
    text: `“Highly recommend their services, professional and friendly throughout.”`,
    name: "Ravi Kumar",
    company: "Tech Solutions",
      img: "/images/Ellipse.png",
  },
  {
    text: `“A fantastic partner for all our creative needs. The quality of work is unparalleled.”`,
    name: "Priya Sharma",
    company: "Marketing Innovators",
      img: "/images/Ellipse.png",
  },
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const delay = 5000; // 5 seconds

  // Clears and resets timer on index change
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

//   function goToPrev() {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
//     );
//   }

//   function goToNext() {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
//   }

  return (
    <div className="relative w-full max-w-xl mx-auto mt-21 font-[Poppins]">
      <div 
        className="overflow-hidden rounded-[8px] border border-[#FFC250] bg-white shadow-[2px_2px_0px_0px_#F9B31B]">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map(({ text, name, company, img }, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full flex flex-col items-center text-center gap-4 p-5 md:p-[20px_15px]"
            >
              <p className="text-[#1E1E1E] text-[14px] font-[400] leading-none">
                {text}
              </p>
              <div className="flex items-center gap-4 justify-center mt-2">
                <img
                  src={img}
                  alt={name}
                  className="w-8 h-8 rounded-full object-cover"
                  
                />
                <div className="flex flex-col">
                  <span className="text-[#1E1E1E] text-[12px] font-[400] leading-normal">
                    {name}
                  </span>
                  <span className="text-[#1E1E1E] text-[12px] font-[400] leading-normal">
                    {company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      {/* <button
        onClick={goToPrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#FFC250] p-2 rounded-full shadow-md hover:bg-[#F9B31B] transition-colors"
        aria-label="Previous testimonial"
      >
        &#8592;
      </button>
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#FFC250] p-2 rounded-full shadow-md hover:bg-[#F9B31B] transition-colors"
        aria-label="Next testimonial"
      >
        &#8594;
      </button> */}

      {/* Dots navigation */}
      {/* <div className="flex justify-center mt-4 gap-2">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === currentIndex ? "bg-[#F9B31B]" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div> */}
    </div>
  );
}
