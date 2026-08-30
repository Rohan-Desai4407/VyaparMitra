const fs = require('fs');
let home = fs.readFileSync('src/pages/Dashboard/Home.tsx', 'utf8');

const oppCode = `
  const opportunities = [
    {
      rank: 1,
      name: input.category,
      score: report.viabilityScore,
      demand: "HIGH",
      investment: \`₹\${financials.projectCost.toLocaleString("en-IN")}\`,
      competition: market.competitorDensity.toUpperCase(),
    },
    {
      rank: 2,
      name: "Food Processing",
      score: report.viabilityScore - 3,
      demand: "HIGH",
      investment: \`₹\${Math.round(financials.projectCost * 1.1).toLocaleString("en-IN")}\`,
      competition: "MEDIUM",
    },
    {
      rank: 3,
      name: "Poultry",
      score: report.viabilityScore - 7,
      demand: "MEDIUM",
      investment: \`₹\${Math.round(financials.projectCost * 0.8).toLocaleString("en-IN")}\`,
      competition: "LOW",
    }
  ];
`;

home = home.replace(/return \(\s*<>\s*<div className="flex flex-col/g, oppCode + '\n  return (\n    <>\n      <div className="flex flex-col');

fs.writeFileSync('src/pages/Dashboard/Home.tsx', home);
