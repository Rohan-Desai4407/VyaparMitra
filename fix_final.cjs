const fs = require('fs');

let signUp = fs.readFileSync('src/pages/AuthPages/SignUp.tsx', 'utf8');
signUp = signUp.replace(/const \[mobile, setMobile\] = useState\(''\);/, "const [mobile, setMobile] = useState('');\n  const [error, setError] = useState('');\n  const [successMsg, setSuccessMsg] = useState('');");
fs.writeFileSync('src/pages/AuthPages/SignUp.tsx', signUp);

let signIn = fs.readFileSync('src/pages/AuthPages/SignIn.tsx', 'utf8');
signIn = signIn.replace(/const navigate = useNavigate\(\);/, "const navigate = useNavigate();\n  const handleSocialLogin = () => {};");
fs.writeFileSync('src/pages/AuthPages/SignIn.tsx', signIn);
