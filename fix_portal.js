const fs = require('fs');
let content = fs.readFileSync('client/src/pages/CitizenPortal.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync('client/src/pages/CitizenPortal.tsx', content);
