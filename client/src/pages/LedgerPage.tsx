import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Badge, Spinner } from '@/components';
import { getLedger, LedgerEntry, parseApiError } from '@/services';

// ── Stat icons ────────────────────────────────────────────

function DecisionsIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────

const getPriorityBadgeVariant = (p: string) => {
  const priority = p.toUpperCase();
  if (priority === 'CRITICAL' || priority === 'HIGH') return 'error' as const;
  if (priority === 'MEDIUM') return 'warning' as const;
  return 'default' as const;
};

const getReadinessBadgeVariant = (r: string) => {
  const readiness = r.toUpperCase();
  if (readiness === 'HIGH') return 'success' as const;
  if (readiness === 'MEDIUM') return 'warning' as const;
  return 'default' as const;
};

const formatTimestamp = (isoString: string) => {
  try {
    return new Date(isoString).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
};

// ── Component ─────────────────────────────────────────────

export default function LedgerPage() {
  const navigate = useNavigate();
  const [ledger, setLedger]   = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const fetchLedger = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLedger();
      setLedger(data);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLedger(); }, []);

  const totalDecisions = ledger.length;
  const activeCount    = ledger.filter(e => e.status === 'received').length;

  // Filter logic
  const filteredLedger = ledger.filter(entry => {
    const matchesSearch = (entry.issueType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (entry.recommendation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.incidentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || entry.priority.toUpperCase() === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <>
      <PageHeader
        badge="Transparency Ledger"
        title="Public Decision Register"
        subtitle="A complete, auditable record of every evidence-based community decision. All entries are immutable and publicly accessible."
      />

      {/* Registry Statistics Summary - Compact tags instead of oversized KPI cards */}
      <section aria-label="Register Summary" className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface-1 text-xs">
          <span className="w-5 h-5 rounded flex items-center justify-center bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400" aria-hidden="true">
            <DecisionsIcon />
          </span>
          <span className="font-semibold text-primary">{totalDecisions}</span>
          <span className="text-muted">Total Filed Decisions</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface-1 text-xs">
          <span className="w-5 h-5 rounded flex items-center justify-center bg-decision-50 dark:bg-decision-950 text-decision-600 dark:text-decision-400" aria-hidden="true">
            <DecisionsIcon />
          </span>
          <span className="font-semibold text-primary">{activeCount}</span>
          <span className="text-muted">Active Pipeline Incidents</span>
        </div>
      </section>

      {/* Table / List Container */}
      <section
        aria-label="Ledger entries"
        className="rounded-lg border border-line bg-surface-1 overflow-hidden mb-8"
      >
        {/* Table Header and Filters Bar */}
        <div className="p-4 border-b border-line bg-surface-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-semibold text-primary uppercase tracking-wider">
            Public Logs ({filteredLedger.length})
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search log by keyword, ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-surface-1 border border-line text-primary placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary-500 w-full sm:w-56"
            />
            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-surface-1 border border-line text-primary focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spinner size="lg" color="primary" label="Loading decision register..." />
            <p className="text-xs font-medium text-muted">
              Reading public register…
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
            <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm font-medium text-red-650 dark:text-red-400">Failed to load ledger records</p>
            <p className="text-xs max-w-sm text-muted">{error}</p>
            <Button variant="secondary" onClick={fetchLedger}>Retry</Button>
          </div>
        )}

        {/* Data table */}
        {!loading && !error && filteredLedger.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" role="table">
              <thead>
                <tr className="border-b border-line bg-surface-2/65">
                  {['Incident', 'Priority', 'Recommendation', 'Readiness', 'Recorded', 'Status'].map(h => (
                    <th
                      key={h}
                      className="px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLedger.map((entry) => (
                  <tr
                    key={entry.incidentId}
                    onClick={() => navigate(`/decision/${entry.incidentId}`)}
                    className="border-b border-line/50 hover:bg-surface-2/70 cursor-pointer transition-colors duration-100 last:border-b-0"
                  >
                    <td className="px-6 py-4.5">
                      <div className="text-sm font-semibold text-primary">
                        {entry.issueType || 'Unknown Issue'}
                      </div>
                      <div className="text-xs mt-0.5 font-mono text-muted">
                        #{entry.incidentId.substring(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <Badge variant={getPriorityBadgeVariant(entry.priority)}>
                        {entry.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4.5 text-sm max-w-xs text-secondary leading-relaxed">
                      {entry.recommendation}
                    </td>
                    <td className="px-6 py-4.5">
                      <Badge variant={getReadinessBadgeVariant(entry.decisionReadiness)}>
                        {entry.decisionReadiness}
                      </Badge>
                    </td>
                    <td className="px-6 py-4.5 text-sm whitespace-nowrap text-muted">
                      {formatTimestamp(entry.timestamp)}
                    </td>
                    <td className="px-6 py-4.5">
                      <Badge variant="info" dot>
                        {entry.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredLedger.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-surface-1">
            <svg className="w-10 h-10 text-slate-300 dark:text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-sm font-medium text-secondary">
              No matching records found.
            </p>
            <p className="text-xs max-w-xs text-muted">
              Adjust your search keywords or priority filter queries.
            </p>
          </div>
        )}
      </section>

      {/* Primary CTA */}
      <div>
        <Button
          id="ledger-submit-incident-btn"
          variant="primary"
          onClick={() => navigate('/submit')}
        >
          Report an Incident
        </Button>
      </div>
    </>
  );
}
