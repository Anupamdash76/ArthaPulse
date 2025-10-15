import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <>
      <Header />
      {/* The pt-20 adds top padding to push content below the fixed header */}
      <main className="pt-20 bg-gray-900 min-h-screen text-white">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;