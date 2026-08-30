const fs = require('fs');
const file = 'src/layout/AppHeader.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\)\s*\}\s*<\/div>\s*<\/div>/, '</form>\n          </div>\n        </div>');

fs.writeFileSync(file, content);
