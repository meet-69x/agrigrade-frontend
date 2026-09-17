import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  ArrowUpDown,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { GradeBadge } from '../components/common/GradeBadge';
import { MOCK_BATCHES, MOCK_CENTRES } from '../data/mockData';
import { batchService, authService } from '../services';
import type { BatchRecord } from '../types';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<BatchRecord[]>(MOCK_BATCHES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCentre, setSelectedCentre] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'timestamp' | 'totalCount' | 'totalWeightKg'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const customBatches: BatchRecord[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('custom_batch_')) {
        try {
          const item = JSON.parse(sessionStorage.getItem(key) || '');
          if (item && item.id) {
            customBatches.push(item);
          }
        } catch {
          // ignore
        }
      }
    }

    setBatches([...customBatches, ...MOCK_BATCHES]);

    authService.ensureAuthenticated().then(() => {
      batchService.getBatches().then(async (summaries) => {
        if (summaries && summaries.length > 0) {
          const fullRecords = await Promise.all(
            summaries.map((s) => batchService.getBatchDetail(s.id).catch(() => null))
          );
          const validRecords = fullRecords.filter((r): r is BatchRecord => r !== null);
          if (validRecords.length > 0) {
            setBatches([...customBatches, ...validRecords]);
          }
        }
      }).catch(() => {
        // Backend offline: keep local custom + mock batches
      });
    });
  }, []);

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.procurementCentre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.variety.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCentre = selectedCentre === 'ALL' || batch.procurementCentre.includes(selectedCentre);
    const matchesGrade = selectedGrade === 'ALL' || batch.overallGrade === selectedGrade;

    return matchesSearch && matchesCentre && matchesGrade;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortField === 'totalCount') comparison = a.totalCount - b.totalCount;
    else if (sortField === 'totalWeightKg') comparison = a.totalWeightKg - b.totalWeightKg;
    else comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();

    return sortDirection === 'desc' ? -comparison : comparison;
  });

  const toggleSort = (field: 'timestamp' | 'totalCount' | 'totalWeightKg') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };


  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2E22] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4FF3F]/10 text-[#D4FF3F] text-xs font-mono tracking-widest uppercase mb-2">
              <History className="w-3.5 h-3.5" />
              <span>APMC Audit Trail Ledger</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-[#F4F1E8]">
              Procurement Batch History
            </h1>
            <p className="text-xs font-mono text-[#8C9080] mt-1">
              Historical record of all scanned onion lots across APMC Mandis with full quality breakdown.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Full APMC History Log exported to Excel!')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2A2E22] bg-[#14170F] text-xs font-mono font-bold text-[#F4F1E8] hover:border-[#D4FF3F]"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#D4FF3F]" />
              <span>Export CSV Table</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-[#14170F] border border-[#2A2E22] space-y-4 shadow-dark-card">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-[#8C9080] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Lot ID, Mandi, Variety, or Inspector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#2A2E22] bg-[#0B0D0A] text-xs font-mono text-[#F4F1E8] focus:outline-none focus:border-[#D4FF3F]"
              />
            </div>

            {/* Centre Filter */}
            <div className="md:col-span-4">
              <select
                value={selectedCentre}
                onChange={(e) => setSelectedCentre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2A2E22] bg-[#0B0D0A] text-xs font-mono text-[#F4F1E8] focus:outline-none"
              >
                <option value="ALL">All Procurement Centres</option>
                {MOCK_CENTRES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#2A2E22] bg-[#0B0D0A] text-xs font-mono text-[#F4F1E8] focus:outline-none"
              >
                <option value="ALL">All Overall Grades</option>
                <option value="A">Grade A Only</option>
                <option value="B">Grade B Only</option>
                <option value="C">Grade C Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-[#2A2E22] bg-[#14170F] overflow-hidden shadow-dark-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#0B0D0A] border-b border-[#2A2E22] text-[#8C9080] uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-semibold">Lot ID / Variety</th>
                  <th className="py-3.5 px-4 font-semibold">Procurement Yard</th>
                  <th
                    onClick={() => toggleSort('timestamp')}
                    className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#D4FF3F]"
                  >
                    <div className="flex items-center gap-1">
                      <span>Date & Time</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('totalCount')}
                    className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#D4FF3F] text-right"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Bulbs</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-center">Grade Ratio</th>
                  <th
                    onClick={() => toggleSort('totalWeightKg')}
                    className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#D4FF3F] text-right"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Weight</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-center">Overall</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#2A2E22]">
                {filteredBatches.map((batch) => (
                  <tr
                    key={batch.id}
                    onClick={() => navigate(`/results/${batch.id}`)}
                    className="hover:bg-white/[0.04] cursor-pointer transition-colors"
                  >
                    {/* Lot Number */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#D4FF3F]">
                        {batch.batchNumber}
                      </div>
                      <div className="text-[10px] text-[#8C9080]">{batch.variety}</div>
                    </td>

                    {/* Yard & Inspector */}
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#F4F1E8] truncate max-w-[200px]">
                        {batch.procurementCentre}
                      </div>
                      <div className="text-[10px] text-[#8C9080]">Inspector: {batch.operatorName}</div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-4 px-4 text-[#8C9080]">
                      {batch.timestamp}
                    </td>

                    {/* Bulbs */}
                    <td className="py-4 px-4 font-bold text-right text-[#F4F1E8]">
                      {batch.totalCount}
                    </td>

                    {/* Grade Ratio Breakdown Bar */}
                    <td className="py-4 px-4">
                      <div className="w-36 mx-auto space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-[#D4FF3F] font-bold">{batch.gradeADistribution} A</span>
                          <span className="text-[#FFB800] font-bold">{batch.gradeBDistribution} B</span>
                          <span className="text-[#FF4444] font-bold">{batch.gradeCDistribution} C</span>
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
                    </td>

                    {/* Weight */}
                    <td className="py-4 px-4 font-bold text-right text-[#F4F1E8]">
                      {batch.totalWeightKg} kg
                    </td>

                    {/* Overall Grade Badge */}
                    <td className="py-4 px-4 text-center">
                      <GradeBadge grade={batch.overallGrade} size="sm" />
                    </td>

                    {/* Action Link */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/results/${batch.id}`);
                        }}
                        className="p-1.5 rounded-lg border border-[#2A2E22] hover:border-[#D4FF3F] text-[#D4FF3F] transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#2A2E22] bg-[#0B0D0A] flex items-center justify-between text-xs font-mono text-[#8C9080]">
            <div>Showing {filteredBatches.length} APMC procurement lots</div>
            <div>Ledger Hash: 0x8F92...B411</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
