const fs = require('fs');
const path = require('path');

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  const rows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cols = [];
    let cur = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === '"') {
        if (inQuotes && line[c + 1] === '"') {
          cur += '"';
          c++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        cols.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    cols.push(cur.trim());
    rows.push(cols);
  }
  return rows;
}

// Color detection dictionary
const COLOR_RULES = [
  { match: /\b(gold|golden|amber|honey|sun|blond|aure|marigold|butter)\b/i, tag: 'golden' },
  { match: /\b(white|snow|blanche|bianc|albi|frost|pearl|ivory|chalk|cotton)\b/i, tag: 'white' },
  { match: /\b(black|noir|nero|kuro|shadow|midnight|coal|onyx|raven|sable)\b/i, tag: 'black' },
  { match: /\b(brown|cocoa|coffee|mocha|chocolate|chestnut|hazel|tawny|russet|brun)\b/i, tag: 'brown' },
  { match: /\b(orange|ginger|red|copper|flame|rusty|cinnamon|tangerine|citrus|mikan)\b/i, tag: 'orange' },
  { match: /\b(grey|gray|silver|ash|smoke|fog|slate|shadow)\b/i, tag: 'grey' },
  { match: /\b(spot|patch|speckle|dappled|marbl|oreo|harlequin|brindle)\b/i, tag: 'spotted' }
];

// Persona / vibe rules
const LUXURY_RE = /\b(king|queen|duke|duchess|prince|princess|lord|lady|baron|viscount|marquis|archduke|chancellor|emperor|empress|royal|noble|majesty|regal|splendor|imperial|jewel|gem|diamond|crystal|gold|silver|aristocrat|sterling|versace|bentley|chanel|rolex|tiffany|gucci|dignity|sovereign|opulent)\b/i;
const FUNNY_RE = /\b(funny|silly|witty|joke|comic|food|snack|nugget|waffle|pickle|bark|purr|paws|potato|spud|nacho|churro|meatball|noodle|goofy|chunky|captain|professor|dr\.|sir|tofu|wasabi|bubbles|cheddar|boop|twain|pudding|crumpet)\b/i;
const CUTE_RE = /\b(cute|sweet|soft|little|gentle|darling|cuddle|honey|blossom|flower|fluffy|baby|joy|peaceful|cake|sugar|candy|peach|cookie|cotton|sweetheart|mochi|mimi|pebble|button|sunny|petal|dewdrop|bakery|cupcake|biscuit|muffin)\b/i;
const BRAVE_RE = /\b(brave|fierce|warrior|strength|mighty|courage|hero|bold|hunter|thunder|storm|fire|lion|wolf|protector|valiant|spear|sword|guard|anchor)\b/i;
const MYSTICAL_RE = /\b(mystical|magic|celestial|cosmic|star|moon|shadow|night|spirit|god|goddess|astral|aurora|eclipse|nebula|oracle|fairy|rune|myth)\b/i;

function extractColors(text) {
  const colors = [];
  for (const rule of COLOR_RULES) {
    if (rule.match.test(text)) {
      colors.push(rule.tag);
    }
  }
  return colors;
}

function extractVibes(text, categoryText) {
  const vibes = new Set();
  const combined = `${text} ${categoryText}`.toLowerCase();

  if (LUXURY_RE.test(combined)) vibes.add('luxury');
  if (CUTE_RE.test(combined)) vibes.add('cute');
  if (FUNNY_RE.test(combined)) vibes.add('funny');
  if (BRAVE_RE.test(combined)) vibes.add('brave');
  if (MYSTICAL_RE.test(combined)) vibes.add('mystical');

  if (/\b(gentle|peace|pure|soft|calm|quiet|kind)\b/i.test(combined)) vibes.add('gentle');
  if (/\b(playful|cheerful|energy|jump|bright|happy|lively)\b/i.test(combined)) vibes.add('playful');
  if (/\b(nature|forest|wood|river|flower|meadow|leaf|tree|rose)\b/i.test(combined)) vibes.add('nature');
  if (/\b(food|bakery|bread|cake|culinary|sweet|tea|spice)\b/i.test(combined)) vibes.add('food');

  // Defaults if none matched
  if (vibes.size === 0) {
    vibes.add('friendly');
    vibes.add('classic');
  }

  return Array.from(vibes);
}

const eng1Rows = parseCsv('C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393969_32aab095.csv');
const eng2Rows = parseCsv('C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393906_549cdab9.csv');
const westRows = parseCsv('C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393952_6afeb59c.csv');
const euroRows = parseCsv('C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393953_844b528b.csv');

console.log('Ingesting records...');

const records = [];
const seen = new Set(); // deduplicate by language + name lowercase

// 1. Process Multilingual files (Western & European)
function processMulti(rows, prefix) {
  for (let i = 1; i < rows.length; i++) {
    const [rowId, lang, itemNo, dogName, dogMeaning, catName, catMeaning] = rows[i];
    if (!lang) continue;

    // Dog record
    if (dogName && dogName.trim()) {
      const cleanDog = dogName.trim();
      const key = `${lang.toLowerCase()}:${cleanDog.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        const meaning = dogMeaning || `${lang} name for faithful canine companions`;
        const colorTags = extractColors(`${cleanDog} ${meaning}`);
        const vibeTags = extractVibes(`${cleanDog} ${meaning}`, '');
        records.push({
          id: `${prefix}-dog-${rowId}`,
          name: cleanDog,
          meaning: meaning,
          origin_language: lang,
          gender: 'unisex',
          species: ['dog', 'cat'],
          color_tags: colorTags,
          vibe_tags: vibeTags,
          popularity: Math.floor(88 + (parseInt(rowId, 10) % 11))
        });
      }
    }

    // Cat record
    if (catName && catName.trim()) {
      const cleanCat = catName.trim();
      const key = `${lang.toLowerCase()}:${cleanCat.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        const meaning = catMeaning || `${lang} name for beloved feline companions`;
        const colorTags = extractColors(`${cleanCat} ${meaning}`);
        const vibeTags = extractVibes(`${cleanCat} ${meaning}`, '');
        records.push({
          id: `${prefix}-cat-${rowId}`,
          name: cleanCat,
          meaning: meaning,
          origin_language: lang,
          gender: 'unisex',
          species: ['cat', 'dog'],
          color_tags: colorTags,
          vibe_tags: vibeTags,
          popularity: Math.floor(88 + (parseInt(rowId, 10) % 11))
        });
      }
    }
  }
}

processMulti(westRows, 'west');
processMulti(euroRows, 'euro');

console.log(`Multilingual processed: ${records.length} records across 20 languages`);

// 2. Process English files (Part 1 and Part 2)
function processEnglish(rows, prefix) {
  let count = 0;
  for (let i = 1; i < rows.length; i++) {
    const [id, dogName, dogCat, catName, catCat] = rows[i];
    if (!id) continue;

    const parseEntry = (name, cat, species) => {
      if (!name || !name.trim()) return;
      const cleanName = name.trim();
      const key = `english:${cleanName.toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);

      const colorTags = extractColors(cleanName);
      const vibeTags = extractVibes(cleanName, cat || '');

      let meaning = '';
      if (vibeTags.includes('luxury')) {
        meaning = `Aristocratic title and regal English name reflecting dignity and luxury`;
      } else if (vibeTags.includes('cute')) {
        meaning = `Delightful sweet English name inspired by warmth, nature, and confectionery`;
      } else if (vibeTags.includes('funny')) {
        meaning = `Playful and witty English name celebrating character, charm, and fun`;
      } else if (cat && cat.toLowerCase().includes('first & middle')) {
        meaning = `Classic two-part harmonious English pet name`;
      } else {
        meaning = `Beloved traditional English pet name of friendship and loyalty`;
      }

      records.push({
        id: `${prefix}-${species}-${id}`,
        name: cleanName,
        meaning: meaning,
        origin_language: 'English',
        gender: 'unisex',
        species: species === 'dog' ? ['dog', 'cat'] : ['cat', 'dog'],
        color_tags: colorTags,
        vibe_tags: vibeTags,
        popularity: Math.floor(82 + (parseInt(id, 10) % 17))
      });
      count++;
    };

    parseEntry(dogName, dogCat, 'dog');
    parseEntry(catName, catCat, 'cat');
  }
  return count;
}

const eng1Count = processEnglish(eng1Rows, 'en1');
const eng2Count = processEnglish(eng2Rows, 'en2');
console.log(`English processed: ${eng1Count + eng2Count} unique records`);
console.log(`Total database size: ${records.length} pet names!`);

// Summary by language
const langCounts = {};
for (const r of records) {
  langCounts[r.origin_language] = (langCounts[r.origin_language] || 0) + 1;
}
console.log('Language breakdown:', langCounts);

// Summary by persona / vibe
const vibeCounts = {};
for (const r of records) {
  for (const v of r.vibe_tags) {
    vibeCounts[v] = (vibeCounts[v] || 0) + 1;
  }
}
console.log('Vibe breakdown:', vibeCounts);
