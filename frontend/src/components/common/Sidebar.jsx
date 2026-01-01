import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LayoutDashboard, FileText, User, LogOut, BookOpen, X, Dock } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      text: 'Dashboard',
    },
    {
      to: '/documents',
      icon: FileText,
      text: 'Documents',
    },
    {
      to: '/flashcards',
      icon: Dock,
      text: 'Flashcards',
    },
    {
      to: '/profile',
      icon: User,
      text: 'Profile',
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 md: hidden transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 backdrop-blur-xl border-r border-primary shadow-sm shadow-secondary z-50 md:relative md:w-64 md:shrink-0 md:flex md:flex-col md:translate-x-0 transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo and Close button for mobile */}
        <div className="flex items-center justify-between h-16 px-2 border-b border-primary shadow-xs shadow-secondary">
          <div className="flex items-center gap-3 pl-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl shadow-md bg-accent">
              <BookOpen className="w-6 h-6 text-foreground" />
            </div>
            <h1 className="text-base md:text-base font-bold tracking-tight">Notes Drill</h1>
          </div>
          <button onClick={toggleSidebar} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `group flex items-center gap3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${isActive ? 'bg-linear-to-r to-primary from-secondary shadow-lg' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    size={18}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 mr-2 ${isActive ? '' : 'group-hover:scale-110'}`}
                  />
                  {link.text}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="px-3 py-4 border-t border-primary">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold hover:bg-red-500 rounded-md transition-all duration-200 cursor-pointer"
          >
            <LogOut
              size={18}
              strokeWidth={2.5}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
