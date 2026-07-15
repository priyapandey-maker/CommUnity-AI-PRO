import { useNavigate } from 'react-router-dom';
import { Navbar, Button, Badge } from '@/components';

function ShieldIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function UsersIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BrainIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  );
}

function GlobeIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

function FileTextIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function HeartIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

const HOW_IT_WORKS = [
  {
    icon: <UsersIcon className="w-5 h-5" />,
    title: 'Citizen Reporting',
    desc: 'Residents easily submit local issues, maintenance requests, or safety concerns directly to the municipality.',
    color: 'text-brand-600 dark:text-brand-400',
    bg: 'bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800'
  },
  {
    icon: <BrainIcon className="w-5 h-5" />,
    title: 'AI Understanding',
    desc: 'Our intelligence engine categorizes, prioritizes, and routes the report to the correct department instantly.',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800'
  },
  {
    icon: <ShieldIcon className="w-5 h-5" />,
    title: 'Authority Decision Support',
    desc: 'Municipal leaders receive data-backed recommendations to allocate resources effectively and act decisively.',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'
  },
  {
    icon: <FileTextIcon className="w-5 h-5" />,
    title: 'Transparent Explanations',
    desc: 'Every decision is logged on a public ledger with clear rationale, fostering trust between citizens and government.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
  },
  {
    icon: <HeartIcon className="w-5 h-5" />,
    title: 'Community Impact',
    desc: 'Together, we build safer, more responsive, and highly connected communities through shared intelligence.',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-surface transition-colors duration-200">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative px-6 pt-24 pb-20 lg:pt-32 lg:pb-28 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/40 via-surface to-surface dark:from-brand-900/20 dark:via-surface dark:to-surface"></div>
          
          <Badge variant="primary" className="mb-8 px-4 py-1.5 text-sm uppercase tracking-widest font-semibold">
            <GlobeIcon className="w-4 h-4 mr-2 inline" />
            Civic Intelligence Platform
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-primary font-display max-w-4xl">
            Empowering <span className="text-brand-600 dark:text-brand-400">Communities</span> Through Better Decisions
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-secondary">
            This is a platform for citizens and authorities to make better community decisions together. Harnessing decision intelligence to resolve local issues transparently and effectively.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Button
              id="landing-submit-incident-btn"
              size="lg"
              variant="primary"
              className="w-full sm:w-auto px-8 shadow-lg shadow-brand-500/25"
              onClick={() => navigate('/submit')}
            >
              Report an Incident
            </Button>
            <Button
              id="landing-explore-btn"
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto px-8"
              onClick={() => navigate('/ledger')}
            >
              Explore Platform
            </Button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-surface-1 border-y border-line py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-primary font-display mb-4">How CommUnity AI Works</h2>
              <p className="text-secondary leading-relaxed text-lg">
                Bridging the gap between civic reporting and municipal action through intelligent, transparent workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((feature, idx) => (
                <div 
                  key={feature.title} 
                  className={`p-8 rounded-2xl border bg-surface hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                    idx >= 3 && HOW_IT_WORKS.length % 3 !== 0 && 'lg:col-span-1.5' 
                  }`}
                  style={{ gridColumn: idx >= 3 && HOW_IT_WORKS.length % 3 !== 0 ? 'span 1.5' : undefined }}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${feature.bg} ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3 font-display">
                    {feature.title}
                  </h3>
                  <p className="text-secondary leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Fix grid centering for bottom row if uneven */}
            <div className="hidden lg:grid grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
              {HOW_IT_WORKS.slice(3).map((feature) => (
                <div 
                  key={feature.title} 
                  className="p-8 rounded-2xl border border-line bg-surface hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${feature.bg} ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3 font-display">
                    {feature.title}
                  </h3>
                  <p className="text-secondary leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Hide original bottom row items on lg screens to use the centered row above */}
            <style>{`
              @media (min-width: 1024px) {
                .grid > div:nth-child(4), .grid > div:nth-child(5) {
                  display: none;
                }
              }
            `}</style>
          </div>
        </section>
        
        {/* Trust Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto text-center">
          <ShieldIcon className="w-12 h-12 mx-auto text-brand-500 mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 font-display">Committed to Civic Trust</h2>
          <p className="text-secondary leading-relaxed mb-8">
            All reports, AI decisions, and authority actions are cryptographically sealed in an immutable decision ledger. We believe that public transparency is the foundation of a thriving, responsive community.
          </p>
          <Button variant="secondary" onClick={() => navigate('/ledger')}>
            View the Public Register
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm border-t border-line text-muted bg-surface-1">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-bold text-primary tracking-wide">CommUnity AI</div>
          <div>Public transparency infrastructure. Authorized decision register.</div>
        </div>
      </footer>
    </div>
  );
}
