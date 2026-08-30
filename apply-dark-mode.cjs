const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'ProjectExpense', 'ProjectExpense.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
    { from: /bg-white/g, to: 'bg-white dark:bg-gray-800 dark:border-gray-700' },
    { from: /text-gray-800/g, to: 'text-gray-800 dark:text-gray-100' },
    { from: /text-gray-700/g, to: 'text-gray-700 dark:text-gray-200' },
    { from: /text-gray-600/g, to: 'text-gray-600 dark:text-gray-300' },
    { from: /text-gray-500/g, to: 'text-gray-500 dark:text-gray-400' },
    { from: /text-gray-400/g, to: 'text-gray-400 dark:text-gray-500' },
    { from: /text-blue-800/g, to: 'text-blue-800 dark:text-blue-400' },
    { from: /text-blue-700/g, to: 'text-blue-700 dark:text-blue-400' },
    { from: /text-blue-600/g, to: 'text-blue-600 dark:text-blue-400' },
    { from: /bg-blue-50(?!.*dark:bg-blue-900)/g, to: 'bg-blue-50 dark:bg-blue-900/30' },
    { from: /bg-gray-50\/50/g, to: 'bg-gray-50/50 dark:bg-gray-700/30' },
    { from: /bg-gray-50(?!.*dark:bg-gray-700)/g, to: 'bg-gray-50 dark:bg-gray-700/50' },
    { from: /hover:bg-gray-50\/50/g, to: 'hover:bg-gray-50/50 dark:hover:bg-gray-700/30' },
    { from: /hover:bg-gray-50(?!.*dark:hover:bg-gray-600)/g, to: 'hover:bg-gray-50 dark:hover:bg-gray-600' },
    { from: /border-gray-300/g, to: 'border-gray-300 dark:border-gray-600' },
    { from: /border-gray-200/g, to: 'border-gray-200 dark:border-gray-700' },
    { from: /border-gray-100/g, to: 'border-gray-100 dark:border-gray-700' },
    { from: /border-gray-50(?!.*dark:border-gray-700)/g, to: 'border-gray-50 dark:border-gray-700' },
    { from: /border-blue-200/g, to: 'border-blue-200 dark:border-blue-800/50' }
];

// Clean up first if any dark: classes were already added
content = content.replace(/ dark:[a-z0-9-\/]+/g, '');

for (const rule of replacements) {
    content = content.replace(rule.from, rule.to);
}

content = content.replace(/<input\s+type="number"\s+className="([^"]+)"/g, (match, classes) => {
    if (!classes.includes('bg-')) {
        return '<input type="number" className="' + classes + ' bg-transparent dark:bg-gray-700"';
    }
    return match;
});
content = content.replace(/<input\s+type="text"\s+placeholder="Expense Name"\s+className="([^"]+)"/g, (match, classes) => {
    if (!classes.includes('bg-')) {
        return '<input type="text" placeholder="Expense Name" className="' + classes + ' bg-transparent dark:bg-gray-700"';
    }
    return match;
});
content = content.replace(/<select\s+className="([^"]+)"/g, (match, classes) => {
    if (classes.includes('bg-white dark:bg-gray-800')) {
        return match; // already caught by global bg-white replace
    } else if (classes.includes('bg-white')) {
        return '<select className="' + classes.replace('bg-white', 'bg-white dark:bg-gray-800') + '"';
    } else {
        return '<select className="' + classes + ' dark:bg-gray-800"';
    }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done applying dark mode classes!');
