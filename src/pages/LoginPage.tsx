import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cpu, ArrowRight, Lock, Mail, UserCheck, Shield } from 'lucide-react';
import type { UserRole } from '../types';
import { CursorSpotlight } from '../components/common/CursorSpotlight';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('Operator');
  const [email, setEmail] = useState('rajesh.patil@apmc-nashik.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const roles: UserRole[] = ['Operator', 'Quality Auditor', 'Procurement Manager', 'Admin'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0B0D0A] text-[#F4F1E8] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <CursorSpotlight />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-[#2A2E22] bg-[#14170F] shadow-dark-card z-10">
        {/* Left Side Visual Banner */}
        <div className="relative p-8 md:p-12 bg-[#0B0D0A] flex flex-col justify-between overflow-hidden border-r border-[#2A2E22]">
          <div className="relative z-10 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#14170F] border border-[#D4FF3F]/40 flex items-center justify-center text-[#D4FF3F]">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-[#F4F1E8]">
                AGRIGRADE<span className="text-[#D4FF3F]">.AI</span>
              </span>
            </Link>

            <div className="space-y-3 pt-8">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D4FF3F]">
                Terminal Authorization
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-[#F4F1E8]">
                Standardizing agricultural inspection lines.
              </h2>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-[#2A2E22] space-y-2">
            <p className="text-xs text-[#8C9080] italic font-mono">
              &ldquo;Accurate computer vision grading protects both farmer payout & mandi line margins.&rdquo;
            </p>
            <div className="text-[10px] text-[#D4FF3F] font-mono">
              APMC Security Ledger v4.2 Active
            </div>
          </div>
        </div>

        {/* Right Side Form inside TiltCard */}
        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6 bg-[#14170F]">
          <div className="space-y-2">
            <h3 className="font-display text-2xl font-bold text-[#F4F1E8]">
              Inspector Terminal Sign In
            </h3>
            <p className="text-xs text-[#8C9080]">
              Select your system authorization role to enter the Mandi grading line.
            </p>
          </div>

          {/* Role Selector Pills */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#8C9080]">
              Authorization Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono transition-all text-left flex items-center justify-between border ${
                    role === r
                      ? 'bg-[#D4FF3F] text-[#0B0D0A] border-[#D4FF3F] font-bold shadow-lime-glow'
                      : 'bg-[#0B0D0A] border-[#2A2E22] text-[#8C9080] hover:border-[#D4FF3F]/50'
                  }`}
                >
                  <span>{r}</span>
                  {role === r && <UserCheck className="w-3.5 h-3.5 text-[#0B0D0A]" />}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#8C9080]">
                Inspector ID / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C9080] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2A2E22] bg-[#0B0D0A] text-xs font-mono text-[#F4F1E8] focus:outline-none focus:border-[#D4FF3F] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-mono text-[#8C9080]">
                  Terminal Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C9080] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2A2E22] bg-[#0B0D0A] text-xs font-mono text-[#F4F1E8] focus:outline-none focus:border-[#D4FF3F] transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#D4FF3F] hover:bg-[#C2F02B] text-[#0B0D0A] font-bold text-xs font-mono tracking-wider shadow-lime-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating terminal...</span>
              ) : (
                <>
                  <span>Sign in as {role}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Bypass */}
          <div className="pt-2 text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs font-mono text-[#D4FF3F] hover:underline inline-flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Quick Demo Access (Skip Login)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
