import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  History,
  Settings,
  Cpu,
  LogOut,
  ChevronDown,
  Building2,
  Bell,
  UserCheck,
} from 'lucide-react';
import { CursorSpotlight } from '../common/CursorSpotlight';
import { MOCK_CENTRES } from '../../data/mockData';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCentre, setSelectedCentre] = useState(MOCK_CENTRES[0]);
  const [centreDropdownOpen, setCentreDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Upload & Scan', icon: UploadCloud, path: '/dashboard' },
    { label: 'Batch Results', icon: LayoutDashboard, path: '/results' },
    { label: 'Procurement Log', icon: History, path: '/history' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D0A] flex text-[#F4F1E8] font-sans relative overflow-x-hidden">
      <CursorSpotlight />

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#2A2E22] bg-[#14170F] flex flex-col justify-between flex-shrink-0 hidden md:flex z-20">
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[#2A2E22]">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#0B0D0A] border border-[#D4FF3F]/40 flex items-center justify-center text-[#D4FF3F]">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-tight text-[#F4F1E8]">
                  AGRIGRADE<span className="text-[#D4FF3F]">.AI</span>
                </span>
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#8C9080]">
                  Terminal v4.2
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <div className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#8C9080]">
              CV Core Operations
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/results' && location.pathname.startsWith('/results'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#D4FF3F] text-[#0B0D0A] font-bold shadow-lime-glow'
                      : 'text-[#F4F1E8]/70 hover:bg-white/[0.04] hover:text-[#D4FF3F]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-6 px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#8C9080]">
              Hardware Config
            </div>
            <button
              onClick={() => alert('Camera ring light calibration: Nominal. Lens distortion correction active.')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono text-[#F4F1E8]/70 hover:bg-white/[0.04] hover:text-[#D4FF3F] transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Lens Calibration</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-[#2A2E22] space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0B0D0A] border border-[#2A2E22]">
            <div className="w-8 h-8 rounded-full bg-[#D4FF3F]/10 text-[#D4FF3F] flex items-center justify-center font-bold font-mono text-xs">
              RP
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold truncate text-[#F4F1E8]">
                Rajesh Patil
              </span>
              <span className="text-[10px] text-[#8C9080] font-mono truncate">
                Shift A • Lead Inspector
              </span>
            </div>
            <button
              onClick={() => navigate('/login')}
              title="Sign Out"
              className="p-1 text-[#8C9080] hover:text-[#FF4444] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Header */}
        <header className="h-16 border-b border-[#2A2E22] bg-[#14170F]/80 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          {/* Procurement Centre Switcher */}
          <div className="relative">
            <button
              onClick={() => setCentreDropdownOpen(!centreDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#2A2E22] bg-[#0B0D0A] text-xs font-mono text-[#F4F1E8] hover:border-[#D4FF3F] transition-colors"
            >
              <Building2 className="w-4 h-4 text-[#D4FF3F]" />
              <span className="font-semibold">{selectedCentre.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C9080]" />
            </button>

            {centreDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#14170F] border border-[#2A2E22] rounded-xl shadow-dark-card p-2 z-30 space-y-1">
                <div className="px-2 py-1 text-[10px] uppercase tracking-wider font-mono text-[#8C9080]">
                  Select APMC Inspection Yard
                </div>
                {MOCK_CENTRES.map((centre) => (
                  <button
                    key={centre.id}
                    onClick={() => {
                      setSelectedCentre(centre);
                      setCentreDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                      selectedCentre.id === centre.id
                        ? 'bg-[#D4FF3F]/10 text-[#D4FF3F] font-bold'
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{centre.name}</div>
                      <div className="text-[10px] text-[#8C9080]">{centre.state} • {centre.activeLines} Lines</div>
                    </div>
                    {selectedCentre.id === centre.id && <UserCheck className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-[#8C9080] hover:text-[#D4FF3F] transition-colors"
            >
              Landing Page
            </Link>

            <button
              aria-label="Notifications"
              className="p-2 rounded-xl border border-[#2A2E22] bg-[#0B0D0A] relative text-[#8C9080] hover:text-[#F4F1E8]"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4FF3F]" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
