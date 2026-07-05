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

// ── Icons ──────────────────────────────────────────────────

function AlertCircleIcon() {
  return (
    <svg className="w-8 h-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
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

function HazardIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

// ── Helpers for badge coloring ────────────────────────────

function getSeverityBadgeVariant(severity: string) {
  const s = severity.toLowerCase();
  if (s.includes('critical') || s.includes('high')) return 'error';
  if (s.includes('medium') || s.includes('warn')) return 'warning';
  if (s.includes('low') || s.includes('safe')) return 'success';
  return 'info';
}

function getUrgencyBadgeVariant(urgency: string) {
  const u = urgency.toLowerCase();
  if (u.includes('immediate') || u.includes('critical') || u.includes('high')) return 'error';
  if (u.includes('medium') || u.includes('medium')) return 'warning';
  if (u.includes('low')) return 'success';
  return 'info';
}

// ── Component ─────────────────────────────────────────────

export default function DecisionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [decision, setDecision] = useState<DecisionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDecision = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getDecision(id);
      setDecision(data);
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
          {decision && (
            <Badge variant="primary" size="md">
              Analysis Completed
            </Badge>
          )}
        </header>

        {/* Section Heading */}
        <SectionTitle
          badge="AI Incident Analysis"
          title={`Analysis Record #${id ?? '—'}`}
          subtitle="Structural and environmental assessment compiled automatically by the Gemini Incident Understanding Engine."
          gradient
          align="left"
          className="mb-8"
        />

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
            <Spinner size="xl" color="primary" label="Fetching AI analysis..." />
            <p className="text-slate-400 text-sm font-medium">Contacting AI Analysis Engine...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <Card variant="glass" padding="lg" className="border-red-900/50 bg-red-950/10 max-w-2xl mx-auto text-center py-12 animate-scale-in">
            <div className="flex justify-center mb-4">
              <AlertCircleIcon />
            </div>
            <h3 className="text-xl font-bold text-red-200 font-display mb-2">
              Failed to Load Analysis
            </h3>
            <p className="text-sm text-red-400 mb-6 max-w-md mx-auto leading-relaxed">
              {error === 'Not Implemented' 
                ? 'The AI analysis endpoint is currently not implemented on the server (returned 501).'
                : error}
            </p>
            <div className="flex justify-center gap-3">
              <PrimaryButton size="md" onClick={fetchDecision} className="bg-red-600 hover:bg-red-500">
                <RefreshIcon />
                Retry Request
              </PrimaryButton>
            </div>
          </Card>
        )}

        {/* SUCCESS STATE */}
        {!loading && !error && decision && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-scale-in">
            
            {/* Left Column: Summary and Hazards */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Executive Summary Card */}
              <Card variant="glass" padding="lg" className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <h3 className="text-lg font-bold text-slate-100 font-display mb-3 flex items-center gap-2">
                  <CheckShieldIcon />
                  Executive Incident Summary
                </h3>
                <p className="text-slate-300 text-base leading-relaxed bg-surface-1 p-5 rounded-xl border border-line">
                  {decision.summary || 'No summary text available.'}
                </p>
                {decision.confidenceReason && (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Analysis Reasoning & Confidence
                    </h4>
                    <p className="text-xs text-slate-400 italic">
                      "{decision.confidenceReason}"
                    </p>
                  </div>
                )}
              </Card>

              {/* Possible Hazards Card */}
              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-slate-200 font-display mb-4 flex items-center gap-2">
                  <HazardIcon />
                  Identified Safety Hazards
                </h3>
                {decision.possibleHazards && decision.possibleHazards.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {decision.possibleHazards.map((hazard, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold bg-amber-950/40 text-amber-400 border border-amber-900/50"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        {hazard}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No immediate hazards identified by the engine.</p>
                )}
              </Card>
            </div>

            {/* Right Column: Metadata Panels */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Classification Metrics Card */}
              <Card variant="default" padding="lg" className="flex flex-col gap-5">
                <h3 className="text-md font-bold text-slate-300 font-display border-b border-line pb-2 mb-1">
                  Telemetry Metrics
                </h3>

                {/* Metric Item: Issue Type */}
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                    Issue Type
                  </span>
                  <p className="text-sm font-semibold text-slate-100 bg-surface-3 px-3 py-2.5 rounded-xl border border-line">
                    {decision.issueType || 'Unknown'}
                  </p>
                </div>

                {/* Metric Item: Affected Asset */}
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                    Affected Asset
                  </span>
                  <p className="text-sm font-semibold text-slate-100 bg-surface-3 px-3 py-2.5 rounded-xl border border-line">
                    {decision.affectedAsset || 'None Identified'}
                  </p>
                </div>

                {/* Metric Item: Severity */}
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                    Severity Level
                  </span>
                  <div className="bg-surface-3 px-3 py-2.5 rounded-xl border border-line flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">
                      {decision.severity || 'Unknown'}
                    </span>
                    <Badge variant={getSeverityBadgeVariant(decision.severity || '')} dot>
                      Status
                    </Badge>
                  </div>
                </div>

                {/* Metric Item: Urgency */}
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                    Urgency Threshold
                  </span>
                  <div className="bg-surface-3 px-3 py-2.5 rounded-xl border border-line flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">
                      {decision.urgency || 'Unknown'}
                    </span>
                    <Badge variant={getUrgencyBadgeVariant(decision.urgency || '')} dot>
                      Priority
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Footer copyright section */}
      <footer className="mt-12 pt-6 border-t border-line text-center text-xs text-slate-600">
        CommUnity AI — Decision transparency and immutability powered by Google Cloud.
      </footer>
    </PageContainer>
  );
}
