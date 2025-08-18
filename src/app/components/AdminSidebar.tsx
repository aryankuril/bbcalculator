"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  FormInput,
  FolderOpen,
  Users,
  LogOut,
  Building,
} from 'lucide-react';

/**
 * The AdminSidebar component for navigation. It uses the current URL
 * to determine which link should be active.
 */
export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Handler for the logout button
  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col justify-between rounded-r-2xl shadow-xl">
      <div>
        <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-2">
          {/* Form Submissions Link */}
          <button
            onClick={() => router.push('/admin/forms')}
            className={`flex items-center gap-3 py-3 px-4 rounded-lg font-semibold transition-colors ${pathname === '/admin/forms' ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800'}`}
          >
            <FormInput size={20} />
            Form Submissions
          </button>
          
          {/* Questions/Routes Link */}
          <button
            onClick={() => router.push('/admin/questions')}
            className={`flex items-center gap-3 py-3 px-4 rounded-lg font-semibold transition-colors ${pathname === '/admin/questions' ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800'}`}
          >
            <FolderOpen size={20} />
            Questions/Routes
          </button>
          
          {/* Users Link */}
          <button
            onClick={() => router.push('/admin/users')}
            className={`flex items-center gap-3 py-3 px-4 rounded-lg font-semibold transition-colors ${pathname === '/admin/users' ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800'}`}
          >
            <Users size={20} />
            Users
          </button>
          
          {/* Departments Link */}
          <button
            onClick={() => router.push('/admin/departments')}
            className={`flex items-center gap-3 py-3 px-4 rounded-lg font-semibold transition-colors ${pathname === '/admin/departments' ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800'}`}
          >
            <Building size={20} />
            Departments
          </button>
        </nav>
      </div>

      {/* Logout button */}
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="flex items-center w-full justify-center gap-3 py-3 px-4 rounded-lg font-semibold transition-colors bg-red-600 hover:bg-red-700"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
