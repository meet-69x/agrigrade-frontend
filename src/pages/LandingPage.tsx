import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Camera,
  Cpu,
  CheckCircle,
  ArrowRight,
  Target,
  CheckCircle2,
  Zap,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Award,
  Scan,
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CountUpNumber } from '../components/common/CountUpNumber';
import { GradeBadge } from '../components/common/GradeBadge';
import { MagneticButton } from '../components/common/MagneticButton';
import { TiltCard } from '../components/common/TiltCard';
import { MarqueeTicker } from '../components/common/MarqueeTicker';
import { CursorSpotlight } from '../components/common/CursorSpotlight';
import { Hero3DOnion } from '../components/3d/Hero3DOnion';
import { GRADE_CRITERIA_SHOWCASE, VALUE_CARDS, SYSTEM_STATS } from '../data/mockData';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const fadeInRise: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const steps = [
    {
      step: '01',
      title: 'Overhead CV Batch Capture',
      icon: Camera,
      description: 'Overhead industrial camera or mobile sensor captures top-down high-contrast batch photography under ring lighting.',
      tag: 'OPTICAL SENSOR',
    },
    {
      step: '02',
      title: 'Multi-Model Neural Detection',
      icon: Cpu,
      description: 'YOLOv8 computer vision models detect individual onion boundaries, compute diameter down to 0.5mm precision, and flag rot.',
      tag: 'YOLOV8 ENSEMBLE',
    },
    {
      step: '03',
      title: 'Certified APMC Grade Certificate',
      icon: Award,
      description: 'Generates instant Grade A/B/C breakdown charts, total batch weight estimates, and official Mandi procurement certificates.',
      tag: 'INSTANT LEDGER',
    },
  ];

  const getValueIcon = (name: string) => {
    switch (name) {
      case 'Target': return Target;
      case 'CheckCircle2': return CheckCircle2;
      case 'Zap': return Zap;
      case 'ShieldCheck': return ShieldCheck;
      case 'TrendingUp': return TrendingUp;
      default: return Sparkles;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D0A] text-[#F4F1E8] font-sans overflow-x-hidden relative selection:bg-[#D4FF3F] selection:text-[#0B0D0A]">
      <CursorSpotlight />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInRise} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14170F] border border-[#D4FF3F]/30 text-[#D4FF3F] text-xs font-mono tracking-widest uppercase">
              <Scan className="w-3.5 h-3.5" />
              <span>APMC COMPUTER VISION STANDARD</span>
            </motion.div>

            <motion.h1
              variants={fadeInRise}
              className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-[#F4F1E8]"
            >
              Objective grading.<br />
              <span className="text-[#D4FF3F]">Every onion,</span> every time.
            </motion.h1>

            <motion.p
              variants={fadeInRise}
              className="text-base sm:text-lg text-[#8C9080] leading-relaxed max-w-2xl font-sans"
            >
              Manual eyeball inspection at Mandis is plagued by visual fatigue, subjective size estimations, and pricing disputes. AgriGrade AI deploys high-speed computer vision models to measure bulb diameter, detect neck rot, and assign certified grades in seconds.
            </motion.p>

            <motion.div variants={fadeInRise} className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <MagneticButton variant="primary" onClick={() => navigate('/dashboard')}>
                <span>Start Batch Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>

              <a
                href="#how-it-works"
                className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-[#D4FF3F]/50 text-xs font-mono tracking-wider uppercase text-[#F4F1E8] text-center transition-all"
              >
                See how it works
              </a>
            </motion.div>

            {/* Micro Specs */}
            <motion.div variants={fadeInRise} className="pt-6 flex items-center gap-6 text-xs font-mono text-[#8C9080] border-t border-[#2A2E22]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#D4FF3F]" />
                <span>Zero Caliper Manual Touch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#D4FF3F]" />
                <span>IS 4805 Mandi Compliant</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Hero 3D Interactive Component */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Hero3DOnion />
          </motion.div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <MarqueeTicker />

      {/* Problem Editorial Pull-Quote Section */}
      <section className="py-24 bg-[#14170F]/50 border-y border-[#2A2E22] relative">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30 text-xs font-mono tracking-widest uppercase">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>The Mandi Inspection Problem</span>
          </div>

          <blockquote className="font-display text-2xl sm:text-4xl font-semibold text-[#F4F1E8] leading-tight tracking-tight">
            &ldquo;When two inspectors look at the same crate of Nashik red onions, one sees Grade A premium export, while the other sees Grade B skin defects. That <span className="text-[#FF6B35]">15% valuation discrepancy</span> causes daily farmer price disputes.&rdquo;
          </blockquote>

          <p className="text-sm sm:text-base text-[#8C9080] max-w-2xl mx-auto leading-relaxed">
            Manual eye-balling cannot reliably separate 52mm bulbs from 58mm bulbs across 400-quintal daily arrivals. AgriGrade AI standardizes size classification down to 0.5mm precision and detects hidden neck rot before storage contamination.
          </p>
        </div>
      </section>

      {/* "How It Works" Interactive Scroll-Sequence Section */}
      <section id="how-it-works" className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D4FF3F]">
            Sequential Inspection Pipeline
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F4F1E8]">
            From conveyor frame to certified grade in 3 seconds
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Step Controls */}
          <div className="lg:col-span-5 space-y-4">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = activeStep === idx;
              return (
                <div
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#14170F] border-[#D4FF3F] shadow-lime-glow'
                      : 'bg-white/[0.02] border-[#2A2E22] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#D4FF3F]">STEP {s.step}</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-[#8C9080]">
                      {s.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#F4F1E8] mb-2 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-[#D4FF3F]" />
                    <span>{s.title}</span>
                  </h3>
                  <p className="text-xs text-[#8C9080] leading-relaxed">{s.description}</p>
                </div>
              );
            })}
          </div>

          {/* Interactive Step Visual Display */}
          <div className="lg:col-span-7">
            <TiltCard className="p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#2A2E22] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4FF3F]/10 border border-[#D4FF3F]/40 flex items-center justify-center text-[#D4FF3F]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold text-[#D4FF3F]">
                      LIVE PIPELINE FRAME
                    </div>
                    <div className="text-[11px] text-[#8C9080] font-mono">
                      {steps[activeStep].title}
                    </div>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#D4FF3F]">3.2s Latency</span>
              </div>

              <div className="relative aspect-[16/9] rounded-xl overflow-hidden warm-border bg-[#0B0D0A]">
                <img
                  src={
                    activeStep === 0
                      ? 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=1000&auto=format&fit=crop'
                      : activeStep === 1
                      ? 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=1000&auto=format&fit=crop'
                      : 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop'
                  }
                  alt={steps[activeStep].title}
                  className="w-full h-full object-cover opacity-80"
                />

                {/* Scanning Laser Animation Line */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4FF3F]/20 via-transparent to-transparent animate-scan pointer-events-none" />

                {/* Overlaid bounding box HUD */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0B0D0A]/90 backdrop-blur-md p-3 rounded-xl border border-[#2A2E22] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#D4FF3F]">YOLOv8 Active: 340 Bulbs</span>
                  <GradeBadge grade="A" confidence={98.4} size="sm" />
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Grade Showcase Section (3 Glass Cards with 3D Tilt) */}
      <section id="grades" className="py-28 bg-[#14170F]/40 border-y border-[#2A2E22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4FF3F]">
              Classification Specifications
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F4F1E8]">
              Transparent grade standards for every bulb
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GRADE_CRITERIA_SHOWCASE.map((criteria) => (
              <TiltCard key={criteria.grade} glowColor={criteria.color} className="p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Real Macro Image */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={criteria.imageUrl}
                      alt={criteria.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <GradeBadge grade={criteria.grade} size="lg" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-[#F4F1E8]">
                      {criteria.title}
                    </h3>
                    <p className="text-xs text-[#8C9080] font-mono mt-0.5">
                      {criteria.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-[#F4F1E8]/80 leading-relaxed">
                    {criteria.description}
                  </p>

                  {/* Specifications Grid Box */}
                  <div className="p-4 rounded-xl bg-[#0B0D0A] border border-[#2A2E22] space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#8C9080]">Diameter Range:</span>
                      <span className="text-[#D4FF3F] font-bold">{criteria.diameter}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8C9080]">Bulb Weight:</span>
                      <span className="text-[#F4F1E8] font-bold">{criteria.weight}</span>
                    </div>
                    <div className="flex justify-between text-[#FF4444]">
                      <span>Rot Tolerance:</span>
                      <span className="font-bold">{criteria.defectTolerance}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-2.5 rounded-xl border border-[#2A2E22] bg-[#14170F] text-xs font-mono text-[#F4F1E8] hover:border-[#D4FF3F] hover:text-[#D4FF3F] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Test Sample Crate</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* "Why It Matters" 5 Value Props */}
      <section id="why-it-matters" className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D4FF3F]">
            Value to Mandi Operations
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F4F1E8]">
            Why procurement lines choose AgriGrade
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {VALUE_CARDS.map((card, idx) => {
            const Icon = getValueIcon(card.iconName);
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <TiltCard className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#D4FF3F]/10 border border-[#D4FF3F]/30 text-[#D4FF3F] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#F4F1E8] mb-2">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#8C9080] leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats Band with Blur-to-Focus Reveal */}
      <section className="py-24 bg-[#14170F] border-y border-[#2A2E22] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {SYSTEM_STATS.map((stat) => (
              <div key={stat.label} className="space-y-3">
                <div className="text-4xl sm:text-6xl font-bold font-mono text-[#D4FF3F]">
                  <CountUpNumber end={stat.value} decimals={stat.value % 1 !== 0 ? 1 : 0} unit={stat.unit} />
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#8C9080]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
