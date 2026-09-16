import React from 'react';

export type SustainabilityStatus = 
  | 'Under evaluation'
  | 'Planned'
  | 'Selected'
  | 'In implementation'
  | 'Operational'
  | 'Measured'
  | 'Certified';

interface SustainabilityStatusBadgeProps {
  status: SustainabilityStatus | string;
  className?: string;
}

export const SustainabilityStatusBadge: React.FC<SustainabilityStatusBadgeProps> = ({ 
  status, 
  className = '' 
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Under evaluation':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-200/90';
      case 'Planned':
        return 'bg-sky-500/10 border-sky-500/30 text-sky-200/90';
      case 'Selected':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200/90';
      case 'In implementation':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-200/90';
      case 'Operational':
      case 'Measured':
      case 'Certified':
        return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300';
      default:
        return 'bg-white/5 border-white/10 text-[#A9AAA7]';
    }
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider border shadow-sm ${getBadgeStyle()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{status}</span>
    </span>
  );
};
