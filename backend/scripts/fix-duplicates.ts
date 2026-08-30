import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Fixing category duplicates...');
  
  // Get all cats
  const cats = await prisma.businessCategory.findMany();
  
  for (const cat of cats) {
      if (cat.code === 'DAIRY_LIVESTOCK' || cat.code === 'FOOD_PROCESSING' || cat.code === 'POULTRY' || cat.code === 'MINI_SUPERMARKET' || cat.code === 'COLD_STORAGE') {
          console.log('Moving templates from', cat.code);
          
          // Find the mock equivalent by name
          const mockCat = cats.find(c => c.name === cat.name && c.id !== cat.id);
          
          if (mockCat) {
              await prisma.projectCostTemplate.updateMany({
                  where: { businessCategoryId: cat.id },
                  data: { businessCategoryId: mockCat.id }
              });
              console.log('Moved templates from', cat.code, 'to', mockCat.code);
              // Delete duplicate
              await prisma.businessCategory.delete({ where: { id: cat.id } });
              // Update mockCat to the real code
              await prisma.businessCategory.update({
                  where: { id: mockCat.id },
                  data: { code: cat.code }
              });
          }
      }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
