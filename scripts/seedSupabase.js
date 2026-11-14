const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = 'https://tpyceqabdimkusdaxgax.supabase.co';
const key = 'sb_publishable_99RlD1GbTSAc9Aa3YPHAQQ_YrJcg8N2';

const supabase = createClient(url, key);

async function seed() {
  console.log('Testing connection to Supabase...');
  const { data: test, error: testErr } = await supabase.from('pet_names').select('id').limit(1);
  if (testErr) {
    console.error('Table test failed:', testErr.message);
    console.log('Please make sure you have run the schema.sql in Supabase SQL Editor first!');
    return;
  }

  console.log('Loading names from unifiedPetNames.json...');
  const names = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/unifiedPetNames.json'), 'utf8'));
  console.log(`Found ${names.length} pet names to upload.`);

  const BATCH_SIZE = 250;
  for (let i = 0; i < names.length; i += BATCH_SIZE) {
    const batch = names.slice(i, i + BATCH_SIZE).map(n => ({
      id: n.id,
      name: n.name,
      meaning: n.meaning,
      origin_language: n.origin_language,
      pronunciation: n.pronunciation || null,
      gender: n.gender || 'unisex',
      species: Array.isArray(n.species) ? n.species : [n.species],
      color_tags: n.color_tags || [],
      vibe_tags: n.vibe_tags || [],
      popularity: n.popularity || 80,
      fun_fact: n.fun_fact || null
    }));

    const { error } = await supabase.from('pet_names').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error(`Error in batch ${i} to ${i + BATCH_SIZE}:`, error.message);
      break;
    }
    console.log(`Uploaded ${Math.min(i + BATCH_SIZE, names.length)} / ${names.length} names...`);
  }
  console.log('Finished uploading names to Supabase cloud!');
}

seed();
