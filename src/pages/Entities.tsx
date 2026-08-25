import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Server, 
  Globe, 
  Key, 
  Terminal, 
  AlertOctagon, 
  Download, 
  Plus, 
  Lock,
  ArrowUpDown,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import { Entity, EntityType } from '../types';
import { playCyberSound } from '../utils/audio';
import '../styles/entities.css';

export const Entities: React.FC = () => {
  const { entities, setSelectedEntity, addToast } = useIntelligence();

  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'SCORE_DESC' | 'SCORE_ASC'>('SCORE_DESC');

  const filteredEntities = entities
    .filter(e => {
      if (selectedType !== 'ALL' && e.type !== selectedType) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.value.toLowerCase().includes(q) ||
        e.reputation.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q)) ||
        (e.jurisdictionState && e.jurisdictionState.toLowerCase().includes(q)) ||
        (e.geo && e.geo.country.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'SCORE_DESC') return b.threatScore - a.threatScore;
      return a.threatScore - b.threatScore;
    });

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'UPI_VPA': return CreditCard;
      case 'SIM_BOX_IMEI': return Smartphone;
      case 'BOTNET_C2': return Server;
      case 'DOMAIN': return Globe;
      case 'CRYPTO_WALLET': return Key;
      case 'THREAT_ACTOR': return AlertOctagon;
      case 'IP': return Terminal;
      default: return Database;
    }
  };

  const handleExportCSV = () => {
    playCyberSound('success');
    const headers = 'ID,Name,Type,Value,ThreatScore,ThreatLevel,Status,Jurisdiction,CERT_In_Ref\n';
    const rows = filteredEntities
      .map(e => `${e.id},"${e.name}",${e.type},${e.value},${e.threatScore},${e.threatLevel},${e.status},"${e.jurisdictionState || (e.geo ? e.geo.country : 'Unknown')}","${e.certInRefCode || 'N/A'}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CERT_IN_I4C_ENTITIES_IOC_${Date.now()}.csv`;
    a.click();
    addToast({
      title: 'NATIONAL IOC REPOSITORY EXPORTED',
      message: `Exported ${filteredEntities.length} entities to CSV (CERT-In / I4C format).`,
      type: 'success'
    });
  };

  return (
    <div className="entities-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-breadcrumb">
          I4C • CERT-In • NCIIPC / SUSPECT ENTITIES & IOCs
        </div>
        <div className="page-title-row">
          <div>
            <h1 className="page-title">Suspect Entities, VPAs & IOC Repository</h1>
            <p className="page-subtitle">
              Centralized repository of identified Command & Control nodes, fake Gov/Bank phishing domains, mule UPI VPAs, SIM box IMEI farms and APT fingerprints.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="cyber-btn cyber-btn-primary" onClick={handleExportCSV}>
              <Download size={14} />
              <span>Export CERT-In / STIX</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="entities-toolbar">
        {/* Type Filter Buttons */}
        <div className="entities-filter-types">
          {[
            { id: 'ALL', label: 'All Entities' },
            { id: 'UPI_VPA', label: 'Mule UPI VPAs' },
            { id: 'SIM_BOX_IMEI', label: 'SIM Boxes / IMEIs' },
            { id: 'DOMAIN', label: 'Phishing Domains' },
            { id: 'BOTNET_C2', label: 'C2 Nodes' },
            { id: 'CRYPTO_WALLET', label: 'Crypto Wallets' },
            { id: 'THREAT_ACTOR', label: 'Threat Actors' },
            { id: 'IP', label: 'Suspicious IPs' },
            { id: 'FILE_HASH', label: 'Malware Hashes' }
          ].map(type => (
            <button
              key={type.id}
              className={`entity-type-btn ${selectedType === type.id ? 'active' : ''}`}
              onClick={() => {
                playCyberSound('click');
                setSelectedType(type.id);
              }}
            >
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 260 }}>
            <input
              type="text"
              placeholder="Search VPA, IMEI, state, IP..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="cyber-input"
              style={{ paddingLeft: 30 }}
            />
            <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-dim)' }} />
          </div>

          <button
            className="cyber-btn cyber-btn-sm"
            onClick={() => setSortOrder(prev => prev === 'SCORE_DESC' ? 'SCORE_ASC' : 'SCORE_DESC')}
            title="Sort by Threat Score"
          >
            <ArrowUpDown size={12} />
            <span>{sortOrder === 'SCORE_DESC' ? 'Score High ➔ Low' : 'Score Low ➔ High'}</span>
          </button>
        </div>
      </div>

      {/* Entities Table */}
      <div className="entities-table-container">
        <table className="cyber-table">
          <thead>
            <tr>
              <th>ENTITY & VALUE</th>
              <th>TYPE</th>
              <th>THREAT SCORE</th>
              <th>JURISDICTION / ORIGIN</th>
              <th>ATTRIBUTED THREAT ACTOR</th>
              <th>CERT-In NOTICE</th>
              <th>OBSERVED STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntities.map(entity => {
              const Icon = getEntityIcon(entity.type);
              const isCrit = entity.threatLevel === 'CRITICAL';

              return (
                <tr 
                  key={entity.id}
                  onClick={() => {
                    playCyberSound('blip');
                    setSelectedEntity(entity);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Entity Name & Value */}
                  <td>
                    <div className="entity-name-cell">
                      <div className="entity-val-primary">
                        <Icon size={14} color={isCrit ? 'var(--danger-red)' : 'var(--accent-cyan)'} />
                        <span>{entity.name}</span>
                      </div>
                      <span className="entity-val-sec">{entity.value}</span>
                    </div>
                  </td>

                  {/* Type */}
                  <td>
                    <span className="code-tag" style={{ fontSize: 10 }}>{entity.type.replace('_', ' ')}</span>
                  </td>

                  {/* Threat Score */}
                  <td>
                    <div className="entity-score-bar-wrap">
                      <span style={{ color: isCrit ? 'var(--danger-red)' : 'var(--accent-cyan)' }}>
                        {entity.threatScore}
                      </span>
                      <div className="entity-score-bar">
                        <div 
                          className={`entity-score-bar-fill ${isCrit ? 'red' : 'amber'}`}
                          style={{
                            width: `${entity.threatScore}%`,
                            background: isCrit ? 'var(--danger-red)' : 'var(--warning-amber)'
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Jurisdiction / Geolocation */}
                  <td>
                    <div className="geo-badge">
                      <span>{entity.geo ? entity.geo.flagEmoji : '🇮🇳'}</span>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600 }}>{entity.jurisdictionState || (entity.geo ? entity.geo.country : 'National')}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>{entity.geo ? entity.geo.asn.split(' ')[0] : 'Gov of India'}</div>
                      </div>
                    </div>
                  </td>

                  {/* Attribution */}
                  <td>
                    <span style={{ color: entity.associatedGroup ? 'var(--danger-red)' : 'var(--text-dim)', fontWeight: entity.associatedGroup ? 600 : 400, fontSize: 12 }}>
                      {entity.associatedGroup || 'Unattributed'}
                    </span>
                  </td>

                  {/* CERT-In Reference */}
                  <td>
                    {entity.certInRefCode ? (
                      <span className="code-tag" style={{ fontSize: 9, color: 'var(--status-green)', borderColor: 'rgba(0,255,157,0.3)' }}>
                        {entity.certInRefCode}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>Under Review</span>
                    )}
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`threat-badge ${entity.status === 'ISOLATED' ? 'critical' : 'low'}`} style={{ fontSize: 9 }}>
                      {entity.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <button 
                      className="cyber-btn cyber-btn-sm"
                      onClick={e => {
                        e.stopPropagation();
                        playCyberSound('blip');
                        setSelectedEntity(entity);
                      }}
                    >
                      Examine
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
