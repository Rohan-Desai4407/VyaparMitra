import re

with open('src/pages/AuthPages/SignIn.tsx', 'r', encoding='utf-8') as f:
    signin_content = f.read()

with open('src/pages/AuthPages/ForgotPassword.tsx', 'r', encoding='utf-8') as f:
    forgot_content = f.read()

# Extract SignIn return statement layout
return_match = re.search(r'(return\s*\(\s*<div className="min-h-screen.*?)(<div className="text-center mb-8">)', signin_content, re.DOTALL)
prefix = return_match.group(1)

# Extract SignIn footer
footer_match = re.search(r'(\{/\* FOOTER \*/\}.*?)(\{/\* Google)', signin_content, re.DOTALL)
suffix = '\n        </div>\n      </div>\n\n      ' + footer_match.group(1) + '    </div>\n  );\n}'

# Extract ForgotPassword form logic and state
form_match = re.search(r'(<div className="mb-8">.*?<div className="mt-8 text-center">)', forgot_content, re.DOTALL)
form_content = form_match.group(1)

# Modify forgot password form content slightly to match styling if needed
form_content = form_content.replace('bg-emerald-600', 'bg-[#0A4222] dark:bg-emerald-600')
form_content = form_content.replace('hover:bg-emerald-700', 'hover:bg-green-900 dark:hover:bg-emerald-500')
form_content = form_content.replace('text-gray-900', 'text-gray-900 dark:text-white')
form_content = form_content.replace('text-gray-700', 'text-gray-700 dark:text-gray-300')
form_content = form_content.replace('text-gray-600', 'text-gray-500 dark:text-gray-400')
form_content = form_content.replace('bg-gray-50 border border-gray-200', 'bg-gray-50/50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white')

imports = """import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Shield, CheckCircle2 } from 'lucide-react';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { ThemeToggleButton } from '../../components/common/ThemeToggleButton';
import { useTranslation } from 'react-i18next';
"""

# Get everything before return
# Need a better regex that gets everything before `return (`
logic_match = re.search(r'(export default function ForgotPassword\(\) \{.*?)(\n\s*return\s*\(\s*<div)', forgot_content, re.DOTALL)
logic = logic_match.group(1)

new_content = imports + '\n' + logic + '\n  const { t } = useTranslation();\n\n  ' + prefix + form_content + '\n                <Link to="/signin" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300">\n                  Back to Sign In\n                </Link>\n              </div>\n            </div>' + suffix

with open('src/pages/AuthPages/ForgotPassword.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Done')
