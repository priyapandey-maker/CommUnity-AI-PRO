import { useState, useEffect } from 'react';
import { PageContainer, SectionTitle, Card, Badge, Spinner, PrimaryButton } from '@/components';
import { dashboardService } from '@/services/dashboard/dashboard.service';
import type { DashboardState } from '@/services/dashboard/dashboard.types';
import { useNavigate } from 'react-router-dom';

function BellIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

export default function CitizenPortal() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const state = await dashboardService.getDashboardState();
        setData(state);
      } catch (err: any) {
        setError(err.message || 'Failed to load citizen data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <PageContainer  className="py-12">
        <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
          <Spinner size="xl" color="primary" label="Loading your portal..." />
        </div>
      </PageContainer>
    );
  }

  if (error || !data) {
    return (
      <PageContainer  className="py-12">
        <Card variant="glass" padding="lg" className="border-red-900/50 bg-red-950/10 text-center">
          <h3 className="text-xl font-bold text-red-200 mb-2">Error Loading Data</h3>
          <p className="text-red-400">{error}</p>
        </Card>
      </PageContainer>
    );
  }

  // Pick the most recent incident to track
  const currentIncident = data.liveIncidents.length > 0 ? data.liveIncidents[0] : null;
  const historyIncidents = data.liveIncidents.slice(1);
  const currentDecision = currentIncident ? data.decisions.find(d => d.incidentId === currentIncident.id) : null;
  const currentTimeline = currentIncident ? data.timeline.filter(t => t.incidentId === currentIncident.id).reverse() : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'IN_PROGRESS': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'RESOLVED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStepStatus = (stepIndex: number, currentStepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'complete';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  let currentStepIndex = 1; // 0 = Submitted, 1 = Under Review, 2 = Action Planned, 3 = Dispatched
  if (currentDecision) currentStepIndex = 2;
  if (currentIncident?.status === 'IN_PROGRESS') currentStepIndex = 3;

  return (
    <PageContainer  className="py-8 md:py-12">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slide-up">
        <div>
          <SectionTitle
            badge="Citizen Portal"
            title="My Reports & Activity"
            subtitle="Track your submissions, receive notifications, and view decisions made by CommUnity AI."
            align="left"
            className="mb-0"
          />
        </div>
        <div className="flex gap-3 shrink-0">
          <PrimaryButton onClick={() => navigate('/submit')} size="md">
            New Report
          </PrimaryButton>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        
        {/* Main Column: Active Tracking */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {currentIncident ? (
            <Card variant="default" padding="lg">
              <div className="flex justify-between items-start mb-6 border-b border-line pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-primary font-display">
                      {currentIncident.title}
                    </h3>
                    <div className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${getStatusColor(currentIncident.status)}`}>
                      {currentIncident.status.replace('_', ' ')}
                    </div>
                  </div>
                  <p className="text-sm text-muted">
                    Submitted on {new Date(currentIncident.timestamp).toLocaleDateString()} at {new Date(currentIncident.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <Badge variant={currentIncident.priority === 'CRITICAL' || currentIncident.priority === 'HIGH' ? 'error' : 'warning'}>
                  Priority: {currentIncident.priority}
                </Badge>
              </div>

              {/* Status Visualization */}
              <div className="mb-8">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Progress Tracker</h4>
                <div className="relative">
                  <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-surface-3 -translate-y-1/2 rounded-full" />
                  <div 
                    className="absolute top-1/2 left-4 h-0.5 bg-brand-500 -translate-y-1/2 rounded-full transition-all duration-1000" 
                    style={{ width: `${(currentStepIndex / 3) * 100}%` }}
                  />
                  
                  <div className="relative z-10 flex justify-between">
                    {[
                      { label: 'Submitted', desc: 'Received' },
                      { label: 'Review', desc: 'AI Analysis' },
                      { label: 'Decision', desc: 'Plan Generated' },
                      { label: 'Action', desc: 'Dispatched' }
                    ].map((step, idx) => {
                      const status = getStepStatus(idx, currentStepIndex);
                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-surface-1 transition-colors duration-300 ${
                            status === 'complete' ? 'border-brand-500 text-brand-500' :
                            status === 'current' ? 'border-brand-400 border-dashed text-brand-400' :
                            'border-surface-3 text-muted'
                          }`}>
                            {status === 'complete' ? <CheckCircleIcon /> : 
                             status === 'current' ? <ClockIcon /> : 
                             <div className="w-2 h-2 rounded-full bg-muted" />}
                          </div>
                          <span className={`text-xs font-bold mt-2 ${status !== 'pending' ? 'text-primary' : 'text-muted'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Decision Explanation */}
              {currentDecision && (
                <div className="bg-brand-50/50 dark:bg-brand-950/10 border border-brand-200 dark:border-brand-900/40 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-brand-700 dark:text-brand-300">Decision Outcome</h4>
                    <button 
                      onClick={() => navigate(`/decision/${currentDecision.incidentId}`)}
                      className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center hover:underline"
                    >
                      View Full Record <ArrowRightIcon />
                    </button>
                  </div>
                  <p className="text-sm text-secondary font-medium bg-surface-1 p-3 rounded-lg border border-line mb-3">
                    {currentDecision.recommendedAction}
                  </p>
                  <p className="text-xs text-muted leading-relaxed">
                    <span className="font-semibold text-secondary">Explanation:</span> {currentDecision.reasonSummary}
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Event Timeline</h4>
                <div className="flex flex-col gap-4 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-line ml-1">
                  {currentTimeline.map((event, idx) => (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-surface-1" />
                      <div className="bg-surface-2 border border-line rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-primary">{event.title}</span>
                          <span className="text-[10px] text-muted">{new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-xs text-secondary">{event.description}</p>
                      </div>
                    </div>
                  ))}
                  {currentTimeline.length === 0 && (
                    <div className="text-xs text-muted pl-8 py-2">Waiting for first timeline event...</div>
                  )}
                </div>
              </div>

            </Card>
          ) : (
            <Card variant="glass" padding="lg" className="flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center text-muted mb-4 border border-line">
                <FileTextIcon />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">No Active Reports</h3>
              <p className="text-sm text-muted max-w-md">You haven't submitted any incidents yet, or all your previous reports have been fully archived.</p>
              <PrimaryButton className="mt-6" onClick={() => navigate('/submit')}>
                Submit Your First Report
              </PrimaryButton>
            </Card>
          )}

          {/* History */}
          <Card variant="default" padding="lg">
            <h3 className="text-sm font-bold text-secondary font-display border-b border-line pb-2 mb-4">
              Report History
            </h3>
            {historyIncidents.length > 0 ? (
              <div className="flex flex-col gap-3">
                {historyIncidents.map(inc => (
                  <div key={inc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-line bg-surface-2 hover:bg-surface-3 transition-colors cursor-pointer group" onClick={() => navigate(`/decision/${inc.id}`)}>
                    <div>
                      <h4 className="text-sm font-bold text-primary group-hover:text-brand-500 transition-colors">{inc.title}</h4>
                      <p className="text-xs text-muted mt-0.5">{new Date(inc.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2 sm:mt-0">
                      <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(inc.status)}`}>
                        {inc.status}
                      </div>
                      <ArrowRightIcon />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted py-4 text-center border border-dashed border-line rounded-lg">
                No historical reports to display.
              </p>
            )}
          </Card>
        </div>

        {/* Sidebar: Notifications */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card variant="glass" padding="lg" className="h-full border-brand-500/10">
            <h3 className="text-sm font-bold text-secondary font-display border-b border-line pb-2 mb-4 flex items-center gap-2">
              <BellIcon />
              Notifications
            </h3>
            
            <div className="flex flex-col gap-3">
              {currentIncident && currentDecision && (
                <div className="p-3 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/30 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-brand-700 dark:text-brand-300">Decision Reached</span>
                    <span className="text-[10px] text-brand-500">Just now</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Your report "{currentIncident.title}" has been reviewed by the AI Engine. Priority set to <span className="font-bold">{currentIncident.priority}</span>.
                  </p>
                </div>
              )}
              {currentIncident && (
                <div className="p-3 bg-surface-2 border border-line rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-primary">Report Received</span>
                    <span className="text-[10px] text-muted">{new Date(currentIncident.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Thank you for submitting. We have successfully logged your report to the transparent ledger.
                  </p>
                </div>
              )}
              {historyIncidents.length > 0 && (
                <div className="p-3 bg-surface-2 border border-line rounded-lg opacity-70">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-primary">System Update</span>
                    <span className="text-[10px] text-muted">Yesterday</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    A previous report you filed was marked as RESOLVED by the local authority.
                  </p>
                </div>
              )}
              
              {!currentIncident && historyIncidents.length === 0 && (
                <div className="text-xs text-muted text-center py-6">
                  You're all caught up! No new notifications.
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </PageContainer>
  );
}
