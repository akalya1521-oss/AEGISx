import React from 'react';
import { Entity } from '../types';
import { Database, ShieldAlert, Globe, Server, Key, ArrowRight } from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

export const EntityPanel: React.FC = () => {
  const { entities, setSelectedEntity } = useIntelligence();

  const topRiskEntities = [...entities]
    .sort((a, b) => b.threatScore - a.threatScore)
    .slice(0, 5);

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'BOTNET_C2': return Server;
      case 'DOMAIN': return Globe;
      case 'CRYPTO_WALLET': return Key;
      default: return Database;
    }
  };

  return (
    <div className="cyber-panel">
      <div className="cyber-panel-header">
        <div className="cyber-panel-title">
          <Database size={16} className="cyber-panel-title-icon" color="var(--accent-cyan)" />
          <span>High-Risk Intelligence Entities</span>
        </div>
        <Link to="/entities" style={{ color: 'var(--accent-cyan)', fontSize: 11, fontFamily: 'var(--font-mono)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>VIEW ALL ({entities.length})</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      <div className="cyber-panel-body" style={{ padding: '8px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {topRiskEntities.map(entity => {
            const Icon = getEntityIcon(entity.type);
            const isCrit = entity.threatLevel === 'CRITICAL';

            return (
              <div
                key={entity.id}
                onClick={() => setSelectedEntity(entity)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-cyan)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 240, 255, 0.05)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.25)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 3,
                    background: isCrit ? 'var(--danger-red-dim)' : 'rgba(0, 240, 255, 0.1)',
                    border: `1px solid ${isCrit ? 'var(--border-red)' : 'var(--border-cyan)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCrit ? 'var(--danger-red)' : 'var(--accent-cyan)',
                    flexShrink: 0
                  }}>
                    <Icon size={14} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, gap: 1 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entity.name}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entity.value} {entity.geo ? `• ${entity.geo.country}` : ''}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span className={`threat-badge ${entity.threatLevel.toLowerCase()}`} style={{ fontSize: 9 }}>
                    SCORE: {entity.threatScore}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
