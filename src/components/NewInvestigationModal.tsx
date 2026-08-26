import React, { useState } from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { X, FolderPlus, ShieldAlert, Plus, Trash2 } from 'lucide-react';
import '../styles/investigations.css';

export const NewInvestigationModal: React.FC = () => {
  const { isNewCaseOpen, setIsNewCaseOpen, addInvestigation } = useIntelligence();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [caseCode, setCaseCode] = useState(`OP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  const [priority, setPriority] = useState<'P1 - CRITICAL' | 'P2 - HIGH' | 'P3 - MEDIUM' | 'P4 - LOW'>('P1 - CRITICAL');
  const [threatActor, setThreatActor] = useState('');
  const [confidence, setConfidence] = useState(85);
  const [targetSectors, setTargetSectors] = useState('Healthcare, Finance');
  const [tags, setTags] = useState('Ransomware, Cobalt Strike');

  if (!isNewCaseOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addInvestigation({
      title,
      summary,
      caseCode,
      priority,
      threatActorGroup: threatActor || 'Unattributed Threat Cluster',
      attributionConfidence: Number(confidence),
      targetSectors: targetSectors.split(',').map(s => s.trim()),
      tags: tags.split(',').map(t => t.trim())
    });

    setIsNewCaseOpen(false);
  };

  return (
    <div className="case-modal-overlay" onClick={() => setIsNewCaseOpen(false)}>
      <div className="case-modal-content" style={{ maxWidth: 650 }} onClick={e => e.stopPropagation()}>
        <div className="case-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FolderPlus size={18} color="var(--accent-cyan)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#fff' }}>
              INITIALIZE NEW CYBERCRIME INVESTIGATION
            </span>
          </div>
          <button 
            className="nav-action-icon-btn" 
            onClick={() => setIsNewCaseOpen(false)}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="case-modal-body" style={{ gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <div>
              <label className="inspector-data-label">CASE CODE</label>
              <input
                type="text"
                value={caseCode}
                onChange={e => setCaseCode(e.target.value.toUpperCase())}
                className="cyber-input"
                required
              />
            </div>
            <div>
              <label className="inspector-data-label">PRIORITY RATING</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="cyber-input"
                style={{ background: 'var(--bg-panel-solid)' }}
              >
                <option value="P1 - CRITICAL">P1 - CRITICAL (Active Exfiltration)</option>
                <option value="P2 - HIGH">P2 - HIGH (Foothold / Lateral)</option>
                <option value="P3 - MEDIUM">P3 - MEDIUM (Reconnaissance / Probe)</option>
                <option value="P4 - LOW">P4 - LOW (Informational / Low Threat)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="inspector-data-label">INVESTIGATION TITLE</label>
            <input
              type="text"
              placeholder="e.g. Operation ViperLock: Fast-Flux Ransomware Campaign"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="cyber-input"
              required
            />
          </div>

          <div>
            <label className="inspector-data-label">EXECUTIVE SUMMARY & THREAT SCOPE</label>
            <textarea
              rows={3}
              placeholder="Detailed description of initial breach vector, impacted assets, adversary telemetry..."
              value={summary}
              onChange={e => setSummary(e.target.value)}
              className="cyber-input"
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
            <div>
              <label className="inspector-data-label">ATTRIBUTED THREAT ACTOR / SYNDICATE</label>
              <input
                type="text"
                placeholder="e.g. DarkHydra Syndicate / APT-29"
                value={threatActor}
                onChange={e => setThreatActor(e.target.value)}
                className="cyber-input"
              />
            </div>
            <div>
              <label className="inspector-data-label">ATTRIBUTION CONFIDENCE ({confidence}%)</label>
              <input
                type="range"
                min={30}
                max={100}
                value={confidence}
                onChange={e => setConfidence(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)', marginTop: 8 }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="inspector-data-label">IMPACTED SECTORS (COMMA SEPARATED)</label>
              <input
                type="text"
                value={targetSectors}
                onChange={e => setTargetSectors(e.target.value)}
                className="cyber-input"
              />
            </div>
            <div>
              <label className="inspector-data-label">TAGS (COMMA SEPARATED)</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="cyber-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
            <button 
              type="button" 
              className="cyber-btn"
              onClick={() => setIsNewCaseOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="cyber-btn cyber-btn-primary"
            >
              <Plus size={14} />
              <span>Initialize Case File</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
