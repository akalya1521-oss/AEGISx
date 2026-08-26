import React from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { X, ShieldAlert, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import '../styles/components.css';

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useIntelligence();

  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <ShieldAlert size={18} color="var(--danger-red)" style={{ flexShrink: 0 }} />;
      case 'warning':
        return <AlertTriangle size={18} color="var(--warning-amber)" style={{ flexShrink: 0 }} />;
      case 'success':
        return <CheckCircle2 size={18} color="var(--status-green)" style={{ flexShrink: 0 }} />;
      default:
        return <Info size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-item ${toast.type}`}>
          {getIcon(toast.type)}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="toast-title">{toast.title}</div>
            <div className="toast-desc">{toast.message}</div>
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 2 }}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};
