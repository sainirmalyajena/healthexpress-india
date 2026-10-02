const Papa = require('papaparse');
const fs = require('fs');

const raw = fs.readFileSync('test.csv', 'utf-8');
const cleanText = raw.replace(/^"/gm, '').replace(/"\s*$/gm, '');
const result = Papa.parse(cleanText, { header: true, skipEmptyLines: true });
console.log("Headers:", result.meta.fields);
console.log("First Row:", result.data[0]);
