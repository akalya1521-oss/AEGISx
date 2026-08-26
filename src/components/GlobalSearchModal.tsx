import React, { useState, useEffect, useRef } from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { Search, X, Shield, FolderGit2, AlertTriangle, FileText, Database, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { playCyberSound } from '../utils/audio';
import '../styles/components.css';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    entities, 
    investigations, 
    alerts, 
    reports,
    setSelectedEntity,
    setSelectedInvestigation,
    setSelectedAlert,
    setSelectedReport
  } = useIntelligence();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchedEntities = entities.filter(
    e => !cleanQuery || e.name.toLowerCase().includes(cleanQuery) || e.value.toLowerCase().includes(cleanQuery) || e.tags.some(t => t.toLowerCase().includes(cleanQuery))
  ).slice(0, 4);

  const matchedCases = investigations.filter(
    i => !cleanQuery || i.title.toLowerCase().includes(cleanQuery) || i.caseCode.toLowerCase().includes(cleanQuery) || i.threatActorGroup.toLowerCase().includes(cleanQuery)
  ).slice(0, 3);

  const matchedAlerts = alerts.filter(
    a => !cleanQuery || a.title.toLowerCase().includes(cleanQuery) || a.id.toLowerCase().includes(cleanQuery) || a.mitreId.toLowerCase().includes(cleanQuery)
  ).slice(0, 3);

  const matchedReports = reports.filter(
    r => !cleanQuery || r.title.toLowerCase().includes(cleanQuery) || r.reportCode.toLowerCase().includes(cleanQuery)
  ).slice(0, 3);

  const totalResults = matchedEntities.length + matchedCases.length + matchedAlerts.length + matchedReports.length;

  return (
    <div className="search-modal-overlay" onClick={() => setIsSearchOpen(false)}>
      <div className="search-modal-box" onClick={e => e.stopPropagation()}>
        {/* Search Header */}
        <div className="search-input-header">
          <Search size={18} color="var(--accent-cyan)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search IPs, domains, CVEs, cases, malware hashes, threat actors..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button 
            className="nav-action-icon-btn" 
            onClick={() => setIsSearchOpen(false)}
            style={{ width: 28, height: 28 }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Search Results */}
        <div className="search-results-list">
          {totalResults === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-dim)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
              NO INTELLIGENCE RECORDS MATCHING "{query}"
            </div>
          ) : (
            <>
              {/* Entities */}
              {matchedEntities.length > 0 && (
                <div>
                  <div style={{ padding: '6px 12px', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Entities ({matchedEntities.length})
                  </div>
                  {matchedEntities.map(entity => (
                    <div
                      key={entity.id}
                      className="search-result-item"
                      onClick={() => {
                        playCyberSound('blip');
                        setSelectedEntity(entity);
                        setIsSearchOpen(false);
                        navigate('/entities');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Database size={14} color="var(--accent-cyan)" />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{entity.name}</div>
                          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{entity.value}</div>
                        </div>
                      </div>
                      <span className={`threat-badge ${entity.threatLevel.toLowerCase()}`} style={{ fontSize: 9 }}>
                        {entity.threatScore} / 100
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Cases */}
              {matchedCases.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ padding: '6px 12px', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Investigations ({matchedCases.length})
                  </div>
                  {matchedCases.map(inv => (
                    <div
                      key={inv.id}
                      className="search-result-item"
                      onClick={() => {
                        playCyberSound('blip');
                        setSelectedInvestigation(inv);
                        setIsSearchOpen(false);
                        navigate('/investigations');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FolderGit2 size={14} color="var(--warning-amber)" />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{inv.title}</div>
                          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{inv.caseCode} • {inv.threatActorGroup}</div>
                        </div>
                      </div>
                      <span className="code-tag" style={{ fontSize: 9 }}>{inv.priority}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Alerts */}
              {matchedAlerts.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ padding: '6px 12px', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Active Alerts ({matchedAlerts.length})
                  </div>
                  {matchedAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className="search-result-item"
                      onClick={() => {
                        playCyberSound('blip');
                        setSelectedAlert(alert);
                        setIsSearchOpen(false);
                        navigate('/alerts');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <AlertTriangle size={14} color="var(--danger-red)" />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{alert.title}</div>
                          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{alert.id} • {alert.sourceIp}</div>
                        </div>
                      </div>
                      <span className={`threat-badge ${alert.threatLevel.toLowerCase()}`} style={{ fontSize: 9 }}>
                        {alert.threatLevel}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reports */}
              {matchedReports.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ padding: '6px 12px', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Intelligence Reports ({matchedReports.length})
                  </div>
                  {matchedReports.map(rep => (
                    <div
                      key={rep.id}
                      className="search-result-item"
                      onClick={() => {
                        playCyberSound('blip');
                        setSelectedReport(rep);
                        setIsSearchOpen(false);
                        navigate('/reports');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FileText size={14} color="var(--status-green)" />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{rep.title}</div>
                          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{rep.reportCode} • {rep.classification}</div>
                        </div>
                      </div>
                      <span className="code-tag" style={{ fontSize: 9 }}>DOSSIER</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Hint */}
        <div style={{ padding: '8px 16px', background: 'rgba(8, 12, 20, 0.95)', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
          <span>Press ESC to dismiss</span>
          <span>CIPHER GLOBAL REPOSITORY</span>
        </div>
      </div>
    </div>
  );
};
