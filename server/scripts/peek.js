const xlsx = require('xlsx');

const workbook = xlsx.readFile('../All_Villagesof_India_2026-08-27_12-18-08.xlsx', { sheetRows: 5 });
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

console.log(data);
