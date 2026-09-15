import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0D0A] text-[#F4F1E8] pt-20 pb-12 border-t border-[#2A2E22] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-[#2A2E22]">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#14170F] border border-[#D4FF3F]/40 flex items-center justify-center text-[#D4FF3F]">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-[#F4F1E8]">
                AGRIGRADE<span className="text-[#D4FF3F]">.AI</span>
              </span>
            </div>
            <p className="text-xs text-[#8C9080] leading-relaxed">
              Standardizing agricultural produce inspection across Mandis & procurement centers through sub-millimeter computer vision hardware & AI models.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4FF3F] bg-[#14170F] border border-[#2A2E22] px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-[#D4FF3F] animate-ping" />
              APMC Neural Pipeline: Active
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-[#D4FF3F] mb-4">
              Terminal Routes
            </h4>
            <ul className="space-y-3 text-xs text-[#8C9080] font-mono">
              <li>
                <Link to="/" className="hover:text-[#F4F1E8] transition-colors">Landing Overview</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#F4F1E8] transition-colors">Overhead CV Scanner</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-[#F4F1E8] transition-colors">Mandi Audit Ledger</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#F4F1E8] transition-colors">Inspector Sign In</Link>
              </li>
            </ul>
          </div>

          {/* Defect Standards */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-[#D4FF3F] mb-4">
              Neural Models
            </h4>
            <ul className="space-y-3 text-xs text-[#8C9080] font-mono">
              <li>Equatorial Diameter (mm)</li>
              <li>Basal Plate Rot Detection</li>
              <li>Neck Closure Integrity</li>
              <li>Skin Tear & Double Bulb</li>
            </ul>
          </div>

          {/* Compliance & Contact */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-[#D4FF3F] mb-4">
              Deployment Hubs
            </h4>
            <p className="text-xs text-[#8C9080] leading-relaxed mb-4">
              Deployed across APMC Lasalgaon, Nashik, Neemuch, Karnal, & Madurai inspection lines.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8C9080] font-mono">
              <ShieldCheck className="w-4 h-4 text-[#D4FF3F]" />
              <span>IS 4805:1968 Certified Standard</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C9080] font-mono gap-4">
          <p>© {new Date().getFullYear()} AgriGrade AI Inc. Lab-Grade Computer Vision System.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#F4F1E8] cursor-pointer">Protocol</span>
            <span className="hover:text-[#F4F1E8] cursor-pointer">API Specs</span>
            <span className="hover:text-[#F4F1E8] cursor-pointer">Security Ledger</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
