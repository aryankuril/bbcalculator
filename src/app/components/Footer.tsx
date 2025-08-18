import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-start lg:gap-8 gap-4 text-left">
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
            <p className="font-bold text-lg break-words">
              hello@bombayblokes.com
            </p>
          </div>

          {/* Call */}
          <div>
            <p className="text-gray-500 font-semibold">Call Us</p>
            <p className="font-bold text-lg">+91 99875 58189</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t pt-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center text-gray-500 text-sm">
          {/* Links */}
          <div className="flex  items-start gap-1 md:flex-row md:gap-3 md:order-2">
            <Link
              href="https://bombayblokes.com/"
              className="hover:text-[#F9B31B] transition-colors"
            >
              Home
            </Link>
            <Link
              href="https://bombayblokes.com/our-clients/"
              className="hover:text-[#F9B31B] transition-colors"
            >
              Our Clients
            </Link>
            <Link
              href="https://bombayblokes.com/contact/"
              className="hover:text-[#F9B31B] transition-colors"
            >
              Contact
            </Link>
            <Link
              href="https://bombayblokes.com/client-registration/"
              className="hover:text-[#F9B31B] transition-colors"
            >
              Client Registration
            </Link>
            <Link
              href="https://bombayblokes.com/service-affiliates/"
              className="hover:text-[#F9B31B] transition-colors"
            >
              Service Affiliates
            </Link>
            <Link
              href="https://bombayblokes.com/service-affiliates/"
              className="hover:text-[#F9B31B] transition-colors"
            >
              Blogs
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-left md:order-1">
            Copyright ©2023 Bombay Blokes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
