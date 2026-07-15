import { useState, useEffect } from 'react';
import { PageContainer, SectionTitle, Card, Badge, Spinner, PrimaryButton, SectionErrorBoundary } from '@/components';
import { dashboardService } from '@/services/dashboard/dashboard.service';
import type { DashboardState } from '@/services/dashboard/dashboard.types';
import { notificationService, AppNotification } from '@/services/notificationService';
import { useNavigate } from 'react-router-dom';

function BellIcon({ unreadCount }: { unreadCount?: number }) {
  return (
    <div className="relative">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {!!unreadCount && unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
          {unreadCount}
        </span>
      )}
    </div>
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
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters for History
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [state, notifs] = await Promise.all([
          dashboardService.getDashboardState(),
          notificationService.getNotifications()
        ]);
        setData(state);
        setNotifications(notifs);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load citizen data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleNotificationClick = async (notif: AppNotification) => {
    if (notif.isRead) return;
    try {
      await notificationService.markAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

  const currentIncident = data.liveIncidents.length > 0 ? data.liveIncidents[0] : null;
  const historyIncidents = data.liveIncidents.slice(1).filter(inc => {
    if (statusFilter !== 'ALL' && inc.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && inc.priority !== priorityFilter) return false;
    if (searchQuery) {
      const sq = searchQuery.toLowerCase();
      if (
        !inc.id.toLowerCase().includes(sq) &&
        !inc.title.toLowerCase().includes(sq) &&
        !inc.category.toLowerCase().includes(sq) &&
        !inc.status.toLowerCase().includes(sq)
      ) {
        return false;
      }
    }
    return true;
  });
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

  let currentStepIndex = 1;
  if (currentIncident) {
    if (currentIncident.status === 'PENDING') currentStepIndex = 1;
    if (currentIncident.status === 'ASSIGNED') currentStepIndex = 2;
    if (currentIncident.status === 'IN_PROGRESS') currentStepIndex = 3;
    if (currentIncident.status === 'RESOLVED') currentStepIndex = 4;
  }

  // Find department info
  const assignedDept = currentIncident ? data.departments.find(d => d.name === currentIncident.department) : null;
  
  // Calculate estimated response
  const getEstimatedResponse = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return '1-2 Hours';
      case 'HIGH': return '24 Hours';
      case 'MEDIUM': return '48 Hours';
      case 'LOW': return '72 Hours';
      default: return 'TBD';
    }
  };

  const resolvedEvent = currentTimeline.find(t => t.type === 'RESOLUTION' || t.title.includes('Resolved'));

  return (
    <SectionErrorBoundary fallbackMessage="Failed to load Citizen Portal. Please try again.">
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
              <div className="flex flex-col gap-4 mb-6 border-b border-line pb-4">
                <div className="flex justify-between items-start">
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
                
                {/* Department & Response Tracking */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {currentIncident.department && (
                    <div className="p-3 bg-surface-2 rounded-lg border border-line">
                      <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-1">Assigned Department</p>
                      <p className="text-sm font-bold text-primary">{currentIncident.department}</p>
                      {assignedDept && (
                        <p className="text-xs text-secondary mt-1">
                          Queue: <span className="font-semibold">{assignedDept.openCases} cases ahead</span> ({assignedDept.workload} workload)
                        </p>
                      )}
                    </div>
                  )}
                  <div className="p-3 bg-surface-2 rounded-lg border border-line">
                    <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-1">Estimated Response</p>
                    <p className="text-sm font-bold text-primary">{getEstimatedResponse(currentIncident.priority)}</p>
                    {resolvedEvent && currentIncident.status === 'RESOLVED' && (
                      <p className="text-xs text-emerald-500 font-semibold mt-1">
                        Resolved on {new Date(resolvedEvent.timestamp).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
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
                  {currentTimeline.map((event, idx) => {
                    const isAuthority = event.type === 'STATUS_UPDATE' || event.type === 'ESCALATION' || event.type === 'ASSIGNMENT' || event.type === 'RESOLUTION';
                    return (
                    <div key={idx} className="relative pl-8 animate-fade-in">
                      <div className={`absolute left-1.5 top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-surface-1 ${isAuthority ? 'bg-amber-500' : 'bg-brand-500'}`} />
                      <div className={`bg-surface-2 border border-line rounded-lg p-3 ${isAuthority ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-primary flex items-center flex-wrap gap-2">
                            {event.title}
                            {isAuthority && <span className="text-[9px] uppercase tracking-wider text-amber-600 bg-amber-500/20 px-1.5 py-0.5 rounded">Authority Action</span>}
                          </span>
                          <span className="text-[10px] text-muted">{new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-xs text-secondary">{event.description}</p>
                      </div>
                    </div>
                  )})}
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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-line pb-3 mb-4 gap-3">
              <h3 className="text-sm font-bold text-secondary font-display whitespace-nowrap">
                Report History
              </h3>
              <div className="flex flex-wrap gap-2 items-center">
                <input 
                  type="text" 
                  placeholder="Search reports..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="px-2 py-1 bg-surface-2 border border-line rounded text-xs text-primary focus:outline-none focus:border-brand-500 w-full sm:w-auto"
                  aria-label="Search reports"
                />
                <select 
                  value={statusFilter} 
                  onChange={e => setStatusFilter(e.target.value)} 
                  className="px-2 py-1 bg-surface-2 border border-line rounded text-xs text-primary focus:outline-none"
                  aria-label="Filter by status"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
                <select 
                  value={priorityFilter} 
                  onChange={e => setPriorityFilter(e.target.value)} 
                  className="px-2 py-1 bg-surface-2 border border-line rounded text-xs text-primary focus:outline-none"
                  aria-label="Filter by priority"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>
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
                No historical reports match your criteria.
              </p>
            )}
          </Card>
        </div>

        {/* Sidebar: Notifications */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card variant="glass" padding="lg" className="h-full border-brand-500/10">
            <h3 className="text-sm font-bold text-secondary font-display border-b border-line pb-2 mb-4 flex items-center gap-2">
              <BellIcon unreadCount={unreadCount} />
              Notifications
            </h3>
            
            <div className="flex flex-col gap-3">
              {notifications.map((notif) => {
                const isResolved = notif.type === 'RESOLUTION';
                const isDecision = notif.type === 'DECISION';
                
                // Derive title from type since backend Notification doesn't have a title field
                const title = notif.type === 'STATUS_CHANGE' ? 'Status Update' 
                            : notif.type === 'ASSIGNMENT' ? 'New Assignment'
                            : notif.type === 'RESOLUTION' ? 'Incident Resolved'
                            : notif.type === 'DECISION' ? 'AI Evaluation'
                            : 'System Notification';

                return (
                  <div 
                    key={notif.id} 
                    role="button"
                    tabIndex={0}
                    aria-label={`Notification: ${title}`}
                    onClick={() => handleNotificationClick(notif)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNotificationClick(notif);
                      }
                    }}
                    className={`p-3 border rounded-lg transition-all cursor-pointer focus-ring ${
                      notif.isRead ? 'opacity-60' : 'shadow-md shadow-brand-500/5 hover:scale-[1.02]'
                    } ${
                      isResolved ? 'bg-emerald-500/10 border-emerald-500/20' 
                      : isDecision ? 'bg-brand-500/10 border-brand-500/20' 
                      : 'bg-surface-2 border-line'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs font-bold ${isResolved ? 'text-emerald-500' : isDecision ? 'text-brand-500' : 'text-primary'}`}>
                        {title}
                        {!notif.isRead && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500"></span>}
                      </span>
                      <span className="text-[10px] text-muted">{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                );
              })}
              
              {notifications.length === 0 && (
                <div className="text-xs text-muted text-center py-6">
                  You're all caught up! No new notifications.
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
      </PageContainer>
    </SectionErrorBoundary>
  );
}
