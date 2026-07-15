const fs = require('fs');
let c = fs.readFileSync('client/src/pages/CitizenPortal.tsx', 'utf8');
c = c.replace('import type { DashboardState, PriorityIncident, TimelineEvent, DecisionSummary }', 'import type { DashboardState }');
c = c.replace(/maxWidth="5xl"/g, '');
fs.writeFileSync('client/src/pages/CitizenPortal.tsx', c);
