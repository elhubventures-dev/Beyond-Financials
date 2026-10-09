import React from 'react';

/**
 * Public pre-launch notice. Does not expose system health, providers, or project scope.
 */
export const SystemStatusBanner: React.FC = () => {
  return (
    <div className="bg-[#001B40] text-slate-200 border-b border-[#06285A] text-xs py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <p>
          <strong className="text-[#FBBF24]">Pre-launch.</strong>{' '}
          Beyond Financials services are not yet available. Join the waitlist to stay informed.
        </p>
        <span className="text-slate-400">Nigeria</span>
      </div>
    </div>
  );
};
