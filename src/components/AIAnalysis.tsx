import React from 'react';
import { Cpu, ShieldAlert, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { mockAIAnalysis } from '../data/aiAnalysis';
import { useIntelligence } from '../context/IntelligenceContext';
import '../styles/components.css';

export const AIAnalysis: React.FC = () => {
  const { isolateNode, addToast } = useIntelligence();

  const handleExecuteMitigation = () => {
    mockAIAnalysis.criticalNodesToIsolate.forEach(nodeId => {
      isolateNode(nodeId);
    });
    addToast({
      title: 'DEFENSIVE COUNTERMEASURES EXECUTED',
      message: `Quarantine applied across ${mockAIAnalysis.criticalNodesToIsolate.length} compromised nodes.`,
      type: 'critical'
    });
  };

  return (
    <div className="cyber-panel ai-analysis-panel">
      <div className="cyber-panel-header" style={{ borderBottomColor: 'rgba(0, 240, 255, 0.2)' }}>
        <div className="cyber-panel-title">
          <Cpu size={16} color="var(--accent-cyan)" />
          <span>CIPHER-AI // Automated Intelligence Synthesis</span>
        </div>
        <div className="ai-header-tag">
          CONFIDENCE: {mockAIAnalysis.confidenceScore}%
        </div>
      </div>

      <div className="cyber-panel-body">
        {/* Headline */}
        <h4 className="ai-headline">
          {mockAIAnalysis.headline}
        </h4>

        {/* Observation Block */}
        <div className="ai-observation-box">
          <p>{mockAIAnalysis.keyObservation}</p>
        </div>

        {/* Attribution & Anomalies */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px 12px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              PRIMARY THREAT ACTOR
            </span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: 'var(--danger-red)' }}>
              {mockAIAnalysis.primaryThreatActor}
            </div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px 12px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              ANOMALIES CORRELATED
            </span>
            <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: 14, fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {mockAIAnalysis.anomaliesDetected} DETECTED
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className="ai-action-callout">
          <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em' }}>
              RECOMMENDED DEFENSIVE ACTION
            </span>
            <span>{mockAIAnalysis.suggestedAction}</span>
            <div style={{ marginTop: 8 }}>
              <button 
                className="cyber-btn cyber-btn-danger cyber-btn-sm"
                onClick={handleExecuteMitigation}
              >
                <span>Execute Emergency Isolation</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div style={{ marginTop: 12, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
          {mockAIAnalysis.timestamp}
        </div>
      </div>
    </div>
  );
};
