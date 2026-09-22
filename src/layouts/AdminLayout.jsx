import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Images, LogOut, Menu, X } from 'lucide-react';
import { logout } from '../services/authService';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Gallery', path: '/gallery', icon: Images },
];

/** Gold ring monogram — echoes the website's ornamental circle motif. */
function Monogram() {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/50 text-goldlight">
      <span className="grid size-7 place-items-center rounded-full border border-gold/30">
        <span className="font-serif text-lg leading-none text-goldlight">N</span>
      </span>
    </span>
  );
}

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md border px-3 py-2.5 text-sm tracking-[0.14em] uppercase transition-colors ${
    isActive
      ? 'border-gold/40 bg-gold/10 text-goldlight'
      : 'border-transparent text-cream/60 hover:border-gold/25 hover:bg-gold/5 hover:text-cream'
  }`;

const AdminLayout = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate('/login');
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-walnut">
      {/* Logo / wordmark */}
      <div className="flex h-16 items-center gap-3 border-b border-gold/15 px-6">
        <Monogram />
        <div className="leading-tight">
          <div className="font-serif text-lg tracking-[0.22em] text-goldlight">NRITHYA</div>
          <div className="text-[10px] tracking-[0.42em] text-cream/50">DEGULA</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {navItems.map((item) => (
          <NavLink key={item.name} to={item.path} end className={navLinkClass}>
            <item.icon size={17} strokeWidth={1.5} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gold/15 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm tracking-[0.14em] text-cream/60 uppercase transition-colors hover:border-gold/25 hover:bg-gold/5 hover:text-cream"
        >
          <LogOut size={17} strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-espresso text-cream">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-gold/15 lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-espresso/80 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute top-0 left-0 h-full w-64 border-r border-gold/15 shadow-2xl animate-fade-in">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-gold/15 bg-walnut px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="grid size-9 place-items-center rounded-md border border-gold/25 text-cream/80 lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span className="font-serif text-base tracking-[0.18em] text-cream/80 uppercase">
              Nrithya Degula <span className="text-gold/60">·</span> Admin
            </span>
          </div>
          <span className="hidden text-xs tracking-[0.3em] text-cream/40 uppercase sm:block">
            Gallery Management
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
