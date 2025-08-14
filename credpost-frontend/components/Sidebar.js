import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import {
  LogOut,
  User,
  Newspaper,
  LayoutDashboard,
  List,
  X, // For closing mobile sidebar
} from 'lucide-react';

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  session,
  profileDropdownRef,
  showProfileDropdown,
  setShowProfileDropdown,
}) => {
  const router = useRouter();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
    setShowProfileDropdown(false);
  };

  return (
    <>
      {/* Overlay for mobile sidebar when open */}
      {isSidebarOpen && (
        <div
          className="flex h-screen inset-0 bg-gray-900 bg-opacity-70 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar itself */}
      <aside className={`fixed md:relative h-screen flex-shrink-0
        ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full'}
        md:w-20 md:hover:w-64 md:translate-x-0
        bg-gray-900 shadow-lg p-6 flex flex-col justify-between
        rounded-r-2xl transition-all duration-300 ease-in-out group z-40`}>
        <div>
          {/* Logo */}
          <div className="flex items-center mb-10 overflow-hidden">
            <Newspaper className="h-8 w-8 text-emerald-400 flex-shrink-0" />
            <h1 className={`text-2xl font-bold text-gray-100 ml-2 whitespace-nowrap transition-opacity duration-300
              ${isSidebarOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>Cred-it</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-4">
            <Link href="/dashboard" className={`flex items-center font-semibold p-3 rounded-lg whitespace-nowrap transition-colors duration-200
              ${router.pathname === '/dashboard' ? 'text-emerald-400 bg-gray-800 shadow-inner' : 'text-gray-300 hover:bg-gray-800'}`}
              onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile after navigation
            >
              <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
              <span className={`ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>Dashboard</span>
            </Link>
            <Link href="/my-posts" className={`flex items-center font-semibold p-3 rounded-lg whitespace-nowrap transition-colors duration-200
              ${router.pathname === '/my-posts' ? 'text-emerald-400 bg-gray-800 shadow-inner' : 'text-gray-300 hover:bg-gray-800'}`}
              onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile after navigation
            >
              <List className="h-5 w-5 flex-shrink-0" />
              <span className={`ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>My Posts</span>
            </Link>
          </nav>
        </div>

        {/* Profile Button */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center w-full p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors duration-200"
          >
            <User className="h-5 w-5 mr-3 flex-shrink-0" />
            {/* Display username or email */}
            <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              {session?.user?.email ? session.user.email.split('@')[0] : 'Profile'} {/* Displays part before @ as username */}
            </span>
          </button>
          {/* Dropdown for logout */}
          {showProfileDropdown && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl animate-fade-in z-20">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full p-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;