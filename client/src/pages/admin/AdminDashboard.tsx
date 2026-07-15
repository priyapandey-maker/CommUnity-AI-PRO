import React, { useEffect, useState } from 'react';
import { Card, PageContainer, SectionTitle, Badge, Spinner } from '@/components';
import { analyticsService, AnalyticsData } from '@/services/analyticsService';
import { dashboardService } from '@/services/dashboard/dashboard.service';
import { TimelineEvent } from '@/services/dashboard/dashboard.types';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [healthStatus, setHealthStatus] = useState({
    backend: 'success',
    aiOrchestrator: 'success',
    notificationService: 'success',
    analyticsService: 'success',
    decisionEngine: 'success',
  });

  // Mocked presentation data per constraints
  const platformStats = {
    totalCitizens: 1420,
    totalAuthority: 24,
    totalAdmins: 3,
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [analyticsData, dashboardState] = await Promise.all([
          analyticsService.getAnalytics().catch(() => null),
          dashboardService.getDashboardState().catch(() => null),
        ]);

        if (analyticsData) setAnalytics(analyticsData);
        if (dashboardState) {
          // Get 10 most recent events
          const recentEvents = [...dashboardState.timeline]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);
          setTimelineEvents(recentEvents);
        }

        // If analytics or dashboard fails, mark services degraded, else success
        setHealthStatus(prev => ({
          ...prev,
          backend: analyticsData && dashboardState ? 'success' : 'error',
          analyticsService: analyticsData ? 'success' : 'error',
          decisionEngine: dashboardState ? 'success' : 'warning',
          aiOrchestrator: dashboardState ? 'success' : 'warning',
        }));

      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <PageContainer maxWidth="xl" className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </PageContainer>
    );
  }

  const StatCard = ({ title, value, subtitle }: { title: string, value: string | number, subtitle?: string }) => (
    <Card padding="md" variant="default" className="flex flex-col border border-line">
      <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">{title}</span>
      <span className="text-2xl font-bold text-text-primary">{value}</span>
      {subtitle && <span className="text-xs text-text-secondary mt-1">{subtitle}</span>}
    </Card>
  );

  const HealthRow = ({ name, status }: { name: string, status: string }) => {
    let variant: 'success' | 'warning' | 'error' | 'default' = 'default';
    if (status === 'success') variant = 'success';
    if (status === 'warning') variant = 'warning';
    if (status === 'error') variant = 'error';

    return (
      <div className="flex items-center justify-between py-3 border-b border-line last:border-0">
        <span className="text-sm font-medium text-text-primary">{name}</span>
        <Badge variant={variant} dot>{status === 'success' ? 'Operational' : status === 'warning' ? 'Degraded' : 'Down'}</Badge>
      </div>
    );
  };

  const totalUsers = platformStats.totalCitizens + platformStats.totalAuthority + platformStats.totalAdmins;
  const citizenPct = Math.round((platformStats.totalCitizens / totalUsers) * 100);
  const authorityPct = Math.round((platformStats.totalAuthority / totalUsers) * 100);
  const adminPct = 100 - citizenPct - authorityPct;

  return (
    <PageContainer maxWidth="xl" className="py-8 animate-fade-in space-y-8">
      <div>
        <SectionTitle 
          title="Platform Administration" 
          subtitle="System monitoring and read-only overview."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION 1: Platform Overview */}
          <section>
            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Platform Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Citizens" value={platformStats.totalCitizens} />
              <StatCard title="Authorities" value={platformStats.totalAuthority} />
              <StatCard title="Admins" value={platformStats.totalAdmins} />
              <StatCard title="Total Users" value={totalUsers} />
              
              <StatCard title="Total Incidents" value={analytics?.totalIncidents || 0} />
              <StatCard title="Open Incidents" value={analytics?.inProgressIncidents || 0} />
              <StatCard title="Resolved" value={analytics?.resolvedIncidents || 0} />
              <StatCard title="Critical" value={analytics?.criticalIncidents || 0} />
            </div>
          </section>

          {/* SECTION 3: Recent Platform Activity */}
          <section>
            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4 mt-8">Recent Platform Activity</h2>
            <Card padding="md" className="overflow-hidden">
              {timelineEvents.length > 0 ? (
                <div className="space-y-4">
                  {timelineEvents.map(event => (
                    <div key={event.id} className="flex gap-4 items-start p-3 rounded-lg hover:bg-surface-2 transition-colors">
                      <div className="mt-1">
                        <Badge variant={event.type === 'DECISION' ? 'primary' : event.type === 'RESOLUTION' ? 'success' : 'default'} size="sm">
                          {event.type}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-text-primary">{event.title}</div>
                        <div className="text-xs text-text-secondary mt-0.5">{event.description}</div>
                        <div className="text-[10px] text-text-tertiary mt-1">
                          {new Date(event.timestamp).toLocaleString()} • ID: {event.incidentId}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-text-secondary text-center py-8">No recent activity found.</div>
              )}
            </Card>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* SECTION 2: System Health */}
          <section>
            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">System Health</h2>
            <Card padding="md">
              <HealthRow name="Backend API" status={healthStatus.backend} />
              <HealthRow name="AI Orchestrator" status={healthStatus.aiOrchestrator} />
              <HealthRow name="Notification Service" status={healthStatus.notificationService} />
              <HealthRow name="Analytics Service" status={healthStatus.analyticsService} />
              <HealthRow name="Decision Engine" status={healthStatus.decisionEngine} />
            </Card>
          </section>

          {/* SECTION 4: Role Distribution */}
          <section>
            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4 mt-8">Role Distribution</h2>
            <Card padding="md">
              <div className="flex h-4 rounded-full overflow-hidden mb-4">
                <div style={{ width: `${citizenPct}%` }} className="bg-blue-500" title="Citizens" />
                <div style={{ width: `${authorityPct}%` }} className="bg-amber-500" title="Authorities" />
                <div style={{ width: `${adminPct}%` }} className="bg-emerald-500" title="Admins" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Citizens</div>
                  <span className="font-semibold">{citizenPct}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Authorities</div>
                  <span className="font-semibold">{authorityPct}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Admins</div>
                  <span className="font-semibold">{adminPct}%</span>
                </div>
              </div>
            </Card>
          </section>

          {/* SECTION 5: Platform Information */}
          <section>
            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4 mt-8">Platform Information</h2>
            <Card padding="md">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Version</span>
                  <span className="font-mono text-text-primary">0.1.0-RC3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Environment</span>
                  <span className="text-text-primary">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Build Time</span>
                  <span className="text-text-primary">{new Date().toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Frontend</span>
                  <span className="text-text-primary">React 18 / Vite</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Backend</span>
                  <span className="text-text-primary">Node.js / Express</span>
                </div>
              </div>
            </Card>
          </section>

        </div>
      </div>
    </PageContainer>
  );
};
