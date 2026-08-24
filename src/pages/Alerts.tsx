import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCheck, 
  Radio, 
  Lock, 
  Play, 
  Pause 
} from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import { AlertCard } from '../components/AlertCard';
import { playCyberSound } from '../utils/audio';
import '../styles/alerts.css';

export const Alerts: React.FC = () => {
  const { alerts, acknowledgeAlert, addToast } = useIntelligence();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(alert => {
    if (severityFilter !== 'ALL' && alert.threatLevel !== severityFilter) return false;
    if (statusFilter !== 'ALL' && alert.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      alert.title.toLowerCase().includes(q) ||
      alert.id.toLowerCase().includes(q) ||
      alert.mitreId.toLowerCase().includes(q) ||
      alert.mitreTechnique.toLowerCase().includes(q) ||
      alert.sourceIp.toLowerCase().includes(q) ||
      alert.targetIp.toLowerCase().includes(q) ||
      (alert.jurisdiction && alert.jurisdiction.toLowerCase().includes(q))
    );
  });

  const handleAcknowledgeAll = () => {
    alerts.forEach(a => {
      if (a.status === 'NEW') acknowledgeAlert(a.id);
    });
    addToast({
      title: 'ALL INCIDENTS ACKNOWLEDGED',
      message: 'Assigned all incoming queue items to active CERT-In / I4C analyst triage.',
      type: 'info'
    });
  };

  const unackCount = alerts.filter(a => a.status === 'NEW').length;
  const criticalCount = alerts.filter(a => a.threatLevel === 'CRITICAL').length;

  return (
    <div className="alerts-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-breadcrumb">
          I4C • CERT-In • NCIIPC / SOC INCIDENT QUEUE
        </div>
        <div className="page-title-row">
          <div>
            <h1 className="page-title">National Threat & Incident Queue</h1>
            <p className="page-subtitle">
              High-fidelity automated detections correlated across National Cyber Threat Grid, NPCI UPI switches, NCIIPC power gateways, and DoT TAFCOP telecom sentry.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {unackCount > 0 && (
              <button className="cyber-btn cyber-btn-primary" onClick={handleAcknowledgeAll}>
                <CheckCheck size={14} />
                <span>Acknowledge All ({unackCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Stream Banner */}
      <div className="alerts-live-ticker-bar">
        <div className="alerts-live-ticker-left">
          <Radio size={14} className="pulse-dot critical" style={{ width: 8, height: 8 }} />
          <span>REAL-TIME SIEM CORRELATION ACTIVE</span>
        </div>
        <div className="alerts-live-ticker-text">
          I4C_1930 ➔ NPCI_UPI_FRAUD ➔ CERT-IN_NCTG ➔ NCIIPC_OT_SCADA ➔ DoT_TAFCOP
        </div>
      </div>

      {/* Summary Chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <div className="cyber-panel" style={{ padding: '12px 16px' }}>
          <span className="inspector-data-label">UNACKNOWLEDGED ALERTS</span>
          <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: 20, fontWeight: 800, color: unackCount > 0 ? 'var(--danger-red)' : 'var(--status-green)', marginTop: 4 }}>
            {unackCount} QUEUED
          </div>
        </div>

        <div className="cyber-panel" style={{ padding: '12px 16px' }}>
          <span className="inspector-data-label">CRITICAL SEVERITY</span>
          <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: 20, fontWeight: 800, color: 'var(--danger-red)', marginTop: 4 }}>
            {criticalCount} EVENTS
          </div>
        </div>

        <div className="cyber-panel" style={{ padding: '12px 16px' }}>
          <span className="inspector-data-label">CERT-In 6-HR COMPLIANCE</span>
          <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: 20, fontWeight: 800, color: 'var(--status-green)', marginTop: 4 }}>
            94.2% ON-TIME
          </div>
        </div>

        <div className="cyber-panel" style={{ padding: '12px 16px' }}>
          <span className="inspector-data-label">AUTOMATED UPI / SIM BLOCKS</span>
          <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: 20, fontWeight: 800, color: 'var(--status-green)', marginTop: 4 }}>
            384 BLOCKED
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="alerts-toolbar">
        {/* Severity Filters */}
        <div className="entities-filter-types">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
            <button
              key={sev}
              className={`entity-type-btn ${severityFilter === sev ? 'active' : ''}`}
              onClick={() => {
                playCyberSound('click');
                setSeverityFilter(sev);
              }}
            >
              <span>{sev === 'ALL' ? 'All Severities' : sev}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 280 }}>
          <input
            type="text"
            placeholder="Search MITRE, VPA, State, IP..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="cyber-input"
            style={{ paddingLeft: 32 }}
          />
          <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-dim)' }} />
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="cyber-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            NO ACTIVE INCIDENTS MATCHING SPECIFIED FILTER
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        )}
      </div>
    </div>
  );
};
