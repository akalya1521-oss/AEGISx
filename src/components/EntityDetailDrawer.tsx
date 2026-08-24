import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntelligence } from '../context/IntelligenceContext';
import { 
  X, 
  ShieldAlert, 
  Globe, 
  Server, 
  Key, 
  Terminal, 
  Lock, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Activity,
  Network,
  FolderGit2
} from 'lucide-react';
import '../styles/entities.css';

export const EntityDetailDrawer: React.FC = () => {
  const { selectedEntity, setSelectedEntity, isolateEntity, addToast, networkNodes, setSelectedNode } = useIntelligence();
  const navigate = useNavigate();

  if (!selectedEntity) return null;

  const handleIsolate = () => {
    isolateEntity(selectedEntity.id);
  };

  const handleCopyIOC = () => {
    navigator.clipboard?.writeText(selectedEntity.value);
    addToast({
      title: 'IOC COPIED TO CLIPBOARD',
      message: `Value "${selectedEntity.value}" ready for firewall blocklist.`,
      type: 'info'
    });
  };

  const isCrit = selectedEntity.threatLevel === 'CRITICAL';

  return (
    <div className="entity-drawer-overlay" onClick={() => setSelectedEntity(null)}>
      <div className="entity-drawer" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="entity-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`threat-badge ${selectedEntity.threatLevel.toLowerCase()}`}>
              {selectedEntity.type}
            </span>
            <span className="code-tag">{selectedEntity.id}</span>
          </div>
          <button 
            className="nav-action-icon-btn" 
            onClick={() => setSelectedEntity(null)}
            aria-label="Close Drawer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="entity-drawer-body">
          {/* Entity Main Title */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', marginBottom: 4 }}>
              {selectedEntity.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-cyan)' }}>
              <span>{selectedEntity.value}</span>
              <button 
                className="cyber-btn cyber-btn-sm" 
                onClick={handleCopyIOC}
                style={{ padding: '2px 6px', fontSize: 10 }}
              >
                Copy IOC
              </button>
            </div>
          </div>

          {/* Threat Score Card */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: `1px solid ${isCrit ? 'var(--border-red)' : 'var(--border-cyan)'}`,
            borderRadius: 4,
            padding: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                CURRENT THREAT SCORE
              </span>
              <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: 28, fontWeight: 900, color: isCrit ? 'var(--danger-red)' : 'var(--accent-cyan)' }}>
                {selectedEntity.threatScore} <span style={{ fontSize: 14, color: 'var(--text-dim)' }}>/ 100</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>STATUS:</span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: selectedEntity.status === 'ISOLATED' ? 'var(--danger-red)' : 'var(--status-green)' }}>
                {selectedEntity.status}
              </div>
            </div>
          </div>

          {/* Reputation / Narrative */}
          <div className="inspector-section">
            <span className="inspector-section-title">INTELLIGENCE ASSESSMENT</span>
            <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: 12, borderRadius: 4, border: '1px solid var(--border-subtle)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {selectedEntity.reputation}
              {selectedEntity.notes && (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-main)' }}>
                  <strong>Analyst Note:</strong> {selectedEntity.notes}
                </div>
              )}
            </div>
          </div>

          {/* Attribution & Campaign */}
          <div className="inspector-section">
            <span className="inspector-section-title">ADVERSARY ATTRIBUTION</span>
            <div className="inspector-data-grid">
              <div className="inspector-data-item">
                <span className="inspector-data-label">Threat Actor</span>
                <span className="inspector-data-val" style={{ color: 'var(--danger-red)', fontWeight: 700 }}>
                  {selectedEntity.associatedGroup || 'Unattributed'}
                </span>
              </div>
              <div className="inspector-data-item">
                <span className="inspector-data-label">Campaign</span>
                <span className="inspector-data-val">
                  {selectedEntity.associatedCampaign || 'Opportunistic'}
                </span>
              </div>
            </div>
          </div>

          {/* Geolocation & ASN */}
          {selectedEntity.geo && (
            <div className="inspector-section">
              <span className="inspector-section-title">GEOLOCATION & NETWORK ROUTING</span>
              <div className="inspector-data-grid">
                <div className="inspector-data-item">
                  <span className="inspector-data-label">Origin Location</span>
                  <span className="inspector-data-val">
                    {selectedEntity.geo.flagEmoji} {selectedEntity.geo.city}, {selectedEntity.geo.country}
                  </span>
                </div>
                <div className="inspector-data-item">
                  <span className="inspector-data-label">Coordinates</span>
                  <span className="inspector-data-val">
                    {selectedEntity.geo.lat}, {selectedEntity.geo.lng}
                  </span>
                </div>
                <div className="inspector-data-item" style={{ gridColumn: 'span 2' }}>
                  <span className="inspector-data-label">Autonomous System (ASN)</span>
                  <span className="inspector-data-val" style={{ color: 'var(--accent-cyan)' }}>
                    {selectedEntity.geo.asn}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* WHOIS Data */}
          {selectedEntity.whoisData && (
            <div className="inspector-section">
              <span className="inspector-section-title">REGISTRY & WHOIS TELEMETRY</span>
              <div className="inspector-data-grid">
                <div className="inspector-data-item">
                  <span className="inspector-data-label">Registrar</span>
                  <span className="inspector-data-val">{selectedEntity.whoisData.registrar}</span>
                </div>
                <div className="inspector-data-item">
                  <span className="inspector-data-label">Creation Date</span>
                  <span className="inspector-data-val">{selectedEntity.whoisData.creationDate}</span>
                </div>
                <div className="inspector-data-item" style={{ gridColumn: 'span 2' }}>
                  <span className="inspector-data-label">Registrant Organization</span>
                  <span className="inspector-data-val">{selectedEntity.whoisData.registrantOrg}</span>
                </div>
              </div>
            </div>
          )}

          {/* Open Ports */}
          {selectedEntity.openPorts && selectedEntity.openPorts.length > 0 && (
            <div className="inspector-section">
              <span className="inspector-section-title">DISCOVERED OPEN PORTS</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selectedEntity.openPorts.map(port => (
                  <span key={port} className="code-tag" style={{ color: 'var(--warning-amber)' }}>
                    PORT {port}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* First & Last Seen */}
          <div className="inspector-section">
            <span className="inspector-section-title">OBSERVATION WINDOW</span>
            <div className="inspector-data-grid">
              <div className="inspector-data-item">
                <span className="inspector-data-label">First Seen</span>
                <span className="inspector-data-val">{selectedEntity.firstSeen}</span>
              </div>
              <div className="inspector-data-item">
                <span className="inspector-data-label">Last Beacon</span>
                <span className="inspector-data-val" style={{ color: 'var(--status-green)' }}>{selectedEntity.lastSeen}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="inspector-actions">
          <button
            className="cyber-btn"
            style={{ width: '100%' }}
            onClick={() => {
              const matchedNode = networkNodes.find(n => n.ip === selectedEntity.value || n.label.includes(selectedEntity.value) || n.cluster === selectedEntity.associatedGroup);
              if (matchedNode) {
                setSelectedNode(matchedNode);
              }
              setSelectedEntity(null);
              navigate('/network-analysis');
            }}
          >
            <Network size={14} />
            <span>Explore in Network Topology</span>
          </button>

          {selectedEntity.status !== 'ISOLATED' ? (
            <button 
              className="cyber-btn cyber-btn-danger" 
              onClick={handleIsolate}
              style={{ width: '100%' }}
            >
              <Lock size={14} />
              <span>Quarantine & Isolate Entity</span>
            </button>
          ) : (
            <div style={{ padding: '8px 12px', background: 'rgba(255, 59, 92, 0.1)', border: '1px solid var(--border-red)', borderRadius: 4, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--danger-red)' }}>
              ENTITY STRICTLY ISOLATED FROM SOC ROUTING
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
