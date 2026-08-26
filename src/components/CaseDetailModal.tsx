import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntelligence } from '../context/IntelligenceContext';
import { 
  X, 
  ShieldAlert, 
  FolderGit2, 
  Plus, 
  FileText, 
  Terminal, 
  UserCheck, 
  DollarSign, 
  Lock, 
  MessageSquare, 
  Calendar, 
  CheckCircle,
  Hash,
  Download,
  ExternalLink
} from 'lucide-react';
import '../styles/investigations.css';

export const CaseDetailModal: React.FC = () => {
  const { 
    selectedInvestigation, 
    setSelectedInvestigation, 
    addCaseNote, 
    addCaseEvidence, 
    addToast,
    entities,
    setSelectedEntity 
  } = useIntelligence();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TIMELINE' | 'EVIDENCE' | 'IOCS' | 'NOTES'>('OVERVIEW');
  const [newNoteText, setNewNoteText] = useState('');
  const [newEvidenceTitle, setNewEvidenceTitle] = useState('');
  const [newEvidenceHash, setNewEvidenceHash] = useState('');
  const [newEvidenceType, setNewEvidenceType] = useState<'PCAP' | 'MEMORY_DUMP' | 'LOG_EXTRACT' | 'CRYPTO_TX' | 'SCREENSHOT' | 'MALWARE_SAMPLE'>('PCAP');

  if (!selectedInvestigation) return null;

  const isCrit = selectedInvestigation.priority.includes('P1');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addCaseNote(selectedInvestigation.id, newNoteText);
    setNewNoteText('');
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidenceTitle.trim()) return;
    const generatedHash = newEvidenceHash.trim() || `${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    addCaseEvidence(selectedInvestigation.id, newEvidenceTitle, newEvidenceType, generatedHash);
    setNewEvidenceTitle('');
    setNewEvidenceHash('');
  };

  const handleExportCase = () => {
    addToast({
      title: 'CASE DOSSIER EXPORTED',
      message: `Full forensic package for ${selectedInvestigation.caseCode} compiled.`,
      type: 'success'
    });
  };

  return (
    <div className="case-modal-overlay" onClick={() => setSelectedInvestigation(null)}>
      <div className="case-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="case-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="inv-code-tag">{selectedInvestigation.caseCode}</span>
            <span className={`threat-badge ${isCrit ? 'critical' : 'high'}`}>
              {selectedInvestigation.priority}
            </span>
            <span className="code-tag">{selectedInvestigation.id}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="cyber-btn cyber-btn-sm cyber-btn-primary" onClick={handleExportCase}>
              <Download size={13} />
              <span>Export Package</span>
            </button>
            <button 
              className="nav-action-icon-btn" 
              onClick={() => setSelectedInvestigation(null)}
              aria-label="Close Case Modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '10px 24px', background: 'rgba(10, 16, 26, 0.95)', borderBottom: '1px solid var(--border-subtle)' }}>
          {(['OVERVIEW', 'TIMELINE', 'EVIDENCE', 'IOCS', 'NOTES'] as const).map(tab => (
            <button
              key={tab}
              className={`inv-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'OVERVIEW' && 'Case Overview'}
              {tab === 'TIMELINE' && `Timeline (${selectedInvestigation.timeline.length})`}
              {tab === 'EVIDENCE' && `Evidence Vault (${selectedInvestigation.evidence.length})`}
              {tab === 'IOCS' && `Indicators (${selectedInvestigation.indicatorsOfCompromise.length})`}
              {tab === 'NOTES' && `Analyst Notes (${selectedInvestigation.caseNotes.length})`}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="case-modal-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', marginBottom: 8 }}>
                  {selectedInvestigation.title}
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {selectedInvestigation.summary}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="inv-meta-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', padding: 16 }}>
                <div className="inv-meta-item">
                  <span className="inv-meta-label">ATTRIBUTED ACTOR</span>
                  <span className="inv-meta-val" style={{ color: 'var(--danger-red)', fontSize: 13 }}>
                    {selectedInvestigation.threatActorGroup}
                  </span>
                </div>
                <div className="inv-meta-item">
                  <span className="inv-meta-label">ATTRIBUTION CONFIDENCE</span>
                  <span className="inv-meta-val" style={{ color: 'var(--accent-cyan)', fontSize: 13 }}>
                    {selectedInvestigation.attributionConfidence}%
                  </span>
                </div>
                <div className="inv-meta-item">
                  <span className="inv-meta-label">FINANCIAL DAMAGE EST.</span>
                  <span className="inv-meta-val" style={{ color: 'var(--warning-amber)', fontSize: 13 }}>
                    {selectedInvestigation.financialDamageEst || 'Assessing...'}
                  </span>
                </div>
                <div className="inv-meta-item">
                  <span className="inv-meta-label">COMPROMISED HOSTS</span>
                  <span className="inv-meta-val" style={{ color: 'var(--text-main)', fontSize: 13 }}>
                    {selectedInvestigation.compromisedEndpoints} Nodes
                  </span>
                </div>
              </div>

              {/* Lead Analyst & Target Sectors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                  <span className="inspector-data-label">LEAD INTELLIGENCE ANALYST</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <UserCheck size={16} color="var(--accent-cyan)" />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#fff' }}>
                      {selectedInvestigation.leadAnalyst}
                    </span>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                  <span className="inspector-data-label">TARGETED INDUSTRY SECTORS</span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    {selectedInvestigation.targetSectors.map(sector => (
                      <span key={sector} className="code-tag" style={{ color: 'var(--text-main)' }}>
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="inspector-data-label">CASE TAGS:</span>
                {selectedInvestigation.tags.map(tag => (
                  <span key={tag} className="inv-tag-badge">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE */}
          {activeTab === 'TIMELINE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 className="inspector-section-title">CHRONOLOGICAL THREAT TIMELINE</h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
                  {selectedInvestigation.timeline.length} VERIFIED MILESTONES
                </span>
              </div>

              <div className="timeline-track">
                {selectedInvestigation.timeline.map(event => (
                  <div key={event.id} className={`timeline-event-item ${event.threatLevel === 'CRITICAL' ? 'critical' : ''}`}>
                    <div className="timeline-event-header">
                      <span className="timeline-event-time">{event.timestamp}</span>
                      <span className="timeline-event-title">{event.title}</span>
                      {event.sourceIp && <span className="code-tag" style={{ fontSize: 9 }}>{event.sourceIp}</span>}
                    </div>
                    <p className="timeline-event-desc">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EVIDENCE VAULT */}
          {activeTab === 'EVIDENCE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 className="inspector-section-title">DIGITAL EVIDENCE & FORENSIC ARTIFACTS</h3>
              </div>

              {/* Evidence Form */}
              <form onSubmit={handleAddEvidence} style={{ background: 'rgba(0,0,0,0.35)', padding: 14, borderRadius: 4, border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  LOG NEW FORENSIC ARTIFACT
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr auto', gap: 10 }}>
                  <input
                    type="text"
                    placeholder="Artifact Title (e.g. Memory Dump lsass.exe)"
                    value={newEvidenceTitle}
                    onChange={e => setNewEvidenceTitle(e.target.value)}
                    className="cyber-input"
                    required
                  />
                  <select
                    value={newEvidenceType}
                    onChange={e => setNewEvidenceType(e.target.value as any)}
                    className="cyber-input"
                    style={{ background: 'var(--bg-panel-solid)' }}
                  >
                    <option value="PCAP">PCAP Network Stream</option>
                    <option value="MEMORY_DUMP">Memory Dump</option>
                    <option value="LOG_EXTRACT">Log Extract</option>
                    <option value="CRYPTO_TX">Crypto Transaction</option>
                    <option value="MALWARE_SAMPLE">Malware Binary</option>
                  </select>
                  <input
                    type="text"
                    placeholder="SHA-256 Hash (Optional, auto-generated if blank)"
                    value={newEvidenceHash}
                    onChange={e => setNewEvidenceHash(e.target.value)}
                    className="cyber-input"
                  />
                  <button type="submit" className="cyber-btn cyber-btn-primary">
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              {/* Evidence Cards */}
              <div className="evidence-grid">
                {selectedInvestigation.evidence.map(ev => (
                  <div key={ev.id} className="evidence-chip">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="evidence-chip-title">
                        <Terminal size={14} color="var(--accent-cyan)" />
                        {ev.title}
                      </span>
                      <span className="code-tag" style={{ fontSize: 9 }}>{ev.type}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', margin: '4px 0' }}>
                      Size: {ev.fileSize} • Collector: {ev.collectedBy}
                    </div>
                    <span className="evidence-chip-hash">
                      SHA256: {ev.hash}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: IOCS */}
          {activeTab === 'IOCS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 className="inspector-section-title">ASSOCIATED INDICATORS OF COMPROMISE</h3>
              <table className="cyber-table">
                <thead>
                  <tr>
                    <th>TYPE</th>
                    <th>INDICATOR VALUE</th>
                    <th>FORENSIC ROLE</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvestigation.indicatorsOfCompromise.map((ioc, idx) => {
                    const matchedEntity = entities.find(e => e.value.toLowerCase() === ioc.value.toLowerCase() || e.name.toLowerCase().includes(ioc.value.toLowerCase()));

                    return (
                      <tr key={idx}>
                        <td><span className="threat-badge medium" style={{ fontSize: 9 }}>{ioc.type}</span></td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{ioc.value}</td>
                        <td style={{ color: 'var(--text-main)' }}>{ioc.role}</td>
                        <td>
                          {matchedEntity ? (
                            <button
                              className="cyber-btn cyber-btn-sm"
                              onClick={() => {
                                setSelectedInvestigation(null);
                                setSelectedEntity(matchedEntity);
                              }}
                            >
                              <ExternalLink size={11} />
                              <span>Inspect Entity</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>Verified IOC</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: NOTES */}
          {activeTab === 'NOTES' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <form onSubmit={handleAddNote} style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Type an intelligence note or investigative hypothesis..."
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  className="cyber-input"
                  style={{ flex: 1 }}
                  required
                />
                <button type="submit" className="cyber-btn cyber-btn-primary">
                  <MessageSquare size={14} />
                  <span>Post Note</span>
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedInvestigation.caseNotes.map(note => (
                  <div key={note.id} style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, borderLeft: '3px solid var(--accent-cyan)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, color: '#fff' }}>
                        {note.author}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
                        {note.timestamp}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
