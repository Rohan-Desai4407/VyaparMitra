const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'ProjectExpense', 'ProjectExpense.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all garbled rupees with HTML entity
// We know they precede certain strings like {totalCost or <input
content = content.replace(/[^\x00-\x7F]+(?=\{totalCost\.toLocaleString)/g, '&#8377;');
content = content.replace(/[^\x00-\x7F]+(?=\{subtotal\.toLocaleString)/g, '&#8377;');
content = content.replace(/[^\x00-\x7F]+(?=\{item\.amount\.toLocaleString)/g, '&#8377;');
content = content.replace(/[^\x00-\x7F]+(?=<input type="number" className="w-24)/g, '&#8377;');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Rupee symbols replaced with HTML entity.");
