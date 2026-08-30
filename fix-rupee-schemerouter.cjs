const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'SchemeRouter.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace corrupted rupee symbol with HTML entity
content = content.replace(/[^\x00-\x7F]+(?=1\.40L)/g, '&#8377;'); // Fix Up to ₹1.40L and ₹1.40L
content = content.replace(/[^\x00-\x7F]+(?=50L)/g, '&#8377;'); // Fix ₹50L
content = content.replace(/[^\x00-\x7F]+(?=10 Lakhs)/g, '&#8377;'); // Fix ₹10 Lakhs in the new section we just added
content = content.replace(/[^\x00-\x7F]+(?=\{financials)/g, '&#8377;'); // Fix ₹{financials.projectCost}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Rupee symbols fixed in SchemeRouter.");
