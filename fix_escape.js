const fs = require('fs');
let content = fs.readFileSync('client/src/pages/DecisionPage.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync('client/src/pages/DecisionPage.tsx', content);
