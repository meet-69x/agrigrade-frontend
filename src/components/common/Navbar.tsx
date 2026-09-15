import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X, Cpu } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Grade Standards', href: '#grades' },
    { label: 'Why it matters', href: '#why-it-matters' },
    { label: 'Inspector Login', href: '/login' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0D0A]/85 backdrop-blur-xl border-b border-[#2A2E22] py-3 shadow-dark-card'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#14170F] border border-[#2A2E22] flex items-center justify-center text-[#D4FF3F] group-hover:border-[#D4FF3F] transition-colors shadow-lime-glow">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold tracking-tight text-[#F4F1E8] leading-none">
                AGRIGRADE<span className="text-[#D4FF3F]">.AI</span>
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#8C9080] mt-1">
                Lab Grade CV Standard
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-mono tracking-wider uppercase text-[#F4F1E8]/70 hover:text-[#D4FF3F] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-4">
            <MagneticButton variant="primary" onClick={() => navigate('/dashboard')}>
              <span>Launch Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-[#2A2E22] bg-[#14170F] text-[#F4F1E8]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0D0A] border-b border-[#2A2E22] px-6 pt-4 pb-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-mono tracking-wider text-[#F4F1E8] py-2"
            >
              {link.label}
            </a>
          ))}
          <MagneticButton
            variant="primary"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/dashboard');
            }}
            className="w-full"
          >
            <span>Launch Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      )}
    </header>
  );
};
