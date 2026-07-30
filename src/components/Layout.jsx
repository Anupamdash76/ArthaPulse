import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-navy-900 text-white selection:bg-amber-500 selection:text-black">
      <Header />
      
      {/* Background ambient lighting effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-navy-900/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-300 font-montserrat">ArthaPulse Analytics</span>
            <span>•</span>
            <span>Real-time Market Data</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400/80" /> Live Feed</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" /> Verified Data</span>
            <span>© {new Date().getFullYear()} ArthaPulse. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;