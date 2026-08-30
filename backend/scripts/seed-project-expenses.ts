import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Project Expenses data...');

  const getCategory = async (code: string, name: string) => {
    let cat = await prisma.businessCategory.findUnique({ where: { code } });
    if (!cat) {
      cat = await prisma.businessCategory.create({
        data: { code, name, description: name }
      });
    }
    return cat;
  };

  const dairyCat = await getCategory('DAIRY_LIVESTOCK', 'Dairy & Livestock');
  const foodCat = await getCategory('FOOD_PROCESSING', 'Food Processing');
  const poultryCat = await getCategory('POULTRY', 'Poultry Farming');
  const marketCat = await getCategory('MINI_SUPERMARKET', 'Mini Supermarket');
  const coldStorageCat = await getCategory('COLD_STORAGE', 'Cold Storage');

  const items = [
    { name: 'Dairy animals', basePrice: 65000 },
    { name: 'Cattle shed', basePrice: 150000 },
    { name: 'Milking machine', basePrice: 45000 },
    { name: 'Milk cans', basePrice: 1500 },
    { name: 'Chaff cutter', basePrice: 25000 },
    { name: 'Initial cattle feed', basePrice: 10000 },
    { name: 'Processing machinery', basePrice: 250000 },
    { name: 'Packaging machine', basePrice: 85000 },
    { name: 'Storage racks', basePrice: 12000 },
    { name: 'Factory/shed modification', basePrice: 120000 },
    { name: 'Raw material (1st month)', basePrice: 50000 },
    { name: 'Shop renovation', basePrice: 120000 },
    { name: 'Shelving & Racks', basePrice: 80000 },
    { name: 'Refrigerators/Freezers', basePrice: 150000 },
    { name: 'Billing/POS system', basePrice: 35000 },
    { name: 'Initial inventory', basePrice: 300000 },
    { name: 'Electrical installation', basePrice: 40000 },
    { name: 'Licenses & Registration', basePrice: 15000 },
    { name: 'Working capital contingency', basePrice: 50000 },
  ];

  for (const item of items) {
    const existing = await prisma.regionalPricing.findFirst({ where: { itemName: item.name } });
    if (!existing) {
      await prisma.regionalPricing.create({
        data: { itemName: item.name, basePrice: item.basePrice, source: 'Market Benchmark' }
      });
    }
  }

  const createTemplate = async (catId: string, scale: string, name: string, itemsData: any[]) => {
    const existing = await prisma.projectCostTemplate.findFirst({
        where: { businessCategoryId: catId, scale }
    });
    if (existing) {
        await prisma.projectCostTemplate.delete({ where: { id: existing.id } });
    }
    
    await prisma.projectCostTemplate.create({
      data: {
        businessCategoryId: catId,
        scale,
        name,
        items: {
          create: itemsData
        }
      }
    });
  };

  await createTemplate(dairyCat.id, 'SMALL', 'Small Dairy Unit (5 Cattle)', [
    { category: 'CAPEX', itemName: 'Dairy animals', quantity: 5, unit: 'heads', basePrice: 65000 },
    { category: 'CAPEX', itemName: 'Cattle shed', quantity: 1, unit: 'unit', basePrice: 80000 },
    { category: 'CAPEX', itemName: 'Milk cans', quantity: 5, unit: 'pcs', basePrice: 1500 },
    { category: 'WORKING_CAPITAL', itemName: 'Initial cattle feed', quantity: 5, unit: 'bags', basePrice: 1500 },
    { category: 'CONTINGENCY', itemName: 'Working capital contingency', quantity: 1, unit: 'Lump sum', basePrice: 20000 },
  ]);
  
  await createTemplate(dairyCat.id, 'MEDIUM', 'Medium Dairy Unit (10 Cattle)', [
    { category: 'CAPEX', itemName: 'Dairy animals', quantity: 10, unit: 'heads', basePrice: 65000 },
    { category: 'CAPEX', itemName: 'Cattle shed', quantity: 1, unit: 'unit', basePrice: 150000 },
    { category: 'CAPEX', itemName: 'Milking machine', quantity: 1, unit: 'unit', basePrice: 45000 },
    { category: 'CAPEX', itemName: 'Milk cans', quantity: 10, unit: 'pcs', basePrice: 1500 },
    { category: 'CAPEX', itemName: 'Chaff cutter', quantity: 1, unit: 'unit', basePrice: 25000 },
    { category: 'WORKING_CAPITAL', itemName: 'Initial cattle feed', quantity: 10, unit: 'bags', basePrice: 1500 },
    { category: 'CONTINGENCY', itemName: 'Working capital contingency', quantity: 1, unit: 'Lump sum', basePrice: 40000 },
  ]);

  await createTemplate(dairyCat.id, 'LARGE', 'Large Dairy Unit (20 Cattle)', [
    { category: 'CAPEX', itemName: 'Dairy animals', quantity: 20, unit: 'heads', basePrice: 65000 },
    { category: 'CAPEX', itemName: 'Cattle shed', quantity: 1, unit: 'unit', basePrice: 280000 },
    { category: 'CAPEX', itemName: 'Milking machine', quantity: 2, unit: 'unit', basePrice: 45000 },
    { category: 'CAPEX', itemName: 'Milk cans', quantity: 20, unit: 'pcs', basePrice: 1500 },
    { category: 'CAPEX', itemName: 'Chaff cutter', quantity: 1, unit: 'unit', basePrice: 25000 },
    { category: 'WORKING_CAPITAL', itemName: 'Initial cattle feed', quantity: 20, unit: 'bags', basePrice: 1500 },
    { category: 'CONTINGENCY', itemName: 'Working capital contingency', quantity: 1, unit: 'Lump sum', basePrice: 70000 },
  ]);

  await createTemplate(marketCat.id, 'MEDIUM', 'Standard Mini Supermarket', [
    { category: 'CAPEX', itemName: 'Shop renovation', quantity: 1, unit: 'Lump sum', basePrice: 150000 },
    { category: 'CAPEX', itemName: 'Shelving & Racks', quantity: 1, unit: 'Lump sum', basePrice: 120000 },
    { category: 'CAPEX', itemName: 'Refrigerators/Freezers', quantity: 2, unit: 'unit', basePrice: 65000 },
    { category: 'CAPEX', itemName: 'Billing/POS system', quantity: 1, unit: 'unit', basePrice: 45000 },
    { category: 'CAPEX', itemName: 'Electrical installation', quantity: 1, unit: 'Lump sum', basePrice: 35000 },
    { category: 'WORKING_CAPITAL', itemName: 'Initial inventory', quantity: 1, unit: 'Lump sum', basePrice: 400000 },
    { category: 'CAPEX', itemName: 'Licenses & Registration', quantity: 1, unit: 'Lump sum', basePrice: 15000 },
    { category: 'CONTINGENCY', itemName: 'Working capital contingency', quantity: 1, unit: 'Lump sum', basePrice: 50000 },
  ]);

  await createTemplate(foodCat.id, 'MEDIUM', 'Medium Food Processing Unit', [
    { category: 'CAPEX', itemName: 'Processing machinery', quantity: 1, unit: 'unit', basePrice: 250000 },
    { category: 'CAPEX', itemName: 'Packaging machine', quantity: 1, unit: 'unit', basePrice: 85000 },
    { category: 'CAPEX', itemName: 'Storage racks', quantity: 4, unit: 'pcs', basePrice: 12000 },
    { category: 'CAPEX', itemName: 'Factory/shed modification', quantity: 1, unit: 'Lump sum', basePrice: 120000 },
    { category: 'WORKING_CAPITAL', itemName: 'Raw material (1st month)', quantity: 1, unit: 'Lump sum', basePrice: 150000 },
    { category: 'CONTINGENCY', itemName: 'Working capital contingency', quantity: 1, unit: 'Lump sum', basePrice: 40000 },
  ]);

  console.log('Done seeding project expenses.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
