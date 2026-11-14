const fs = require('fs');

const files = [
  { name: 'english_dog_and_cat_names_5000_each.csv', path: 'C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393969_32aab095.csv' },
  { name: 'english_dog_and_cat_names_part2_5000_each.csv', path: 'C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393906_549cdab9.csv' },
  { name: 'western_languages_50_dog_and_50_cat_names.csv', path: 'C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393952_6afeb59c.csv' },
  { name: 'european_languages_part2_50_dog_and_50_cat_names.csv', path: 'C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393953_844b528b.csv' }
];

for (const f of files) {
  try {
    const content = fs.readFileSync(f.path, 'utf8');
    const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
    console.log(`\n=== File: ${f.name} ===`);
    console.log(`Total lines: ${lines.length}`);
    console.log(`Header: ${lines[0]}`);
    console.log(`Sample 1: ${lines[1]}`);
    console.log(`Sample 2: ${lines[2]}`);
    console.log(`Sample 3: ${lines[3]}`);
  } catch (err) {
    console.error(`Error reading ${f.name}:`, err.message);
  }
}
