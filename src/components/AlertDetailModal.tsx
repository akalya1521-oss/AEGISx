import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntelligence } from '../context/IntelligenceContext';
import { 
  X, 
  AlertOctagon, 
  ShieldAlert, 
  Check, 
  ArrowUpRight, 
  CheckCircle2, 
  Terminal, 
  Shield, 
  Lock, 
  Copy,
  FolderGit2
} from 'lucide-react';
import '../styles/alerts.css';

export const AlertDetailModal: React.FC = () => {
  const { selectedAlert, setSelectedAlert, acknowledgeAlert, escalateAlert, resolveAlert, addToast, investigations, setSelectedInvestigation } = useIntelligence();
  const navigate = useNavigate();

  if (!selectedAlert) return null;

  const handleCopyPayload = () => {
    if (selectedAlert.payloadPreview) {
      navigator.clipboard?.writeText(selectedAlert.payloadPreview);
      addToast({
        title: 'PAYLOAD EXTRACT COPIED',
        message: 'Raw alert payload copied to clipboard buffer.',
        type: 'info'
      });
    }
  };

  const handleBlockIp = () => {
    addToast({
      title: 'FIREWALL RULE DEPLOYED',
      message: `IP ${selectedAlert.sourceIp} dropped at perimeter border gateway.`,
      type: 'critical'
    });
  };

  const isCrit = selectedAlert.threatLevel === 'CRITICAL';

  return (
    <div className="case-modal-overlay" onClick={() => setSelectedAlert(null)}>
      <div className="case-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="case-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`threat-badge ${selectedAlert.threatLevel.toLowerCase()}`}>
              {selectedAlert.threatLevel}
            </span>
            <span className="code-tag">{selectedAlert.id}</span>
            <span className="alert-mitre-tag">
              {selectedAlert.mitreId}: {selectedAlert.mitreTechnique}
            </span>
          </div>

          <button 
            className="nav-action-icon-btn" 
            onClick={() => setSelectedAlert(null)}
            aria-label="Close Alert Modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="case-modal-body">
          {/* Title & Description */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', marginBottom: 8 }}>
              {selectedAlert.title}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {selectedAlert.description}
            </p>
          </div>

          {/* Telemetry Route Box */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            background: 'rgba(0, 0, 0, 0.3)',
            padding: 14,
            borderRadius: 4,
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <span className="inspector-data-label">SOURCE ENDPOINT</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--danger-red)', fontWeight: 700 }}>
                {selectedAlert.sourceIp}
              </div>
            </div>

            <div>
              <span className="inspector-data-label">DESTINATION</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-cyan)', fontWeight: 700 }}>
                {selectedAlert.targetIp}
              </div>
            </div>

            <div>
              <span className="inspector-data-label">DEST PORT / PROTOCOL</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-main)' }}>
                {selectedAlert.destinationPort > 0 ? `Port ${selectedAlert.destinationPort}` : 'N/A (L2/L3)'}
              </div>
            </div>

            <div>
              <span className="inspector-data-label">DETECTION SENSOR</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-main)' }}>
                {selectedAlert.source}
              </div>
            </div>
          </div>

          {/* Signature Match */}
          <div className="inspector-section">
            <span className="inspector-section-title">SIGNATURE RULE MATCH</span>
            <div style={{ padding: '10px 14px', background: 'rgba(255, 59, 92, 0.08)', border: '1px solid var(--border-red)', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--danger-red)' }}>
              {selectedAlert.signatureMatch}
            </div>
          </div>

          {/* Payload Preview */}
          {selectedAlert.payloadPreview && (
            <div className="inspector-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="inspector-section-title">INTERCEPTED PACKET PAYLOAD</span>
                <button 
                  className="cyber-btn cyber-btn-sm" 
                  onClick={handleCopyPayload}
                  style={{ padding: '2px 8px', fontSize: 10 }}
                >
                  <Copy size={11} />
                  <span>Copy Payload</span>
                </button>
              </div>
              <pre style={{
                background: '#04070c',
                border: '1px solid var(--border-subtle)',
                borderRadius: 4,
                padding: 12,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--accent-cyan)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                maxHeight: 140,
                overflowY: 'auto'
              }}>
                {selectedAlert.payloadPreview}
              </pre>
            </div>
          )}

          {/* Hex Dump */}
          {selectedAlert.hexDump && selectedAlert.hexDump.length > 0 && (
            <div className="inspector-section">
              <span className="inspector-section-title">PACKET BYTE DISASSEMBLY (HEX DUMP)</span>
              <div className="hexdump-container">
                {selectedAlert.hexDump.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(10, 16, 26, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button 
              className="cyber-btn cyber-btn-danger" 
              onClick={handleBlockIp}
            >
              <Lock size={14} />
              <span>Block Source IP</span>
            </button>

            {selectedAlert.associatedCaseId && (
              <button 
                className="cyber-btn"
                onClick={() => {
                  const linkedCase = investigations.find(i => i.id === selectedAlert.associatedCaseId);
                  if (linkedCase) {
                    setSelectedInvestigation(linkedCase);
                  }
                  setSelectedAlert(null);
                  navigate('/investigations');
                }}
              >
                <FolderGit2 size={14} color="var(--warning-amber)" />
                <span>Jump to Case File ({selectedAlert.associatedCaseId})</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {selectedAlert.status === 'NEW' && (
              <>
                <button 
                  className="cyber-btn"
                  onClick={() => {
                    acknowledgeAlert(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                >
                  <Check size={14} />
                  <span>Acknowledge</span>
                </button>

                <button 
                  className="cyber-btn cyber-btn-danger"
                  onClick={() => {
                    escalateAlert(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                >
                  <ArrowUpRight size={14} />
                  <span>Escalate to Incident Case</span>
                </button>
              </>
            )}

            {selectedAlert.status !== 'RESOLVED' && selectedAlert.status !== 'NEW' && (
              <button 
                className="cyber-btn cyber-btn-primary"
                onClick={() => {
                  resolveAlert(selectedAlert.id);
                  setSelectedAlert(null);
                }}
              >
                <CheckCircle2 size={14} />
                <span>Neutralize & Close Alert</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
