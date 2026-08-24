import React from 'react';
import { ShieldAlert, AlertTriangle, TrendingUp, Zap, Activity } from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import '../styles/dashboard.css';

export const RiskPanel: React.FC = () => {
  const { currentRiskScore } = useIntelligence();

  const riskVectors = [
    { name: 'UPI Mule Account Fast-Layering Velocity', score: 94, level: 'red' },
    { name: 'Critical Infrastructure (Power/Telecom) Probes', score: 88, level: 'red' },
    { name: 'Defence & DRDO Target Espionage (CapraRAT)', score: 82, level: 'amber' },
    { name: 'Digital Arrest VoIP Caller-ID Spoofing', score: 76, level: 'amber' },
    { name: 'Gov/Taxpayer Phishing Reverse-Proxy Density', score: 68, level: 'cyan' }
  ];

  return (
    <div className="cyber-panel">
      <div className="cyber-panel-header">
        <div className="cyber-panel-title">
          <ShieldAlert size={16} className="cyber-panel-title-icon" color="var(--danger-red)" />
          <span>National Threat Risk Matrix (India)</span>
        </div>
        <span className="code-tag" style={{ color: '#ffb800', borderColor: 'rgba(255,184,0,0.4)' }}>DEFCON 2</span>
      </div>

      <div className="cyber-panel-body">
        {/* Risk Score Circle & Status */}
        <div className="risk-score-display">
          <div className="risk-gauge-circle">
            <span className="risk-gauge-val">{currentRiskScore}</span>
            <span className="risk-gauge-max">/ 100</span>
          </div>

          <div className="risk-summary-text">
            <div className="risk-status-pill">
              <AlertTriangle size={13} />
              <span>HIGH THREAT ADVISORY</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Active transnational UPI money-laundering surge and state-actor reconnaissance detected across Northern Load Despatch and Defence vendor nodes.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--danger-red)', fontFamily: 'var(--font-mono)' }}>
              <TrendingUp size={12} />
              <span>+6.4% escalation past 4 hours • 1930 Portal Escalated</span>
            </div>
          </div>
        </div>

        {/* Threat Vector Breakdown Bars */}
        <div className="risk-vector-list">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              National Cyber Threat Vectors
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-cyan)' }}>
              CERT-In TELEMETRY
            </span>
          </div>

          {riskVectors.map(vector => (
            <div key={vector.name} className="risk-vector-item">
              <div className="risk-vector-header">
                <span className="risk-vector-name">{vector.name}</span>
                <span className="risk-vector-pct">{vector.score}%</span>
              </div>
              <div className="risk-progress-bar-bg">
                <div 
                  className={`risk-progress-bar-fill ${vector.level}`}
                  style={{ width: `${vector.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Alert Strip */}
        <div style={{ marginTop: 16, padding: '10px 12px', background: 'rgba(255, 59, 92, 0.08)', border: '1px solid var(--border-red)', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={14} color="var(--danger-red)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--danger-red)' }}>
            I4C CITIZEN EMERGENCY FREEZE TRIGGER (1930) READY ACROSS 14 COMMERCIAL BANKS
          </span>
        </div>
      </div>
    </div>
  );
};
