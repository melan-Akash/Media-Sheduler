import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './sidebar';
import { MenuIcon } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/accounts': 'Social Accounts',
  '/scheduler': 'Post Scheduler',
  '/ai-composer': 'AI Composer'
};

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Social AI';

  return (
    <div className="flex h-screen bg-slate-50/50">
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar / Header */}
        <header className="bg-white border-b border-slate-100 py-4 px-8 flex items-center gap-4">
          <button 
            className="md:hidden p-1 text-slate-500 hover:bg-slate-50 rounded-lg transition-all"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <MenuIcon className="size-6" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
            <p className="text-xs text-slate-400">Manage and automate your social presence</p>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}