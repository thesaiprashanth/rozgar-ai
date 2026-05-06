import React from 'react';
import {
  LogOut,
  User,
  Bell,
  Search,
  Home,
  Briefcase,
  Sparkles,
  Settings,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { cn } from '../utils/cn';

export const Navbar = ({ user }: { user: any }) => {
  return (
    <nav className="h-16 border-b border-black/5 bg-white flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <Sparkles className="text-white w-6 h-6" />
        </div>

        <span className="font-bold text-xl tracking-tight text-slate-800">
          Rozgar AI
        </span>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-orange-600 transition-colors">
            Home
          </Link>

          <Link
            to="/search"
            className="hover:text-orange-600 transition-colors"
          >
            Internship Search
          </Link>

          <Link
            to="/recommendations"
            className="hover:text-orange-600 transition-colors"
          >
            Recommendations
          </Link>

          <Link
            to="/applications"
            className="hover:text-orange-600 transition-colors"
          >
            My Applications
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
            <Bell className="w-5 h-5 text-slate-600" />

            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
            <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-slate-500" />
              )}
            </div>

            <span className="text-sm font-semibold text-slate-700">
              {user?.name || user?.displayName || 'User'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Search, label: 'Internship Search', path: '/search' },
    { icon: Sparkles, label: 'Recommendations', path: '/recommendations' },
    { icon: Briefcase, label: 'My Applications', path: '/applications' },
    { icon: User, label: 'Edit Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="w-64 border-r border-black/5 bg-white h-[calc(100vh-64px)] p-4 hidden lg:block relative">
      <div className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group',
              location.pathname === item.path
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <item.icon
              className={cn(
                'w-5 h-5 transition-colors',
                location.pathname === item.path
                  ? 'text-orange-600'
                  : 'text-slate-400 group-hover:text-slate-600'
              )}
            />

            {item.label}
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4 pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};