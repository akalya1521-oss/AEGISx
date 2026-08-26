import React, { useState } from 'react';
import { 
  Network, 
  Filter, 
  Layers, 
  ShieldAlert, 
  Lock, 
  Activity, 
  Server, 
  Radio, 
  Maximize2,
  X,
  UserCheck,
  AlertTriangle,
  Zap,
  Building2
} from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import { NetworkGraph } from '../components/NetworkGraph';
import { networkClusters } from '../data/network';
import { playCyberSound } from '../utils/audio';
import '../styles/network-analysis.css';

export const NetworkAnalysis: React.FC = () => {
  const { 
    networkNodes, 
    networkLinks, 
    selectedNode, 
    setSelectedNode, 
    isolateNode, 
    addToast 
  } = useIntelligence();

  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [hopDepth, setHopDepth] = useState<number>(3);

  const handleClusterSelect = (clusterId: string) => {
    playCyberSound('click');
    setSelectedCluster(clusterId);
  };

  const handleIsolateSelected = () => {
    if (selectedNode) {
      isolateNode(selectedNode.id);
    }
  };

  const handleTraceRoute = () => {
    playCyberSound('scan');
    addToast({
      title: 'NATIONAL BGP ROUTE TRACED',
      message: `Identified 4 intermediate Autonomous Systems routing to ${selectedNode?.label}.`,
      type: 'info'
    });
  };

  return (
    <div className="network-page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-breadcrumb">
          NCIIPC • CERT-In / CNI NETWORK TOPOLOGY & UPI FRAUD MESH
        </div>
        <div className="page-title-row">
          <div>
            <h1 className="page-title">National Critical Infrastructure Mesh</h1>
            <p className="page-subtitle">
              Cross-cluster graph topology, SCADA Modbus beacon correlation, UPI mule account flows and automated edge node quarantine across the Indian grid.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              className="cyber-btn cyber-btn-danger" 
              onClick={() => {
                playCyberSound('alert');
                addToast({
                  title: 'GLOBAL SDN FLOW PURGED',
                  message: 'Flushed open socket connections on all flagged C2 endpoints.',
                  type: 'critical'
                });
              }}
            >
              <Zap size={14} />
              <span>Purge Active C2 Sockets</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cluster Filter Bar & Hop Depth Controls */}
      <div className="network-controls-bar">
        <div className="network-filter-group">
          <span className="inspector-data-label" style={{ marginRight: 6 }}>
            <Filter size={11} style={{ display: 'inline', marginRight: 4 }} />
            THREAT CLUSTER:
          </span>
          {networkClusters.map(cluster => (
            <button
              key={cluster.id}
              className={`network-filter-pill ${selectedCluster === cluster.id ? 'active' : ''}`}
              onClick={() => handleClusterSelect(cluster.id)}
            >
              <span className="network-filter-dot" style={{ background: cluster.color }} />
              <span>{cluster.name}</span>
            </button>
          ))}
        </div>

        {/* Hop Depth Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="inspector-data-label">HOP DEPTH:</span>
          {[1, 2, 3].map(depth => (
            <button
              key={depth}
              className={`cyber-btn cyber-btn-sm ${hopDepth === depth ? 'cyber-btn-primary' : ''}`}
              onClick={() => {
                playCyberSound('click');
                setHopDepth(depth);
              }}
            >
              {depth} {depth === 1 ? 'Hop' : 'Hops'}
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Telemetry Strip */}
      <div className="network-telemetry-banner">
        <div className="network-metric-chip">
          <span className="network-metric-chip-label">ACTIVE CNI NODES</span>
          <span className="network-metric-chip-val">{networkNodes.length} NODES</span>
        </div>

        <div className="network-metric-chip">
          <span className="network-metric-chip-label">AGGREGATE EXFILTRATION STREAM</span>
          <span className="network-metric-chip-val" style={{ color: 'var(--danger-red)' }}>42.8 MB/s</span>
        </div>

        <div className="network-metric-chip">
          <span className="network-metric-chip-label">UPI / C2 BEACONS MONITORED</span>
          <span className="network-metric-chip-val" style={{ color: 'var(--warning-amber)' }}>14 CHANNELS</span>
        </div>

        <div className="network-metric-chip">
          <span className="network-metric-chip-label">NATIONAL GRID DENSITY</span>
          <span className="network-metric-chip-val">0.74 (HIGH MESH)</span>
        </div>
      </div>

      {/* Main Workspace: Graph Canvas + Optional Node Inspector */}
      <div className="network-workspace">
        {/* Canvas Area */}
        <div className="network-canvas-container">
          <NetworkGraph
            nodes={networkNodes}
            links={networkLinks}
            selectedCluster={selectedCluster}
            onSelectNode={node => setSelectedNode(node)}
            height="100%"
          />
        </div>

        {/* Node Inspector Drawer if a node is selected */}
        {selectedNode && (
          <div className="node-inspector-drawer">
            <div className="inspector-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`threat-badge ${selectedNode.threatLevel.toLowerCase()}`}>
                  {selectedNode.type}
                </span>
                <span className="inspector-title">Node Inspector</span>
              </div>
              <button 
                className="nav-action-icon-btn" 
                onClick={() => setSelectedNode(null)}
                style={{ width: 26, height: 26 }}
              >
                <X size={14} />
              </button>
            </div>

            <div className="inspector-body">
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#fff', marginBottom: 4 }}>
                  {selectedNode.label}
                </h3>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-cyan)' }}>
                  ID: {selectedNode.id}
                </div>
              </div>

              {/* Threat Score Bar */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span className="inspector-data-label">THREAT SCORE</span>
                  <span style={{ fontFamily: 'var(--font-orbitron)', fontWeight: 800, color: selectedNode.threatLevel === 'CRITICAL' ? 'var(--danger-red)' : 'var(--accent-cyan)' }}>
                    {selectedNode.threatScore} / 100
                  </span>
                </div>
                <div className="risk-progress-bar-bg">
                  <div 
                    className={`risk-progress-bar-fill ${selectedNode.threatLevel === 'CRITICAL' ? 'red' : 'amber'}`}
                    style={{ width: `${selectedNode.threatScore}%` }}
                  />
                </div>
              </div>

              {/* Data Grid */}
              <div className="inspector-section">
                <span className="inspector-section-title">TOPOLOGY METADATA</span>
                <div className="inspector-data-grid">
                  <div className="inspector-data-item">
                    <span className="inspector-data-label">Cluster</span>
                    <span className="inspector-data-val" style={{ color: 'var(--danger-red)' }}>{selectedNode.cluster}</span>
                  </div>
                  <div className="inspector-data-item">
                    <span className="inspector-data-label">Status</span>
                    <span className="inspector-data-val" style={{ color: selectedNode.status === 'ISOLATED' ? 'var(--danger-red)' : 'var(--status-green)' }}>
                      {selectedNode.status}
                    </span>
                  </div>
                  {selectedNode.ip && (
                    <div className="inspector-data-item">
                      <span className="inspector-data-label">IP Address</span>
                      <span className="inspector-data-val">{selectedNode.ip}</span>
                    </div>
                  )}
                  {(selectedNode.state || selectedNode.country) && (
                    <div className="inspector-data-item">
                      <span className="inspector-data-label">Location / State</span>
                      <span className="inspector-data-val">{selectedNode.state ? `${selectedNode.state}, ` : ''}{selectedNode.country}</span>
                    </div>
                  )}
                  {selectedNode.trafficRate && (
                    <div className="inspector-data-item">
                      <span className="inspector-data-label">Throughput / Rate</span>
                      <span className="inspector-data-val" style={{ color: 'var(--accent-cyan)' }}>{selectedNode.trafficRate}</span>
                    </div>
                  )}
                  {selectedNode.beaconInterval && (
                    <div className="inspector-data-item">
                      <span className="inspector-data-label">Beacon Cycle</span>
                      <span className="inspector-data-val">{selectedNode.beaconInterval}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Narrative Details */}
              {selectedNode.details && (
                <div className="inspector-section">
                  <span className="inspector-section-title">CERT-In FORENSIC LOG</span>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: 10, borderRadius: 4, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {selectedNode.details}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="inspector-actions">
              <button className="cyber-btn" onClick={handleTraceRoute}>
                <Activity size={13} />
                <span>Trace Inbound BGP Hop Route</span>
              </button>

              {selectedNode.status !== 'ISOLATED' && (
                <button className="cyber-btn cyber-btn-danger" onClick={handleIsolateSelected}>
                  <Lock size={13} />
                  <span>Isolate & Quarantine Node</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
