const fs = require('fs');
let signUp = fs.readFileSync('src/pages/AuthPages/SignUp.tsx', 'utf8');
signUp = signUp.replace(/import\s*\{\s*useNavigate\s*\}\s*from\s*['"]react-router['"];\r?\n?/g, '');
fs.writeFileSync('src/pages/AuthPages/SignUp.tsx', signUp);
