-- ========================================================
-- loveforpet.com - Supabase Seed Data (Multi-Language Names)
-- Run this in your Supabase SQL Editor after schema.sql
-- ========================================================

insert into public.pet_names (id, name, meaning, origin_language, pronunciation, gender, species, color_tags, vibe_tags, popularity, fun_fact)
values
  -- Japanese
  ('jp-1', 'Mochi (餅)', 'Sweet, soft Japanese rice cake representing good fortune', 'Japanese', 'MO-chee', 'unisex', array['dog', 'cat', 'rabbit'], array['white', 'cream', 'golden', 'spotted'], array['cute', 'sweet', 'gentle', 'food'], 98, 'One of the most popular Japanese names worldwide for cuddly pets.'),
  ('jp-2', 'Kuro (黒)', 'Black; sleek and mystical night shadow', 'Japanese', 'KOO-roh', 'unisex', array['dog', 'cat'], array['black', 'grey', 'dark'], array['mystical', 'noble', 'sleek'], 94, 'Classically given to sleek black cats and dark-coated dogs.'),
  ('jp-3', 'Shiro (白)', 'Pure white like winter snow and clarity', 'Japanese', 'SHEE-roh', 'unisex', array['dog', 'cat', 'rabbit', 'bird'], array['white', 'cream'], array['gentle', 'pure', 'calm'], 92, 'Shiro is the quintessential pure white pet name in Japan.'),
  ('jp-4', 'Mikan (みかん)', 'Sweet Japanese mandarin orange', 'Japanese', 'MEE-kahn', 'unisex', array['cat', 'dog', 'bird'], array['orange', 'golden', 'ginger'], array['cute', 'playful', 'food', 'cheerful'], 91, 'Perfect for ginger cats and golden puppies with sunny personalities.'),
  ('jp-5', 'Katsu (勝)', 'Victory, triumph, and strength', 'Japanese', 'KAHT-soo', 'male', array['dog', 'cat'], array['golden', 'brown', 'black'], array['brave', 'energetic', 'noble'], 88, 'Often given to spirited guard dogs or energetic puppies.'),
  ('jp-6', 'Sakura (桜)', 'Cherry blossom; emblem of spring, beauty, and new beginnings', 'Japanese', 'sah-KOO-rah', 'female', array['dog', 'cat', 'rabbit', 'bird'], array['white', 'cream', 'spotted'], array['sweet', 'gentle', 'nature', 'noble'], 97, 'Beloved in Japan for gentle female companions.'),
  ('jp-7', 'Choco (チョコ)', 'Rich chocolate, sweet and warm', 'Japanese', 'CHOH-koh', 'unisex', array['dog', 'cat'], array['brown', 'dark'], array['cute', 'food', 'sweet'], 90, null),
  ('jp-8', 'Yuki (雪)', 'Snow or happiness; calm and radiant', 'Japanese', 'YOO-kee', 'unisex', array['dog', 'cat', 'rabbit'], array['white', 'grey'], array['pure', 'gentle', 'calm'], 96, null),
  ('jp-9', 'Hoshi (星)', 'Star; shining light and guide', 'Japanese', 'HOH-shee', 'unisex', array['dog', 'cat', 'bird'], array['golden', 'white', 'spotted'], array['mystical', 'cheerful', 'nature'], 87, null),
  ('jp-10', 'Kuma (熊)', 'Bear; sturdy, big-hearted, and cuddly', 'Japanese', 'KOO-mah', 'male', array['dog', 'cat'], array['brown', 'black', 'golden'], array['brave', 'cuddly', 'nature'], 95, 'Extremely popular for fluffy breeds like Chow Chows and Akitas.'),

  -- French
  ('fr-1', 'Biscotti', 'Twice-baked almond biscuit with warm golden tones', 'French', 'bis-KOH-tee', 'unisex', array['dog', 'cat'], array['golden', 'cream', 'brown'], array['food', 'cute', 'sweet'], 89, null),
  ('fr-2', 'Bijou', 'Jewel or precious gemstone', 'French', 'bee-ZHOO', 'unisex', array['dog', 'cat', 'bird'], array['white', 'golden', 'spotted'], array['noble', 'sweet', 'cute'], 93, null),
  ('fr-3', 'Noir', 'Black, deep elegance and mystery', 'French', 'NWAHR', 'unisex', array['cat', 'dog'], array['black', 'dark'], array['sleek', 'mystical', 'noble'], 95, null),
  ('fr-4', 'Éclair', 'Flash of lightning or sweet pastry; fast and sweet', 'French', 'ay-KLAIR', 'unisex', array['dog', 'cat', 'rabbit'], array['brown', 'golden', 'orange'], array['food', 'energetic', 'playful'], 90, null),
  ('fr-5', 'Soleil', 'The sun; radiant warmth and light', 'French', 'soh-LAY', 'unisex', array['dog', 'cat', 'bird'], array['golden', 'orange', 'yellow', 'cream'], array['cheerful', 'warm', 'nature'], 91, null),
  ('fr-6', 'Fleur', 'Flower; delicate blossom', 'French', 'FLUR', 'female', array['cat', 'dog', 'rabbit', 'bird'], array['white', 'spotted', 'cream'], array['gentle', 'nature', 'sweet'], 92, null),
  ('fr-7', 'Beau', 'Handsome, dashing, and elegant', 'French', 'BOH', 'male', array['dog', 'cat'], array['black', 'golden', 'brown'], array['noble', 'gentle', 'sleek'], 94, null),
  ('fr-8', 'Caramel', 'Sweet molten golden sugar', 'French', 'kah-rah-MEL', 'unisex', array['dog', 'cat'], array['golden', 'brown', 'orange'], array['food', 'sweet', 'warm'], 93, null),

  -- Spanish
  ('es-1', 'Sol', 'Sun; radiant, bright, and loving', 'Spanish', 'SOHL', 'unisex', array['dog', 'cat', 'bird'], array['golden', 'orange', 'yellow'], array['cheerful', 'warm', 'nature'], 95, null),
  ('es-2', 'Luna', 'Moon; celestial beauty and calm serenity', 'Spanish', 'LOO-nah', 'female', array['dog', 'cat', 'rabbit'], array['white', 'grey', 'black', 'spotted'], array['mystical', 'gentle', 'noble'], 99, 'Currently the #1 female pet name across both Americas and Europe!'),
  ('es-3', 'Canela', 'Cinnamon; fragrant spice with reddish-brown warmth', 'Spanish', 'kah-NEH-lah', 'female', array['dog', 'cat'], array['orange', 'brown', 'golden'], array['warm', 'sweet', 'nature'], 92, null),
  ('es-4', 'Sombra', 'Shadow; agile, quiet, and devoted', 'Spanish', 'SOHM-brah', 'unisex', array['cat', 'dog'], array['black', 'grey', 'dark'], array['mystical', 'sleek', 'brave'], 88, null),
  ('es-5', 'Chico', 'Little boy, friendly companion', 'Spanish', 'CHEE-koh', 'male', array['dog', 'cat', 'bird'], array['brown', 'golden', 'spotted', 'black'], array['playful', 'friendly', 'cute'], 91, null),
  ('es-6', 'Blanco', 'White; pristine and snowy coat', 'Spanish', 'BLAHN-koh', 'male', array['dog', 'cat', 'rabbit'], array['white', 'cream'], array['pure', 'gentle', 'noble'], 86, null),
  ('es-7', 'Dulce', 'Sweet, honeyed, and affectionate', 'Spanish', 'DOOL-seh', 'female', array['dog', 'cat', 'rabbit'], array['cream', 'golden', 'white'], array['sweet', 'cute', 'gentle'], 89, null),
  ('es-8', 'Rico', 'Rich, delightful, or charming', 'Spanish', 'REE-koh', 'male', array['dog', 'cat', 'bird'], array['golden', 'brown', 'black'], array['playful', 'noble', 'cheerful'], 88, null),

  -- Italian
  ('it-1', 'Bellissimo', 'Most beautiful and magnificent', 'Italian', 'beh-LEES-see-moh', 'male', array['dog', 'cat'], array['golden', 'white', 'black'], array['noble', 'sweet', 'cheerful'], 85, null),
  ('it-2', 'Bella', 'Beautiful, lovely soul', 'Italian', 'BEHL-lah', 'female', array['dog', 'cat'], array['golden', 'white', 'brown', 'spotted'], array['sweet', 'gentle', 'noble'], 98, null),
  ('it-3', 'Nero', 'Deep black and strong', 'Italian', 'NEH-roh', 'male', array['dog', 'cat'], array['black', 'dark'], array['brave', 'sleek', 'noble'], 92, null),
  ('it-4', 'Piccolo', 'Little one, petite and adorable', 'Italian', 'PEEK-koh-loh', 'male', array['dog', 'cat', 'bird', 'rabbit'], array['white', 'golden', 'spotted', 'brown'], array['cute', 'playful', 'sweet'], 89, null),
  ('it-5', 'Amico', 'True friend and faithful companion', 'Italian', 'ah-MEE-koh', 'male', array['dog', 'cat'], array['golden', 'brown', 'black'], array['loyal', 'friendly', 'gentle'], 87, null),
  ('it-6', 'Zenzero', 'Ginger spice, lively and warm', 'Italian', 'DZEHN-dzeh-roh', 'unisex', array['cat', 'dog'], array['orange', 'ginger', 'golden'], array['playful', 'food', 'cheerful'], 84, null),
  ('it-7', 'Lupo', 'Wolf; spirited, wild, and brave', 'Italian', 'LOO-poh', 'male', array['dog'], array['grey', 'black', 'brown'], array['brave', 'wild', 'noble'], 91, null),

  -- Celtic / Irish
  ('celt-1', 'Rory (Ruairí)', 'Red King; passionate, warm, and loyal', 'Celtic / Irish', 'ROH-ree', 'unisex', array['dog', 'cat'], array['orange', 'golden', 'brown'], array['brave', 'warm', 'noble'], 94, null),
  ('celt-2', 'Finn (Fionn)', 'Fair, white, or bright-haired warrior', 'Celtic / Irish', 'FIN', 'male', array['dog', 'cat', 'rabbit'], array['white', 'cream', 'golden'], array['brave', 'cheerful', 'pure'], 96, null),
  ('celt-3', 'Keeva (Caoimhe)', 'Gentle, precious, and beautiful', 'Celtic / Irish', 'KEE-vah', 'female', array['dog', 'cat', 'rabbit'], array['white', 'cream', 'golden', 'spotted'], array['gentle', 'sweet', 'nature'], 88, null),
  ('celt-4', 'Rowan', 'Little red berry tree; sacred and protective', 'Celtic / Irish', 'ROH-an', 'unisex', array['dog', 'cat', 'bird'], array['orange', 'brown', 'golden'], array['nature', 'mystical', 'gentle'], 92, null),
  ('celt-5', 'Dara', 'Oak tree; sturdy, grounded, and enduring', 'Celtic / Irish', 'DAH-rah', 'unisex', array['dog', 'cat'], array['brown', 'golden', 'black'], array['strong', 'loyal', 'nature'], 85, null),

  -- Norse
  ('no-1', 'Thor', 'God of thunder and lightning; brave and powerful', 'Norse', 'THOHR', 'male', array['dog'], array['golden', 'brown', 'black', 'grey'], array['brave', 'strong', 'noble'], 97, null),
  ('no-2', 'Freya', 'Norse goddess of love, beauty, and golden cats', 'Norse', 'FRAY-ah', 'female', array['cat', 'dog'], array['golden', 'white', 'grey', 'cream'], array['noble', 'sweet', 'mystical'], 98, 'In Norse mythology, Freya drove a chariot pulled by giant blue-grey cats!'),
  ('no-3', 'Loki', 'Clever, playful, and charming trickster', 'Norse', 'LOH-kee', 'male', array['cat', 'dog'], array['black', 'orange', 'spotted', 'grey'], array['playful', 'mystical', 'energetic'], 96, null),
  ('no-4', 'Frost', 'Crisp ice crystal; cool and quiet', 'Norse', 'FROHST', 'unisex', array['dog', 'cat', 'rabbit'], array['white', 'grey', 'silver'], array['pure', 'calm', 'nature'], 89, null),
  ('no-5', 'Bjorn', 'Bear; hearty, gentle giant', 'Norse', 'BYORN', 'male', array['dog'], array['brown', 'black'], array['strong', 'cuddly', 'brave'], 91, null),

  -- Latin / Greek
  ('lat-1', 'Aurelius', 'Golden, luminous, and noble', 'Latin', 'aw-REE-lee-us', 'male', array['dog', 'cat', 'bird'], array['golden', 'yellow', 'cream'], array['noble', 'wise', 'gentle'], 90, null),
  ('lat-2', 'Stella', 'Star; shining beacon of love', 'Latin', 'STEL-lah', 'female', array['dog', 'cat', 'bird'], array['white', 'golden', 'spotted'], array['sweet', 'cheerful', 'nature'], 95, null),
  ('lat-3', 'Felix', 'Lucky, fortunate, and happy', 'Latin', 'FEE-liks', 'male', array['cat', 'dog'], array['black', 'white', 'spotted'], array['cheerful', 'playful', 'lucky'], 93, null),
  ('grk-1', 'Apollo', 'Greek god of the sun, light, music, and truth', 'Greek', 'uh-POL-oh', 'male', array['dog', 'cat', 'bird'], array['golden', 'white', 'orange'], array['noble', 'bright', 'brave'], 95, null),
  ('grk-2', 'Zeus', 'Sky ruler; majestic and kingly', 'Greek', 'ZOOS', 'male', array['dog'], array['black', 'brown', 'grey'], array['brave', 'strong', 'noble'], 96, null),
  ('grk-3', 'Chloe', 'Young green sprout; blooming life and innocence', 'Greek', 'KLOH-ee', 'female', array['dog', 'cat', 'rabbit'], array['cream', 'golden', 'white'], array['sweet', 'gentle', 'cute'], 92, null),

  -- Hindi / Sanskrit
  ('hi-1', 'Sonu', 'Golden boy; precious and cherished', 'Hindi', 'SOH-noo', 'male', array['dog', 'cat', 'bird'], array['golden', 'cream', 'yellow'], array['sweet', 'cheerful', 'cute'], 90, null),
  ('hi-2', 'Kalu', 'Black darling; affectionate name for dark-coated beauties', 'Hindi', 'KAH-loo', 'unisex', array['dog', 'cat'], array['black', 'dark'], array['cuddly', 'loyal', 'friendly'], 88, null),
  ('hi-3', 'Ananda', 'Pure bliss, joy, and delight', 'Sanskrit', 'ah-NAHN-dah', 'unisex', array['dog', 'cat', 'rabbit'], array['white', 'golden', 'spotted'], array['peaceful', 'sweet', 'gentle'], 86, null),
  ('hi-4', 'Sheru', 'Little lion; brave, fierce, and regal heart', 'Hindi', 'SHAY-roo', 'male', array['dog', 'cat'], array['golden', 'orange', 'brown'], array['brave', 'noble', 'strong'], 92, null),
  ('hi-5', 'Moti', 'Pearl; rare, gleaming, and priceless', 'Hindi', 'MOH-tee', 'unisex', array['dog', 'cat', 'rabbit'], array['white', 'cream', 'silver'], array['pure', 'gentle', 'precious'], 89, null),

  -- Arabic & Swahili
  ('ar-1', 'Zahra', 'Brilliant blooming flower; radiant and shining', 'Arabic', 'ZAH-rah', 'female', array['cat', 'dog', 'bird'], array['white', 'cream', 'golden', 'spotted'], array['sweet', 'noble', 'nature'], 91, null),
  ('ar-2', 'Amir', 'Prince or leader; dignified and loyal', 'Arabic', 'ah-MEER', 'male', array['dog', 'cat'], array['black', 'golden', 'brown'], array['noble', 'loyal', 'brave'], 92, null),
  ('ar-3', 'Habibi', 'My beloved, my sweetheart', 'Arabic', 'hah-BEE-bee', 'unisex', array['dog', 'cat', 'rabbit', 'bird'], array['golden', 'brown', 'cream', 'black', 'white'], array['sweet', 'cuddly', 'loving'], 95, null),
  ('ar-4', 'Qamar', 'Full moon; luminous and serene guide', 'Arabic', 'KAH-mar', 'unisex', array['cat', 'dog'], array['white', 'grey', 'silver'], array['mystical', 'gentle', 'calm'], 88, null),
  ('sw-1', 'Simba', 'Lion; courage, majesty, and strength', 'Swahili', 'SEEM-bah', 'male', array['dog', 'cat'], array['golden', 'orange', 'brown'], array['brave', 'noble', 'playful'], 99, null),
  ('sw-2', 'Rafiki', 'Loyal and trustworthy friend', 'Swahili', 'rah-FEE-kee', 'unisex', array['dog', 'cat', 'bird'], array['brown', 'spotted', 'black', 'golden'], array['friendly', 'loyal', 'wise'], 90, null),

  -- Korean & English
  ('ko-1', 'Bori (보리)', 'Barley grain; warm golden-brown earth', 'Korean', 'BOH-ree', 'unisex', array['dog', 'cat'], array['golden', 'brown', 'cream'], array['cute', 'nature', 'warm'], 94, null),
  ('ko-2', 'Gureum (구름)', 'Fluffy cloud floating gently in the sky', 'Korean', 'GOO-reum', 'unisex', array['dog', 'cat', 'rabbit'], array['white', 'cream', 'grey'], array['cuddly', 'gentle', 'pure'], 93, null),
  ('ko-3', 'Nabi (나비)', 'Butterfly; light-footed and graceful', 'Korean', 'NAH-bee', 'unisex', array['cat', 'dog', 'rabbit'], array['spotted', 'calico', 'white', 'golden'], array['graceful', 'playful', 'nature'], 95, 'Nabi is South Korea’s most traditional and beloved name for playful cats.'),
  ('en-1', 'Bailey', 'Trusted keeper, warm friend, sweet cream liqueur', 'English', 'BAY-lee', 'unisex', array['dog', 'cat'], array['golden', 'cream', 'brown'], array['friendly', 'sweet', 'cuddly'], 97, null),
  ('en-2', 'Shadow', 'Constantly by your side like a gentle shadow', 'English', 'SHAD-oh', 'unisex', array['dog', 'cat'], array['black', 'grey'], array['loyal', 'mystical', 'sleek'], 94, null),
  ('en-3', 'Daisy', 'Day’s eye; cheerful yellow and white wildflower', 'English', 'DAY-zee', 'female', array['dog', 'cat', 'rabbit'], array['white', 'golden', 'yellow', 'cream'], array['cheerful', 'nature', 'sweet'], 96, null),
  ('en-4', 'Copper', 'Warm reddish-metallic coat, spirited hound', 'English', 'KOP-er', 'male', array['dog', 'cat'], array['orange', 'brown', 'ginger'], array['friendly', 'energetic', 'nature'], 92, null),
  ('en-5', 'Pepper', 'Zesty spice, specks of charcoal and grey', 'English', 'PEP-er', 'unisex', array['dog', 'cat', 'bird'], array['black', 'grey', 'spotted'], array['playful', 'feisty', 'food'], 93, null)
on conflict (id) do update set
  name = excluded.name,
  meaning = excluded.meaning,
  origin_language = excluded.origin_language,
  pronunciation = excluded.pronunciation,
  gender = excluded.gender,
  species = excluded.species,
  color_tags = excluded.color_tags,
  vibe_tags = excluded.vibe_tags,
  popularity = excluded.popularity,
  fun_fact = excluded.fun_fact;
