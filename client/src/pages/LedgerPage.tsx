import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Badge, Spinner } from '@/components';
import { getLedger, LedgerEntry, parseApiError } from '@/services';

export default function LedgerPage() {
  const navigate = useNavigate();
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchLedger();
  }, []);

  // Calculate live stats
  const totalDecisions = ledger.length;
  const criticalCount = ledger.filter(e => e.priority === 'CRITICAL' || e.priority === 'HIGH').length;
  const activeCount = ledger.filter(e => e.status === 'received').length;

  const LEDGER_STATS = [
    { label: 'Total Decisions', value: totalDecisions.toString(), icon: '⚖️' },
    { label: 'High Priority', value: criticalCount.toString(), icon: '🚨' },
    { label: 'Active Reports', value: activeCount.toString(), icon: '📋' },
    { label: 'Avg. Readiness', value: totalDecisions > 0 ? 'HIGH' : '—', icon: '⏱️' },
  ];

  // Helper badge coloring
  const getPriorityBadgeVariant = (p: string) => {
    const priority = p.toUpperCase();
    if (priority === 'CRITICAL' || priority === 'HIGH') return 'error';
    if (priority === 'MEDIUM') return 'warning';
    return 'default';
  };

  const getReadinessBadgeVariant = (r: string) => {
    const readiness = r.toUpperCase();
    if (readiness === 'HIGH') return 'success';
    if (readiness === 'MEDIUM') return 'warning';
    return 'default';
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  return (
    <>
      <PageHeader
        badge="Transparency Ledger"
        title="Decision Ledger"
        subtitle="A complete, auditable record of every AI-assisted community decision. All entries are immutable and publicly accessible."
      />

      {/* Stats row */}
      <section aria-label="Ledger statistics" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {LEDGER_STATS.map(({ label, value, icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 hover:border-indigo-800 transition-colors duration-200"
          >
            <span className="text-xl mb-2 block">{icon}</span>
            <p className="text-2xl font-extrabold text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </section>

      {/* Table / List Container */}
      <section aria-label="Ledger entries" className="rounded-2xl border border-gray-800 bg-gray-900/50 overflow-hidden mb-8">
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spinner size="lg" color="primary" label="Loading decision ledger..." />
            <p className="text-xs text-gray-500 font-medium">Reading public ledger...</p>
          </div>
        )}

        {/* Error Banner */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm font-medium text-red-400">Failed to load ledger records</p>
            <p className="text-xs text-gray-600 max-w-sm">{error}</p>
            <Button variant="secondary" onClick={fetchLedger}>
              Retry Fetch
            </Button>
          </div>
        )}

        {/* Data Present Table */}
        {!loading && !error && ledger.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" role="table">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/80">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Incident</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Priority</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Recommendation</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Readiness</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {ledger.map((entry) => (
                  <tr
                    key={entry.incidentId}
                    onClick={() => navigate(`/decision/${entry.incidentId}`)}
                    className="hover:bg-indigo-950/10 cursor-pointer transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-200">
                        {entry.issueType || 'Unknown Issue'}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        ID: #{entry.incidentId.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getPriorityBadgeVariant(entry.priority)}>
                        {entry.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {entry.recommendation}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getReadinessBadgeVariant(entry.decisionReadiness)}>
                        {entry.decisionReadiness}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                      {formatTimestamp(entry.timestamp)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 capitalize bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-900/30">
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && ledger.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <span className="text-4xl">📭</span>
            <p className="text-sm font-medium text-gray-400">No decisions recorded yet.</p>
            <p className="text-xs text-gray-600">Entries will appear here once incidents are submitted and analysed.</p>
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
          Submit an Incident
        </Button>
      </div>
    </>
  );
}
