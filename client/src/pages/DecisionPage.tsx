import { useState, useEffect, useCallback } from 'react';
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

const getEvidenceInfluence = (factor: string, value: string): { text: string; trend: 'up' | 'down' | 'neutral' } => {
  const v = value.toLowerCase();
  switch (factor) {
    case 'schoolZone':
      return v === 'true' 
        ? { text: '↑ Increased Priority (School Zone active)', trend: 'up' }
        : { text: '→ Standard Priority (Non-School Zone)', trend: 'neutral' };
    case 'recentRain':
      return v === 'true'
        ? { text: '↑ Priority Escalated (Active rain/precipitation hazard)', trend: 'up' }
        : { text: '→ Standard Priority (Dry weather conditions)', trend: 'neutral' };
    case 'maintenanceHistory': {
      const count = parseInt(v) || 0;
      return count > 0
        ? { text: `↑ Increased Risk (+${count} recent maintenance failures)`, trend: 'up' }
        : { text: '→ Normal Risk Profile (Clean maintenance history)', trend: 'neutral' };
    }
    case 'criticalInfrastructure':
      return v === 'true'
        ? { text: '↑ Critical Path Escalation (Key assets affected)', trend: 'up' }
        : { text: '→ Standard Routing (General asset classification)', trend: 'neutral' };
    case 'severity':
      if (v === 'high' || v === 'critical') {
        return { text: `↑ High Priority Driver (Severity rated ${value})`, trend: 'up' };
      }
      return { text: `→ Base Driver (Severity rated ${value})`, trend: 'neutral' };
    case 'urgency':
      if (v === 'high' || v === 'immediate' || v === 'critical') {
        return { text: `↑ Urgency Triage Trigger (${value} attention required)`, trend: 'up' };
      }
      return { text: `→ Base Driver (Urgency rated ${value})`, trend: 'neutral' };
    case 'hazardCount': {
      const hCount = parseInt(v) || 0;
      return hCount > 0
        ? { text: `↑ Priority Safety Impact (${hCount} hazard(s) flagged)`, trend: 'up' }
        : { text: '→ Base Priority (No critical safety hazards flagged)', trend: 'neutral' };
    }
    case 'crewAvailable':
      return v === 'true'
        ? { text: '↑ Immediate Response Viable (Crew dispatch ready)', trend: 'up' }
        : { text: '↓ Dispatch Latency Risk (No crew currently available)', trend: 'down' };
    default:
      return { text: '→ Telemetry Factor Ingested', trend: 'neutral' };
  }
};

export default function DecisionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [decisionRecord, setDecisionRecord] = useState<DecisionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isFallback = decisionRecord?.analysis?.source === 'fallback';

  const steps = [
    {
      id: 'report',
      label: 'Citizen Report',
      description: 'Signals ingested',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'understanding',
      label: isFallback ? 'Rule-Based Understanding' : 'AI Incident Understanding',
      description: isFallback ? 'Deterministic fallback classification' : 'Semantic classification via Gemini',
      icon: isFallback ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'knowledge',
      label: 'Knowledge Context',
      description: 'Enriched operational context',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
    },
    {
      id: 'evaluation',
      label: 'Evidence Evaluation',
      description: 'Weighted telemetry evaluated',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'decision',
      label: 'Decision Generated',
      description: 'Recommendation & priority generated',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'ledger',
      label: 'Published to Ledger',
      description: 'Immutably logged to public record',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  const fetchDecision = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchDecision();
  }, [fetchDecision]);

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
            className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary transition-colors duration-150 focus-ring rounded-lg p-1.5"
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
          badge="Decision Record"
          title={`Decision #${id ? id.substring(0, 8) : '—'}`}
          subtitle="Evidence-based evaluation compiled from citizen report, AI incident understanding, and operational knowledge context."
          gradient
          align="left"
          className="mb-8"
        />

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
            <Spinner size="xl" color="primary" label="Loading decision audit trail..." />
            <p className="text-muted text-sm font-medium">Reading ledger database logs...</p>
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

        {!loading && !error && decisionRecord && (
          <div className="flex flex-col gap-6 animate-scale-in">
            {decisionRecord.analysis.source === 'fallback' && (
              <div className="flex items-center gap-3 p-4 bg-amber-950/20 border border-amber-500/30 rounded-lg text-amber-300 text-sm leading-relaxed">
                <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>
                  AI-assisted analysis was temporarily unavailable. Your report was processed using our rule-based incident understanding to ensure uninterrupted service.
                </span>
              </div>
            )}

            <Card variant="default" padding="lg" className="border-line bg-surface-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Recommended Action
                  </span>
                  <h3 className="text-2xl font-bold mt-1 font-display text-primary">
                    {decisionRecord.decision.recommendation}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={getPriorityBadgeVariant(decisionRecord.decision.priority)} dot>
                    {decisionRecord.decision.priority} Priority
                  </Badge>
                  <Badge variant={getReadinessBadgeVariant(decisionRecord.decision.decisionReadiness)}>
                    Readiness: {decisionRecord.decision.decisionReadiness}
                  </Badge>
                </div>
              </div>

              <div className="bg-surface-2 p-5 rounded-lg border border-line flex flex-col md:flex-row gap-6 items-start justify-between">
                <div className="w-full md:w-1/2 flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted font-semibold uppercase tracking-wider">Confidence & Readiness Quotient</span>
                    <span className="text-sm text-primary-600 dark:text-primary-400 font-bold">
                      {getReadinessPercentage(decisionRecord.decision.decisionReadiness)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-4 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${getReadinessPercentage(decisionRecord.decision.decisionReadiness)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Calculated from real-time community report ingestion, operational knowledge enrichment parameters, and decision framework rulesets.
                  </p>
                </div>
                
                <div className="w-full md:w-1/2 bg-surface-1 border border-line-strong p-4 rounded-lg flex flex-col gap-2">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Readiness Evaluation Checklist</span>
                  <ul className="flex flex-col gap-1.5 text-xs text-secondary">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{isFallback ? 'Rule-Based Incident Understanding' : 'AI Incident Understanding'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Knowledge Context Enrichment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{decisionRecord.decision.evidence.length} Evidence Factors Evaluated</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Deterministic Decision Rules Applied</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card variant="default" padding="lg">
              <h3 className="text-base font-semibold mb-5 flex items-center gap-2 text-primary">
                <CheckShieldIcon />
                Evidence Pipeline Ingestion & Influence Signals
              </h3>

              <div className="relative border-l border-line pl-6 ml-3 flex flex-col gap-8">
                {decisionRecord.decision.evidence.map((item: EvidenceFactor, index: number) => {
                  const factorMeta = getFactorMeta(item.factor);
                  const influence = getEvidenceInfluence(item.factor, item.value);
                  
                  const trendColors = {
                    up: 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/20',
                    down: 'text-rose-500 bg-rose-50/50 dark:bg-rose-950/20 border-rose-500/20',
                    neutral: 'text-muted bg-surface-2 border-line',
                  };

                  return (
                    <div key={index} className="relative group animate-fade-in">
                      <span className="absolute -left-[38px] top-0.5 bg-surface-2 border border-line-strong w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-150 group-hover:border-primary-500">
                        {factorMeta.icon}
                      </span>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-primary group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150">
                            {factorMeta.title}
                          </h4>
                          
                          <Badge variant={item.source === 'analysis' ? 'primary' : 'info'}>
                            {item.source === 'analysis' ? 'AI Analysis' : 'Knowledge Context'}
                          </Badge>
                          
                          {item.weight !== undefined && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-surface-3 border border-line text-muted">
                              Weight: {item.weight}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                          <p className="text-xs text-muted leading-relaxed">
                            Resolved value: <span className="text-secondary font-medium font-mono bg-surface-3 px-1.5 py-0.5 rounded-lg border border-line">{item.value}</span>
                          </p>
                          
                          <div className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 ${trendColors[influence.trend]}`}>
                            {influence.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-6">
              <Card variant="glass" padding="md" className="border-line bg-surface-1">
                <div className="px-2 py-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-5 flex items-center gap-2 text-muted">
                    <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Decision Intelligence Pipeline
                  </h3>
                  
                  <div className="hidden md:grid grid-cols-6 relative gap-4">
                    <div className="absolute top-6 left-[8.33%] right-[8.33%] h-0.5 bg-line pointer-events-none z-0">
                      <div className="h-full w-full bg-gradient-to-r from-primary-500 via-emerald-500 to-emerald-400 rounded-full" />
                    </div>

                    {steps.map((step) => (
                      <div key={step.id} className="flex flex-col items-center text-center relative z-10 group">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center border border-decision-500 bg-surface-1 text-decision-500 transition-all duration-200 group-hover:bg-decision-50 dark:group-hover:bg-decision-950">
                          {step.icon}
                        </div>
                        <h4 className="text-xs font-semibold mt-2.5 group-hover:text-decision-600 dark:group-hover:text-decision-400 transition-colors duration-150 text-primary">
                          {step.label}
                        </h4>
                        <p className="text-[10px] mt-1 max-w-[130px] leading-relaxed text-muted">
                          {step.description}
                        </p>
                        <div className="mt-1.5 text-[9px] font-semibold text-decision-600 dark:text-decision-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-decision-500 inline-block" />
                          Done
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex md:hidden flex-col relative pl-4 border-l-2 border-emerald-500/40 gap-6 ml-4 py-2">
                    {steps.map((step) => (
                      <div key={step.id} className="relative flex gap-4 group">
                        <div className="absolute -left-[25px] top-0.5 w-6 h-6 rounded-full border border-decision-500 bg-surface-1 text-decision-500 flex items-center justify-center text-xs">
                          <div className="scale-75 flex items-center justify-center">
                            {step.icon}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-primary">
                              {step.label}
                            </h4>
                            <span className="text-[9px] font-semibold text-decision-600 dark:text-decision-400">
                              Done
                            </span>
                          </div>
                          <p className="text-[10px] mt-0.5 text-muted">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card variant="glass" padding="md" className="border-line">
                <div className="px-2 py-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 text-muted">
                    Decision Influence Engine Mapping
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch relative">
                    <div className="bg-surface-2 p-4 rounded-lg border border-line flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Ingested Telemetry Inputs</span>
                        <h4 className="text-sm font-bold text-primary mt-1">Weighted Evidence Signals</h4>
                      </div>
                      <div className="mt-4 flex flex-col gap-1 text-muted text-xs">
                        <span>• {decisionRecord.decision.evidence.filter(e => e.source === 'analysis').length} Report inputs ingested</span>
                        <span>• {decisionRecord.decision.evidence.filter(e => e.source === 'context').length} Knowledge contexts enriched</span>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex items-center justify-center pointer-events-none" aria-hidden="true">
                      <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <div className="flex md:hidden items-center justify-center py-1" aria-hidden="true">
                      <svg className="w-5 h-5 text-primary-500 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>

                    <div className="bg-primary-50/50 dark:bg-primary-950/10 p-4 rounded-lg border border-primary-200 dark:border-primary-800/40 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider">Resolution Mapping</span>
                        <h4 className="text-sm font-bold text-primary mt-1">Rule Triage Output</h4>
                      </div>
                      <div className="mt-4 flex flex-col gap-1.5 text-secondary text-xs">
                        <div className="flex justify-between items-center">
                          <span>Computed Priority:</span>
                          <span className="font-bold text-primary">{decisionRecord.decision.priority}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Confidence Readiness:</span>
                          <span className="font-bold text-primary">{decisionRecord.decision.decisionReadiness}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card variant="default" padding="lg" className="flex flex-col gap-5 h-full">
                  <h3 className="text-md font-bold text-secondary font-display border-b border-line pb-2 mb-1">
                    Telemetry Metrics
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-muted font-semibold uppercase tracking-wider block mb-1">
                        Issue Type
                      </span>
                      <p className="text-sm font-semibold text-primary bg-surface-3 px-3 py-2 rounded-lg border border-line">
                        {decisionRecord.analysis.issueType || 'Unknown'}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-muted font-semibold uppercase tracking-wider block mb-1">
                        Affected Asset
                      </span>
                      <p className="text-sm font-semibold text-primary bg-surface-3 px-3 py-2 rounded-lg border border-line">
                        {decisionRecord.analysis.affectedAsset || 'None Identified'}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-muted font-semibold uppercase tracking-wider block mb-1">
                        Severity Level
                      </span>
                      <div className="bg-surface-3 px-3 py-2 rounded-lg border border-line">
                        <span className="text-sm font-semibold text-primary">
                          {decisionRecord.analysis.severity || 'Unknown'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-muted font-semibold uppercase tracking-wider block mb-1">
                        Urgency Threshold
                      </span>
                      <div className="bg-surface-3 px-3 py-2 rounded-lg border border-line">
                        <span className="text-sm font-semibold text-primary">
                          {decisionRecord.analysis.urgency || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="md:col-span-1">
                <Card variant="default" padding="lg" className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-secondary font-display mb-3">
                      Identified Safety Hazards
                    </h3>
                    {decisionRecord.analysis.possibleHazards && decisionRecord.analysis.possibleHazards.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {decisionRecord.analysis.possibleHazards.map((hazard, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-950/40 text-amber-400 border border-amber-900/50"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                            {hazard}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted">No immediate hazards identified by the engine.</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            <Card variant="default" padding="lg">
              <h3 className="text-sm font-bold text-secondary font-display mb-3">
                Alternatives Considered
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {decisionRecord.decision.alternatives.map((alt, index) => (
                  <div
                    key={index}
                    className="p-3.5 bg-surface-3 rounded-lg border border-line text-xs text-secondary leading-relaxed"
                  >
                    {alt}
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="default" padding="lg">
              <h3 className="text-sm font-bold text-secondary font-display mb-4">
                Executive Reasoning & Public Explanation
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Citizen Incident Summary
                  </h4>
                  <p className="text-sm text-secondary leading-relaxed bg-surface-2 p-4 rounded-lg border border-line">
                    {decisionRecord.analysis.summary || 'No summary text available.'}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Decision Pipeline Explanation
                  </h4>
                  <p className="text-sm text-secondary leading-relaxed bg-surface-3 p-4 rounded-lg border border-line-strong">
                    {decisionRecord.decision.explanation}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <footer className="mt-12 pt-5 border-t text-center text-xs text-muted border-line">
        CommUnity AI — Evidence-based decisions. Published to the public record.
      </footer>
    </PageContainer>
  );
}
