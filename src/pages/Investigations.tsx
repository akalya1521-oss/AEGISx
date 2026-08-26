import React, { useState } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  ShieldAlert, 
  UserCheck, 
  HardDrive,
  Download,
  Building2
} from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import { InvestigationCard } from '../components/InvestigationCard';
import { playCyberSound } from '../utils/audio';
import '../styles/investigations.css';

export const Investigations: React.FC = () => {
  const { investigations, setIsNewCaseOpen, setSelectedInvestigation, addToast } = useIntelligence();

  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'ACTIVE' | 'CONTAINMENT' | 'ESCALATED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  const filteredInvestigations = investigations.filter(inv => {
    // Tab filter
    if (activeTab === 'CRITICAL' && !inv.priority.includes('P1')) return false;
    if (activeTab === 'ACTIVE' && inv.status !== 'ACTIVE_INVESTIGATION') return false;
    if (activeTab === 'CONTAINMENT' && inv.status !== 'CONTAINMENT') return false;
    if (activeTab === 'ESCALATED' && inv.status !== 'ESCALATED_LE') return false;

    // Search filter
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.title.toLowerCase().includes(q) ||
      inv.caseCode.toLowerCase().includes(q) ||
      inv.threatActorGroup.toLowerCase().includes(q) ||
      inv.investigatingAgency.toLowerCase().includes(q) ||
      inv.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const totalEndpoints = investigations.reduce((acc, i) => acc + i.compromisedEndpoints, 0);
  const totalEvidence = investigations.reduce((acc, i) => acc + i.evidence.length, 0);

  return (
    <div className="investigations-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-breadcrumb">
          I4C • CBI • CERT-In / ACTIVE INVESTIGATIONS
        </div>
        <div className="page-title-row">
          <div>
            <h1 className="page-title">National Cyber Crime Investigations</h1>
            <p className="page-subtitle">
              Coordinated cross-state case files, UPI mule account tracking, state-sponsored espionage attribution and NCFL digital forensics.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              className="cyber-btn cyber-btn-primary"
              onClick={() => {
                playCyberSound('click');
                setIsNewCaseOpen(true);
              }}
            >
              <Plus size={14} />
              <span>Initialize Case File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Case Metrics Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16
      }}>
        <div className="cyber-panel" style={{ padding: '14px 18px' }}>
          <span className="inspector-data-label">ACTIVE CASE FILES</span>
          <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 4 }}>
            {investigations.length} CASES
          </div>
        </div>

        <div className="cyber-panel" style={{ padding: '14px 18px' }}>
          <span className="inspector-data-label">FINANCIAL LOSS EXPOSURE</span>
          <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: 22, fontWeight: 800, color: 'var(--danger-red)', marginTop: 4 }}>
            ₹142.5 CRORE
          </div>
        </div>

        <div className="cyber-panel" style={{ padding: '14px 18px' }}>
          <span className="inspector-data-label">COMPROMISED HOSTS / SIMs</span>
          <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: 22, fontWeight: 800, color: 'var(--warning-amber)', marginTop: 4 }}>
            {totalEndpoints.toLocaleString()} TARGETS
          </div>
        </div>

        <div className="cyber-panel" style={{ padding: '14px 18px' }}>
          <span className="inspector-data-label">NCFL DIGITAL EVIDENCE</span>
          <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: 22, fontWeight: 800, color: 'var(--accent-cyan)', marginTop: 4 }}>
            {totalEvidence} ARTIFACTS
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="inv-toolbar">
        <div className="inv-search-filter-row">
          <div style={{ position: 'relative', width: 280 }}>
            <input
              type="text"
              placeholder="Search case, agency, adversary..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="cyber-input"
              style={{ paddingLeft: 32 }}
            />
            <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-dim)' }} />
          </div>

          <div className="inv-tabs">
            <button
              className={`inv-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveTab('ALL')}
            >
              All Cases ({investigations.length})
            </button>
            <button
              className={`inv-tab-btn ${activeTab === 'CRITICAL' ? 'active' : ''}`}
              onClick={() => setActiveTab('CRITICAL')}
            >
              Critical P1 ({investigations.filter(i => i.priority.includes('P1')).length})
            </button>
            <button
              className={`inv-tab-btn ${activeTab === 'ACTIVE' ? 'active' : ''}`}
              onClick={() => setActiveTab('ACTIVE')}
            >
              Active Triage ({investigations.filter(i => i.status === 'ACTIVE_INVESTIGATION').length})
            </button>
            <button
              className={`inv-tab-btn ${activeTab === 'CONTAINMENT' ? 'active' : ''}`}
              onClick={() => setActiveTab('CONTAINMENT')}
            >
              Containment
            </button>
            <button
              className={`inv-tab-btn ${activeTab === 'ESCALATED' ? 'active' : ''}`}
              onClick={() => setActiveTab('ESCALATED')}
            >
              CBI / LE Escalated
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-panel)', padding: 4, borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
          <button
            className={`cyber-btn cyber-btn-sm ${viewMode === 'GRID' ? 'cyber-btn-primary' : ''}`}
            onClick={() => setViewMode('GRID')}
            title="Card Grid View"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            className={`cyber-btn cyber-btn-sm ${viewMode === 'TABLE' ? 'cyber-btn-primary' : ''}`}
            onClick={() => setViewMode('TABLE')}
            title="Table View"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'GRID' ? (
        <div className="inv-cards-grid">
          {filteredInvestigations.map(inv => (
            <InvestigationCard key={inv.id} investigation={inv} />
          ))}
        </div>
      ) : (
        <div className="entities-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>CASE CODE</th>
                <th>CASE TITLE</th>
                <th>PRIORITY</th>
                <th>INVESTIGATING AGENCY</th>
                <th>ATTRIBUTED ACTOR</th>
                <th>FINANCIAL IMPACT</th>
                <th>STATUS</th>
                <th>LEAD OFFICER</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestigations.map(inv => (
                <tr 
                  key={inv.id} 
                  onClick={() => setSelectedInvestigation(inv)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><span className="inv-code-tag">{inv.caseCode}</span></td>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{inv.title}</td>
                  <td>
                    <span className={`threat-badge ${inv.priority.includes('P1') ? 'critical' : 'high'}`} style={{ fontSize: 9 }}>
                      {inv.priority.split('-')[0]}
                    </span>
                  </td>
                  <td style={{ color: 'var(--accent-cyan)', fontSize: 11 }}>{inv.investigatingAgency}</td>
                  <td style={{ color: 'var(--danger-red)', fontWeight: 600 }}>{inv.threatActorGroup}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--warning-amber)' }}>{inv.financialDamageEst?.split('(')[0] || 'Assessing'}</td>
                  <td><span className="code-tag">{inv.status.replace('_', ' ')}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{inv.leadAnalyst.split('(')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
