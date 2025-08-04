import React from 'react';
import { NavLink } from 'react-router-dom';
import { SiBitcoinsv } from "react-icons/si";
import { FaSun, FaMoon } from 'react-icons/fa';
import { useAppStore } from '../store';

const Header = () => {
  const { theme, toggleTheme } = useAppStore();
  
  const activeStyle = {
    color: '#F97316',
  };

  return (
    <header className='flex items-center justify-between bg-white/10 dark:bg-gray-900 px-8 py-4 fixed w-full top-0 z-50 shadow-lg backdrop-blur-md'>
      <NavLink to='/' className="flex items-center gap-3 text-gray-800 dark:text-white text-2xl font-bold font-montserrat">
        <SiBitcoinsv className='text-orange-500' size={25} />
        <h1>CryptoTrack</h1>
      </NavLink>
      <div className="flex items-center gap-10">
        <nav>
          <ul className='flex items-center gap-10 text-lg'>
            <li><NavLink to='/' style={({ isActive }) => isActive ? activeStyle : undefined} className='text-gray-600 dark:text-white hover:text-orange-500 transition-colors'>Home</NavLink></li>
            <li><NavLink to='/coins' style={({ isActive }) => isActive ? activeStyle : undefined} className='text-gray-600 dark:text-white hover:text-orange-500 transition-colors'>Coins</NavLink></li>
          </ul>
        </nav>
        {/* Theme Toggle Button */}
        <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
          {theme === 'dark' ? <FaSun size={22} /> : <FaMoon size={22} />}
        </button>
      </div>
    </header>
  );
};

export default Header;