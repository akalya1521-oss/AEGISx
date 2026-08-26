import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, Bell, Volume2, VolumeX, Menu, Activity, ShieldAlert, User, Radio } from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import '../styles/navbar.css';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const { alerts, setIsSearchOpen, soundActive, toggleSoundState, defconLevel } = useIntelligence();
  const [timeIst, setTimeIst] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Format Indian Standard Time (IST)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const formatter = new Intl.DateTimeFormat('en-IN', options);
      setTimeIst(formatter.format(now) + ' IST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadAlertsCount = alerts.filter(a => a.status === 'NEW').length;

  return (
    <header className="cyber-navbar">
      {/* Left Brand */}
      <div className="nav-brand-group">
        <button 
          className="nav-mobile-toggle" 
          onClick={onToggleMobileSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="nav-logo-box">
          <div className="nav-logo-icon-wrap" style={{ borderColor: 'rgba(255, 153, 51, 0.4)', background: 'rgba(255, 153, 51, 0.08)' }}>
            <Shield size={20} color="#ff9933" />
          </div>
          <div className="nav-brand-text">
            <div className="nav-brand-title">
              CIPHER<span>//</span>WATCH
            </div>
            <div className="nav-brand-sub" style={{ color: '#00f0ff' }}>
              I4C • CERT-In • NATIONAL CYBER COMMAND (GOI)
            </div>
          </div>
        </Link>
      </div>

      {/* Center Live Radar Status */}
      <div className="nav-center-status">
        <div className="nav-status-item">
          <span className="pulse-dot"></span>
          <span className="nav-status-label">GRID:</span>
          <span className="nav-status-val" style={{ color: 'var(--status-green)' }}>SYNCED</span>
        </div>

        <div className="nav-status-item">
          <Activity size={13} color="var(--accent-cyan)" />
          <span className="nav-status-label">I4C 1930 LINK:</span>
          <span className="nav-status-val" style={{ color: 'var(--status-green)' }}>ONLINE</span>
        </div>

        <div className="nav-status-item">
          <span className="nav-status-label">CERT-In DEFCON:</span>
          <div className="nav-defcon-badge">
            <ShieldAlert size={12} style={{ display: 'inline', marginRight: 4 }} />
            LEVEL {defconLevel} (ELEVATED)
          </div>
        </div>

        <div className="nav-status-item" style={{ minWidth: 150 }}>
          <span className="nav-status-label">TIME:</span>
          <span className="nav-status-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ffb800' }}>
            {timeIst || '--:--:-- IST'}
          </span>
        </div>
      </div>

      {/* Right Nav Actions */}
      <div className="nav-right-actions">
        {/* Global Search Button */}
        <button 
          className="nav-search-btn" 
          onClick={() => setIsSearchOpen(true)}
          title="Search National Intelligence Database (Hotkey: /)"
        >
          <Search size={14} />
          <span>Search IOCs, VPAs, IPs...</span>
          <kbd className="nav-search-kbd">/</kbd>
        </button>

        {/* Audio Toggle */}
        <button 
          className="nav-action-icon-btn" 
          onClick={toggleSoundState}
          title={soundActive ? 'Mute Cyber Audio FX' : 'Enable Cyber Audio FX'}
        >
          {soundActive ? <Volume2 size={16} color="var(--accent-cyan)" /> : <VolumeX size={16} color="var(--text-dim)" />}
        </button>

        {/* Alert Notifications */}
        <Link to="/alerts" className="nav-action-icon-btn" title="View Active Incident Alerts">
          <Bell size={16} />
          {unreadAlertsCount > 0 && (
            <span className="nav-badge-count">{unreadAlertsCount}</span>
          )}
        </Link>

        {/* Analyst Profile */}
        <div className="nav-analyst-profile">
          <div className="nav-avatar-wrap" style={{ borderColor: '#ff9933' }}>
            <User size={16} color="#ff9933" />
            <span className="nav-avatar-online"></span>
          </div>
          <div className="nav-analyst-info">
            <span className="nav-analyst-name">SP Rajeshwar Sharma, IPS</span>
            <span className="nav-analyst-clearance" style={{ color: '#ff9933' }}>SECRET // GOVT OF INDIA</span>
          </div>
        </div>
      </div>
    </header>
  );
};
