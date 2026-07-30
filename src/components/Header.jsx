import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Activity, Building2, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Exchanges', icon: Building2 },
    { path: '/coins', label: 'Coins', icon: Coins },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-header transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink 
          to="/" 
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:border-amber-400/50 transition-all duration-300 shadow-glow-amber">
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight font-montserrat text-white group-hover:text-amber-400 transition-colors">
              Artha<span className="text-amber-400">Pulse</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
              Fintech Intelligence
            </span>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-8">
          <nav className="flex items-center gap-1.5 p-1 rounded-xl bg-navy-800/80 border border-white/5 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-navy-700 rounded-lg border border-amber-500/30 shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 z-10 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="z-10">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
