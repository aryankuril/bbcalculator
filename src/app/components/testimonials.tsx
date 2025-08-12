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

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delay = 5000;

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, delay);
    return () => resetTimeout();
  }, [currentIndex]);

  function resetTimeout() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }

  // function goToPrev() {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
  //   );
  // }

  // function goToNext() {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
  //   );
  // }

  return (
    <div className=" max-w-xl mx-auto mt-15 font-poppins relative">
      {/* Carousel viewport */}
      <div className="overflow-hidden w-full">
       <div
  className="flex transition-transform duration-500 ease-in-out"
  style={{
    transform: `translateX(-${currentIndex * 100}%)`,
  }}
>
  {testimonials.map(({ text, name, company, img }, index) => (
    <div
      key={index}
      className="flex-shrink-0 w-full flex justify-center" // full slide width, center card
    >
      <div
        className="w-[95%] px-4 py-4 relative border border-yellow-400 rounded-lg shadow-sm bg-white"
        style={{
          borderWidth: "1px",
          borderColor: "#FFC250",
          boxShadow: "2px 2px 0 0 #F9B31B",
        }}
      >
        <p className="text-center text-[#1E1E1E] text-base font-medium leading-snug">
          {text}
        </p>

        <div className="flex items-center gap-3 justify-center mt-3">
          <img
            src={img}
            alt={name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="text-center">
            <p className="text-[#1E1E1E] font-semibold text-xs">{name}</p>
            <p className="text-[#1E1E1E] font-normal text-xs">{company}</p>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

      </div>

      {/* Navigation arrows */}
      {/* <button
        onClick={goToPrev}
        aria-label="Previous testimonial"
        className="absolute top-1/2 -translate-y-1/2 left-0 -ml-5 bg-yellow-400 hover:bg-yellow-300 transition-colors rounded-full w-10 h-10 flex items-center justify-center shadow-md"
      >
        ←
      </button>
      <button
        onClick={goToNext}
        aria-label="Next testimonial"
        className="absolute top-1/2 -translate-y-1/2 right-0 -mr-5 bg-yellow-400 hover:bg-yellow-300 transition-colors rounded-full w-10 h-10 flex items-center justify-center shadow-md"
      >
        →
      </button> */}

      {/* Dots navigation */}
      <div className="flex justify-center gap-3 mt-4">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === currentIndex ? "bg-yellow-400" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
