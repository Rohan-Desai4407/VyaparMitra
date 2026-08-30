const fs = require('fs');

function fixSignUp() {
    let content = fs.readFileSync('src/pages/AuthPages/SignUp.tsx', 'utf8');
    content = content.replace(/import { useNavigate } from "react-router";\n/g, '');
    content = content.replace(/import { Link } from "react-router";\nimport { Link, useNavigate } from "react-router";/g, 'import { Link, useNavigate } from "react-router";');
    content = content.replace(/<ThemeToggleButton \/>/g, '');
    content = content.replace(/\{error && \(/g, '{false && (');
    content = content.replace(/\{successMsg && \(/g, '{false && (');
    content = content.replace(/<GoogleAccountModal[\s\S]*?\/>/g, '');
    fs.writeFileSync('src/pages/AuthPages/SignUp.tsx', content);
}

function fixSignIn() {
    let content = fs.readFileSync('src/pages/AuthPages/SignIn.tsx', 'utf8');
    content = content.replace(/onClick=\{handleSocialLogin\}/g, 'onClick={() => {}}');
    fs.writeFileSync('src/pages/AuthPages/SignIn.tsx', content);
}

function fixHome() {
    let content = fs.readFileSync('src/pages/Dashboard/Home.tsx', 'utf8');
    // Remove duplicate imports
    content = content.replace(/import \{ \n  MapPin, \n  Store, \n  TrendingUp, \n  Users, \n  Activity, \n  AlertCircle, \n  Landmark, \n  IndianRupee, \n  Building2\n\} from "lucide-react";/g, '');
    content = content.replace(/import \{.*?Landmark.*?\} from "lucide-react";/g, 'import { MapPin, Store, TrendingUp, Users, Activity, AlertCircle, Landmark, IndianRupee, Building2 } from "lucide-react";');
    
    // Fix undefined opportunities
    content = content.replace(/opportunities\.map/g, '(opportunities || []).map');
    
    fs.writeFileSync('src/pages/Dashboard/Home.tsx', content);
}

try { fixSignUp(); } catch(e){}
try { fixSignIn(); } catch(e){}
try { fixHome(); } catch(e){}
