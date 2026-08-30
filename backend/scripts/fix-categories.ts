import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CATEGORY_MAPPING = [
  { code: 'DAIRY_LIVESTOCK', legacyCode: 'mock-1', name: 'Dairy & Livestock' },
  { code: 'RETAIL_KIRANA', legacyCode: 'mock-2', name: 'Retail & Kirana Store' },
  { code: 'TEXTILES_GARMENT', legacyCode: 'mock-3', name: 'Textiles & Garment Manufacturing' },
  { code: 'AGRO_PROCESSING', legacyCode: 'mock-4', name: 'Agro-Processing & Food Products' },
  { code: 'HANDICRAFTS', legacyCode: 'mock-5', name: 'Handicrafts & Artisanal Goods' },
  { code: 'AUTO_SERVICES', legacyCode: 'mock-6', name: 'Vehicle Repair & Auto Services' },
  { code: 'POULTRY_FISHERIES', legacyCode: 'mock-7', name: 'Poultry & Fisheries' },
  { code: 'CONSTRUCTION_HARDWARE', legacyCode: 'mock-8', name: 'Construction Materials & Hardware' },
  { code: 'BEAUTY_PARLOR', legacyCode: 'mock-9', name: 'Beauty Parlor & Personal Care' },
  { code: 'ELECTRONICS_REPAIR', legacyCode: 'mock-10', name: 'Mobile & Electronics Repair' },
  { code: 'FURNITURE_CARPENTRY', legacyCode: 'mock-11', name: 'Furniture & Carpentry' },
  { code: 'BAKERY_SWEETS', legacyCode: 'mock-12', name: 'Bakery & Sweets Shop' },
  { code: 'EVENT_MANAGEMENT', legacyCode: 'mock-13', name: 'Event Management & Catering' },
  { code: 'PHARMACY', legacyCode: 'mock-14', name: 'Medical Store / Pharmacy' },
  { code: 'LOGISTICS', legacyCode: 'mock-15', name: 'Logistics & Transport' },
  { code: 'PRINTING_STATIONERY', legacyCode: 'mock-16', name: 'Printing & Stationery' },
  // Adding the requested specific ones
  { code: 'COLD_STORAGE', legacyCode: null, name: 'Cold Storage' },
  { code: 'MINI_SUPERMARKET', legacyCode: null, name: 'Mini Supermarket' },
  { code: 'FOOD_PROCESSING', legacyCode: null, name: 'Food Processing' },
  { code: 'POULTRY', legacyCode: null, name: 'Poultry Farming' },
  { code: 'GOAT_FARMING', legacyCode: null, name: 'Goat Farming' },
  { code: 'SHEEP_FARMING', legacyCode: null, name: 'Sheep Farming' },
  { code: 'FISHERIES', legacyCode: null, name: 'Fisheries' },
  { code: 'FLOUR_MILL', legacyCode: null, name: 'Flour Mill' },
  { code: 'SPICE_PROCESSING', legacyCode: null, name: 'Spice Processing' },
  { code: 'OIL_PROCESSING', legacyCode: null, name: 'Oil Processing' },
  { code: 'FRUIT_VEG_PROCESSING', legacyCode: null, name: 'Fruit & Vegetable Processing' },
  { code: 'AGRI_INPUT', legacyCode: null, name: 'Agri Input Store' },
  { code: 'FARM_EQUIP_RENTAL', legacyCode: null, name: 'Farm Equipment Rental' },
  { code: 'TRACTOR_SERVICES', legacyCode: null, name: 'Tractor / Machinery Services' },
  { code: 'TAILORING', legacyCode: null, name: 'Tailoring / Garment Unit' },
  { code: 'WELDING_FABRICATION', legacyCode: null, name: 'Welding / Fabrication' },
  { code: 'PACKAGING', legacyCode: null, name: 'Packaging Unit' },
  { code: 'SOLAR_SERVICES', legacyCode: null, name: 'Solar / Renewable Energy Service' },
  { code: 'OTHER_AGRO', legacyCode: null, name: 'Other Agro-Processing' }
];

async function main() {
  console.log('Seeding and migrating categories...');
  
  for (const map of CATEGORY_MAPPING) {
    let cat = null;
    
    // Check by legacy code
    if (map.legacyCode) {
      cat = await prisma.businessCategory.findUnique({ where: { code: map.legacyCode } });
      if (cat) {
        // Update to proper code
        await prisma.businessCategory.update({
          where: { id: cat.id },
          data: { code: map.code, name: map.name }
        });
      }
    }
    
    // Check by new code
    if (!cat) {
      cat = await prisma.businessCategory.findUnique({ where: { code: map.code } });
    }
    
    // Create if missing
    if (!cat) {
      cat = await prisma.businessCategory.create({
        data: { code: map.code, name: map.name, description: map.name }
      });
    }
  }

  // Delete duplicates that have the same name but different code (e.g. from previous bad seed)
  const allCats = await prisma.businessCategory.findMany();
  for (const cat of allCats) {
    const valid = CATEGORY_MAPPING.find(c => c.code === cat.code);
    if (!valid && cat.name === 'Dairy & Livestock') {
        // Move its templates to the valid one
        const validCat = await prisma.businessCategory.findUnique({where: {code: 'DAIRY_LIVESTOCK'}});
        if (validCat) {
            await prisma.projectCostTemplate.updateMany({
                where: { businessCategoryId: cat.id },
                data: { businessCategoryId: validCat.id }
            });
            await prisma.businessCategory.delete({where: {id: cat.id}});
        }
    }
    if (!valid && cat.name === 'Food Processing') {
        const validCat = await prisma.businessCategory.findUnique({where: {code: 'FOOD_PROCESSING'}});
        if (validCat) {
            await prisma.projectCostTemplate.updateMany({
                where: { businessCategoryId: cat.id },
                data: { businessCategoryId: validCat.id }
            });
            await prisma.businessCategory.delete({where: {id: cat.id}});
        }
    }
    if (!valid && cat.name === 'Poultry Farming') {
        const validCat = await prisma.businessCategory.findUnique({where: {code: 'POULTRY'}});
        if (validCat) {
            await prisma.projectCostTemplate.updateMany({
                where: { businessCategoryId: cat.id },
                data: { businessCategoryId: validCat.id }
            });
            await prisma.businessCategory.delete({where: {id: cat.id}});
        }
    }
    if (!valid && cat.name === 'Mini Supermarket') {
        const validCat = await prisma.businessCategory.findUnique({where: {code: 'MINI_SUPERMARKET'}});
        if (validCat) {
            await prisma.projectCostTemplate.updateMany({
                where: { businessCategoryId: cat.id },
                data: { businessCategoryId: validCat.id }
            });
            await prisma.businessCategory.delete({where: {id: cat.id}});
        }
    }
    if (!valid && cat.name === 'Cold Storage') {
        const validCat = await prisma.businessCategory.findUnique({where: {code: 'COLD_STORAGE'}});
        if (validCat) {
            await prisma.projectCostTemplate.updateMany({
                where: { businessCategoryId: cat.id },
                data: { businessCategoryId: validCat.id }
            });
            await prisma.businessCategory.delete({where: {id: cat.id}});
        }
    }
  }

  // Define Helper
  const createTemplate = async (catCode: string, scale: string, name: string, itemsData: any[]) => {
    const cat = await prisma.businessCategory.findUnique({ where: { code: catCode } });
    if (!cat) return;
    
    const existing = await prisma.projectCostTemplate.findFirst({
        where: { businessCategoryId: cat.id, scale }
    });
    if (existing) {
        await prisma.projectCostTemplate.delete({ where: { id: existing.id } });
    }
    
    await prisma.projectCostTemplate.create({
      data: {
        businessCategoryId: cat.id,
        scale,
        name,
        items: { create: itemsData }
      }
    });
  };

  // DAIRY TEMPLATES
  await createTemplate('DAIRY_LIVESTOCK', 'SMALL', 'Small Dairy Unit (5 Cattle)', [
    { category: 'CAPEX', itemName: 'Animals', quantity: 5, unit: 'heads', basePrice: 65000 },
    { category: 'CAPEX', itemName: 'Animal Shed', quantity: 1, unit: 'unit', basePrice: 80000 },
    { category: 'CAPEX', itemName: 'Milk Cans', quantity: 5, unit: 'pcs', basePrice: 1500 },
    { category: 'CAPEX', itemName: 'Water System', quantity: 1, unit: 'unit', basePrice: 15000 },
    { category: 'CAPEX', itemName: 'Electrical', quantity: 1, unit: 'unit', basePrice: 10000 },
    { category: 'WORKING_CAPITAL', itemName: 'Feed', quantity: 5, unit: 'bags', basePrice: 1500 },
    { category: 'WORKING_CAPITAL', itemName: 'Veterinary', quantity: 5, unit: 'heads', basePrice: 500 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'Lump sum', basePrice: 20000 },
  ]);
  
  await createTemplate('DAIRY_LIVESTOCK', 'MEDIUM', 'Medium Dairy Unit (10 Cattle)', [
    { category: 'CAPEX', itemName: 'Animals', quantity: 10, unit: 'heads', basePrice: 65000 },
    { category: 'CAPEX', itemName: 'Animal Shed', quantity: 1, unit: 'unit', basePrice: 150000 },
    { category: 'CAPEX', itemName: 'Milking Machine', quantity: 1, unit: 'unit', basePrice: 45000 },
    { category: 'CAPEX', itemName: 'Chaff Cutter', quantity: 1, unit: 'unit', basePrice: 25000 },
    { category: 'CAPEX', itemName: 'Water System', quantity: 1, unit: 'unit', basePrice: 20000 },
    { category: 'CAPEX', itemName: 'Electrical', quantity: 1, unit: 'unit', basePrice: 15000 },
    { category: 'WORKING_CAPITAL', itemName: 'Feed', quantity: 10, unit: 'bags', basePrice: 1500 },
    { category: 'WORKING_CAPITAL', itemName: 'Fodder', quantity: 10, unit: 'tons', basePrice: 2000 },
    { category: 'WORKING_CAPITAL', itemName: 'Labour', quantity: 1, unit: 'months', basePrice: 15000 },
    { category: 'WORKING_CAPITAL', itemName: 'Veterinary', quantity: 10, unit: 'heads', basePrice: 500 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'Lump sum', basePrice: 40000 },
  ]);

  await createTemplate('DAIRY_LIVESTOCK', 'LARGE', 'Large Dairy Unit (20 Cattle)', [
    { category: 'CAPEX', itemName: 'Animals', quantity: 20, unit: 'heads', basePrice: 65000 },
    { category: 'CAPEX', itemName: 'Animal Shed', quantity: 1, unit: 'unit', basePrice: 280000 },
    { category: 'CAPEX', itemName: 'Calf Shed', quantity: 1, unit: 'unit', basePrice: 60000 },
    { category: 'CAPEX', itemName: 'Milking Machine', quantity: 2, unit: 'unit', basePrice: 45000 },
    { category: 'CAPEX', itemName: 'Chaff Cutter', quantity: 1, unit: 'unit', basePrice: 25000 },
    { category: 'CAPEX', itemName: 'Milk Cans', quantity: 20, unit: 'pcs', basePrice: 1500 },
    { category: 'CAPEX', itemName: 'Water System', quantity: 1, unit: 'unit', basePrice: 35000 },
    { category: 'CAPEX', itemName: 'Electrical', quantity: 1, unit: 'unit', basePrice: 25000 },
    { category: 'CAPEX', itemName: 'Waste Management', quantity: 1, unit: 'unit', basePrice: 45000 },
    { category: 'WORKING_CAPITAL', itemName: 'Feed', quantity: 20, unit: 'bags', basePrice: 1500 },
    { category: 'WORKING_CAPITAL', itemName: 'Fodder', quantity: 20, unit: 'tons', basePrice: 2000 },
    { category: 'WORKING_CAPITAL', itemName: 'Labour', quantity: 2, unit: 'months', basePrice: 15000 },
    { category: 'WORKING_CAPITAL', itemName: 'Veterinary', quantity: 20, unit: 'heads', basePrice: 500 },
    { category: 'WORKING_CAPITAL', itemName: 'Insurance', quantity: 20, unit: 'heads', basePrice: 3000 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'Lump sum', basePrice: 70000 },
  ]);
  
  // Create POULTRY TEMPLATES
  await createTemplate('POULTRY', 'SMALL', 'Poultry Small (500 birds)', [
    { category: 'CAPEX', itemName: 'Shed', quantity: 1, unit: 'unit', basePrice: 100000 },
    { category: 'CAPEX', itemName: 'Chicks', quantity: 500, unit: 'birds', basePrice: 40 },
    { category: 'WORKING_CAPITAL', itemName: 'Feed', quantity: 10, unit: 'bags', basePrice: 1800 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'sum', basePrice: 10000 },
  ]);
  await createTemplate('POULTRY', 'MEDIUM', 'Poultry Medium (2000 birds)', [
    { category: 'CAPEX', itemName: 'Shed', quantity: 1, unit: 'unit', basePrice: 300000 },
    { category: 'CAPEX', itemName: 'Chicks', quantity: 2000, unit: 'birds', basePrice: 40 },
    { category: 'WORKING_CAPITAL', itemName: 'Feed', quantity: 40, unit: 'bags', basePrice: 1800 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'sum', basePrice: 30000 },
  ]);
  await createTemplate('POULTRY', 'LARGE', 'Poultry Large (5000 birds)', [
    { category: 'CAPEX', itemName: 'Shed', quantity: 1, unit: 'unit', basePrice: 700000 },
    { category: 'CAPEX', itemName: 'Chicks', quantity: 5000, unit: 'birds', basePrice: 40 },
    { category: 'WORKING_CAPITAL', itemName: 'Feed', quantity: 100, unit: 'bags', basePrice: 1800 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'sum', basePrice: 70000 },
  ]);
  
  // Create FOOD_PROCESSING TEMPLATES
  await createTemplate('FOOD_PROCESSING', 'SMALL', 'Food Processing Small (100kg/day)', [
    { category: 'CAPEX', itemName: 'Small Processor', quantity: 1, unit: 'unit', basePrice: 50000 },
    { category: 'WORKING_CAPITAL', itemName: 'Raw materials', quantity: 100, unit: 'kg', basePrice: 50 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'sum', basePrice: 5000 },
  ]);
  await createTemplate('FOOD_PROCESSING', 'MEDIUM', 'Food Processing Medium (500kg/day)', [
    { category: 'CAPEX', itemName: 'Medium Processor', quantity: 1, unit: 'unit', basePrice: 200000 },
    { category: 'WORKING_CAPITAL', itemName: 'Raw materials', quantity: 500, unit: 'kg', basePrice: 50 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'sum', basePrice: 20000 },
  ]);
  await createTemplate('FOOD_PROCESSING', 'LARGE', 'Food Processing Large (1000kg/day)', [
    { category: 'CAPEX', itemName: 'Industrial Processor', quantity: 1, unit: 'unit', basePrice: 600000 },
    { category: 'WORKING_CAPITAL', itemName: 'Raw materials', quantity: 1000, unit: 'kg', basePrice: 50 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'sum', basePrice: 50000 },
  ]);
  
  // Create COLD_STORAGE TEMPLATES
  await createTemplate('COLD_STORAGE', 'SMALL', 'Cold Storage Small (30 MT)', [
    { category: 'CAPEX', itemName: 'Insulation & Panels', quantity: 1, unit: 'unit', basePrice: 300000 },
    { category: 'WORKING_CAPITAL', itemName: 'Power backup', quantity: 1, unit: 'unit', basePrice: 150000 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'sum', basePrice: 40000 },
  ]);
  await createTemplate('COLD_STORAGE', 'MEDIUM', 'Cold Storage Medium (100 MT)', [
    { category: 'CAPEX', itemName: 'Insulation & Panels', quantity: 1, unit: 'unit', basePrice: 800000 },
    { category: 'WORKING_CAPITAL', itemName: 'Power backup', quantity: 1, unit: 'unit', basePrice: 350000 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'sum', basePrice: 90000 },
  ]);
  await createTemplate('COLD_STORAGE', 'LARGE', 'Cold Storage Large (500 MT)', [
    { category: 'CAPEX', itemName: 'Insulation & Panels', quantity: 1, unit: 'unit', basePrice: 2500000 },
    { category: 'WORKING_CAPITAL', itemName: 'Power backup', quantity: 1, unit: 'unit', basePrice: 850000 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'sum', basePrice: 200000 },
  ]);
  
  // Create MINI_SUPERMARKET TEMPLATES
  await createTemplate('MINI_SUPERMARKET', 'SMALL', 'Mini Supermarket Small', [
    { category: 'CAPEX', itemName: 'Racks', quantity: 1, unit: 'unit', basePrice: 50000 },
    { category: 'WORKING_CAPITAL', itemName: 'Initial Stock', quantity: 1, unit: 'unit', basePrice: 150000 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'sum', basePrice: 15000 },
  ]);
  await createTemplate('MINI_SUPERMARKET', 'MEDIUM', 'Mini Supermarket Medium', [
    { category: 'CAPEX', itemName: 'Racks & POS', quantity: 1, unit: 'unit', basePrice: 150000 },
    { category: 'WORKING_CAPITAL', itemName: 'Initial Stock', quantity: 1, unit: 'unit', basePrice: 500000 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'sum', basePrice: 50000 },
  ]);
  await createTemplate('MINI_SUPERMARKET', 'LARGE', 'Mini Supermarket Large', [
    { category: 'CAPEX', itemName: 'Racks & POS & CCTV', quantity: 1, unit: 'unit', basePrice: 350000 },
    { category: 'WORKING_CAPITAL', itemName: 'Initial Stock', quantity: 1, unit: 'unit', basePrice: 1200000 },
    { category: 'CONTINGENCY', itemName: 'Contingency', quantity: 1, unit: 'sum', basePrice: 100000 },
  ]);

  console.log('Database mapped and seeded perfectly.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
