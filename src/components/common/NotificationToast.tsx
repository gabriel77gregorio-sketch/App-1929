import React from 'react';
import { useGame } from '../../context/GameContext';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications } = useGame();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-3 pointer-events-none">
      {notifications.map((n) => {
        let Icon = Info;
        let borderColor = 'border-gold-500/40';
        let bgColor = 'bg-noir-900/95';
        let textColor = 'text-paper-100';

        if (n.type === 'success') {
          Icon = CheckCircle2;
          borderColor = 'border-emerald-600/50';
          textColor = 'text-emerald-300';
        } else if (n.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = 'border-amber-600/50';
          textColor = 'text-amber-300';
        } else if (n.type === 'error') {
          Icon = XCircle;
          borderColor = 'border-blood-800/60';
          textColor = 'text-red-300';
        }

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-lg shadow-xl backdrop-blur-md border ${borderColor} ${bgColor} animate-slideDown`}
          >
            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${textColor}`} />
            <p className="text-xs font-medium text-paper-200 leading-snug">
              {n.message}
            </p>
          </div>
        );
      })}
    </div>
  );
};
