import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboard/dashboard.service';
import { DashboardState } from '@/services/dashboard/dashboard.types';
import {
  MetricCard,
  CommunityHealthCard,
  DecisionCard,
  PriorityIncidentCard,
  CommunityRiskMap,
  IncidentTable,
  InsightCard,
  Timeline,
  DepartmentCard,
  RecommendationCard,
  DashboardSkeleton,
  NoCriticalIncidents,
  NoAnalytics,
  NoTimeline,
  NoRecommendations
} from '@/components/dashboard';

export default function AuthorityDashboard() {
  const [data, setData] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await dashboardService.getDashboardState();
      setData(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (!data) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Authority Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Authority Decision Center</h1>
          <p className="text-sm text-text-secondary mt-1">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-text-tertiary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-surface-2 hover:bg-surface-3 text-text-secondary text-sm font-medium rounded-md transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* 2. AI Situation Summary (Hero) */}
      <section>
        <h2 className="section-label mb-4">AI Situation Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard title="Total Incidents" value={data.metrics.totalIncidents} />
          <MetricCard title="Critical Incidents" value={data.metrics.criticalIncidents} trend="up" trendValue="2" />
          <MetricCard title="Escalations" value={data.metrics.escalations} />
          <MetricCard title="Departments Active" value={data.metrics.departmentsActive} />
          <MetricCard title="Pending Decisions" value={data.metrics.pendingDecisions} trend="down" trendValue="4" />
        </div>
        <div className="mt-4">
          {data.primaryRecommendation ? (
            <RecommendationCard primaryRecommendation={data.primaryRecommendation} />
          ) : (
            <NoRecommendations />
          )}
        </div>
      </section>

      {/* 3. Community Health Overview */}
      <section>
        <CommunityHealthCard health={data.health} />
      </section>

      {/* 4. Decision Center */}
      <section>
        <h2 className="section-label mb-4">Decision Center</h2>
        <div className="grid grid-cols-1 gap-6">
          {data.decisions.map(decision => (
            <DecisionCard key={decision.id} decision={decision} />
          ))}
          {data.decisions.length === 0 && <NoRecommendations />}
        </div>
      </section>

      {/* 5 & 6. Priority Queue & Community Risk Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="flex justify-between items-end mb-4">
            <h2 className="section-label">Priority Queue</h2>
            <span className="text-xs text-text-tertiary">Top {data.priorityQueue.length} incidents</span>
          </div>
          {data.priorityQueue.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.priorityQueue.map(incident => (
                <PriorityIncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          ) : (
            <NoCriticalIncidents />
          )}
        </section>
        <section>
          <h2 className="section-label mb-4">Risk Map</h2>
          <CommunityRiskMap />
        </section>
      </div>

      {/* 7. Live Incident Intelligence */}
      <section>
        <h2 className="section-label mb-4">Live Incident Intelligence</h2>
        <IncidentTable incidents={data.liveIncidents} />
      </section>

      {/* 8 & 9. Community Analytics & Decision Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <h2 className="section-label mb-4">Community Analytics</h2>
          {data.trends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InsightCard title="Incident Trends (7 Days)">
                {/* Mocking a simple chart with Flex bars */}
                <div className="flex items-end h-32 gap-2 mt-4">
                  {data.trends.map(t => (
                    <div key={t.date} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-sm relative">
                        <div 
                          className="absolute bottom-0 w-full bg-blue-500 dark:bg-blue-400 rounded-t-sm transition-all group-hover:bg-blue-600"
                          style={{ height: `${(t.count / 50) * 100}%`, minHeight: '4px' }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-text-tertiary">{t.date}</span>
                    </div>
                  ))}
                </div>
              </InsightCard>
              <InsightCard title="Category Distribution">
                <div className="space-y-3 mt-2">
                  {data.categoryDistribution.map(c => (
                    <div key={c.category}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary">{c.category}</span>
                        <span className="text-text-tertiary font-medium">{c.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-3 rounded-full">
                        <div className="h-1.5 bg-indigo-500 rounded-full" style={{ width: `${c.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </InsightCard>
            </div>
          ) : (
            <NoAnalytics />
          )}
        </section>
        <section>
          {data.timeline.length > 0 ? (
            <Timeline events={data.timeline} />
          ) : (
            <NoTimeline />
          )}
        </section>
      </div>

      {/* 10. Department Overview */}
      <section>
        <h2 className="section-label mb-4">Department Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.departments.map(dept => (
            <DepartmentCard key={dept.id} department={dept} />
          ))}
        </div>
      </section>
    </div>
  );
}
