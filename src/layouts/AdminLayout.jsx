import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, LogOut, Settings, Users, Bell, Search } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Gallery', path: '/gallery', icon: <ImageIcon size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white">
              N
            </div>
            Nithya
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5 w-96 focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:border-purple-500 transition-all">
            <Search size={16} className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm text-slate-200 w-full placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full border border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4 ml-2">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-slate-200">Admin User</div>
                <div className="text-xs text-slate-500">admin@nithya.com</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-0.5">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                  alt="Avatar"
                  className="w-full h-full rounded-full bg-slate-900"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-950 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
