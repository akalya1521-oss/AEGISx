import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  Printer, 
  Plus, 
  ShieldAlert,
  Building2 
} from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import { ReportCard } from '../components/ReportCard';
import { playCyberSound } from '../utils/audio';
import '../styles/reports.css';

export const Reports: React.FC = () => {
  const { reports, setSelectedReport, addToast } = useIntelligence();

  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter(r => {
    if (selectedType !== 'ALL' && r.type !== selectedType) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.reportCode.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q) ||
      (r.threatActor && r.threatActor.toLowerCase().includes(q))
    );
  });

  const handleExportAll = () => {
    playCyberSound('success');
    addToast({
      title: 'CERT-In / I4C INTELLIGENCE ARCHIVE GENERATED',
      message: 'Generated encrypted archive package (STIX 2.1 & PDF Briefing format) for authorized agencies.',
      type: 'success'
    });
  };

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-breadcrumb">
          CERT-In • I4C • NCIIPC / CLASSIFIED THREAT INTELLIGENCE
        </div>
        <div className="page-title-row">
          <div>
            <h1 className="page-title">National Threat Intelligence Dossiers & Advisories</h1>
            <p className="page-subtitle">
              Classified adversary profiles, incident postmortems, CNI vulnerability disclosures and annual CERT-In cyber threat landscape bulletins.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="cyber-btn cyber-btn-primary" onClick={handleExportAll}>
              <Download size={14} />
              <span>Download Intelligence Bundle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reports Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div className="cyber-panel" style={{ padding: '14px 18px' }}>
          <span className="inspector-data-label">PUBLISHED DOSSIERS</span>
          <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 4 }}>
            {reports.length} REPORTS
          </div>
        </div>

        <div className="cyber-panel" style={{ padding: '14px 18px' }}>
          <span className="inspector-data-label">HIGHEST CLASSIFICATION</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--danger-red)', marginTop: 8 }}>
            TOP SECRET // NTRO-RAW-CERT
          </div>
        </div>

        <div className="cyber-panel" style={{ padding: '14px 18px' }}>
          <span className="inspector-data-label">MITRE ATT&CK TECHNIQUES</span>
          <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: 22, fontWeight: 800, color: 'var(--accent-cyan)', marginTop: 4 }}>
            18 DOCUMENTED
          </div>
        </div>

        <div className="cyber-panel" style={{ padding: '14px 18px' }}>
          <span className="inspector-data-label">VERIFIED IOC HASHES & VPAs</span>
          <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: 22, fontWeight: 800, color: 'var(--status-green)', marginTop: 4 }}>
            342 IOCs
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="entities-toolbar">
        {/* Type Filter Buttons */}
        <div className="entities-filter-types">
          {[
            { id: 'ALL', label: 'All Reports' },
            { id: 'THREAT_ACTOR_DOSSIER', label: 'Adversary Dossiers' },
            { id: 'INCIDENT_POSTMORTEM', label: 'CNI Incident Postmortems' },
            { id: 'WEEKLY_INTEL_BRIEF', label: 'CERT-In Bulletins' }
          ].map(type => (
            <button
              key={type.id}
              className={`entity-type-btn ${selectedType === type.id ? 'active' : ''}`}
              onClick={() => {
                playCyberSound('click');
                setSelectedType(type.id);
              }}
            >
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 280 }}>
          <input
            type="text"
            placeholder="Search report code, adversary, TTP..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="cyber-input"
            style={{ paddingLeft: 32 }}
          />
          <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-dim)' }} />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="reports-grid">
        {filteredReports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
};
