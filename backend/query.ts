import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const cats = await prisma.businessCategory.findMany();
  console.log("Categories:", cats);
  const templates = await prisma.projectCostTemplate.findMany();
  console.log("Templates:", templates.map(t => ({id: t.id, catId: t.businessCategoryId, scale: t.scale})));
}
main().finally(() => prisma.$disconnect());
