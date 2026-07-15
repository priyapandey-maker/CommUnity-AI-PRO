import React, { useEffect, useState, useMemo } from 'react';
import { PageContainer, SectionTitle, Card, Badge, PrimaryButton } from '@/components';
import { getMyIncidents, LedgerEntry } from '@/services/incidentService';
import { useNavigate } from 'react-router-dom';

export const MyReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getMyIncidents();
        setReports(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load your reports');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      if (statusFilter !== 'ALL' && report.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && report.priority !== priorityFilter) return false;
      if (categoryFilter !== 'ALL' && report.issueType !== categoryFilter) return false;
      return true;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [reports, statusFilter, priorityFilter, categoryFilter]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(reports.map(r => r.issueType).filter(Boolean)));
  }, [reports]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(reports.map(r => r.status).filter(Boolean)));
  }, [reports]);

  return (
    <PageContainer className="py-12">
      <div className="flex justify-between items-center mb-8">
        <SectionTitle 
          badge="Citizen Area" 
          title="My Reports" 
          subtitle="View and track the status of all your submitted incidents." 
          align="left" 
          className="mb-0"
        />
        <PrimaryButton onClick={() => navigate('/submit')}>+ New Report</PrimaryButton>
      </div>

      <Card variant="glass" padding="md" className="mb-8 flex flex-wrap gap-4 items-end border-brand-500/10">
        <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[150px]">
          <label className="text-xs font-semibold text-slate-500">Status</label>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-surface-2 border border-line rounded-lg text-sm text-primary focus:outline-none focus:border-brand-500 w-full"
          >
            <option value="ALL">All Statuses</option>
            {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        
        <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[150px]">
          <label className="text-xs font-semibold text-slate-500">Priority</label>
          <select 
            value={priorityFilter} 
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-surface-2 border border-line rounded-lg text-sm text-primary focus:outline-none focus:border-brand-500 w-full"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[150px]">
          <label className="text-xs font-semibold text-slate-500">Category</label>
          <select 
            value={categoryFilter} 
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-surface-2 border border-line rounded-lg text-sm text-primary focus:outline-none focus:border-brand-500 w-full"
          >
            <option value="ALL">All Categories</option>
            {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </Card>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-4">
          {[1,2,3].map(i => (
            <Card key={i} className="animate-pulse flex flex-col md:flex-row justify-between p-6 gap-4 border border-line bg-surface-2 h-32">
              <div className="flex flex-col gap-2 w-full md:w-2/3">
                 <div className="h-5 bg-surface-3 rounded w-1/3"></div>
                 <div className="h-4 bg-surface-3 rounded w-1/4 mt-2"></div>
                 <div className="h-4 bg-surface-3 rounded w-1/2"></div>
              </div>
              <div className="flex flex-col md:items-end justify-center gap-2">
                 <div className="h-8 bg-surface-3 rounded w-24"></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="p-8 text-center border-red-500/20 bg-red-500/5">
          <h3 className="text-lg font-bold text-red-600 mb-2">Error Loading Reports</h3>
          <p className="text-sm text-red-400">{error}</p>
          <PrimaryButton className="mt-4" onClick={() => window.location.reload()}>Try Again</PrimaryButton>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredReports.length === 0 && (
        <Card className="p-12 text-center border-dashed border-line bg-surface-1">
          <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4 border border-line">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-primary mb-2">No reports found</h3>
          <p className="text-sm text-muted mb-6">
            {reports.length === 0 ? "You haven't submitted any reports yet." : "No reports match your selected filters."}
          </p>
          {reports.length === 0 ? (
            <PrimaryButton onClick={() => navigate('/submit')}>Create a Report</PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => { setStatusFilter('ALL'); setPriorityFilter('ALL'); setCategoryFilter('ALL'); }}>Clear Filters</PrimaryButton>
          )}
        </Card>
      )}

      {/* Incident List */}
      {!isLoading && !error && filteredReports.length > 0 && (
        <div className="flex flex-col gap-4">
          {filteredReports.map(report => (
            <Card key={report.incidentId} className="flex flex-col md:flex-row justify-between p-6 gap-4 border border-line bg-surface-1 hover:bg-surface-2 transition-colors">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-primary">{report.issueType || 'Incident Report'}</h3>
                  <Badge variant={report.priority === 'CRITICAL' || report.priority === 'HIGH' ? 'error' : report.priority === 'MEDIUM' ? 'warning' : 'success'}>
                    {report.priority}
                  </Badge>
                  <div className="px-2 py-1 text-xs font-bold uppercase rounded border bg-surface-3 text-secondary">
                    {report.status}
                  </div>
                </div>
                <div className="text-xs text-muted mt-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <span><strong>Created:</strong> {new Date(report.timestamp).toLocaleDateString()}</span>
                  <span className="hidden md:inline text-line">•</span>
                  <span><strong>Latest Update:</strong> {new Date(report.timestamp).toLocaleTimeString()}</span>
                </div>
                {report.recommendation && (
                  <p className="text-sm text-secondary mt-2 line-clamp-2">
                    {report.recommendation}
                  </p>
                )}
              </div>
              <div className="flex items-center md:items-end justify-start md:justify-end mt-4 md:mt-0">
                <PrimaryButton onClick={() => navigate(`/decision/${report.incidentId}`)}>
                  View Details
                </PrimaryButton>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
};
