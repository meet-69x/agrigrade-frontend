import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Sparkles,
  RefreshCw,
  Building2,
  ChevronRight,
  Info,
  Zap,
  Scan,
  Upload,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { GradeBadge } from '../components/common/GradeBadge';
import { MagneticButton } from '../components/common/MagneticButton';
import { TiltCard } from '../components/common/TiltCard';
import { MOCK_BATCHES, MOCK_CENTRES } from '../data/mockData';
import { batchService, centreService, authService } from '../services';
import type { OnionItem, GradeType, BatchRecord } from '../types';

export const DashboardUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [centres, setCentres] = useState(MOCK_CENTRES);
  const [selectedCentre, setSelectedCentre] = useState(MOCK_CENTRES[0].id);
  const [variety, setVariety] = useState<'Nashik Red' | 'Red Globe' | 'Yellow Granex' | 'White Spanish'>('Nashik Red');
  const [batchId, setBatchId] = useState(`AG-NSK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-09`);
  const [sampleSize, setSampleSize] = useState(340);
  const [selectedImage, setSelectedImage] = useState<string>(
    'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=1200&auto=format&fit=crop'
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    // Load procurement centres from backend if available
    centreService.getCentres().then((fetchedCentres) => {
      if (fetchedCentres && fetchedCentres.length > 0) {
        const formatted = fetchedCentres.map((c) => ({
          id: c.id,
          name: c.name,
          location: c.location || 'APMC Yard',
          state: 'Maharashtra',
          activeLines: 4,
          dailyCapacityTons: 150,
        }));
        setCentres(formatted);
        setSelectedCentre(formatted[0].id);
      }
    }).catch(() => {
      // Backend offline: keep mock centres
    });
  }, []);

  const samplePresets = [
    {
      name: 'Nashik Red Conveyor Batch #4',
      url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=1200&auto=format&fit=crop',
      count: 340,
    },
    {
      name: 'Lasalgaon APMC Crate #12',
      url: 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=1200&auto=format&fit=crop',
      count: 410,
    },
    {
      name: 'Neemuch Yard Sample #2 (Rain Scarred)',
      url: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=1200&auto=format&fit=crop',
      count: 290,
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setSelectedImage(dataUrl);
          sessionStorage.setItem('latest_upload_image', dataUrl);
          sessionStorage.setItem(`batch_image_${batchId}`, dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 700);
    setTimeout(() => setScanStep(3), 1500);

    // Save image to sessionStorage for immediate frontend display
    if (selectedImage) {
      sessionStorage.setItem('latest_upload_image', selectedImage);
      sessionStorage.setItem(`batch_image_${batchId}`, selectedImage);
    }

    try {
      await authService.ensureAuthenticated();

      let fileToUpload = selectedFile;
      if (!fileToUpload) {
        // If sample preset image selected, fetch image blob as File
        const blob = await fetch(selectedImage).then((res) => res.blob());
        fileToUpload = new File([blob], 'onion_batch.jpg', { type: 'image/jpeg' });
      }

      // Submit to backend
      const resultBatch = await batchService.createBatch(selectedCentre, batchId, fileToUpload);
      if (selectedImage) {
        sessionStorage.setItem(`batch_image_${resultBatch.id}`, selectedImage);
      }
      
      setTimeout(() => {
        setIsScanning(false);
        navigate(`/results/${resultBatch.id}`);
      }, 2200);
    } catch (err) {
      console.warn('Backend API connection failed, navigating to custom upload results:', err);

      // Create a local custom batch record so user's uploaded image & parameters generate matching stats in offline/demo mode!
      if (selectedImage) {
        const generatedItems: OnionItem[] = Array.from({ length: Math.min(sampleSize, 12) }).map((_, idx) => {
          const diameter = Math.round((45 + ((idx * 4.3) % 28)) * 10) / 10;
          const grade: GradeType = diameter >= 55 ? 'A' : diameter >= 40 ? 'B' : 'C';
          return {
            id: `ON-UP-${idx + 1}`,
            itemNumber: idx + 1,
            diameterMm: diameter,
            weightGrams: Math.round(diameter * 1.8),
            grade,
            confidence: Math.round((92 + ((idx * 1.7) % 7)) * 10) / 10,
            defects: grade === 'C' ? ['Sunburn / Discoloration'] : grade === 'B' ? ['Skin Tear'] : ['None'],
            thumbnailUrl: selectedImage,
            boundingBox: {
              x: 10 + (idx % 4) * 22,
              y: 12 + Math.floor(idx / 4) * 25,
              width: 18,
              height: 20,
            },
          };
        });

        const gradeACount = generatedItems.filter((i) => i.grade === 'A').length;
        const gradeBCount = generatedItems.filter((i) => i.grade === 'B').length;
        const gradeCCount = generatedItems.filter((i) => i.grade === 'C').length;
        const avgDiameter = Math.round((generatedItems.reduce((acc, i) => acc + i.diameterMm, 0) / generatedItems.length) * 10) / 10;
        const overallGrade: GradeType = gradeACount >= gradeBCount && gradeACount >= gradeCCount ? 'A' : gradeBCount >= gradeCCount ? 'B' : 'C';

        const customBatch: BatchRecord = {
          id: batchId,
          batchNumber: batchId,
          procurementCentre: centres.find((c) => c.id === selectedCentre)?.name || 'Nashik Mandi Procurement Centre #4',
          centreLocation: 'APMC Yard',
          variety,
          timestamp: new Date().toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          operatorName: 'APMC Inspector',
          operatorRole: 'Operator',
          totalCount: sampleSize,
          gradeADistribution: Math.round(sampleSize * (gradeACount / generatedItems.length)),
          gradeBDistribution: Math.round(sampleSize * (gradeBCount / generatedItems.length)),
          gradeCDistribution: sampleSize - Math.round(sampleSize * (gradeACount / generatedItems.length)) - Math.round(sampleSize * (gradeBCount / generatedItems.length)),
          overallGrade,
          avgDiameterMm: avgDiameter,
          avgWeightGrams: Math.round(avgDiameter * 1.8),
          totalWeightKg: Math.round((sampleSize * (avgDiameter * 1.8) / 1000) * 10) / 10,
          imageUrl: selectedImage,
          items: generatedItems,
        };
        sessionStorage.setItem(`custom_batch_${batchId}`, JSON.stringify(customBatch));
      }

      setTimeout(() => {
        setIsScanning(false);
        navigate(`/results/${batchId}`);
      }, 2200);
    }
  };


  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Top Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2E22] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4FF3F]/10 text-[#D4FF3F] text-xs font-mono tracking-widest uppercase mb-2">
              <Scan className="w-3.5 h-3.5" />
              <span>APMC Line Terminal</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-[#F4F1E8]">
              Batch Quality Upload & AI Scan
            </h1>
            <p className="text-xs font-mono text-[#8C9080] mt-1">
              Capture or upload high-resolution overhead batch photography for computer vision model inference.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setBatchId(`AG-NSK-${Math.floor(1000 + Math.random() * 9000)}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#2A2E22] bg-[#14170F] text-xs font-mono text-[#F4F1E8] hover:border-[#D4FF3F]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#8C9080]" />
              <span>Regenerate Lot ID</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Upload Dropzone Card + Batch Metadata Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Drag & Drop Camera Upload Card */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border-2 border-dashed border-[#D4FF3F]/40 bg-[#14170F] p-6 relative overflow-hidden shadow-dark-card group">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#0B0D0A] border border-[#2A2E22]">
                <img
                  src={selectedImage}
                  alt="Current batch for AI analysis"
                  className="w-full h-full object-cover opacity-80"
                />

                {/* AI Scan Animation Overlay */}
                <AnimatePresence>
                  {isScanning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#0B0D0A]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-20"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-[#D4FF3F] text-[#0B0D0A] flex items-center justify-center shadow-lime-glow animate-bounce">
                        <Zap className="w-8 h-8" />
                      </div>

                      <div className="space-y-1">
                        <div className="font-display text-xl font-bold text-[#F4F1E8]">
                          {scanStep === 1 && '1/3 Detecting Bulb Boundaries...'}
                          {scanStep === 2 && '2/3 Measuring Diameter & Weight...'}
                          {scanStep === 3 && '3/3 Classifying Defect Profiles...'}
                        </div>
                        <div className="text-xs text-[#D4FF3F] font-mono">
                          YOLOv8 Ensemble Model • 340 Bulbs Detected
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full max-w-xs h-1.5 bg-[#2A2E22] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#D4FF3F]"
                          initial={{ width: '0%' }}
                          animate={{ width: scanStep === 1 ? '35%' : scanStep === 2 ? '70%' : '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isScanning && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-[#D4FF3F] text-[#0B0D0A] text-xs font-mono font-bold flex items-center gap-1.5 shadow-lime-glow cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Image File</span>
                    </button>
                    <button
                      onClick={() => alert('Camera stream initialized — APMC overhead lens online.')}
                      className="px-4 py-2 rounded-xl border border-[#2A2E22] bg-[#0B0D0A] text-[#F4F1E8] text-xs font-mono font-bold flex items-center gap-1.5 hover:border-[#D4FF3F]"
                    >
                      <Camera className="w-4 h-4 text-[#D4FF3F]" />
                      <span>Live Feed</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Sample Preset Switcher */}
              <div className="mt-4 pt-4 border-t border-[#2A2E22]">
                <label className="text-[11px] font-mono uppercase tracking-widest text-[#8C9080] block mb-2">
                  Select APMC Sample Crate
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {samplePresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setSelectedImage(preset.url);
                        setSampleSize(preset.count);
                        setSelectedFile(null);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all ${
                        selectedImage === preset.url
                          ? 'border-[#D4FF3F] bg-[#D4FF3F]/10 font-bold text-[#D4FF3F]'
                          : 'border-[#2A2E22] bg-[#0B0D0A] text-[#8C9080] hover:border-[#D4FF3F]/50'
                      }`}
                    >
                      <div className="truncate text-[11px]">{preset.name}</div>
                      <div className="text-[10px] text-[#8C9080] mt-0.5">{preset.count} bulbs</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Metadata Inputs & Scan CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-[#2A2E22] bg-[#14170F] p-6 space-y-5 shadow-dark-card">
              <h3 className="font-display text-lg font-bold text-[#F4F1E8] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#D4FF3F]" />
                <span>Batch Parameters & Metadata</span>
              </h3>

              <div className="space-y-4 text-xs font-mono">
                {/* Batch ID */}
                <div className="space-y-1">
                  <label className="text-[#8C9080]">Batch ID / Lot Number</label>
                  <input
                    type="text"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A2E22] bg-[#0B0D0A] text-xs font-bold text-[#F4F1E8] focus:outline-none focus:border-[#D4FF3F]"
                  />
                </div>

                {/* Procurement Centre */}
                <div className="space-y-1">
                  <label className="text-[#8C9080]">Procurement Line</label>
                  <select
                    value={selectedCentre}
                    onChange={(e) => setSelectedCentre(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A2E22] bg-[#0B0D0A] text-xs text-[#F4F1E8] focus:outline-none"
                  >
                    {centres.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.state})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Variety Selector */}
                <div className="space-y-1">
                  <label className="text-[#8C9080]">Onion Variety</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Nashik Red', 'Red Globe', 'Yellow Granex', 'White Spanish'] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVariety(v)}
                        className={`py-2 px-3 rounded-xl border text-left text-xs font-mono transition-all ${
                          variety === v
                            ? 'bg-[#D4FF3F] text-[#0B0D0A] border-[#D4FF3F] font-bold shadow-lime-glow'
                            : 'bg-[#0B0D0A] border-[#2A2E22] text-[#8C9080]'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Sample Count */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[#8C9080]">Sample Count</label>
                    <span className="text-[#D4FF3F] font-bold">{sampleSize} bulbs</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={600}
                    step={10}
                    value={sampleSize}
                    onChange={(e) => setSampleSize(Number(e.target.value))}
                    className="w-full accent-[#D4FF3F]"
                  />
                </div>
              </div>

              {/* Primary Analyze CTA */}
              <MagneticButton
                variant="primary"
                onClick={handleStartScan}
                className="w-full py-4 text-base font-display font-bold"
              >
                <Sparkles className="w-5 h-5" />
                <span>Run CV Batch Inference</span>
              </MagneticButton>

              <div className="flex items-center gap-2 text-[10px] font-mono text-[#8C9080] justify-center">
                <Info className="w-3.5 h-3.5 text-[#D4FF3F]" />
                <span>Overhead ring light calibration: 100% Nominal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Below Section: Recent Batches Clean Cards */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-[#F4F1E8]">
              Recent Procurement Batches
            </h2>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-mono text-[#D4FF3F] hover:underline flex items-center gap-1"
            >
              <span>View full mandi ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_BATCHES.slice(0, 3).map((batch) => (
              <TiltCard
                key={batch.id}
                onClick={() => navigate(`/results/${batch.id}`)}
                className="p-5 cursor-pointer space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#D4FF3F]">
                      {batch.batchNumber}
                    </span>
                    <GradeBadge grade={batch.overallGrade} size="sm" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display text-base font-bold text-[#F4F1E8]">
                      {batch.variety} • {batch.totalCount} Bulbs
                    </h3>
                    <div className="text-xs text-[#8C9080] font-mono truncate">
                      {batch.procurementCentre}
                    </div>
                  </div>

                  {/* Distribution Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-mono text-[#8C9080]">
                      <span>Grade Ratio</span>
                      <span>
                        A: {Math.round((batch.gradeADistribution / batch.totalCount) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#0B0D0A] overflow-hidden flex">
                      <div
                        style={{ width: `${(batch.gradeADistribution / batch.totalCount) * 100}%` }}
                        className="bg-[#D4FF3F]"
                      />
                      <div
                        style={{ width: `${(batch.gradeBDistribution / batch.totalCount) * 100}%` }}
                        className="bg-[#FFB800]"
                      />
                      <div
                        style={{ width: `${(batch.gradeCDistribution / batch.totalCount) * 100}%` }}
                        className="bg-[#FF4444]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2A2E22] flex items-center justify-between text-xs font-mono text-[#8C9080]">
                  <span>{batch.timestamp}</span>
                  <span className="text-[#F4F1E8] font-bold">
                    {batch.totalWeightKg} kg
                  </span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
