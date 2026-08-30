const fs = require('fs');
const filePath = 'src/pages/FinancialPlanner.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Remove corrupted emoji from the button line
content = content.replace(
  /Launch What-if Simulator [^\n<]*/,
  '<SlidersHorizontal className="w-3.5 h-3.5" />\n              Launch What-if Simulator'
);

fs.writeFileSync(filePath, content);
console.log('Done!');
