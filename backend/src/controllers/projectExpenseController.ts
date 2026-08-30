import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Location-based Rent Multipliers ─────────────────────────────────────────
const RENT_MULTIPLIERS: Record<string, number> = {
  mumbai: 3.5, delhi: 3.0, bangalore: 3.0, bengaluru: 3.0, hyderabad: 2.5,
  chennai: 2.5, pune: 2.5, ahmedabad: 2.0, surat: 2.0, vadodara: 1.8,
  rajkot: 1.6, jaipur: 1.8, lucknow: 1.6, bhopal: 1.5, indore: 1.7,
  nagpur: 1.6, patna: 1.4, chandigarh: 1.8, coimbatore: 1.6, kochi: 1.7,
};

function getRentMultiplier(location: string): number {
  if (!location) return 1.0;
  const loc = location.toLowerCase();
  for (const [city, mult] of Object.entries(RENT_MULTIPLIERS)) {
    if (loc.includes(city)) return mult;
  }
  // Village/rural areas = lower rent
  const isRural = loc.includes('village') || loc.includes('gram') || loc.includes('taluka');
  return isRural ? 0.6 : 1.0;
}

// ─── Business-specific CAPEX items (use CAPEX category to match frontend) ─────
function getCapexItems(cat: string, projectCost: number, scale: string): any[] {
  const s = scale === 'SMALL' ? 0.7 : scale === 'LARGE' ? 1.5 : 1.0;

  if (cat.includes('baker') || cat.includes('sweet') || cat.includes('mithai')) {
    return [
      { itemName: 'Commercial Convection Oven (Double Deck)', description: 'High-capacity stainless steel oven for bread & cakes', quantity: 1, basePrice: Math.round(projectCost * 0.18 * s), unit: 'unit', isRequired: true },
      { itemName: 'Industrial Spiral Dough Mixer (20kg)', description: 'Heavy-duty mixer for dough preparation', quantity: 1, basePrice: Math.round(projectCost * 0.10 * s), unit: 'unit', isRequired: true },
      { itemName: 'Display Refrigerator (Glass Front, 300L)', description: 'For display of cakes, pastries & sweets', quantity: 2, basePrice: Math.round(projectCost * 0.07 * s), unit: 'unit', isRequired: true },
      { itemName: 'Gas Burner & Kadhai (Commercial)', description: 'For frying & sweet preparation', quantity: 2, basePrice: Math.round(projectCost * 0.04 * s), unit: 'unit', isRequired: true },
      { itemName: 'Deep Freezer (250L)', description: 'Ice cream, frozen goods storage', quantity: 1, basePrice: Math.round(projectCost * 0.04 * s), unit: 'unit', isRequired: false },
      { itemName: 'SS Work Tables & Kitchen Trolleys', description: 'Food-grade preparation surfaces', quantity: 3, basePrice: Math.round(projectCost * 0.015 * s), unit: 'unit', isRequired: true },
      { itemName: 'Billing Counter, Cash Drawer & POS', description: 'Customer billing system', quantity: 1, basePrice: Math.round(projectCost * 0.02 * s), unit: 'unit', isRequired: true },
      { itemName: 'Interior Fit-out & Shop Shelving', description: 'Furniture, shelves, display racks', quantity: 1, basePrice: Math.round(projectCost * 0.05 * s), unit: 'Lump sum', isRequired: true },
    ];
  }

  if (cat.includes('dairy') || cat.includes('milk')) {
    return [
      { itemName: 'Milk Chilling Vat / Bulk Milk Cooler (500L)', description: 'Primary milk storage & chilling unit', quantity: 1, basePrice: Math.round(projectCost * 0.25 * s), unit: 'unit', isRequired: true },
      { itemName: 'Cream Separator (Electric)', description: 'Separates cream from milk', quantity: 1, basePrice: Math.round(projectCost * 0.08 * s), unit: 'unit', isRequired: true },
      { itemName: 'Milk Pasteurizer / HTST Unit', description: 'Ensures safe pasteurized output', quantity: 1, basePrice: Math.round(projectCost * 0.12 * s), unit: 'unit', isRequired: true },
      { itemName: 'Milk Quality Testing Kit (Lactometer, Fat Analyzer)', description: 'FSSAI compliance testing', quantity: 1, basePrice: Math.round(projectCost * 0.04 * s), unit: 'unit', isRequired: true },
      { itemName: 'SS Milk Cans (40L)', description: 'Transport and storage cans', quantity: 10, basePrice: Math.round(projectCost * 0.008 * s), unit: 'unit', isRequired: true },
      { itemName: 'Pouch Filling & Sealing Machine', description: 'For milk sachet packaging', quantity: 1, basePrice: Math.round(projectCost * 0.10 * s), unit: 'unit', isRequired: false },
    ];
  }

  if (cat.includes('poultry') || cat.includes('chicken') || cat.includes('egg')) {
    return [
      { itemName: 'Broiler Poultry Shed Construction (500 birds)', description: 'Semi-permanent shed with ventilation', quantity: 1, basePrice: Math.round(projectCost * 0.30 * s), unit: 'Lump sum', isRequired: true },
      { itemName: 'Automatic Feeder & Drinker System', description: 'Nipple drinkers and trough feeders', quantity: 1, basePrice: Math.round(projectCost * 0.08 * s), unit: 'Lump sum', isRequired: true },
      { itemName: 'Exhaust Fans & Ventilation System', description: 'Temperature control for shed', quantity: 4, basePrice: Math.round(projectCost * 0.015 * s), unit: 'unit', isRequired: true },
      { itemName: 'Brooding Equipment (Heaters/Brooders)', description: 'For chick brooding phase', quantity: 2, basePrice: Math.round(projectCost * 0.04 * s), unit: 'unit', isRequired: true },
      { itemName: 'Weighing Scale (Digital, 200kg)', description: 'For batch weighing', quantity: 1, basePrice: Math.round(projectCost * 0.02 * s), unit: 'unit', isRequired: true },
    ];
  }

  if (cat.includes('kirana') || cat.includes('grocery') || cat.includes('general store')) {
    return [
      { itemName: 'Storage Racks & Display Shelves (Steel)', description: 'Product display and storage', quantity: 6, basePrice: Math.round(projectCost * 0.04 * s), unit: 'unit', isRequired: true },
      { itemName: 'Counter & Cash Register / POS System', description: 'Billing counter with drawer', quantity: 1, basePrice: Math.round(projectCost * 0.05 * s), unit: 'unit', isRequired: true },
      { itemName: 'Weighing Scale (Digital, NABL certified)', description: 'Legal metrology compliant scale', quantity: 2, basePrice: Math.round(projectCost * 0.015 * s), unit: 'unit', isRequired: true },
      { itemName: 'Refrigerator (Double Door, 450L)', description: 'Cold drinks, dairy & frozen items', quantity: 1, basePrice: Math.round(projectCost * 0.08 * s), unit: 'unit', isRequired: true },
      { itemName: 'CCTV Security System (4 cameras)', description: 'Shop security and loss prevention', quantity: 1, basePrice: Math.round(projectCost * 0.03 * s), unit: 'Lump sum', isRequired: false },
      { itemName: 'Interior Fit-out & Flooring', description: 'Shop interior improvement', quantity: 1, basePrice: Math.round(projectCost * 0.06 * s), unit: 'Lump sum', isRequired: true },
    ];
  }

  if (cat.includes('tailoring') || cat.includes('garment') || cat.includes('textile') || cat.includes('boutique')) {
    return [
      { itemName: 'Industrial Sewing Machine (High Speed)', description: 'Primary stitching machine', quantity: 3, basePrice: Math.round(projectCost * 0.08 * s), unit: 'unit', isRequired: true },
      { itemName: 'Overlock / Serger Machine', description: 'Seam finishing machine', quantity: 1, basePrice: Math.round(projectCost * 0.06 * s), unit: 'unit', isRequired: true },
      { itemName: 'Steam Iron & Ironing Board', description: 'Finishing & pressing', quantity: 2, basePrice: Math.round(projectCost * 0.02 * s), unit: 'unit', isRequired: true },
      { itemName: 'Cutting Table (6x3 ft, SS)', description: 'Fabric cutting surface', quantity: 1, basePrice: Math.round(projectCost * 0.04 * s), unit: 'unit', isRequired: true },
      { itemName: 'Mannequins & Display Stand', description: 'For sample display', quantity: 3, basePrice: Math.round(projectCost * 0.015 * s), unit: 'unit', isRequired: false },
    ];
  }

  if (cat.includes('salon') || cat.includes('beauty') || cat.includes('parlour') || cat.includes('barber')) {
    return [
      { itemName: 'Hydraulic Salon Chair', description: 'Client seating chair', quantity: 3, basePrice: Math.round(projectCost * 0.07 * s), unit: 'unit', isRequired: true },
      { itemName: 'Washbasin with Neck Rest', description: 'Hair washing station', quantity: 2, basePrice: Math.round(projectCost * 0.05 * s), unit: 'unit', isRequired: true },
      { itemName: 'Salon Mirror & Vanity Unit', description: 'Wall-mounted mirror with lighting', quantity: 3, basePrice: Math.round(projectCost * 0.04 * s), unit: 'unit', isRequired: true },
      { itemName: 'Professional Hair Dryer & Straightener Set', description: 'Styling tools', quantity: 2, basePrice: Math.round(projectCost * 0.03 * s), unit: 'set', isRequired: true },
      { itemName: 'Steamer & Hot Towel Machine', description: 'Facial & treatment use', quantity: 1, basePrice: Math.round(projectCost * 0.03 * s), unit: 'unit', isRequired: false },
      { itemName: 'Air Conditioner (1.5 ton)', description: 'Client comfort', quantity: 1, basePrice: Math.round(projectCost * 0.08 * s), unit: 'unit', isRequired: true },
    ];
  }

  if (cat.includes('fish') || cat.includes('seafood') || cat.includes('aqua')) {
    return [
      { itemName: 'Insulated Fish Storage Box / Cold Box', description: 'For fish preservation', quantity: 4, basePrice: Math.round(projectCost * 0.05 * s), unit: 'unit', isRequired: true },
      { itemName: 'Deep Freezer (300L)', description: 'Frozen fish storage', quantity: 1, basePrice: Math.round(projectCost * 0.12 * s), unit: 'unit', isRequired: true },
      { itemName: 'Weighing Scale & Counter Setup', description: 'Shop counter with scale', quantity: 1, basePrice: Math.round(projectCost * 0.04 * s), unit: 'unit', isRequired: true },
      { itemName: 'Ice Making Machine (50kg/day)', description: 'Ice for fresh fish display', quantity: 1, basePrice: Math.round(projectCost * 0.15 * s), unit: 'unit', isRequired: true },
    ];
  }

  if (cat.includes('vegetable') || cat.includes('fruit') || cat.includes('sabzi')) {
    return [
      { itemName: 'Market Stall / Thela (Push Cart)', description: 'Mobile vending cart', quantity: 1, basePrice: Math.round(projectCost * 0.10 * s), unit: 'unit', isRequired: true },
      { itemName: 'Weighing Scale (Platform, 100kg)', description: 'For bulk weighing', quantity: 1, basePrice: Math.round(projectCost * 0.04 * s), unit: 'unit', isRequired: true },
      { itemName: 'Crates & Bamboo Baskets', description: 'Produce storage and display', quantity: 20, basePrice: Math.round(projectCost * 0.008 * s), unit: 'unit', isRequired: true },
      { itemName: 'Cold Storage Rental (Monthly)', description: 'Shared cold storage for inventory', quantity: 3, basePrice: Math.round(projectCost * 0.02 * s), unit: 'months', isRequired: false },
    ];
  }

  if (cat.includes('pharmac') || cat.includes('medical') || cat.includes('chemist')) {
    return [
      { itemName: 'Pharmacy Storage Rack System (Wood/Steel)', description: 'Medicine shelving units', quantity: 8, basePrice: Math.round(projectCost * 0.04 * s), unit: 'unit', isRequired: true },
      { itemName: 'Refrigerator for Vaccines (2–8°C)', description: 'ILR/cold chain compliant', quantity: 1, basePrice: Math.round(projectCost * 0.10 * s), unit: 'unit', isRequired: true },
      { itemName: 'Counter & Billing System (POS)', description: 'Dispensing counter with billing', quantity: 1, basePrice: Math.round(projectCost * 0.06 * s), unit: 'unit', isRequired: true },
      { itemName: 'CCTV Camera System', description: 'Security surveillance', quantity: 1, basePrice: Math.round(projectCost * 0.03 * s), unit: 'Lump sum', isRequired: true },
    ];
  }

  // Default (generic)
  return [
    { itemName: 'Primary Business Equipment Set', description: 'Core machinery / tools', quantity: 1, basePrice: Math.round(projectCost * 0.35 * s), unit: 'Lump sum', isRequired: true },
    { itemName: 'Furniture & Interior Fit-out', description: 'Tables, chairs, shelves', quantity: 1, basePrice: Math.round(projectCost * 0.08 * s), unit: 'Lump sum', isRequired: true },
    { itemName: 'Computer / POS / Billing System', description: 'Digital management tools', quantity: 1, basePrice: Math.round(projectCost * 0.04 * s), unit: 'unit', isRequired: false },
  ];
}

// ─── Working Capital items (30-day operating cost) ───────────────────────────
function getWorkingCapitalItems(cat: string, projectCost: number, location: string): any[] {
  const rentMult = getRentMultiplier(location);

  const rawMaterial = cat.includes('baker') || cat.includes('sweet') ? {
    itemName: 'Raw Materials - Flour, Sugar, Butter, Dairy', description: '30-day stock for production', quantity: 1, basePrice: Math.round(projectCost * 0.12), unit: 'Lump sum', isRequired: true
  } : cat.includes('dairy') || cat.includes('milk') ? {
    itemName: 'Raw Materials - Cattle Feed & Fodder (30 days)', description: 'Monthly cattle feed stock', quantity: 1, basePrice: Math.round(projectCost * 0.10), unit: 'Lump sum', isRequired: true
  } : {
    itemName: 'Initial Inventory & Raw Materials (30 days)', description: 'Opening stock to start operations', quantity: 1, basePrice: Math.round(projectCost * 0.12), unit: 'Lump sum', isRequired: true
  };

  return [
    rawMaterial,
    { itemName: `Commercial Shop / Unit Rent (3 months advance)`, description: `Security + 3 months rent – ${location || 'local area'}, rate scaled to location`, quantity: 1, basePrice: Math.round(projectCost * 0.05 * rentMult), unit: 'Lump sum', isRequired: true },
    { itemName: `Electricity Bill Deposit & Initial 3 Months`, description: 'Commercial connection deposit + usage', quantity: 1, basePrice: Math.round(projectCost * 0.025 * rentMult), unit: 'Lump sum', isRequired: true },
    { itemName: 'Water & Sanitation Charges (3 months)', description: 'Municipal water connection deposit', quantity: 1, basePrice: Math.round(projectCost * 0.008), unit: 'Lump sum', isRequired: true },
    { itemName: 'Staff Wages & Labour (2 months advance)', description: 'Initial staff payroll', quantity: 1, basePrice: Math.round(projectCost * 0.04), unit: 'Lump sum', isRequired: false },
    { itemName: 'Internet, Phone & Misc. Operational Costs', description: 'Broadband, SIM, packaging, printing', quantity: 1, basePrice: Math.round(projectCost * 0.01), unit: 'Lump sum', isRequired: false },
  ];
}

// ─── Contingency items ───────────────────────────────────────────────────────
function getContingencyItems(cat: string, projectCost: number): any[] {
  const needsLicense = cat.includes('baker') || cat.includes('sweet') || cat.includes('dairy') || cat.includes('food') || cat.includes('pharmac');
  const items: any[] = [
    { itemName: 'Udyam / MSME Registration', description: 'Business registration fee', quantity: 1, basePrice: 0, unit: 'Lump sum', isRequired: true },
    { itemName: 'Shop & Establishment License', description: 'Local municipal license', quantity: 1, basePrice: Math.round(projectCost * 0.003), unit: 'Lump sum', isRequired: true },
    { itemName: 'GST Registration', description: 'If applicable as per turnover', quantity: 1, basePrice: 0, unit: 'Lump sum', isRequired: false },
  ];
  if (needsLicense) {
    items.push({ itemName: 'FSSAI Food License (Basic/State)', description: 'Mandatory food safety license', quantity: 1, basePrice: Math.round(projectCost * 0.005), unit: 'Lump sum', isRequired: true });
  }
  items.push(
    { itemName: 'Initial Marketing – Flyers, Signboard, Social Media', description: 'Launch promotion expenses', quantity: 1, basePrice: Math.round(projectCost * 0.02), unit: 'Lump sum', isRequired: false },
    { itemName: 'Contingency & Unforeseen Expenses (5%)', description: 'Buffer for price changes, repairs', quantity: 1, basePrice: Math.round(projectCost * 0.05), unit: 'Lump sum', isRequired: true }
  );
  return items;
}

export const getTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { scale, location, capital, categoryName } = req.query;

    const marginCapital = Number(capital) || 100000;
    const projectCost = marginCapital * 10;
    const scaleStr = String(scale || 'MEDIUM').toUpperCase();
    const locationStr = String(location || '');
    const cat = String(categoryName || 'General Business').toLowerCase();

    const capexItems = getCapexItems(cat, projectCost, scaleStr).map(i => ({ ...i, category: 'CAPEX' }));
    const wcItems = getWorkingCapitalItems(cat, projectCost, locationStr).map(i => ({ ...i, category: 'WORKING_CAPITAL' }));
    const contingencyItems = getContingencyItems(cat, projectCost).map(i => ({ ...i, category: 'CONTINGENCY' }));

    const items = [...capexItems, ...wcItems, ...contingencyItems];

    res.status(200).json({ data: { items } });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProjectExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const assessmentId = Array.isArray(req.params.assessmentId) ? req.params.assessmentId[0] : (req.params.assessmentId as string);
    const expenses = await prisma.projectExpense.findMany({ where: { assessmentId } });
    res.status(200).json({ data: expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const saveProjectExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const assessmentId = Array.isArray(req.params.assessmentId) ? req.params.assessmentId[0] : (req.params.assessmentId as string);
    const { expenses } = req.body;

    if (!Array.isArray(expenses)) {
      res.status(400).json({ error: 'expenses must be an array' });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.projectExpense.deleteMany({ where: { assessmentId } });
      if (expenses.length > 0) {
        await tx.projectExpense.createMany({
          data: expenses.map((e: any) => ({
            assessmentId,
            category: e.category,
            itemName: e.itemName,
            description: e.description || null,
            quantity: e.quantity,
            unit: e.unit,
            unitPrice: e.unitPrice,
            amount: e.amount,
            pricingSource: e.pricingSource || 'User Input',
            pricingSourceUrl: e.pricingSourceUrl || null,
            isOptional: e.isOptional || false,
          }))
        });
      }
    });

    res.status(200).json({ message: 'Saved successfully' });
  } catch (error) {
    console.error('Error saving expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRegionalPricing = async (req: Request, res: Response): Promise<void> => {
  try {
    const pricing = await prisma.regionalPricing.findMany();
    res.status(200).json({ data: pricing });
  } catch (error) {
    console.error('Error fetching regional pricing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
