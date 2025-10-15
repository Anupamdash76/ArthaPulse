import React from 'react';
import { NavLink } from 'react-router-dom';
import { SiBitcoinsv } from "react-icons/si";
import { FaSun, FaMoon } from 'react-icons/fa';
import { useAppStore } from '../store';

const Header = () => {
  const { theme, toggleTheme } = useAppStore();
  
  // Active link style for light and dark modes
  const getActiveStyle = ({ isActive }) => {
    return isActive ? { color: '#F97316' } : {};
  };

  return (
    <header className='flex items-center justify-between px-8 py-4 fixed w-full top-0 z-50 transition-colors duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md dark:border-b dark:border-slate-800'>
      <NavLink to='/' className="flex items-center gap-3 text-slate-800 dark:text-white text-2xl font-bold font-montserrat">
        <SiBitcoinsv className='text-orange-500' size={25} />
        <h1>ArthaPulse</h1>
      </NavLink>
      <div className="flex items-center gap-10">
        <nav>
          <ul className='flex items-center gap-10 text-lg'>
            <li><NavLink to='/' style={getActiveStyle} className='text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors'>Home</NavLink></li>
            <li><NavLink to='/coins' style={getActiveStyle} className='text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors'>Coins</NavLink></li>
          </ul>
        </nav>
        <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors">
          {theme === 'dark' ? <FaSun size={22} /> : <FaMoon size={22} />}
        </button>
      </div>
    </header>
  );
};

export default Header;