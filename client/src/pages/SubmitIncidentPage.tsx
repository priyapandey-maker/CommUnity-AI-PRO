import { PageHeader } from '@/components';
import IncidentForm from '@/components/IncidentForm';

const STEPS = [
  { step: '1', text: 'Your report is received and timestamped.' },
  { step: '2', text: 'AI analyses the incident for severity and context.' },
  { step: '3', text: 'A decision is generated and published to the public ledger.' },
];

const TIPS = [
  'Be specific about the street, neighbourhood, or landmark.',
  'Describe the impact on safety or the community.',
  'Include a photo when possible — it improves analysis accuracy.',
  'Avoid including personal information in your description.',
];

export default function SubmitIncidentPage() {
  return (
    <>
      <PageHeader
        badge="Incident Reporting"
        title="Report a Community Issue"
        subtitle="Submissions are audited using localized evidence to generate transparent public decisions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Form ─────────────────────────────────── */}
        <div className="lg:col-span-2">
          <IncidentForm />
        </div>

        {/* ── Sidebar ──────────────────────────────── */}
        <aside className="flex flex-col gap-4">

          {/* What happens next */}
          <div className="rounded-lg border border-line bg-surface-1 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3 text-muted">
              What happens next
            </h2>
            <ol className="flex flex-col gap-3" role="list">
              {STEPS.map(({ step, text }) => (
                <li key={step} className="flex gap-2.5">
                  <span
                    className="w-5.5 h-5.5 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    {step}
                  </span>
                  <p className="text-xs leading-relaxed text-secondary">
                    {text}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          <div className="rounded-lg border border-line bg-surface-2 p-4">
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-2.5 text-primary-700 dark:text-primary-400"
            >
              Tips for a better report
            </h2>
            <ul className="flex flex-col gap-2 text-xs">
              {TIPS.map((tip) => (
                <li key={tip} className="flex gap-2 text-secondary">
                  <svg
                    className="w-3.5 h-3.5 text-decision-600 dark:text-decision-400 shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
