"use client";
import { useRouter } from "next/navigation"; // ✅ This works with App Router
import { useEffect, useState } from "react";

export default function Navbar({ role }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("role");
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setUser(storedRole);
  }, []);

  return (
    <div className="fixed top-4 left-300 z-50">
      {!user && (
        <div className="flex gap-2">
          <button
  onClick={() => router.push("/login")}
  className="flex items-center justify-center gap-2 px-[30px] py-[10px] rounded-[5px] italic 
             border shadow-[2px_2px_0px_0px_#262626] transition-colors text-[16px] font-[400] 
             bg-[#F9B31B] border-[#262626] text-[#262626]"
>
  Login
</button>

     <button 
  onClick={() => router.push("/signup")}
  className="flex items-center justify-center gap-2 px-[30px] py-[10px] rounded-[5px] font-medium
             border-2 transition-colors bg-black border-black text-white 
             shadow-[2px_2px_0px_0px_#F9B31B]"
>
  Signup
</button>

        </div>
      )}

      {user === "admin" && (
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center justify-center gap-2 px-[30px] py-[10px] rounded-[5px] font-medium
             border-2 transition-colors bg-black border-black text-white 
             shadow-[2px_2px_0px_0px_#F9B31B]"
        >
          Admin Dashboard
        </button>
      )}

      {user && user !== "admin" && (
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-[30px] py-[10px] rounded-[5px] italic 
             border shadow-[2px_2px_0px_0px_#262626] transition-colors text-[16px] font-[400] 
             bg-[#F9B31B] border-[#262626] text-[#262626]"
        >
          Logout
        </button>
      )}
    </div>
  );
}
