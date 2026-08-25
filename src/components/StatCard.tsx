import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import '../styles/dashboard.css';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'up-critical' | 'up-safe' | 'down-safe' | 'neutral';
  footerText?: string;
  variant?: 'default' | 'critical' | 'warning' | 'success';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  trendType = 'neutral',
  footerText,
  variant = 'default'
}) => {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <div className="stat-card-icon-wrap">
          <Icon size={16} />
        </div>
      </div>

      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        {trend && (
          <div className={`stat-card-trend ${trendType}`}>
            {trendType === 'up-critical' && <ArrowUpRight size={14} />}
            {trendType === 'up-safe' && <ArrowUpRight size={14} />}
            {trendType === 'down-safe' && <ArrowDownRight size={14} />}
            {trendType === 'neutral' && <Minus size={14} />}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {footerText && (
        <div className="stat-card-footer">
          {footerText}
        </div>
      )}
    </div>
  );
};
