import React from 'react';
import { Investigation } from '../types';
import { ShieldAlert, UserCheck, HardDrive, Target, ArrowRight } from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import '../styles/investigations.css';

interface InvestigationCardProps {
  investigation: Investigation;
  onSelect?: (inv: Investigation) => void;
}

export const InvestigationCard: React.FC<InvestigationCardProps> = ({
  investigation,
  onSelect
}) => {
  const { setSelectedInvestigation } = useIntelligence();

  const handleClick = () => {
    setSelectedInvestigation(investigation);
    if (onSelect) onSelect(investigation);
  };

  const isCrit = investigation.priority.includes('P1');

  return (
    <div 
      className={`inv-card ${isCrit ? 'critical' : ''}`}
      onClick={handleClick}
    >
      <div className="inv-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="inv-code-tag">{investigation.caseCode}</span>
          <span className={`threat-badge ${isCrit ? 'critical' : 'high'}`} style={{ fontSize: 9 }}>
            {investigation.priority}
          </span>
        </div>
        <span className="code-tag" style={{ fontSize: 10 }}>{investigation.id}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 className="inv-card-title">{investigation.title}</h3>
        <p className="inv-card-summary">{investigation.summary}</p>
      </div>

      {/* Meta Grid */}
      <div className="inv-meta-grid">
        <div className="inv-meta-item">
          <span className="inv-meta-label">THREAT ACTOR</span>
          <span className="inv-meta-val" style={{ color: 'var(--danger-red)' }}>
            {investigation.threatActorGroup}
          </span>
        </div>

        <div className="inv-meta-item">
          <span className="inv-meta-label">ATTRIBUTION CONF</span>
          <span className="inv-meta-val" style={{ color: 'var(--accent-cyan)' }}>
            {investigation.attributionConfidence}% CONFIDENT
          </span>
        </div>

        <div className="inv-meta-item">
          <span className="inv-meta-label">IMPACTED ENDPOINTS</span>
          <span className="inv-meta-val">
            {investigation.compromisedEndpoints} HOSTS
          </span>
        </div>

        <div className="inv-meta-item">
          <span className="inv-meta-label">STATUS</span>
          <span className="inv-meta-val" style={{ color: 'var(--status-green)' }}>
            {investigation.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="inv-tags-row">
        {investigation.tags.slice(0, 3).map(tag => (
          <span key={tag} className="inv-tag-badge">#{tag}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="inv-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <UserCheck size={13} color="var(--accent-cyan)" />
          <span style={{ fontSize: 11 }}>{investigation.leadAnalyst.split('(')[0]}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-cyan)', fontWeight: 600 }}>
          <span>Examine Case</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </div>
  );
};
