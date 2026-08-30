const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning old schema rules...");
  await prisma.schemeEligibilityRule.deleteMany({});
  await prisma.schemeFinancialRule.deleteMany({});
  await prisma.governmentScheme.deleteMany({});
  console.log("Seeding schemes...");

  // 1. MICRO FINANCE
  const microScheme = await prisma.governmentScheme.create({
    data: {
      schemeCode: 'MICRO',
      name: 'Micro Finance Scheme',
      officialName: 'Prime Minister Micro Enterprise Scheme (PMMES)',
      ministry: 'Ministry of MSME',
      department: 'Department of Micro Enterprises',
      description: 'A credit-linked subsidy program for setting up new micro-enterprises in rural and semi-urban areas.',
      schemeType: 'CREDIT_LINKED_SUBSIDY',
      active: true,
      officialSourceUrl: 'https://msme.gov.in/micro-finance',
      sourceDate: new Date('2025-01-01'),
      lastVerifiedAt: new Date(),
    }
  });

  await prisma.schemeFinancialRule.create({
    data: {
      schemeId: microScheme.id,
      minimumProjectCost: 0,
      maximumProjectCost: 140000,
      minimumLoan: 0,
      maximumLoan: 140000,
      marginPercentage: 5,
      maximumFinancingPercentage: 95,
      subsidyPercentage: 25,
      maximumSubsidy: 35000,
      interestRate: '6.5',
      interestRateType: 'FIXED',
      tenureMonths: 36,
      moratoriumMonths: 3,
      collateralRequired: 'NO',
      guaranteeAvailable: true,
      guaranteePercentage: 85,
      source: 'MSME Guidelines 2025'
    }
  });

  await prisma.schemeEligibilityRule.createMany({
    data: [
      { schemeId: microScheme.id, ruleType: 'AGE', field: 'age', operator: 'GTE', value: '18', source: 'MSME Portal' },
      { schemeId: microScheme.id, ruleType: 'BUSINESS_TYPE', field: 'isNewBusiness', operator: 'EQ', value: 'true', source: 'MSME Portal' }
    ]
  });

  // 2. TERM LOAN
  const termScheme = await prisma.governmentScheme.create({
    data: {
      schemeCode: 'TERM',
      name: 'Term Loan Scheme',
      officialName: 'Stand-Up India Enterprise Loan',
      ministry: 'Ministry of Finance',
      department: 'Department of Financial Services',
      description: 'Facilitates bank loans between 1.4 Lakh and 50 Lakhs for setting up new enterprises.',
      schemeType: 'TERM_LOAN',
      active: true,
      officialSourceUrl: 'https://standupmitra.in',
      sourceDate: new Date('2025-02-15'),
      lastVerifiedAt: new Date(),
    }
  });

  await prisma.schemeFinancialRule.create({
    data: {
      schemeId: termScheme.id,
      minimumProjectCost: 140000,
      maximumProjectCost: 5000000,
      minimumLoan: 100000,
      maximumLoan: 4500000,
      marginPercentage: 10,
      maximumFinancingPercentage: 90,
      subsidyPercentage: 15,
      maximumSubsidy: 500000,
      interestRate: '8.0',
      interestRateType: 'FLOATING',
      tenureMonths: 84,
      moratoriumMonths: 6,
      collateralRequired: 'CONDITIONAL',
      guaranteeAvailable: true,
      guaranteePercentage: 75,
      source: 'DFS Stand-Up Guidelines'
    }
  });

  await prisma.schemeEligibilityRule.createMany({
    data: [
      { schemeId: termScheme.id, ruleType: 'AGE', field: 'age', operator: 'GTE', value: '18', source: 'Stand-Up Portal' },
      { schemeId: termScheme.id, ruleType: 'BUSINESS_TYPE', field: 'isNewBusiness', operator: 'EQ', value: 'true', source: 'Stand-Up Portal' }
    ]
  });

  console.log("Schemes seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
