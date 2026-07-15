const fs = require('fs');
const file = 'client/src/pages/DecisionPage.tsx';
const content = fs.readFileSync(file, 'utf8');

const startStr = '<div className="flex flex-col gap-6 animate-scale-in">';
const endStr = '          </div>\n        )}\n      </div>\n\n      <footer';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr, startIdx);

if (startIdx === -1 || endIdx === -1) {
    console.log("Could not find boundaries");
    process.exit(1);
}

const replacement = `          <div className="flex flex-col gap-6 animate-scale-in">
            {decisionRecord.analysis.source === 'fallback' && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-250 rounded-xl text-amber-900 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-100 text-sm font-semibold leading-relaxed" role="alert">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-450 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>
                  AI-assisted analysis was temporarily unavailable. Your report was processed using our rule-based incident understanding to ensure uninterrupted service.
                </span>
              </div>
            )}

            {/* 1. Recommendation, 2. Priority, 3. Readiness */}
            <Card variant="default" padding="lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Recommended Action
                  </span>
                  <h3 className="text-2xl font-bold mt-1 font-display text-primary">
                    {decisionRecord.decision.recommendation}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={getPriorityBadgeVariant(decisionRecord.decision.priority)} dot>
                    {decisionRecord.decision.priority} Priority
                  </Badge>
                  <Badge variant={getReadinessBadgeVariant(decisionRecord.decision.decisionReadiness)}>
                    Readiness: {decisionRecord.decision.decisionReadiness}
                  </Badge>
                </div>
              </div>

              <div className="bg-surface-2 p-5 rounded-lg border border-line flex flex-col md:flex-row gap-6 items-start justify-between">
                <div className="w-full md:w-1/2 flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted font-semibold uppercase tracking-wider">Confidence & Readiness Quotient</span>
                    <span className="text-sm text-primary-600 dark:text-primary-400 font-bold">
                      {getReadinessPercentage(decisionRecord.decision.decisionReadiness)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-4 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: \`\${getReadinessPercentage(decisionRecord.decision.decisionReadiness)}%\` }}
                    />
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Calculated from real-time community report ingestion, operational knowledge enrichment parameters, and decision framework rulesets.
                  </p>
                </div>

                <div className="w-full md:w-1/2 bg-surface-1 border border-line-strong p-4 rounded-lg flex flex-col gap-2">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Readiness Evaluation Checklist</span>
                  <ul className="flex flex-col gap-1.5 text-xs text-secondary">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{isFallback ? 'Rule-Based Incident Understanding' : 'AI Incident Understanding'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Knowledge Context Enrichment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{decisionRecord.decision.evidence.length} Evidence Factors Evaluated</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Deterministic Decision Rules Applied</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 4. Decision Explanation */}
            <Card variant="default" padding="lg">
              <h3 className="text-sm font-bold text-secondary font-display border-b border-line pb-2 mb-4">
                Executive Reasoning & Public Explanation
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Citizen Incident Summary
                  </h4>
                  <p className="text-sm text-secondary leading-relaxed bg-surface-2 p-4 rounded-lg border border-line">
                    {decisionRecord.analysis.summary || 'No summary text available.'}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Decision Pipeline Explanation
                  </h4>
                  <p className="text-sm text-secondary leading-relaxed bg-surface-3 p-4 rounded-lg border border-line-strong">
                    {decisionRecord.decision.explanation}
                  </p>
                </div>
              </div>
            </Card>

            {/* 5. Evidence (Evidence Pipeline + Safety Hazards) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card variant="default" padding="lg" className="h-full">
                  <h3 className="text-sm font-bold text-secondary font-display border-b border-line pb-2 mb-4 flex items-center gap-2">
                    <CheckShieldIcon />
                    <span>Evidence Pipeline Ingestion & Influence Signals</span>
                  </h3>

                  <div className="relative border-l border-line pl-6 ml-3 flex flex-col gap-8">
                    {decisionRecord.decision.evidence.map((item, index) => {
                      const factorMeta = getFactorMeta(item.factor);
                      const influence = getEvidenceInfluence(item.factor, item.value);

                      const trendColors = {
                        up: 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/20',
                        down: 'text-rose-500 bg-rose-50/50 dark:bg-rose-950/20 border-rose-500/20',
                        neutral: 'text-muted bg-surface-2 border-line',
                      };

                      return (
                        <div key={index} className="relative group animate-fade-in">
                          <span className="absolute -left-[38px] top-0.5 bg-surface-2 border border-line-strong w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-150 group-hover:border-primary-500">
                            {factorMeta.icon}
                          </span>

                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-semibold text-primary group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150">
                                {factorMeta.title}
                              </h4>

                              <Badge variant={item.source === 'analysis' ? 'primary' : 'info'}>
                                {item.source === 'analysis' ? 'AI Analysis' : 'Knowledge Context'}
                              </Badge>

                              {item.weight !== undefined && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-surface-3 border border-line text-muted">
                                  Weight: {item.weight}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                              <p className="text-xs text-muted leading-relaxed">
                                Resolved value: <span className="text-secondary font-medium font-mono bg-surface-3 px-1.5 py-0.5 rounded-lg border border-line">{item.value}</span>
                              </p>

                              <div className={\`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 \${trendColors[influence.trend]}\`}>
                                {influence.text}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card variant="default" padding="lg" className="h-full flex flex-col justify-start">
                  <div>
                    <h3 className="text-sm font-bold text-secondary font-display border-b border-line pb-2 mb-4">
                      Identified Safety Hazards
                    </h3>
                    {decisionRecord.analysis.possibleHazards && decisionRecord.analysis.possibleHazards.length > 0 ? (
                      <div className="flex flex-col gap-2.5">
                        {decisionRecord.analysis.possibleHazards.map((hazard, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2.5 p-3 rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20 text-xs font-semibold text-amber-800 dark:text-amber-200 transition-colors"
                          >
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" aria-hidden="true" />
                            <span>{hazard}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted">No immediate hazards identified by the engine.</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            {/* 6. AI Pipeline & 7. Timeline */}
            <div className="grid grid-cols-1 gap-6">
              {/* Timeline / Decision Intelligence Pipeline */}
              <Card variant="glass" padding="lg">
                <div>
                  <h3 className="text-sm font-bold text-secondary font-display border-b border-line pb-2 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span>Timeline: Decision Intelligence Pipeline</span>
                  </h3>

                  <div className="hidden md:grid grid-cols-6 relative gap-4">
                    <div className="absolute top-6 left-[8.33%] right-[8.33%] h-0.5 bg-line pointer-events-none z-0">
                      <div className="h-full w-full bg-gradient-to-r from-primary-500 via-emerald-500 to-emerald-400 rounded-full" />
                    </div>

                    {steps.map((step) => (
                      <div key={step.id} className="flex flex-col items-center text-center relative z-10 group">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center border border-decision-500 bg-surface-1 text-decision-500 transition-all duration-200 group-hover:bg-decision-50 dark:group-hover:bg-decision-950">
                          {step.icon}
                        </div>
                        <h4 className="text-xs font-semibold mt-2.5 group-hover:text-decision-600 dark:group-hover:text-decision-400 transition-colors duration-150 text-primary">
                          {step.label}
                        </h4>
                        <p className="text-[10px] mt-1 max-w-[130px] leading-relaxed text-muted">
                          {step.description}
                        </p>
                        <div className="mt-1.5 text-[9px] font-semibold text-decision-600 dark:text-decision-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-decision-500 inline-block" />
                          Done
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex md:hidden flex-col relative pl-4 border-l-2 border-emerald-500/40 gap-6 ml-4 py-2">
                    {steps.map((step) => (
                      <div key={step.id} className="relative flex gap-4 group">
                        <div className="absolute -left-[25px] top-0.5 w-6 h-6 rounded-full border border-decision-500 bg-surface-1 text-decision-500 flex items-center justify-center text-xs">
                          <div className="scale-75 flex items-center justify-center">
                            {step.icon}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-primary">
                              {step.label}
                            </h4>
                            <span className="text-[9px] font-semibold text-decision-600 dark:text-decision-400">
                              Done
                            </span>
                          </div>
                          <p className="text-[10px] mt-0.5 text-muted">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Recommendation Flow / Influence Engine */}
              <Card variant="glass" padding="lg">
                <div>
                  <h3 className="text-sm font-bold text-secondary font-display border-b border-line pb-2 mb-4">
                    Recommendation Flow: Influence Engine Mapping
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch relative">
                    <div className="bg-surface-2 p-4 rounded-lg border border-line flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Ingested Telemetry Inputs</span>
                        <h4 className="text-sm font-bold text-primary mt-1">Weighted Evidence Signals</h4>
                      </div>
                      <div className="mt-4 flex flex-col gap-1 text-muted text-xs">
                        <span>• {decisionRecord.decision.evidence.filter(e => e.source === 'analysis').length} Report inputs ingested</span>
                        <span>• {decisionRecord.decision.evidence.filter(e => e.source === 'context').length} Knowledge contexts enriched</span>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center justify-center pointer-events-none" aria-hidden="true">
                      <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <div className="flex md:hidden items-center justify-center py-1" aria-hidden="true">
                      <svg className="w-5 h-5 text-primary-500 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>

                    <div className="bg-primary-50/50 dark:bg-primary-950/10 p-4 rounded-lg border border-primary-200 dark:border-primary-800/40 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider">Resolution Mapping</span>
                        <h4 className="text-sm font-bold text-primary mt-1">Rule Triage Output</h4>
                      </div>
                      <div className="mt-4 flex flex-col gap-1.5 text-secondary text-xs">
                        <div className="flex justify-between items-center">
                          <span>Computed Priority:</span>
                          <span className="font-bold text-primary">{decisionRecord.decision.priority}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Confidence Readiness:</span>
                          <span className="font-bold text-primary">{decisionRecord.decision.decisionReadiness}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Alternative Actions */}
              <Card variant="default" padding="lg">
                <h3 className="text-sm font-bold text-secondary font-display border-b border-line pb-2 mb-4">
                  Alternative Actions Considered
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {decisionRecord.decision.alternatives.map((alt, index) => (
                    <div
                      key={index}
                      className="p-3.5 bg-surface-3 rounded-lg border border-line text-xs text-secondary leading-relaxed"
                    >
                      {alt}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* 8. Technical Metadata (Telemetry Metrics) */}
            <Card variant="default" padding="lg" className="flex flex-col gap-5 h-full">
              <h3 className="text-md font-bold text-secondary font-display border-b border-line pb-2 mb-1">
                Technical Metadata: Telemetry Metrics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-muted font-semibold uppercase tracking-wider block mb-1">
                    Issue Type
                  </span>
                  <p className="text-sm font-semibold text-primary bg-surface-3 px-3 py-2 rounded-lg border border-line">
                    {decisionRecord.analysis.issueType || 'Unknown'}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-muted font-semibold uppercase tracking-wider block mb-1">
                    Affected Asset
                  </span>
                  <p className="text-sm font-semibold text-primary bg-surface-3 px-3 py-2 rounded-lg border border-line">
                    {decisionRecord.analysis.affectedAsset || 'None Identified'}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-muted font-semibold uppercase tracking-wider block mb-1">
                    Severity Level
                  </span>
                  <div className="bg-surface-3 px-3 py-2 rounded-lg border border-line">
                    <span className="text-sm font-semibold text-primary">
                      {decisionRecord.analysis.severity || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted font-semibold uppercase tracking-wider block mb-1">
                    Urgency Threshold
                  </span>
                  <div className="bg-surface-3 px-3 py-2 rounded-lg border border-line">
                    <span className="text-sm font-semibold text-primary">
                      {decisionRecord.analysis.urgency || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

`;

const newContent = content.substring(0, startIdx) + replacement + content.substring(endIdx);
fs.writeFileSync(file, newContent, 'utf8');
console.log('Reordered successfully');
