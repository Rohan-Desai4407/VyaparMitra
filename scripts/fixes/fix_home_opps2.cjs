const fs = require('fs');
let home = fs.readFileSync('src/pages/Dashboard/Home.tsx', 'utf8');

const oppCode = `
  const opportunities = [
    {
      rank: 1,
      name: input?.category || "Dairy",
      score: report?.viabilityScore || 85,
      demand: "HIGH",
      investment: \`₹\${(financials?.projectCost || 500000).toLocaleString("en-IN")}\`,
      competition: (market?.competitorDensity || "LOW").toUpperCase(),
    },
    {
      rank: 2,
      name: "Food Processing",
      score: (report?.viabilityScore || 85) - 3,
      demand: "HIGH",
      investment: \`₹\${Math.round((financials?.projectCost || 500000) * 1.1).toLocaleString("en-IN")}\`,
      competition: "MEDIUM",
    },
    {
      rank: 3,
      name: "Poultry",
      score: (report?.viabilityScore || 85) - 7,
      demand: "MEDIUM",
      investment: \`₹\${Math.round((financials?.projectCost || 500000) * 0.8).toLocaleString("en-IN")}\`,
      competition: "LOW",
    }
  ];
  return (
`;

home = home.replace(/return\s*\(\s*<>/, oppCode + '\n    <>');

fs.writeFileSync('src/pages/Dashboard/Home.tsx', home);
