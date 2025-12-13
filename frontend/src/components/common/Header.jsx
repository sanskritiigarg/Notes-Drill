import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, Menu } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full h-16 backdrop-blur-xl border-b border-primary shadow-xs shadow-secondary">
      <div className="flex items-center justify-between h-full px-4">
        {/* Mobile Menu */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:block"></div>

        <div className="flex items-center gap-3">
          <button className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 bg-accent">
            <Bell
              size={20}
              strokeWidth={2}
              className="group-hover:scale-110 transition-transform duration-200"
            />

            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-foreground rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 border-l border-primary">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl transition-colors duration-200 cursor-pointer group">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent transition-all duration-200">
                <User size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-light">{user?.username || 'User'}</p>
                <p className="text-xs text-light">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
