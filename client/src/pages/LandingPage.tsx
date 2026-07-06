import { useNavigate } from 'react-router-dom';
import { Navbar, Button } from '@/components';

// ── Feature card icons (SVG, Material-style) ──────────────

function AnalysisIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function DecisionIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function LedgerIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

// ── Feature data ──────────────────────────────────────────

const FEATURES = [
  {
    icon: <AnalysisIcon />,
    iconColor: 'text-primary-600 dark:text-primary-400',
    iconBg: 'bg-primary-50 dark:bg-primary-950',
    title: 'Fact-Based Enrichment',
    desc: 'Incident reports are evaluated using localized telemetry signals, impact severity rules, and knowledge base guidelines.',
  },
  {
    icon: <DecisionIcon />,
    iconColor: 'text-decision-600 dark:text-decision-400',
    iconBg: 'bg-decision-50 dark:bg-decision-950',
    title: 'Deterministic Audit Trails',
    desc: 'Resolutions are generated through open, rule-based algorithms showing the exact evidence driving the outcome.',
  },
  {
    icon: <LedgerIcon />,
    iconColor: 'text-evidence-600 dark:text-evidence-400',
    iconBg: 'bg-evidence-50 dark:bg-evidence-950',
    title: 'Immutable Public Record',
    desc: 'All decisions are committed to an open-access ledger, preventing retroactive alterations or non-transparent changes.',
  },
] as const;

// ── Component ─────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-surface transition-colors duration-200">
      <Navbar />

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 pt-12 pb-10">
        <div className="text-center max-w-2xl">

          {/* Status badge / Civic Trust Indicator */}
          <span className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-700 bg-primary-50 border border-primary-200 rounded-lg dark:text-primary-300 dark:bg-primary-950 dark:border-primary-900 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-decision-500 inline-block" aria-hidden="true" />
            Official Municipal Accountability Portal
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3 text-primary">
            Public Incident Resolution &{' '}
            <span className="text-primary-600 dark:text-primary-400">Decision Register</span>
          </h1>

          <p className="text-base max-w-xl mx-auto mb-6 leading-relaxed text-secondary">
            Authorized municipal platform enabling transparent, evidence-based civic decisions.
            Submit local issues, track resolution pathways, and audit the immutable public record.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              id="landing-submit-incident-btn"
              size="md"
              variant="primary"
              onClick={() => navigate('/submit')}
            >
              Report an Incident
            </Button>
            <Button
              id="landing-view-ledger-btn"
              size="md"
              variant="secondary"
              onClick={() => navigate('/ledger')}
            >
              View Decision Ledger
            </Button>
          </div>

          {/* Trust Compliance Notice */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted font-medium border-t border-line/45 pt-4">
            <svg className="w-4 h-4 text-decision-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Fully compliant with public record access laws and governance transparency standards.</span>
          </div>

          {/* Feature strip */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {FEATURES.map(({ icon, iconColor, iconBg, title, desc }) => (
              <div
                key={title}
                className="rounded-lg p-4 border border-line bg-surface-1 transition-colors duration-150"
              >
                <span
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${iconBg} ${iconColor}`}
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <h2 className="text-xs font-semibold mb-1 text-primary uppercase tracking-wider">
                  {title}
                </h2>
                <p className="text-xs leading-relaxed text-secondary">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs border-t border-line text-muted">
        CommUnity AI — Public transparency infrastructure. Authorized decision register.
      </footer>
    </div>
  );
}
