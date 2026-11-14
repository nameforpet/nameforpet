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

// Color detection rules
const COLOR_RULES = [
  { match: /\b(gold|golden|amber|honey|sun|blond|aure|marigold|butter|apricot|bronze)\b/i, tag: 'golden' },
  { match: /\b(white|snow|blanche|bianc|albi|frost|pearl|ivory|chalk|cotton|frosty|luna)\b/i, tag: 'white' },
  { match: /\b(black|noir|nero|kuro|shadow|midnight|coal|onyx|raven|sable|jet|pitch)\b/i, tag: 'black' },
  { match: /\b(brown|cocoa|coffee|mocha|chocolate|chestnut|hazel|tawny|russet|brun|copper)\b/i, tag: 'brown' },
  { match: /\b(orange|ginger|red|flame|rusty|cinnamon|tangerine|citrus|mikan|ruby|scarlet)\b/i, tag: 'orange' },
  { match: /\b(grey|gray|silver|ash|smoke|fog|slate|shadow|pewter)\b/i, tag: 'grey' },
  { match: /\b(spot|patch|speckle|dappled|marbl|oreo|harlequin|brindle|calico|freckle)\b/i, tag: 'spotted' }
];

// Persona / vibe rules
const LUXURY_RE = /\b(king|queen|duke|duchess|prince|princess|lord|lady|baron|viscount|marquis|archduke|chancellor|emperor|empress|royal|noble|majesty|regal|splendor|imperial|jewel|gem|diamond|crystal|gold|silver|aristocrat|sterling|versace|bentley|chanel|rolex|tiffany|gucci|dignity|sovereign|opulent|reign|crown|coronet|admiral|monarch|sir\b|lady\b)\b/i;
const FUNNY_RE = /\b(funny|silly|witty|joke|comic|snack|nugget|waffle|pickle|bark|purr|paws|potato|spud|nacho|churro|meatball|noodle|goofy|chunky|captain|professor|dr\.|tofu|wasabi|bubbles|cheddar|boop|twain|pudding|crumpet|taco|bacon|cheesy|bloop|doodle|munchkin)\b/i;
const CUTE_RE = /\b(cute|sweet|soft|little|gentle|darling|cuddle|honey|blossom|flower|fluffy|baby|joy|peaceful|cake|sugar|candy|peach|cookie|cotton|sweetheart|mochi|mimi|pebble|button|sunny|petal|dewdrop|bakery|cupcake|biscuit|muffin|pie|buttercup|daisy|pixie)\b/i;
const BRAVE_RE = /\b(brave|fierce|warrior|strength|mighty|courage|hero|bold|hunter|thunder|storm|fire|lion|wolf|protector|valiant|spear|sword|guard|anchor|iron|vanguard|thor|ares)\b/i;
const MYSTICAL_RE = /\b(mystical|magic|celestial|cosmic|star|moon|shadow|night|spirit|god|goddess|astral|aurora|eclipse|nebula|oracle|fairy|rune|myth|phantom|zenith|sol)\b/i;

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
  if (/\b(nature|forest|wood|river|flower|meadow|leaf|tree|rose|bramble|thistle)\b/i.test(combined)) vibes.add('nature');
  if (/\b(food|bakery|bread|cake|culinary|sweet|tea|spice)\b/i.test(combined)) vibes.add('food');

  // Defaults if none matched
  if (vibes.size === 0) {
    vibes.add('friendly');
    vibes.add('classic');
  }

  return Array.from(vibes);
}

// Ingest Starter Names from petNamesData.ts (Japanese, etc.)
const starterNamesPath = path.join(__dirname, '../lib/petNamesData.ts');
let starterNames = [];
try {
  const rawStarter = fs.readFileSync(starterNamesPath, 'utf8');
  // Simple extraction of Japanese entries
  const jpRegex = /{\s*id:\s*'(jp-[^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?meaning:\s*'([^']+)'[\s\S]*?origin_language:\s*'([^']+)'[\s\S]*?}/g;
  let match;
  while ((match = jpRegex.exec(rawStarter)) !== null) {
    starterNames.push({
      id: match[1],
      name: match[2],
      meaning: match[3],
      origin_language: match[4],
      gender: 'unisex',
      species: ['dog', 'cat', 'rabbit'],
      color_tags: extractColors(`${match[2]} ${match[3]}`),
      vibe_tags: extractVibes(`${match[2]} ${match[3]}`, ''),
      popularity: 95
    });
  }
} catch (e) {
  console.warn('Could not read starter Japanese names:', e.message);
}

const eng1Path = 'C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393969_32aab095.csv';
const eng2Path = 'C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393906_549cdab9.csv';
const westPath = 'C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393952_6afeb59c.csv';
const euroPath = 'C:/Users/ps/.gemini/antigravity/brain/9ad5150c-3acc-43cb-bd05-9419e297d6b1/.user_uploaded/media_1793579393953_844b528b.csv';

const records = [];
const seen = new Set();

// Add starter Japanese names
for (const s of starterNames) {
  seen.add(`${s.origin_language.toLowerCase()}:${s.name.toLowerCase()}`);
  records.push(s);
}

// Multilingual files (Western & European)
const westRows = parseCsv(westPath);
const euroRows = parseCsv(euroPath);

function processMulti(rows, prefix) {
  for (let i = 1; i < rows.length; i++) {
    const [rowId, lang, itemNo, dogName, dogMeaning, catName, catMeaning] = rows[i];
    if (!lang) continue;

    // Dog
    if (dogName && dogName.trim()) {
      const cleanDog = dogName.trim();
      const key = `${lang.toLowerCase()}:${cleanDog.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        const meaning = dogMeaning || `${lang} name of devotion and charm`;
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

    // Cat
    if (catName && catName.trim()) {
      const cleanCat = catName.trim();
      const key = `${lang.toLowerCase()}:${cleanCat.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        const meaning = catMeaning || `${lang} name of grace and beauty`;
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

// English files
const eng1Rows = parseCsv(eng1Path);
const eng2Rows = parseCsv(eng2Path);

function processEnglish(rows, prefix) {
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
    };

    parseEntry(dogName, dogCat, 'dog');
    parseEntry(catName, catCat, 'cat');
  }
}

processEnglish(eng1Rows, 'en1');
processEnglish(eng2Rows, 'en2');

console.log(`Writing unified database with ${records.length} pet names...`);

// Write to src/data/unifiedPetNames.json
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const outPath = path.join(dataDir, 'unifiedPetNames.json');
fs.writeFileSync(outPath, JSON.stringify(records, null, 2), 'utf8');

console.log(`Successfully generated ${outPath} (${(fs.statSync(outPath).size / (1024 * 1024)).toFixed(2)} MB)`);
