import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importLGDData() {
  const filePath = path.join(__dirname, '../../data.csv');
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  console.log('Streaming CSV file into database...');

  const stateCache = new Map<string, string>();
  const districtCache = new Map<string, string>();
  const subDistrictCache = new Map<string, string>();

  let insertedVillages = 0;

  // We can't do upsert asynchronously inside a fast stream easily without backpressure,
  // so we'll collect chunks and await them.
  const CHUNK_SIZE = 500;
  let chunk: any[] = [];

  const processChunk = async (currentChunk: any[]) => {
    for (const row of currentChunk) {
      try {
        // Based on the headers seen previously, pandas to_csv outputs the first row as columns.
        // Wait, pandas outputs the *first row* of the xlsx as headers if it was the header.
        // But our earlier peek showed the FIRST row was actual data, and the 0th row was headers.
        // So pandas `to_csv(index=False)` will make the 0th row the header.
        
        // Let's use Object.values to be safe, since column names might be weird like "Unnamed: 0"
        const vals = Object.values(row);
        const stateCode = String(vals[1]).trim();
        const stateName = String(vals[2]).trim();
        const districtCode = String(vals[3]).trim();
        const districtName = String(vals[4]).trim();
        const subDistrictCode = String(vals[5]).trim();
        const subDistrictName = String(vals[6]).trim();
        const villageCode = String(vals[7]).trim();
        const villageName = String(vals[9]).trim();
        const villageCategory = String(vals[11]).trim() || 'VILLAGE';
        const villageStatus = String(vals[12]).trim();
        const census2011 = String(vals[14]).trim();

        if (!stateCode || !districtCode || !subDistrictCode || !villageCode || stateCode === 'undefined' || stateCode === 'State Code') continue;

        let stateId = stateCache.get(stateCode);
        if (!stateId) {
          const state = await prisma.state.upsert({
            where: { lgdCode: stateCode },
            update: { name: stateName },
            create: { lgdCode: stateCode, name: stateName }
          });
          stateId = state.id;
          stateCache.set(stateCode, stateId);
        }

        let districtId = districtCache.get(districtCode);
        if (!districtId) {
          const district = await prisma.district.upsert({
            where: { lgdCode: districtCode },
            update: { name: districtName, stateId },
            create: { lgdCode: districtCode, name: districtName, stateId }
          });
          districtId = district.id;
          districtCache.set(districtCode, districtId);
        }

        let subDistrictId = subDistrictCache.get(subDistrictCode);
        if (!subDistrictId) {
          const subDistrict = await prisma.subDistrict.upsert({
            where: { lgdCode: subDistrictCode },
            update: { name: subDistrictName, districtId },
            create: { lgdCode: subDistrictCode, name: subDistrictName, districtId }
          });
          subDistrictId = subDistrict.id;
          subDistrictCache.set(subDistrictCode, subDistrictId);
        }

        await prisma.village.upsert({
          where: { lgdCode: villageCode },
          update: {
            name: villageName,
            locationType: villageCategory.toUpperCase(),
            villageCode: census2011,
            isInhabited: villageStatus.toLowerCase().includes('inhabitant')
          },
          create: {
            lgdCode: villageCode,
            subDistrictId,
            name: villageName,
            locationType: villageCategory.toUpperCase(),
            villageCode: census2011,
            isInhabited: villageStatus.toLowerCase().includes('inhabitant')
          }
        });
        
        insertedVillages++;
        if (insertedVillages % 1000 === 0) {
          console.log(`Inserted ${insertedVillages} villages...`);
        }
      } catch (err: any) {
        // ignore individual row errors to not crash the stream
      }
    }
  };

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath).pipe(csv());
    
    stream.on('data', async (data) => {
      chunk.push(data);
      if (chunk.length >= CHUNK_SIZE) {
        stream.pause();
        const currentChunk = [...chunk];
        chunk = [];
        await processChunk(currentChunk);
        stream.resume();
      }
    });

    stream.on('end', async () => {
      if (chunk.length > 0) {
        await processChunk(chunk);
      }
      console.log(`\nImport complete! Successfully processed ${insertedVillages} villages.`);
      
      await prisma.locationDatasetMetadata.create({
        data: {
          source: 'LGD',
          datasetName: 'Local Government Directory',
          datasetVersion: '2026-08',
          recordCount: insertedVillages,
          status: 'SUCCESS'
        }
      });
      resolve(true);
    });

    stream.on('error', reject);
  });
}

importLGDData().catch(console.error).finally(() => prisma.$disconnect());
