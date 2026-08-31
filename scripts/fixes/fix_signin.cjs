const fs = require('fs');
let signIn = fs.readFileSync('src/pages/AuthPages/SignIn.tsx', 'utf8');
signIn = signIn.replace(/const handleSocialLogin = \(\) => \{\};/g, 'const handleSocialLogin = (provider: string) => {};');
fs.writeFileSync('src/pages/AuthPages/SignIn.tsx', signIn);
