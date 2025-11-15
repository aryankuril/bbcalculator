import React from 'react'
import Image from 'next/image';
import Button from "./Button";

const Landing = () => {
  return (
   <div
  className="w-full h-screen relative bg-no-repeat bg-center bg-cover px-4 py-10 md:py-0"
  style={{ backgroundImage: "url('/images/your-background.png')" }} // if you have a background
>
  <div className="max-w-7xl mx-auto w-full h-full flex flex-col-reverse md:flex-row items-center justify-center gap-8 relative z-10">
    
    {/* Text Section */}
    <div className="text-center md:text-left px-5 py-10 space-y-4 w-full md:w-1/2 z-20">
      <h1 className="text-[34px] sm:text-[28px] md:text-5xl text-black leading-tight">
        Estimate Your Project
      </h1>

      <div className="flex md:flex-row items-center justify-center md:justify-start gap-3 sm:gap-5">
        <span
          className="relative flex items-center justify-center w-[93px] h-[43px] text-[26px] sm:text-[32px] md:text-[35px] text-black text-center capitalize font-Poppins px-2 py-1 rounded-[5px]"
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

        <span className="text-[24px] sm:text-[28px] md:text-5xl text-black">
          Instantly
        </span>
      </div>


       <Button
                      href="https://bombayblokes.com/estimates-calculator"
                      text="Calculate Now"
                      className="relative justify-center text-black  transition-colors"
                    />

      {/* <button
        className="cursor-pointer mt-6 inline-flex items-center font-poppins justify-center gap-[10px] px-[30px] py-[10px] rounded-[5px] text-white text-[16px] sm:text-[18px]"
        style={{
          background: "#262626",
          boxShadow: "2px 2px 0px 0px #F9B31B",
        }}
        //  onClick={() => window.location.href = "https://bombayblokes.com/estimates-calculator/"}
          onClick={() => window.location.href = "https://estimates.bombayblokes.com/website"}
      >
        Calculate Now
      </button> */}
    </div>

    {/* Image Section */}
    <div className="relative w-full md:w-[600px] h-[300px] md:h-[500px] lg:h-[553px] z-0">
      <Image
        src="/images/hero2.png"
        alt="Desk Illustration"
        fill
        className="object-contain"
      />
    </div>
  </div>
</div>

  )
}

export default Landing;
