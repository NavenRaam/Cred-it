// components/Layout.jsx (Example)
import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Import your Sidebar
import Header from './Header'; // If you have a header

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // ... (state for profile, etc.)

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        // ... pass other props
      />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;