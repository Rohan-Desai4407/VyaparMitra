const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedMissingTemplates() {
  const categories = await prisma.businessCategory.findMany();
  let created = 0;
  
  for (const cat of categories) {
    const scales = ['SMALL', 'MEDIUM', 'LARGE'];
    
    for (const scale of scales) {
      const count = await prisma.projectCostTemplate.count({
        where: { businessCategoryId: cat.id, scale }
      });
      
      if (count === 0) {
        let baseCost = 0;
        if (scale === 'SMALL') baseCost = 250000;
        if (scale === 'MEDIUM') baseCost = 800000;
        if (scale === 'LARGE') baseCost = 2500000;
        
        await prisma.projectCostTemplate.create({
          data: {
            businessCategoryId: cat.id,
            name: `${cat.name} Benchmark`,
            scale,
            items: {
              create: [
                {
                  category: 'CAPEX',
                  itemName: 'Basic Equipment & Setup',
                  quantity: 1,
                  unit: 'Lump sum',
                  basePrice: baseCost * 0.6
                },
                {
                  category: 'WORKING_CAPITAL',
                  itemName: 'Initial Inventory & Overheads',
                  quantity: 1,
                  unit: 'months',
                  basePrice: baseCost * 0.3
                },
                {
                  category: 'CONTINGENCY',
                  itemName: 'Contingency Fund (10%)',
                  quantity: 1,
                  unit: 'Lump sum',
                  basePrice: baseCost * 0.1
                }
              ]
            }
          }
        });
        created++;
      }
    }
  }
  console.log('Created ' + created + ' generic templates');
}

seedMissingTemplates().catch(console.error).finally(() => prisma.$disconnect());
