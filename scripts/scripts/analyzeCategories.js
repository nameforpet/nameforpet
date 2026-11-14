const fs = require('fs');

function analyzeFile(path) {
  const content = fs.readFileSync(path, 'utf8');
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  return lines;
}

const eng1 = analyzeFile('C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393969_32aab095.csv');
const eng2 = analyzeFile('C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393906_549cdab9.csv');
const west = analyzeFile('C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393952_6afeb59c.csv');
const euro = analyzeFile('C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393953_844b528b.csv');

// Categories in English 1 & 2
const catSet = new Set();
for (const lines of [eng1, eng2]) {
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length >= 5) {
      catSet.add(parts[2].trim());
      catSet.add(parts[4].trim());
    }
  }
}
console.log('English categories:', Array.from(catSet));

// Languages in western & euro
function getLangs(lines) {
  const langs = new Set();
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length >= 2) {
      langs.add(parts[1].trim());
    }
  }
  return Array.from(langs);
}

console.log('Western languages:', getLangs(west));
console.log('Euro languages:', getLangs(euro));
