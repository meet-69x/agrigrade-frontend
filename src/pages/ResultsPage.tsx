import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Download,
  Edit3,
  CheckCircle,
  FileSpreadsheet,
  ArrowLeft,
  Filter,
  Check,
  Scan,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { GradeBadge } from '../components/common/GradeBadge';
import { TiltCard } from '../components/common/TiltCard';
import { MagneticButton } from '../components/common/MagneticButton';
import { MOCK_BATCHES } from '../data/mockData';
import type { GradeType, OnionItem } from '../types';

export const ResultsPage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();

  const currentBatch = MOCK_BATCHES.find((b) => b.id === batchId) || MOCK_BATCHES[0];

  const [items, setItems] = useState<OnionItem[]>(currentBatch.items);
  const [hoveredOnionId, setHoveredOnionId] = useState<string | null>(null);
  const [selectedOnion, setSelectedOnion] = useState<OnionItem | null>(null);
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [newGrade, setNewGrade] = useState<GradeType>('A');
  const [overrideReason, setOverrideReason] = useState('Manual physical calliper re-measurement');
  const [filterGrade, setFilterGrade] = useState<string>('ALL');
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const gradeACount = items.filter((i) => (i.overriddenGrade || i.grade) === 'A').length;
  const gradeBCount = items.filter((i) => (i.overriddenGrade || i.grade) === 'B').length;
  const gradeCCount = items.filter((i) => (i.overriddenGrade || i.grade) === 'C').length;

  const pieData = [
    { name: 'Grade A', value: gradeACount, color: '#D4FF3F' },
    { name: 'Grade B', value: gradeBCount, color: '#FFB800' },
    { name: 'Grade C', value: gradeCCount, color: '#FF4444' },
  ];

  const handleOpenOverride = (onion: OnionItem) => {
    setSelectedOnion(onion);
    setNewGrade(onion.overriddenGrade || onion.grade);
    setOverrideModalOpen(true);
  };

  const handleSaveOverride = () => {
    if (!selectedOnion) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === selectedOnion.id
          ? {
              ...item,
              overriddenGrade: newGrade,
              overrideReason: overrideReason,
            }
          : item
      )
    );
    setOverrideModalOpen(false);
  };

  const filteredItems = items.filter((item) => {
    const activeGrade = item.overriddenGrade || item.grade;
    if (filterGrade === 'ALL') return true;
    return activeGrade === filterGrade;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2E22] pb-6">
          <div className="space-y-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs font-mono text-[#D4FF3F] hover:underline flex items-center gap-1 mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Scanner Terminal</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold text-[#F4F1E8]">
                CV Inspection Results
              </h1>
              <GradeBadge grade={currentBatch.overallGrade} size="lg" />
            </div>
            <p className="text-xs font-mono text-[#8C9080]">
              LOT: {currentBatch.batchNumber} • {currentBatch.procurementCentre} • {currentBatch.timestamp}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MagneticButton variant="primary" onClick={() => setExportModalOpen(true)}>
              <Download className="w-4 h-4" />
              <span>Export Mandi Report</span>
            </MagneticButton>
          </div>
        </div>

        {/* Top Bounding Box Overhead Camera View & Side Analytics Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Batch Image with SVG Bounding Boxes */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#F4F1E8] flex items-center gap-2">
                <Scan className="w-5 h-5 text-[#D4FF3F]" />
                <span>Sub-Millimeter CV Overlay</span>
              </h3>
              <span className="text-xs font-mono text-[#8C9080]">
                Hover box to highlight bulb
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-[#2A2E22] bg-[#0B0D0A] shadow-dark-card">
              <img
                src={currentBatch.imageUrl}
                alt="Overhead onion scan batch"
                className="w-full aspect-[16/10] object-cover opacity-80"
              />

              {/* Bounding Box SVG Overlays */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {items.map((onion) => {
                  const activeGrade = onion.overriddenGrade || onion.grade;
                  const isHovered = hoveredOnionId === onion.id;
                  const strokeColor =
                    activeGrade === 'A' ? '#D4FF3F' : activeGrade === 'B' ? '#FFB800' : '#FF4444';

                  return (
                    <g key={onion.id} className="pointer-events-auto cursor-pointer">
                      <rect
                        x={`${onion.boundingBox.x}%`}
                        y={`${onion.boundingBox.y}%`}
                        width={`${onion.boundingBox.width}%`}
                        height={`${onion.boundingBox.height}%`}
                        fill={isHovered ? `${strokeColor}33` : 'transparent'}
                        stroke={strokeColor}
                        strokeWidth={isHovered ? 3 : 2}
                        rx={6}
                        onMouseEnter={() => setHoveredOnionId(onion.id)}
                        onMouseLeave={() => setHoveredOnionId(null)}
                        onClick={() => handleOpenOverride(onion)}
                        className="transition-all duration-200"
                      />
                      <text
                        x={`${onion.boundingBox.x + 1}%`}
                        y={`${onion.boundingBox.y + 6}%`}
                        fill="#D4FF3F"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                        className="drop-shadow-md"
                      >
                        #{onion.itemNumber} {activeGrade} ({onion.diameterMm}mm)
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Bottom HUD Legend */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#0B0D0A]/90 backdrop-blur-md p-2.5 rounded-xl border border-[#2A2E22] flex items-center justify-between text-xs font-mono text-[#F4F1E8]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#D4FF3F]" />
                    <span>Grade A (≥55mm)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#FFB800]" />
                    <span>Grade B (40-54mm)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#FF4444]" />
                    <span>Grade C (&lt;40mm / Defect)</span>
                  </div>
                </div>
                <div className="text-[#D4FF3F] font-bold">
                  {items.length} Bulbs Scanned
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recharts Donut & Batch Summary Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-[#2A2E22] bg-[#14170F] p-6 space-y-6 shadow-dark-card">
              <h3 className="font-display text-lg font-bold text-[#F4F1E8]">
                Grade Ratio Distribution
              </h3>

              {/* Recharts Donut */}
              <div className="h-48 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0B0D0A',
                        borderRadius: '12px',
                        color: '#F4F1E8',
                        fontSize: '12px',
                        border: '1px solid #2A2E22',
                        fontFamily: 'monospace',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="font-display text-3xl font-bold text-[#D4FF3F]">
                    {Math.round((gradeACount / items.length) * 100)}%
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#8C9080]">
                    Grade A Ratio
                  </span>
                </div>
              </div>

              {/* Key Metrics Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#2A2E22]">
                <div className="p-3.5 rounded-xl bg-[#0B0D0A] border border-[#2A2E22] font-mono">
                  <div className="text-[10px] text-[#8C9080] uppercase">Avg Bulb Diameter</div>
                  <div className="text-base font-bold text-[#D4FF3F] mt-0.5">
                    {currentBatch.avgDiameterMm} mm
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B0D0A] border border-[#2A2E22] font-mono">
                  <div className="text-[10px] text-[#8C9080] uppercase">Est. Batch Weight</div>
                  <div className="text-base font-bold text-[#F4F1E8] mt-0.5">
                    {currentBatch.totalWeightKg} kg
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#D4FF3F]/10 border border-[#D4FF3F]/40 text-xs font-mono text-[#D4FF3F] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Lot meets <strong>APMC Export Grade A</strong> clearance threshold.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Onion Result Cards Grid */}
        <div className="space-y-4 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2E22] pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-[#F4F1E8]">
                Detected Bulb Specifications ({filteredItems.length})
              </h2>
              <p className="text-xs font-mono text-[#8C9080]">
                Individual measurements, defect classifications, and inspector override options.
              </p>
            </div>

            {/* Grade Filter Bar */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#8C9080]" />
              {(['ALL', 'A', 'B', 'C'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setFilterGrade(g)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                    filterGrade === g
                      ? 'bg-[#D4FF3F] text-[#0B0D0A] font-bold shadow-lime-glow'
                      : 'bg-[#14170F] border border-[#2A2E22] text-[#8C9080]'
                  }`}
                >
                  {g === 'ALL' ? 'All Grades' : `Grade ${g}`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((onion) => {
              const activeGrade = onion.overriddenGrade || onion.grade;
              const isHovered = hoveredOnionId === onion.id;

              return (
                <TiltCard
                  key={onion.id}
                  glowColor={activeGrade === 'A' ? '#D4FF3F' : activeGrade === 'B' ? '#FFB800' : '#FF4444'}
                  className={`p-5 space-y-4 transition-all ${
                    isHovered ? 'border-[#D4FF3F] shadow-lime-glow' : ''
                  }`}
                >
                  {/* Top Thumbnail & Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#2A2E22] flex-shrink-0 bg-[#0B0D0A]">
                      <img
                        src={onion.thumbnailUrl}
                        alt={`Onion #${onion.itemNumber}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#8C9080]">
                          Bulb #{onion.itemNumber}
                        </span>
                        <GradeBadge grade={activeGrade} confidence={onion.confidence} size="sm" />
                      </div>
                      <div className="font-mono text-sm font-bold text-[#F4F1E8]">
                        Ø {onion.diameterMm} mm • {onion.weightGrams}g
                      </div>
                    </div>
                  </div>

                  {/* Defects Tag Pills */}
                  <div className="space-y-1.5 pt-2 border-t border-[#2A2E22]">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-[#8C9080]">
                      Detected Defect Profile
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {onion.defects.map((defect) => (
                        <span
                          key={defect}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                            defect === 'None'
                              ? 'bg-[#D4FF3F]/10 text-[#D4FF3F] border-[#D4FF3F]/40'
                              : 'bg-[#FF4444]/10 text-[#FF4444] border-[#FF4444]/40'
                          }`}
                        >
                          {defect}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Override Indicator or Trigger */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#2A2E22]">
                    {onion.overriddenGrade ? (
                      <div className="text-[10px] text-[#FFB800] font-mono flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Override: Grade {onion.overriddenGrade}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#8C9080] font-mono">CV Automated</span>
                    )}

                    <button
                      onClick={() => handleOpenOverride(onion)}
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#D4FF3F] hover:underline"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Override Grade</span>
                    </button>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>

        {/* Grade Override Modal */}
        <AnimatePresence>
          {overrideModalOpen && selectedOnion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#14170F] rounded-2xl border border-[#2A2E22] shadow-dark-card p-6 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-[#2A2E22] pb-3">
                  <h3 className="font-display text-lg font-bold text-[#F4F1E8]">
                    Inspector Grade Override
                  </h3>
                  <span className="font-mono text-xs text-[#8C9080]">
                    Bulb #{selectedOnion.itemNumber}
                  </span>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#0B0D0A] border border-[#2A2E22] space-y-1">
                    <div className="text-[#8C9080]">Original CV Inference:</div>
                    <div className="font-bold flex items-center gap-2">
                      <GradeBadge grade={selectedOnion.grade} size="sm" />
                      <span>Ø {selectedOnion.diameterMm}mm ({selectedOnion.confidence}% Conf)</span>
                    </div>
                  </div>

                  {/* New Grade Radio Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[#8C9080]">Re-classify Grade</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['A', 'B', 'C'] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setNewGrade(g)}
                          className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                            newGrade === g
                              ? 'bg-[#D4FF3F] text-[#0B0D0A] border-[#D4FF3F] shadow-lime-glow'
                              : 'bg-[#0B0D0A] border-[#2A2E22] text-[#8C9080]'
                          }`}
                        >
                          Grade {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reason Text */}
                  <div className="space-y-1.5">
                    <label className="text-[#8C9080]">Override Justification</label>
                    <textarea
                      rows={3}
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#2A2E22] bg-[#0B0D0A] text-xs font-mono text-[#F4F1E8] focus:outline-none focus:border-[#D4FF3F]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2A2E22]">
                  <button
                    onClick={() => setOverrideModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-[#8C9080]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveOverride}
                    className="px-5 py-2 rounded-xl bg-[#D4FF3F] text-[#0B0D0A] text-xs font-mono font-bold shadow-lime-glow"
                  >
                    Save Override
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Export Report Modal */}
        <AnimatePresence>
          {exportModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#14170F] rounded-2xl border border-[#2A2E22] shadow-dark-card p-6 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-[#2A2E22] pb-3">
                  <h3 className="font-display text-lg font-bold text-[#F4F1E8]">
                    Export Mandi Quality Certificate
                  </h3>
                  <FileSpreadsheet className="w-5 h-5 text-[#D4FF3F]" />
                </div>

                <p className="text-xs text-[#8C9080] font-mono leading-relaxed">
                  Download an official APMC-compliant inspection certificate containing individual bulb diameter logs, rot frequencies, and inspector cryptographic signature.
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      alert('PDF Mandi Quality Certificate generated & saved to downloads!');
                      setExportModalOpen(false);
                    }}
                    className="w-full py-3 rounded-xl bg-[#D4FF3F] text-[#0B0D0A] text-xs font-mono font-bold shadow-lime-glow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Mandi Certificate</span>
                  </button>

                  <button
                    onClick={() => {
                      alert('CSV Raw Data exported!');
                      setExportModalOpen(false);
                    }}
                    className="w-full py-3 rounded-xl border border-[#2A2E22] bg-[#0B0D0A] text-xs font-mono text-[#F4F1E8] hover:border-[#D4FF3F]"
                  >
                    Export Raw CSV Logs (.CSV)
                  </button>
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setExportModalOpen(false)}
                    className="text-xs font-mono text-[#8C9080] hover:underline"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};
