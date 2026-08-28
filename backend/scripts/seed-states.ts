import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importStatesAndDistricts() {
  const filePath = path.join(__dirname, '../../data.csv');
  console.log('Extracting unique States and Districts...');

  const uniqueStates = new Map<string, string>();
  const uniqueDistricts = new Map<string, {name: string, stateCode: string}>();

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const vals = Object.values(row);
        const stateCode = String(vals[1]).trim();
        const stateName = String(vals[2]).trim();
        const districtCode = String(vals[3]).trim();
        const districtName = String(vals[4]).trim();
        
        if (stateCode && stateCode !== 'undefined' && stateCode !== 'State Code') {
          uniqueStates.set(stateCode, stateName);
          if (districtCode && districtCode !== 'undefined') {
            uniqueDistricts.set(districtCode, {name: districtName, stateCode});
          }
        }
      })
      .on('end', async () => {
        console.log(`Found ${uniqueStates.size} states and ${uniqueDistricts.size} districts. Inserting...`);
        
        // Insert States
        for (const [code, name] of uniqueStates.entries()) {
          await prisma.state.upsert({
            where: { lgdCode: code },
            update: { name },
            create: { lgdCode: code, name }
          });
        }
        
        console.log('States inserted! Now inserting districts...');
        
        // Fetch states to map IDs
        const states = await prisma.state.findMany();
        const stateIdMap = new Map(states.map(s => [s.lgdCode, s.id]));

        // Insert Districts
        let dCount = 0;
        for (const [code, {name, stateCode}] of uniqueDistricts.entries()) {
          const stateId = stateIdMap.get(stateCode);
          if (stateId) {
            await prisma.district.upsert({
              where: { lgdCode: code },
              update: { name, stateId },
              create: { lgdCode: code, name, stateId }
            });
            dCount++;
            if (dCount % 100 === 0) console.log(`Inserted ${dCount} districts...`);
          }
        }
        
        console.log('Done! All States and Districts are now visible.');
        resolve(true);
      })
      .on('error', reject);
  });
}

importStatesAndDistricts().catch(console.error).finally(() => prisma.$disconnect());
