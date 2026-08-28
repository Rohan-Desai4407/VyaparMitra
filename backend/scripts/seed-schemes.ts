import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Government Schemes...');

  // 1. PMEGP
  await prisma.governmentScheme.upsert({
    where: { schemeCode: 'PMEGP' },
    update: {},
    create: {
      schemeCode: 'PMEGP',
      name: 'Prime Minister Employment Generation Programme',
      officialName: 'PMEGP',
      ministry: 'MSME',
      active: true,
      officialSourceUrl: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
      lastVerifiedAt: new Date(),
      financialRules: {
        create: {
          minimumProjectCost: 100000,
          maximumProjectCost: 5000000,
          marginPercentage: 0.10,
          maximumFinancingPercentage: 0.90,
          subsidyPercentage: 0.25,
          maximumSubsidy: 1250000,
          interestRate: '8.5',
          tenureMonths: 84,
          moratoriumMonths: 6,
          source: 'KVIC Official Guidelines',
        }
      }
    }
  });

  // 2. PMFME
  await prisma.governmentScheme.upsert({
    where: { schemeCode: 'PMFME' },
    update: {},
    create: {
      schemeCode: 'PMFME',
      name: 'PM Formalisation of Micro Food Processing Enterprises',
      officialName: 'PMFME',
      ministry: 'Food Processing Industries',
      active: true,
      officialSourceUrl: 'https://pmfme.mofpi.gov.in/',
      lastVerifiedAt: new Date(),
      financialRules: {
        create: {
          minimumProjectCost: 100000,
          maximumProjectCost: 3000000,
          marginPercentage: 0.10,
          maximumFinancingPercentage: 0.90,
          subsidyPercentage: 0.35,
          maximumSubsidy: 1000000,
          interestRate: '8.5',
          tenureMonths: 84,
          moratoriumMonths: 6,
          source: 'MOFPI Guidelines',
        }
      }
    }
  });

  // 3. PM MUDRA - Shishu
  await prisma.governmentScheme.upsert({
    where: { schemeCode: 'MUDRA_SHISHU' },
    update: {},
    create: {
      schemeCode: 'MUDRA_SHISHU',
      name: 'Pradhan Mantri Mudra Yojana - Shishu',
      officialName: 'PMMY Shishu',
      ministry: 'Finance',
      active: true,
      officialSourceUrl: 'https://www.mudra.org.in/',
      lastVerifiedAt: new Date(),
      financialRules: {
        create: {
          minimumProjectCost: 0,
          maximumProjectCost: 50000,
          marginPercentage: 0.0,
          maximumFinancingPercentage: 1.0,
          subsidyPercentage: 0,
          interestRate: '10.0',
          tenureMonths: 60,
          moratoriumMonths: 0,
          collateralRequired: 'No',
          source: 'MUDRA Portal',
        }
      }
    }
  });

  // 4. PM MUDRA - Kishore
  await prisma.governmentScheme.upsert({
    where: { schemeCode: 'MUDRA_KISHORE' },
    update: {},
    create: {
      schemeCode: 'MUDRA_KISHORE',
      name: 'Pradhan Mantri Mudra Yojana - Kishore',
      officialName: 'PMMY Kishore',
      ministry: 'Finance',
      active: true,
      lastVerifiedAt: new Date(),
      financialRules: {
        create: {
          minimumProjectCost: 50001,
          maximumProjectCost: 500000,
          marginPercentage: 0.10,
          maximumFinancingPercentage: 0.90,
          subsidyPercentage: 0,
          interestRate: '11.0',
          tenureMonths: 60,
          collateralRequired: 'No',
          source: 'MUDRA Portal',
        }
      }
    }
  });

  // 5. Stand-Up India
  await prisma.governmentScheme.upsert({
    where: { schemeCode: 'STANDUP_INDIA' },
    update: {},
    create: {
      schemeCode: 'STANDUP_INDIA',
      name: 'Stand-Up India Scheme',
      ministry: 'Finance',
      active: true,
      lastVerifiedAt: new Date(),
      financialRules: {
        create: {
          minimumProjectCost: 1000000,
          maximumProjectCost: 10000000,
          marginPercentage: 0.15,
          maximumFinancingPercentage: 0.85,
          subsidyPercentage: 0,
          interestRate: '10.0',
          tenureMonths: 84,
          moratoriumMonths: 18,
          collateralRequired: 'Required / CGFSIL',
          source: 'Stand-Up India Guidelines',
        }
      }
    }
  });

  console.log('Schemes seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
