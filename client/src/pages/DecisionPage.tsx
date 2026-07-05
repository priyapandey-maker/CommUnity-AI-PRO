import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PageContainer,
  Card,
  SectionTitle,
  Badge,
  PrimaryButton,
  SecondaryButton,
} from '@/components';

// ── Types & Mock Data ──────────────────────────────────────

interface DecisionData {
  recommendation: string;
  priority: 'Low' | 'Medium' | 'High';
  evidence: {
    title: string;
    description: string;
    type: 'school' | 'weather' | 'history';
  }[];
  decisionReadiness: 'Low' | 'Medium' | 'High';
  readinessScore: number; // percentage
  alternatives: {
    title: string;
    impact: 'Low' | 'Medium' | 'High';
    cost: 'Low' | 'Medium' | 'High';
  }[];
  explanation: string;
}

const mockDecision: DecisionData = {
  recommendation: 'Immediate Repair',
  priority: 'High',
  evidence: [
    {
      title: 'School Zone',
      description: 'Active pedestrian zone requires enhanced safety levels and immediate hazard resolution.',
      type: 'school',
    },
    {
      title: 'Recent Rain',
      description: 'Heavy precipitation has accelerated base erosion, causing structural deterioration.',
      type: 'weather',
    },
    {
      title: 'Maintenance History',
      description: 'Work order logs indicate three recurring temporary patch failures in this coordinate over 12 months.',
      type: 'history',
    },
  ],
  decisionReadiness: 'High',
  readinessScore: 92,
  alternatives: [
    {
      title: 'Temporary Barricade',
      impact: 'Low',
      cost: 'Low',
    },
    {
      title: 'Scheduled Maintenance',
      impact: 'Medium',
      cost: 'Medium',
    },
  ],
  explanation:
    'Immediate repair is recommended because the incident affects a school zone, recent rainfall increases deterioration risk, and historical maintenance indicates recurring issues.',
};

// ── Icons ──────────────────────────────────────────────────

function AlertCircleIcon() {
  return (
    <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
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

function CheckIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
}

function WeatherIcon() {
  return (
    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────

export default function DecisionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [actionDone, setActionDone] = useState<'approved' | 'rejected' | null>(null);

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setActionDone('approved');
    }, 1200);
  };

  const handleReject = () => {
    setIsRejecting(true);
    setTimeout(() => {
      setIsRejecting(false);
      setActionDone('rejected');
    }, 1000);
  };

  return (
    <PageContainer as="div" maxWidth="xl" className="py-8 min-h-screen flex flex-col justify-between">
      {/* Header Area */}
      <div>
        <header className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200 focus-ring rounded-lg p-1.5"
          >
            <ArrowLeftIcon />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">Readiness Score</span>
            <Badge variant="primary" size="md">
              {mockDecision.readinessScore}% Confidence
            </Badge>
          </div>
        </header>

        {/* Section Heading */}
        <SectionTitle
          badge={`Decision Record #${id ?? '—'}`}
          title="Decision Recommendation"
          subtitle="Real-time incident analysis and resolution paths compiled from community telemetry and infrastructure data."
          gradient
          align="left"
          className="mb-8"
        />

        {/* Alert Action Banner */}
        {actionDone && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 border animate-fade-in ${
              actionDone === 'approved'
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-red-950/40 border-red-800 text-red-300'
            }`}
          >
            <CheckIcon />
            <span className="font-semibold text-sm">
              Recommendation successfully {actionDone === 'approved' ? 'approved and sent to dispatch' : 'rejected'}.
            </span>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Recommendation Details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Primary Recommendation Card */}
            <Card variant="glass" padding="lg" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Recommended Action
                  </span>
                  <h3 className="text-2xl font-bold text-slate-100 font-display mt-0.5">
                    {mockDecision.recommendation}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="error" dot>
                    {mockDecision.priority} Priority
                  </Badge>
                  <Badge variant="info">
                    Readiness: {mockDecision.decisionReadiness}
                  </Badge>
                </div>
              </div>

              {/* Progress gauge/readiness bar */}
              <div className="mb-6 bg-surface-1 p-4 rounded-xl border border-line">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-medium">Decision Readiness Quotient</span>
                  <span className="text-xs text-brand-400 font-bold">{mockDecision.readinessScore}%</span>
                </div>
                <div className="w-full bg-surface-4 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-500 to-accent-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${mockDecision.readinessScore}%` }}
                  />
                </div>
              </div>

              {/* Explanation block */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Executive Summary</h4>
                <p className="text-sm text-slate-400 leading-relaxed bg-surface-3 p-4 rounded-xl border border-line-strong">
                  {mockDecision.explanation}
                </p>
              </div>
            </Card>

            {/* Alternatives Card */}
            <Card variant="default" padding="md">
              <h3 className="text-lg font-bold text-slate-200 font-display mb-4">
                Alternative Operations Considered
              </h3>
              <div className="flex flex-col gap-3">
                {mockDecision.alternatives.map((alt, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-surface-1 hover:bg-surface-3 transition-colors duration-200 rounded-xl border border-line"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{alt.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Automated safety fallback option</p>
                    </div>
                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                      <span className="text-xs text-slate-500">
                        Impact: <span className="text-slate-300 font-medium">{alt.impact}</span>
                      </span>
                      <span className="text-xs text-slate-500">
                        Cost: <span className="text-slate-300 font-medium">{alt.cost}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Evidence Timeline */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card variant="default" padding="lg" className="flex-grow">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircleIcon />
                <h3 className="text-lg font-bold text-slate-200 font-display">
                  Supporting Evidence Signals
                </h3>
              </div>

              {/* Timeline implementation */}
              <div className="relative border-l border-line pl-6 ml-3 flex flex-col gap-8">
                {mockDecision.evidence.map((item, index) => {
                  let icon = <SchoolIcon />;
                  if (item.type === 'weather') icon = <WeatherIcon />;
                  if (item.type === 'history') icon = <HistoryIcon />;

                  return (
                    <div key={index} className="relative group">
                      {/* Timeline Node Point */}
                      <span className="absolute -left-[38px] top-0.5 bg-surface-2 border border-line-strong w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300 group-hover:border-brand-500 group-hover:shadow-glow-xs">
                        {icon}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200 group-hover:text-brand-300 transition-colors duration-200">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Action Footer Bar */}
      <footer className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        <SecondaryButton
          size="lg"
          onClick={handleReject}
          loading={isRejecting}
          disabled={Boolean(actionDone) || isApproving}
        >
          Decline & Escalate
        </SecondaryButton>
        <PrimaryButton
          variant="gradient"
          size="lg"
          onClick={handleApprove}
          loading={isApproving}
          disabled={Boolean(actionDone) || isRejecting}
        >
          Approve Action Plan
        </PrimaryButton>
      </footer>
    </PageContainer>
  );
}
