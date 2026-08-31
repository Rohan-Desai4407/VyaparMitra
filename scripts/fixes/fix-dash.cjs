const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'SchemeRouter.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the mangled dash
content = content.replace(/&#8377;1\.40L&#8377;50L/g, '&#8377;1.40L - &#8377;50L');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Dash fixed in SchemeRouter.");
