// "use client";

// import Image from "next/image";
// import { useState, useEffect, ReactNode } from "react";
// import { usePathname } from "next/navigation";

// interface PageLoaderProps {
//   children?: ReactNode;
// }

// export default function PageLoader({ children }: PageLoaderProps) {
//   const [loading, setLoading] = useState(true);
//   const [homeLoaderPlayed, setHomeLoaderPlayed] = useState(false);
//   const pathname = usePathname();

//   // Homepage GIF duration in ms
//   const HOME_GIF_DURATION = 3800;

//   useEffect(() => {
//     if (pathname === "/") {
//       if (!homeLoaderPlayed) {
//         const timer = setTimeout(() => {
//           setLoading(false);
//           setHomeLoaderPlayed(true);
//         }, HOME_GIF_DURATION);
//         return () => clearTimeout(timer);
//       } else {
//         setLoading(false);
//       }
//     } else {
//       // Other pages loader
//       setLoading(true);
//       const timer = setTimeout(() => setLoading(false), 500);
//       return () => clearTimeout(timer);
//     }
//   }, [pathname, homeLoaderPlayed]);

//   if (loading) {
//     if (pathname === "/") {
//       return (
//         <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
          
//           {/* ✅ Desktop Loader */}
//           <div className="hidden md:block w-full h-full">
//             <Image
//               src="/video/loader2.gif"
//               alt="Home Loading Desktop..."
//               className="w-full h-screen object-cover"
//               width={100}
//               height={100}
//               priority
//             />
//           </div>

//           {/* ✅ Mobile Loader */}
//           <div className="block md:hidden w-full h-full">
//             <Image
//               src="/video/loader2-mob.gif"
//               alt="Home Loading Mobile..."
//               className="w-full h-screen object-cover"
//               width={100}
//               height={100}
//               priority
//             />
//           </div>

//         </div>
//       );
//     }

//     // Other pages loader
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
//         <Image
//           src="/video/loader3.gif"
//           alt="Loading..."
//           className="w-full h-screen object-cover"
//           width={100}
//           height={100}
//           priority
//         />
//       </div>
//     );
//   }

//   return <>{children}</>;
// }

























"use client";

import Image from "next/image";
import { useState, useEffect, ReactNode } from "react";

interface PageLoaderProps {
  children?: ReactNode;
}

export default function PageLoader({ children }: PageLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if mobile on mount and on resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    // Loader timeout
    const timer = setTimeout(() => setLoading(false), 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        {isMobile ? (
          <Image
            src="/video/loader3-mob.gif"
            alt="Loading..."
            className="w-full h-screen object-cover"
            width={100}
            height={100}
            priority
          />
        ) : (
          <Image
            src="/video/loader3.gif"
            alt="Loading..."
            className="w-full h-screen object-cover"
            width={100}
            height={100}
            priority
          />
        )}
      </div>
    );
  }

  return <>{children}</>;
}

