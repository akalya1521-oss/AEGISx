import React from 'react';
import { 
  Server, 
  Network, 
  ShieldAlert, 
  FolderGit2, 
  Plus, 
  Download, 
  Search, 
  Lock, 
  ArrowRight,
  Activity,
  Zap,
  Globe,
  Building2
} from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import { StatCard } from '../components/StatCard';
import { RiskPanel } from '../components/RiskPanel';
import { NetworkGraph } from '../components/NetworkGraph';
import { ThreatActivity } from '../components/ThreatActivity';
import { AIAnalysis } from '../components/AIAnalysis';
import { EntityPanel } from '../components/EntityPanel';
import { InvestigationCard } from '../components/InvestigationCard';
import { AlertCard } from '../components/AlertCard';
import { Link, useNavigate } from 'react-router-dom';
import { playCyberSound } from '../utils/audio';
import '../styles/dashboard.css';

export const Dashboard: React.FC = () => {
  const { 
    networkNodes, 
    networkLinks, 
    investigations, 
    alerts, 
    setIsNewCaseOpen, 
    setIsSearchOpen,
    addToast
  } = useIntelligence();

  const navigate = useNavigate();

  const activeCases = investigations.filter(i => i.status === 'ACTIVE_INVESTIGATION').slice(0, 2);
  const recentAlerts = alerts.slice(0, 3);

  const handleExportIOCs = () => {
    playCyberSound('success');
    addToast({
      title: 'CERT-In / I4C IOC BUNDLE EXPORTED',
      message: 'Compiled 124 indicators into STIX 2.1 JSON and CSV format for 28 State Cyber Cells.',
      type: 'success'
    });
  };

  const handleEmergencyFreeze = () => {
    playCyberSound('alert');
    addToast({
      title: 'I4C 1930 EMERGENCY FREEZE DIRECTIVE ISSUED',
      message: 'Automated freeze request broadcast to NPCI switch and 14 commercial partner banks.',
      type: 'critical'
    });
  };

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-breadcrumb">
          NATIONAL CYBER THREAT INTELLIGENCE / OVERVIEW
        </div>
        <div className="page-title-row">
          <div>
            <h1 className="page-title">National Command Center</h1>
            <p className="page-subtitle">
              Real-time visibility across active I4C investigations, suspect Indian VPAs, state-sponsored APTs, and critical national infrastructure (CNI) threats.
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

      {/* Top Stat Cards */}
      <div className="stats-grid">
        <StatCard
          label="ACTIVE CNI NODES"
          value="124"
          icon={Server}
          trend="+12%"
          trendType="up-safe"
          footerText="18 C2 Nexus • 106 Regional Relays"
          variant="default"
        />

        <StatCard
          label="MESH CONNECTIONS"
          value="342"
          icon={Network}
          trend="+8%"
          trendType="neutral"
          footerText="42.8 MB/s Live Telemetry Mesh"
          variant="default"
        />

        <StatCard
          label="HIGH RISK TARGETS"
          value="18"
          icon={ShieldAlert}
          trend="+3 NEW"
          trendType="up-critical"
          footerText="4 CNI Power • 6 NetBanking AiTM"
          variant="critical"
        />

        <StatCard
          label="ACTIVE INVESTIGATIONS"
          value="27"
          icon={FolderGit2}
          trend="₹142.5 CR"
          trendType="up-critical"
          footerText="5 Priority-1 • 14 State Cases"
          variant="warning"
        />
      </div>

      {/* Quick Actions Strip */}
      <div className="quick-action-strip">
        <div className="quick-action-title">
          <Zap size={15} color="var(--accent-cyan)" />
          <span>I4C & CERT-In RAPID RESPONSE SUITE</span>
        </div>

        <div className="quick-action-buttons">
          <button 
            className="cyber-btn cyber-btn-sm" 
            onClick={() => {
              playCyberSound('blip');
              setIsSearchOpen(true);
            }}
          >
            <Search size={13} />
            <span>Scan IP / Domain / UPI VPA</span>
          </button>

          <button 
            className="cyber-btn cyber-btn-sm" 
            onClick={handleExportIOCs}
          >
            <Download size={13} />
            <span>Export CERT-In IOC Bundle</span>
          </button>

          <button 
            className="cyber-btn cyber-btn-sm cyber-btn-danger" 
            onClick={handleEmergencyFreeze}
          >
            <Lock size={13} />
            <span>I4C 1930 Bank Account Freeze</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid: Network Graph & Risk Panel */}
      <div className="dashboard-grid-main">
        {/* Interactive Network Visualizer Panel */}
        <div className="cyber-panel" style={{ display: 'flex', flexDirection: 'column', minHeight: 480 }}>
          <div className="cyber-panel-header">
            <div className="cyber-panel-title">
              <Network size={16} className="cyber-panel-title-icon" />
              <span>National CNI Mesh & UPI Fraud Topology</span>
            </div>
            <Link 
              to="/network-analysis" 
              style={{ color: 'var(--accent-cyan)', fontSize: 11, fontFamily: 'var(--font-mono)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <span>FULL TOPOLOGY EXPLORER</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div style={{ flex: 1, minHeight: 380, position: 'relative' }}>
            <NetworkGraph
              nodes={networkNodes}
              links={networkLinks}
              isCompact={true}
              height="100%"
            />
          </div>
        </div>

        {/* Risk Analysis Panel */}
        <div>
          <RiskPanel />
        </div>
      </div>

      {/* AI Intelligence Analyst Panel */}
      <AIAnalysis />

      {/* Secondary 3-Column Grid: Live Threat Feed, High-Risk Entities & Priority Cases */}
      <div className="dashboard-grid-secondary">
        {/* Live Packet Intercept Feed */}
        <ThreatActivity />

        {/* High Risk Entities */}
        <EntityPanel />

        {/* Priority Investigations */}
        <div className="cyber-panel">
          <div className="cyber-panel-header">
            <div className="cyber-panel-title">
              <FolderGit2 size={16} className="cyber-panel-title-icon" color="var(--warning-amber)" />
              <span>Priority National Cases</span>
            </div>
            <Link 
              to="/investigations" 
              style={{ color: 'var(--accent-cyan)', fontSize: 11, fontFamily: 'var(--font-mono)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <span>ALL CASES</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="cyber-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeCases.map(inv => (
              <InvestigationCard key={inv.id} investigation={inv} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts Quick Triage */}
      <div className="cyber-panel">
        <div className="cyber-panel-header">
          <div className="cyber-panel-title">
            <ShieldAlert size={16} className="cyber-panel-title-icon" color="var(--danger-red)" />
            <span>High-Severity Real-Time Incident Triage</span>
          </div>
          <Link 
            to="/alerts" 
            style={{ color: 'var(--accent-cyan)', fontSize: 11, fontFamily: 'var(--font-mono)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <span>INCIDENT QUEUE ({alerts.length})</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="cyber-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recentAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
};
