import React from 'react';
import { Alert } from '../types';
import { AlertOctagon, Check, ArrowUpRight, CheckCircle2, Shield } from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import '../styles/alerts.css';

interface AlertCardProps {
  alert: Alert;
  onSelect?: (alert: Alert) => void;
  compact?: boolean;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onSelect, compact = false }) => {
  const { acknowledgeAlert, escalateAlert, resolveAlert, setSelectedAlert } = useIntelligence();

  const handleClick = () => {
    setSelectedAlert(alert);
    if (onSelect) onSelect(alert);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="threat-badge critical" style={{ fontSize: 9 }}>UNACK</span>;
      case 'ACKNOWLEDGED':
        return <span className="threat-badge high" style={{ fontSize: 9 }}>IN TRIAGE</span>;
      case 'ESCALATED':
        return <span className="threat-badge critical" style={{ fontSize: 9 }}>ESCALATED</span>;
      case 'RESOLVED':
        return <span className="threat-badge low" style={{ fontSize: 9 }}>RESOLVED</span>;
      default:
        return <span className="threat-badge informational" style={{ fontSize: 9 }}>{status}</span>;
    }
  };

  return (
    <div 
      className={`alert-card-row ${alert.threatLevel.toLowerCase()}`}
      onClick={handleClick}
    >
      <div className="alert-card-left">
        <div className="alert-icon-box">
          <AlertOctagon size={18} />
        </div>

        <div className="alert-content-wrap">
          <div className="alert-header-line">
            <span className="code-tag" style={{ fontSize: 10 }}>{alert.id}</span>
            <span className="alert-code-title">{alert.title}</span>
            {getStatusBadge(alert.status)}
          </div>

          <p className="alert-desc-text">{alert.description}</p>

          <div className="alert-meta-tags">
            <span className="alert-mitre-tag">
              MITRE {alert.mitreId}: {alert.mitreTechnique}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
              SRC: <span style={{ color: 'var(--text-main)' }}>{alert.sourceIp}</span> ➔ DST: <span style={{ color: 'var(--text-cyan)' }}>{alert.targetIp}</span>
            </span>
            {alert.associatedCaseId && (
              <span className="code-tag" style={{ fontSize: 10, color: 'var(--accent-cyan)' }}>
                CASE: {alert.associatedCaseId}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="alert-card-right">
        <div className="alert-time-stamp">
          <div>{alert.timestamp.slice(11, 19)} UTC</div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>Conf: {alert.confidence}%</div>
        </div>

        {!compact && alert.status === 'NEW' && (
          <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
            <button 
              className="cyber-btn cyber-btn-sm"
              onClick={() => acknowledgeAlert(alert.id)}
              title="Acknowledge Alert"
            >
              <Check size={12} />
              <span>Ack</span>
            </button>
            <button 
              className="cyber-btn cyber-btn-danger cyber-btn-sm"
              onClick={() => escalateAlert(alert.id)}
              title="Escalate Alert to Priority Case"
            >
              <ArrowUpRight size={12} />
              <span>Escalate</span>
            </button>
          </div>
        )}

        {!compact && alert.status !== 'NEW' && alert.status !== 'RESOLVED' && (
          <div onClick={e => e.stopPropagation()}>
            <button 
              className="cyber-btn cyber-btn-sm"
              onClick={() => resolveAlert(alert.id)}
              title="Mark Threat Neutralized"
            >
              <CheckCircle2 size={12} />
              <span>Resolve</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
