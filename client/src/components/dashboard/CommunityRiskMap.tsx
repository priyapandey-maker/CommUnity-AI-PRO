
export function CommunityRiskMap() {
  return (
    <div className="civic-card h-80 flex flex-col items-center justify-center bg-surface-2 dark:bg-surface-2/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, var(--line-strong) 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }}></div>
      <div className="z-10 text-center">
        <svg className="w-12 h-12 mx-auto text-text-tertiary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <h3 className="text-sm font-semibold text-text-secondary">Community Risk Map</h3>
        <p className="text-xs text-text-tertiary mt-1">Geospatial visualization pending API integration</p>
      </div>
    </div>
  );
}
