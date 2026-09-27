import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  startDate?: string;
  onFinish?: () => void;
  showProgress?: boolean;
  compact?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  startDate,
  onFinish,
  showProgress = true,
  compact = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    seconds: number;
    formatted: string;
    progress: number;
    isFinished: boolean;
  }>({
    seconds: 0,
    formatted: '00:00',
    progress: 100,
    isFinished: false,
  });

  useEffect(() => {
    const calculate = () => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({
          seconds: 0,
          formatted: 'Pronto',
          progress: 100,
          isFinished: true,
        });
        if (onFinish) onFinish();
        return;
      }

      const totalSecs = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSecs / 60);
      const seconds = totalSecs % 60;
      const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      let progress = 0;
      if (startDate) {
        const start = new Date(startDate).getTime();
        const totalDuration = target - start;
        const elapsed = now - start;
        progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      }

      setTimeLeft({
        seconds: totalSecs,
        formatted,
        progress,
        isFinished: false,
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate, startDate, onFinish]);

  if (compact) {
    return (
      <span className={`font-mono text-xs font-semibold ${timeLeft.isFinished ? 'text-emerald-400 font-bold' : 'text-gold-400'}`}>
        {timeLeft.formatted}
      </span>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-mono mb-1">
        <span className="text-noir-400 uppercase tracking-wider text-[10px]">Tempo Restante</span>
        <span className={`font-semibold ${timeLeft.isFinished ? 'text-emerald-400 animate-pulse' : 'text-gold-400'}`}>
          {timeLeft.formatted}
        </span>
      </div>
      {showProgress && (
        <div className="w-full h-1.5 bg-noir-800 rounded-full overflow-hidden border border-noir-700">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft.isFinished 
                ? 'bg-emerald-500' 
                : 'bg-gradient-to-r from-gold-600 to-gold-400'
            }`}
            style={{ width: `${timeLeft.progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
