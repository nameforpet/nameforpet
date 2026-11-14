const fs = require('fs');
const path = require('path');

// Helper to parse CSV line respecting quotes
function parseCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

const eng1Path = 'C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393969_32aab095.csv';
const eng2Path = 'C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393906_549cdab9.csv';
const westPath = 'C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393952_6afeb59c.csv';
const euroPath = 'C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393953_844b528b.csv';

// Let's inspect samples of meanings and categories
function inspectMulti(filePath, name) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter(l => l.trim().length > 0);
  console.log(`\n--- Inspecting ${name} ---`);
  for (let i = 1; i <= 5; i++) {
    const cols = parseCsvLine(lines[i]);
    console.log(cols);
  }
}

inspectMulti(westPath, 'Western');
inspectMulti(euroPath, 'European');
