import React from 'react';
import { IntelligenceReport } from '../types';
import { FileText, Download, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import '../styles/reports.css';

interface ReportCardProps {
  report: IntelligenceReport;
  onSelect?: (rep: IntelligenceReport) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onSelect }) => {
  const { setSelectedReport, addToast } = useIntelligence();

  const handleClick = () => {
    setSelectedReport(report);
    if (onSelect) onSelect(report);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToast({
      title: 'INTELLIGENCE DOSSIER EXPORTED',
      message: `Exported ${report.reportCode} in STIX 2.1 & PDF Briefing format.`,
      type: 'success'
    });
  };

  return (
    <div className="report-card" onClick={handleClick}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="report-classification-stamp">
            {report.classification}
          </span>
          <span className="code-tag" style={{ fontSize: 10 }}>{report.reportCode}</span>
        </div>

        <h3 className="report-card-title">{report.title}</h3>
        <p className="report-card-summary">{report.summary}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} />
            <span>{report.readTime}</span>
          </div>
          <div>{report.ttpList.length} TTPs Mapped</div>
          <div>{report.indicators.length} IOCs Verified</div>
        </div>

        <div className="report-meta-footer">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 11 }}>{report.author.split(',')[0]}</span>
            <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{report.date}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              className="cyber-btn cyber-btn-sm" 
              onClick={handleDownload}
              title="Download Intelligence Bundle"
            >
              <Download size={12} />
              <span>Export</span>
            </button>
            <div style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center' }}>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
