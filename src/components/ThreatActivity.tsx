import React, { useState, useEffect } from 'react';
import { Radio, ShieldAlert, Wifi, Pause, Play } from 'lucide-react';
import { liveFeedItems } from '../data/aiAnalysis';
import '../styles/components.css';

export const ThreatActivity: React.FC = () => {
  const [feed, setFeed] = useState(liveFeedItems);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const randomTargets = [
        '185.220.101.5 (Bucharest C2)',
        '213.152.161.42 (Stager Relay)',
        'shadow-vault-auth.cc (AiTM Proxy)',
        '10.240.88.19 (Healthcare DB)',
        '0x99a1b8c73d9e87f12a... (Mixer Hop)'
      ];
      const randomActions = [
        'Encrypted TLS session handshake established with',
        'Unauthorized kerberos ticket validation attempt from',
        'Permit2 offline authorization signature broadcast by',
        'High entropy DNS TXT query burst routed through',
        'Reflective DLL process memory injection blocked on'
      ];
      const randomLevels: ('CRITICAL' | 'HIGH' | 'MEDIUM')[] = ['CRITICAL', 'HIGH', 'MEDIUM'];

      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);

      const newItem = {
        id: `live-${Date.now()}`,
        time: timeStr,
        text: `${randomActions[Math.floor(Math.random() * randomActions.length)]} ${randomTargets[Math.floor(Math.random() * randomTargets.length)]}`,
        level: randomLevels[Math.floor(Math.random() * randomLevels.length)]
      };

      setFeed(prev => [newItem, ...prev.slice(0, 8)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="cyber-panel">
      <div className="cyber-panel-header">
        <div className="cyber-panel-title">
          <Radio size={16} className="cyber-panel-title-icon" color="var(--accent-cyan)" />
          <span>Live Packet Intercept & Telemetry Stream</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button 
            className="cyber-btn cyber-btn-sm"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume live feed' : 'Pause live feed'}
          >
            {isPaused ? <Play size={11} /> : <Pause size={11} />}
            <span>{isPaused ? 'RESUME' : 'LIVE'}</span>
          </button>
          <span className="pulse-dot"></span>
        </div>
      </div>

      <div className="cyber-panel-body" style={{ padding: '8px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {feed.map(item => (
            <div 
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                background: 'rgba(0, 0, 0, 0.25)',
                borderLeft: `2px solid ${item.level === 'CRITICAL' ? 'var(--danger-red)' : item.level === 'HIGH' ? 'var(--warning-amber)' : 'var(--accent-cyan)'}`,
                borderRadius: '0 4px 4px 0',
                fontSize: 12,
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', flexShrink: 0 }}>
                  [{item.time}]
                </span>
                <span style={{ color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.text}
                </span>
              </div>
              <span className={`threat-badge ${item.level.toLowerCase()}`} style={{ fontSize: 9, padding: '1px 5px' }}>
                {item.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
