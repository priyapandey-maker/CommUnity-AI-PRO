import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageContainer,
  Card,
  SectionTitle,
  Badge,
  Spinner,
  PrimaryButton,
} from '@/components';
import { getDecision, DecisionResponse, parseApiError } from '@/services';
import type { EvidenceFactor } from '@community-ai/shared';

// ── Icons ──────────────────────────────────────────────────

function AlertCircleIcon() {
  return (
    <svg className="w-6 h-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.213 15M21 21v-5h-.581m0 0a8.003 8.003 0 01-15.357-2" />
    </svg>
  );
}

function CheckShieldIcon() {
  return (
    <svg className="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
}

function WeatherIcon() {
  return (
    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function HazardIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ── Helpers for coloring ──────────────────────────────────

function getPriorityBadgeVariant(priority: string) {
  const p = priority.toLowerCase();
  if (p === 'critical' || p === 'high') return 'error';
  if (p === 'medium') return 'warning';
  return 'default';
}

function getReadinessBadgeVariant(readiness: string) {
  const r = readiness.toLowerCase();
  if (r === 'high') return 'success';
  if (r === 'medium') return 'warning';
  return 'default';
}

function getReadinessPercentage(readiness: string): number {
  const r = readiness.toLowerCase();
  if (r === 'high') return 95;
  if (r === 'medium') return 65;
  return 35;
}

export default function DecisionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [decisionRecord, setDecisionRecord] = useState<DecisionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDecision = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getDecision(id);
      setDecisionRecord(data);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecision();
  }, [id]);

  // Map factor names to nice readable titles and icons
  const getFactorMeta = (factor: string): { title: string; icon: JSX.Element } => {
    switch (factor) {
      case 'schoolZone':
        return { title: 'School Zone Check', icon: <SchoolIcon /> };
      case 'recentRain':
        return { title: 'Precipitation/Rain Event', icon: <WeatherIcon /> };
      case 'maintenanceHistory':
        return { title: 'Maintenance Failure History', icon: <HistoryIcon /> };
      case 'criticalInfrastructure':
        return { title: 'Critical Infrastructure Status', icon: <ShieldIcon /> };
      case 'severity':
        return { title: 'AI Severity Assessment', icon: <AlertCircleIcon /> };
      case 'urgency':
        return { title: 'AI Urgency Assessment', icon: <AlertCircleIcon /> };
      case 'hazardCount':
        return { title: 'Safety Hazard Checklist', icon: <HazardIcon /> };
      case 'crewAvailable':
        return { title: 'Maintenance Crew Availability', icon: <ClockIcon /> };
      default:
        return { title: `Telemetry: ${factor}`, icon: <ClockIcon /> };
    }
  };

  return (
    <PageContainer as="div" maxWidth="xl" className="py-8 min-h-screen flex flex-col justify-between">
      <div>
        {/* Navigation Breadcrumb */}
        <header className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200 focus-ring rounded-lg p-1.5"
          >
            <ArrowLeftIcon />
            Back to Dashboard
          </button>
          {decisionRecord && (
            <Badge variant="primary" size="md">
              Chronological Record
            </Badge>
          )}
        </header>

        {/* Section Heading */}
        <SectionTitle
          badge="Transparency Audit Trail"
          title={`Decision Trail #${id ? id.substring(0, 8) : '—'}`}
          subtitle="Chronological audit records compiled via Gemini incident understanding models and local operational knowledge base parameters."
          gradient
          align="left"
          className="mb-8"
        />

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
            <Spinner size="xl" color="primary" label="Loading decision audit trail..." />
            <p className="text-slate-400 text-sm font-medium">Reading ledger database logs...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <Card variant="glass" padding="lg" className="border-red-900/50 bg-red-950/10 max-w-2xl mx-auto text-center py-12 animate-scale-in">
            <div className="flex justify-center mb-4">
              <AlertCircleIcon />
            </div>
            <h3 className="text-xl font-bold text-red-200 font-display mb-2">
              Decision Record Not Found
            </h3>
            <p className="text-sm text-red-400 mb-6 max-w-md mx-auto leading-relaxed">
              {error === 'Decision not found' 
                ? 'The requested decision ID could not be located in the ledger store (returned 404).'
                : error}
            </p>
            <div className="flex justify-center gap-3">
              <PrimaryButton size="md" onClick={fetchDecision} className="bg-red-600 hover:bg-red-500">
                <RefreshIcon />
                Retry Lookup
              </PrimaryButton>
            </div>
          </Card>
        )}

        {/* SUCCESS STATE */}
        {!loading && !error && decisionRecord && (
          <div className="flex flex-col gap-6 animate-scale-in">
            {decisionRecord.analysis.source === 'fallback' && (
              <div className="flex items-center gap-3 p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl text-amber-300 text-sm leading-relaxed">
                <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>
                  AI-assisted analysis was temporarily unavailable. Your report was processed using our rule-based incident understanding to ensure uninterrupted service.
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Primary Recommendation & Evidence Timeline */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Primary Recommendation Card */}
              <Card variant="glass" padding="lg" className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      Recommended Operation
                    </span>
                    <h3 className="text-2xl font-bold text-slate-100 font-display mt-0.5">
                      {decisionRecord.decision.recommendation}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityBadgeVariant(decisionRecord.decision.priority)} dot>
                      {decisionRecord.decision.priority} Priority
                    </Badge>
                    <Badge variant={getReadinessBadgeVariant(decisionRecord.decision.decisionReadiness)}>
                      Readiness: {decisionRecord.decision.decisionReadiness}
                    </Badge>
                  </div>
                </div>

                {/* Readiness Progress quotient */}
                <div className="mb-6 bg-surface-1 p-4 rounded-xl border border-line">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400 font-medium">Confidence & Readiness Quotient</span>
                    <span className="text-xs text-brand-400 font-bold">
                      {getReadinessPercentage(decisionRecord.decision.decisionReadiness)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-4 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-500 to-accent-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${getReadinessPercentage(decisionRecord.decision.decisionReadiness)}%` }}
                    />
                  </div>
                </div>

                {/* Executive Summary & Explanation block */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Citizen Incident Summary
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed bg-surface-1 p-4 rounded-xl border border-line">
                      {decisionRecord.analysis.summary || 'No summary text available.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Decision Pipeline Explanation
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed bg-surface-3 p-4 rounded-xl border border-line-strong">
                      {decisionRecord.decision.explanation}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Timeline Card */}
              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-slate-200 font-display mb-6 flex items-center gap-2">
                  <CheckShieldIcon />
                  Evidence Pipeline Execution Signals
                </h3>

                <div className="relative border-l border-line pl-6 ml-3 flex flex-col gap-8">
                  {decisionRecord.decision.evidence.map((item: EvidenceFactor, index: number) => {
                    const factorMeta = getFactorMeta(item.factor);

                    return (
                      <div key={index} className="relative group">
                        {/* Timeline Node Point */}
                        <span className="absolute -left-[38px] top-0.5 bg-surface-2 border border-line-strong w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300 group-hover:border-brand-500 group-hover:shadow-glow-xs">
                          {factorMeta.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-slate-200 group-hover:text-brand-300 transition-colors duration-200">
                              {factorMeta.title}
                            </h4>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-3 border border-line text-slate-400">
                              Weight: {item.weight}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Resolved value: <span className="text-slate-300 font-medium font-mono">{item.value}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Right Column: Telemetry & Hazards & Alternatives */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Telemetry Metrics Panel */}
              <Card variant="default" padding="lg" className="flex flex-col gap-5">
                <h3 className="text-md font-bold text-slate-300 font-display border-b border-line pb-2 mb-1">
                  Telemetry Metrics
                </h3>

                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                    Issue Type
                  </span>
                  <p className="text-sm font-semibold text-slate-100 bg-surface-3 px-3 py-2.5 rounded-xl border border-line">
                    {decisionRecord.analysis.issueType || 'Unknown'}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                    Affected Asset
                  </span>
                  <p className="text-sm font-semibold text-slate-100 bg-surface-3 px-3 py-2.5 rounded-xl border border-line">
                    {decisionRecord.analysis.affectedAsset || 'None Identified'}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                    Severity Level
                  </span>
                  <div className="bg-surface-3 px-3 py-2.5 rounded-xl border border-line flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">
                      {decisionRecord.analysis.severity || 'Unknown'}
                    </span>
                    <Badge variant={getPriorityBadgeVariant(decisionRecord.analysis.severity)} dot>
                      Status
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                    Urgency Threshold
                  </span>
                  <div className="bg-surface-3 px-3 py-2.5 rounded-xl border border-line flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">
                      {decisionRecord.analysis.urgency || 'Unknown'}
                    </span>
                    <Badge variant={getPriorityBadgeVariant(decisionRecord.analysis.urgency)} dot>
                      Priority
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Possible Hazards */}
              <Card variant="default" padding="lg">
                <h3 className="text-sm font-bold text-slate-300 font-display mb-3">
                  Identified Safety Hazards
                </h3>
                {decisionRecord.analysis.possibleHazards && decisionRecord.analysis.possibleHazards.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {decisionRecord.analysis.possibleHazards.map((hazard, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-950/40 text-amber-400 border border-amber-900/50"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        {hazard}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No immediate hazards identified by the engine.</p>
                )}
              </Card>

              {/* Alternatives Considered */}
              <Card variant="default" padding="lg">
                <h3 className="text-sm font-bold text-slate-300 font-display mb-3">
                  Alternatives Considered
                </h3>
                <div className="flex flex-col gap-2">
                  {decisionRecord.decision.alternatives.map((alt, index) => (
                    <div
                      key={index}
                      className="p-3 bg-surface-3 rounded-xl border border-line text-xs text-slate-300 leading-relaxed"
                    >
                      {alt}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
        )}
      </div>

      <footer className="mt-12 pt-6 border-t border-line text-center text-xs text-slate-600">
        CommUnity AI — Decision transparency and immutability powered by Google Cloud.
      </footer>
    </PageContainer>
  );
}
