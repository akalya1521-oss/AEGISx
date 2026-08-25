import React from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { X, Download, Printer, ShieldAlert, CheckCircle2, Shield, Share2, Copy } from 'lucide-react';
import '../styles/reports.css';

export const ReportDetailModal: React.FC = () => {
  const { selectedReport, setSelectedReport, addToast } = useIntelligence();

  if (!selectedReport) return null;

  const handleExport = () => {
    addToast({
      title: 'INTELLIGENCE BRIEF DOWNLOADED',
      message: `Full PDF & STIX 2.1 archive generated for ${selectedReport.reportCode}.`,
      type: 'success'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyIOCs = () => {
    const text = selectedReport.indicators.map(i => `${i.type}: ${i.indicator}`).join('\n');
    navigator.clipboard?.writeText(text);
    addToast({
      title: 'IOC BLOCKLIST COPIED',
      message: `${selectedReport.indicators.length} indicators copied to clipboard.`,
      type: 'info'
    });
  };

  return (
    <div className="case-modal-overlay" onClick={() => setSelectedReport(null)}>
      <div className="case-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="case-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="report-classification-stamp">
              {selectedReport.classification}
            </span>
            <span className="code-tag">{selectedReport.reportCode}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="cyber-btn cyber-btn-sm" onClick={handlePrint} title="Print Dossier">
              <Printer size={13} />
              <span>Print</span>
            </button>
            <button className="cyber-btn cyber-btn-sm cyber-btn-primary" onClick={handleExport} title="Download STIX / PDF">
              <Download size={13} />
              <span>Export Dossier</span>
            </button>
            <button 
              className="nav-action-icon-btn" 
              onClick={() => setSelectedReport(null)}
              aria-label="Close Modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="case-modal-body dossier-viewer">
          {/* Classification Banner */}
          <div className="dossier-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldAlert size={16} />
              <span>CLASSIFIED CYBER THREAT INTELLIGENCE DOSSIER // RESTRICTED ACCESS</span>
            </div>
            <span>DATE: {selectedReport.date}</span>
          </div>

          {/* Title and Author */}
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', lineHeight: 1.3, marginBottom: 8 }}>
              {selectedReport.title}
            </h1>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
              AUTHOR: <span style={{ color: 'var(--text-main)' }}>{selectedReport.author}</span> • READ TIME: {selectedReport.readTime}
            </div>
          </div>

          {/* Executive Brief */}
          <div className="dossier-section">
            <h3 className="dossier-section-heading">EXECUTIVE THREAT SUMMARY</h3>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: 14, borderRadius: 4, borderLeft: '3px solid var(--accent-cyan)', fontSize: 13, color: 'var(--text-main)', lineHeight: 1.6 }}>
              {selectedReport.executiveBrief}
            </div>
          </div>

          {/* Key Findings */}
          <div className="dossier-section">
            <h3 className="dossier-section-heading">KEY INTELLIGENCE FINDINGS</h3>
            <ul className="dossier-bullets">
              {selectedReport.keyFindings.map((finding, idx) => (
                <li key={idx} className="dossier-bullet-item">{finding}</li>
              ))}
            </ul>
          </div>

          {/* MITRE ATT&CK TTP Table */}
          <div className="dossier-section">
            <h3 className="dossier-section-heading">OBSERVED TACTICS, TECHNIQUES & PROCEDURES (TTPs)</h3>
            <table className="cyber-table" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>TACTIC</th>
                  <th>TECHNIQUE & ID</th>
                  <th>FORENSIC OBSERVATION</th>
                </tr>
              </thead>
              <tbody>
                {selectedReport.ttpList.map(ttp => (
                  <tr key={ttp.id}>
                    <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-cyan)' }}>{ttp.tactic}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      <span className="code-tag">{ttp.id}</span> {ttp.technique}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{ttp.observation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Indicators of Compromise (IOCs) */}
          <div className="dossier-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="dossier-section-heading" style={{ border: 'none', padding: 0 }}>CONFIRMED INDICATORS OF COMPROMISE (IOCs)</h3>
              <button className="cyber-btn cyber-btn-sm" onClick={handleCopyIOCs}>
                <Copy size={11} />
                <span>Copy All IOCs</span>
              </button>
            </div>
            <table className="cyber-table" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>TYPE</th>
                  <th>INDICATOR VALUE</th>
                  <th>CONFIDENCE</th>
                  <th>FIRST SEEN</th>
                </tr>
              </thead>
              <tbody>
                {selectedReport.indicators.map((ioc, idx) => (
                  <tr key={idx}>
                    <td><span className="threat-badge medium" style={{ fontSize: 9 }}>{ioc.type}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-cyan)' }}>{ioc.indicator}</td>
                    <td style={{ color: 'var(--status-green)', fontFamily: 'var(--font-mono)' }}>{ioc.confidence}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{ioc.firstSeen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recommended Mitigations */}
          <div className="dossier-section">
            <h3 className="dossier-section-heading">RECOMMENDED CONTAINMENT & MITIGATION ACTIONS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedReport.recommendedMitigations.map((action, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(0, 255, 157, 0.05)', border: '1px solid rgba(0, 255, 157, 0.2)', padding: '10px 14px', borderRadius: 4, fontSize: 12, color: 'var(--text-main)' }}>
                  <CheckCircle2 size={16} color="var(--status-green)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
