import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Network, 
  Database, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  HardDrive,
  Cpu,
  Volume2,
  VolumeX,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import { playCyberSound } from '../utils/audio';
import '../styles/sidebar.css';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { alerts, investigations, soundActive, toggleSoundState } = useIntelligence();

  const newAlertsCount = alerts.filter(a => a.status === 'NEW').length;
  const activeCasesCount = investigations.filter(i => i.status === 'ACTIVE_INVESTIGATION').length;

  const handleNavClick = () => {
    playCyberSound('click');
    if (mobileOpen) {
      onCloseMobile();
    }
  };

  const navItems = [
    {
      path: '/dashboard',
      label: 'National Overview',
      icon: LayoutDashboard,
      badge: null,
      symbol: '◈'
    },
    {
      path: '/investigations',
      label: 'Investigations',
      icon: FolderGit2,
      badge: activeCasesCount,
      badgeType: 'default',
      symbol: '▣'
    },
    {
      path: '/network-analysis',
      label: 'CNI Network Mesh',
      icon: Network,
      badge: null,
      symbol: '◎'
    },
    {
      path: '/entities',
      label: 'Suspect Entities & VPAs',
      icon: Database,
      badge: null,
      symbol: '◇'
    },
    {
      path: '/alerts',
      label: 'SOC Alert Triage',
      icon: AlertTriangle,
      badge: newAlertsCount,
      badgeType: 'alert',
      symbol: '⚠'
    },
    {
      path: '/reports',
      label: 'CERT-In Dossiers',
      icon: FileText,
      badge: null,
      symbol: '▤'
    }
  ];

  return (
    <aside className={`cyber-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Sidebar Header */}
      <div>
        <div className="sidebar-header">
          <div className="sidebar-header-title">
            <span className="sidebar-header-pulse" style={{ background: '#ff9933', boxShadow: '0 0 8px #ff9933' }}></span>
            <span>NATIONAL COMMAND</span>
          </div>
          <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            I4C-NCTIG
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) => 
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <div className="sidebar-nav-item-content">
                  <span className="sidebar-nav-icon">
                    <Icon size={16} />
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge > 0 && (
                  <span className={`sidebar-badge ${item.badgeType === 'alert' ? 'alert' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {/* Security Active Badge */}
        <div className="sidebar-security-badge" style={{ borderColor: 'rgba(0, 255, 157, 0.3)', background: 'rgba(0, 255, 157, 0.06)' }}>
          <CheckCircle2 size={18} color="var(--status-green)" />
          <div className="sidebar-security-text">
            <span className="sidebar-security-title">28 STATE CYBER CELLS</span>
            <span className="sidebar-security-desc">CERT-In 6-Hr Rule Active</span>
          </div>
        </div>

        {/* System Telemetry */}
        <div className="sidebar-system-telemetry">
          <div className="sidebar-telemetry-item">
            <span><Building2 size={10} style={{ display: 'inline', marginRight: 4 }} />NCIIPC OT</span>
            <span className="sidebar-telemetry-val" style={{ color: 'var(--status-green)' }}>AIR-GAPPED</span>
          </div>
          <div className="sidebar-telemetry-item">
            <span><HardDrive size={10} style={{ display: 'inline', marginRight: 4 }} />180-DAY LOGS</span>
            <span className="sidebar-telemetry-val">MANDATED</span>
          </div>
        </div>

        {/* Audio Toggle */}
        <div 
          className="sidebar-audio-toggle" 
          onClick={toggleSoundState}
          role="button"
          tabIndex={0}
        >
          <span>CYBERNETIC AUDIO FX</span>
          {soundActive ? <Volume2 size={13} color="var(--accent-cyan)" /> : <VolumeX size={13} />}
        </div>
      </div>
    </aside>
  );
};
