const fs = require('fs');
const file = 'src/pages/FinancialPlanner.tsx';
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/â‚¹/g, '₹').replace(/â€“/g, '–');
fs.writeFileSync(file, data);
