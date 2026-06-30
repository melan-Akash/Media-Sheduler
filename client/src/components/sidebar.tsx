import { NavLink, useLocation, Link } from 'react-router-dom';
import { LayoutDashboardIcon, UserIcon, CalendarDaysIcon, SparklesIcon, LogOutIcon } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboardIcon, path: '/dashboard' },
  { name: 'Accounts', icon: UserIcon, path: '/accounts' },
  { name: 'Scheduler', icon: CalendarDaysIcon, path: '/scheduler' },
  { name: 'AI Composer', icon: SparklesIcon, path: '/ai-composer' } // Note: AI icon assumed from context
];

import { useApp } from '../context/appcontext';

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const location = useLocation();
  const { user, logout } = useApp();

  return (
    <div className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-slate-100 transition-transform duration-300 md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer">
          <img src="/logo.svg" alt="logo" className="size-6 text-red-500" />
          <span className="text-xl font-bold text-slate-800 font-sans">Media Scheduler</span>
        </Link>
      </div>

      {/* Nav Section Label */}
      <div className="px-6 py-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wider">MENU</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink 
              key={item.name} 
              to={item.path} 
              id={item.name === 'Accounts' ? 'tour-nav-accounts' : item.name === 'Scheduler' ? 'tour-nav-scheduler' : item.name === 'AI Composer' ? 'tour-nav-composer' : undefined}
              end={item.path === '/dashboard'}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive ? 'bg-red-50/50 text-red-500' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`size-5 shrink-0 ${isActive ? 'text-red-500' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </div>
              {isActive && <span className="w-1 h-5 bg-red-500 rounded-full" />}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-3">
          {/* User Initial Icon */}
          <div className="size-10 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold text-base shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          {/* User Name & Email */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
          </div>
        </div>
        
        {/* Sign Out Button */}
        <button 
          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all" 
          onClick={logout}
        >
          <LogOutIcon className="size-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}