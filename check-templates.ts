import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkMissingTemplates() {
  const categories = await prisma.businessCategory.findMany();
  let missing = 0;
  for (const cat of categories) {
    const templatesCount = await prisma.projectCostTemplate.count({
      where: { categoryId: cat.id }
    });
    if (templatesCount === 0) {
      console.log(Missing templates for:  ());
      missing++;
    }
  }
  console.log(Total missing: );
}

checkMissingTemplates().catch(console.error).finally(() => prisma.());
