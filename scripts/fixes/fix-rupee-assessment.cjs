const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'BusinessAssessmentForm.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace corrupted rupee symbol with HTML entity
content = content.replace(/[^\x00-\x7F]+(?=<\/span>)/g, '&#8377;'); // Inside the span before the input
content = content.replace(/[^\x00-\x7F]+(?=\{preview\.feasibleProjectCost)/g, '&#8377;'); // Inside the text
content = content.replace(/[^\x00-\x7F]+(?=\{preview\.potentialFinancing)/g, '&#8377;'); // Inside the text

fs.writeFileSync(filePath, content, 'utf8');
console.log("Rupee symbols fixed.");
