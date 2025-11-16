import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full h-full  bg-white border-t border-gray-200">
      <div className=" mt-3 py-5 lg:pb-0 pb-23 container  h-full">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-start lg:gap-8 gap-4 text-left ">
          {/* Logo */}
          <div className="flex justify-start">
            <Link href="https://bombayblokes.com/">
            <Image
              src="/images/bblogo.webp"
              alt="Bombay Blokes Logo"
              width={250}
              height={60}
              className="object-contain"
            />
            </Link>
          </div>


          {/* Mail */}
          <div>
            <p className="text-gray-500 font-semibold">Mail Us</p>
            <p className="font-bold  text-black text-[22px] break-words">
              hello@bombayblokes.com
            </p>
          </div>

          {/* Call */}
          <div>
            <p className="text-gray-500 font-semibold">Call Us</p>
            <p className="font-bold text-[22px] text-black ">+91 99875 58189</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 border-t pt-4 lg:pt-1 flex flex-col gap-2 md:flex-row md:justify-between md:items-center text-gray-500 text-sm">
          {/* Links */}
         <div className="flex flex-wrap items-start gap-1 md:gap-3 md:order-2">
  <Link
    href="https://bombayblokes.com"
    className="hover:text-[#F9B31B] transition-colors border-r border-gray-400 pr-2"
  >
    Home
  </Link>
  <Link
    href="https://bombayblokes.com/clients"
    className="hover:text-[#F9B31B] transition-colors border-r border-gray-400 pr-2"
  >
    Our Clients
  </Link>
  <Link
    href="https://bombayblokes.com/contactus"
    className="hover:text-[#F9B31B] transition-colors border-r border-gray-400 pr-2"
  >
    Contact
  </Link>
  <Link
    href="https://bombayblokes.com/client-registration"
    className="hover:text-[#F9B31B] transition-colors border-r border-gray-400 pr-2"
  >
    Client Registration
  </Link>
  <Link
    href="https://bombayblokes.com/blogs"
    className="hover:text-[#F9B31B] transition-colors"
  >
    Blogs
  </Link>
</div>

          {/* Copyright */}
          <p className="text-left md:order-1  ">
            Copyright ©2023 Bombay Blokes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
