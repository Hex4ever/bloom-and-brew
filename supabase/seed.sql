-- Bloom & Brew — seed data
-- Run AFTER 001_initial_schema.sql
-- Paste into Supabase SQL editor → Run

-- ── Curated grinders (user_id = null) ────────────────────────────────────────
insert into public.grinders (name, clicks_per_1000um, detent_style, is_default) values
  ('Comandante C40',   33,   'half',  false),
  ('1Zpresso JX',      77,   'half',  false),
  ('1Zpresso K-Ultra', 12.5, 'half',  false),
  ('Baratza Encore',   25,   'whole', false),
  ('Timemore C2',      40,   'whole', false),
  ('Fellow Ode Gen 2', 30,   'whole', false);

-- ── Curated recipes ───────────────────────────────────────────────────────────
-- V60
insert into public.recipes
  (method, title, source_author, dose_g, water_g, temp_c, ratio, brew_time_s, difficulty, is_curated, steps, flavor_profile)
values
(
  'v60', 'Hoffmann Ultimate V60', 'James Hoffmann',
  15, 250, 96, round(250.0/15, 2), 210, 'Advanced', true,
  '[
    {"t":0,  "label":"Bloom",       "desc":"Pour 45g water, swirl gently to saturate all grounds",       "pour":45},
    {"t":45, "label":"First pour",  "desc":"Pour to 100g in slow circles from center outward",            "pour":55},
    {"t":75, "label":"Second pour", "desc":"Pour to 175g, keep the level high",                           "pour":75},
    {"t":105,"label":"Final pour",  "desc":"Pour to 250g, gentle swirl to flatten the bed",               "pour":75},
    {"t":210,"label":"Drawdown",    "desc":"Let it finish. Should complete around 3:30 total",             "pour":0}
  ]'::jsonb,
  '{"sweetness":7,"acidity":8,"body":6,"bitterness":4,"aftertaste":8}'::jsonb
),
(
  'v60', 'Tetsu Kasuya 4:6 Method', 'Tetsu Kasuya',
  20, 300, 92, round(300.0/20, 2), 210, 'Intermediate', true,
  '[
    {"t":0,  "label":"Pour 1 — Sweetness","desc":"Pour 50g slowly. Smaller pour = more sweetness",         "pour":50},
    {"t":45, "label":"Pour 2 — Acidity",  "desc":"Pour to 120g. This pour balances the acidity",           "pour":70},
    {"t":90, "label":"Pour 3",            "desc":"Pour to 180g. Controls strength",                        "pour":60},
    {"t":135,"label":"Pour 4",            "desc":"Pour to 240g",                                           "pour":60},
    {"t":180,"label":"Pour 5",            "desc":"Pour to 300g. Final pour for strength",                  "pour":60},
    {"t":210,"label":"Drawdown",          "desc":"Let it finish, aim for 3:30 total",                      "pour":0}
  ]'::jsonb,
  '{"sweetness":8,"acidity":7,"body":6,"bitterness":3,"aftertaste":8}'::jsonb
),
(
  'v60', 'Lance Hedrick One Cup', 'Lance Hedrick',
  14, 230, 99, round(230.0/14, 2), 180, 'Intermediate', true,
  '[
    {"t":0,  "label":"Bloom",     "desc":"Pour 60g at near-boiling water, swirl hard",                    "pour":60},
    {"t":45, "label":"Main pour", "desc":"Pour continuously to 230g in slow spiral, ~30s",                "pour":170},
    {"t":75, "label":"Rao spin",  "desc":"Swirl the dripper once to flatten the bed",                     "pour":0},
    {"t":180,"label":"Drawdown",  "desc":"Complete around 2:30-3:00 total",                               "pour":0}
  ]'::jsonb,
  '{"sweetness":7,"acidity":8,"body":5,"bitterness":4,"aftertaste":7}'::jsonb
),
(
  'v60', 'Scott Rao Pulse Pour', 'Scott Rao',
  22, 360, 95, round(360.0/22, 2), 240, 'Advanced', true,
  '[
    {"t":0,  "label":"Bloom",    "desc":"Pour 66g (3x dose), swirl thoroughly",                           "pour":66},
    {"t":45, "label":"Pulse 1",  "desc":"Pour to 180g in gentle pulses",                                  "pour":114},
    {"t":90, "label":"Pulse 2",  "desc":"Pour to 270g, maintain slurry level",                            "pour":90},
    {"t":135,"label":"Pulse 3",  "desc":"Pour to 360g, then spin the dripper",                            "pour":90},
    {"t":240,"label":"Drawdown", "desc":"Target 4:00 total brew time",                                    "pour":0}
  ]'::jsonb,
  '{"sweetness":7,"acidity":7,"body":7,"bitterness":4,"aftertaste":8}'::jsonb
),
(
  'v60', 'Onyx Classic V60', 'Onyx Coffee Lab',
  22, 350, 96, round(350.0/22, 2), 210, 'Intermediate', true,
  '[
    {"t":0,  "label":"Bloom",            "desc":"Pour 60g water, stir gently with a spoon",               "pour":60},
    {"t":30, "label":"First main pour",  "desc":"Pour to 200g over 30 seconds",                           "pour":140},
    {"t":75, "label":"Second main pour", "desc":"Pour to 350g over 30 seconds",                           "pour":150},
    {"t":210,"label":"Drawdown",         "desc":"Total time around 3:30",                                  "pour":0}
  ]'::jsonb,
  '{"sweetness":7,"acidity":7,"body":6,"bitterness":4,"aftertaste":7}'::jsonb
),
(
  'v60', 'Blue Bottle Method', 'Blue Bottle Coffee',
  30, 500, 93, round(500.0/30, 2), 240, 'Intermediate', true,
  '[
    {"t":0,  "label":"Bloom",       "desc":"Pour 60g (2x dose), gentle swirl",                            "pour":60},
    {"t":45, "label":"First pour",  "desc":"Pour to 150g in circular motion",                             "pour":90},
    {"t":90, "label":"Second pour", "desc":"Pour to 300g, keep level steady",                             "pour":150},
    {"t":150,"label":"Third pour",  "desc":"Pour to 500g, finish the brew",                               "pour":200},
    {"t":240,"label":"Drawdown",    "desc":"Target 4:00 total",                                           "pour":0}
  ]'::jsonb,
  '{"sweetness":6,"acidity":7,"body":6,"bitterness":4,"aftertaste":6}'::jsonb
),
(
  'v60', 'Iced V60 (Japanese-style)', 'Mark Prince',
  20, 200, 96, round(200.0/20, 2), 200, 'Intermediate', true,
  '[
    {"t":0,  "label":"Ice in server","desc":"Add 100g ice to the server before brewing",                   "pour":0},
    {"t":15, "label":"Bloom",        "desc":"Pour 40g over grounds, swirl",                               "pour":40},
    {"t":45, "label":"Main pour",    "desc":"Pour to 200g in gentle spiral",                               "pour":160},
    {"t":150,"label":"Drawdown",     "desc":"Coffee drips onto ice — instant chill",                      "pour":0},
    {"t":200,"label":"Swirl",        "desc":"Swirl the server to mix. Serve over fresh ice",               "pour":0}
  ]'::jsonb,
  '{"sweetness":6,"acidity":9,"body":4,"bitterness":3,"aftertaste":7}'::jsonb
),

-- Aeropress
(
  'aeropress', 'World Aeropress Champion ''23', 'Carlos de la Torre',
  14, 200, 88, round(200.0/14, 2), 135, 'Intermediate', true,
  '[
    {"t":0,  "label":"Add water","desc":"Pour 200g water quickly, stir 3 times with paddle",               "pour":200},
    {"t":60, "label":"Steep",    "desc":"Attach cap, let sit undisturbed",                                 "pour":0},
    {"t":105,"label":"Press",    "desc":"Press slowly and steadily over 30 seconds",                       "pour":0},
    {"t":135,"label":"Done",     "desc":"Stop when you hear the hiss",                                     "pour":0}
  ]'::jsonb,
  '{"sweetness":8,"acidity":6,"body":7,"bitterness":4,"aftertaste":8}'::jsonb
),
(
  'aeropress', 'Inverted Method', 'Aeropress Co.',
  17, 220, 85, round(220.0/17, 2), 120, 'Intermediate', true,
  '[
    {"t":0, "label":"Invert & load","desc":"Flip Aeropress upside down, add grounds",                      "pour":0},
    {"t":10,"label":"Pour water",   "desc":"Pour 220g water, stir briskly 5 times",                       "pour":220},
    {"t":60,"label":"Attach cap",   "desc":"Screw on rinsed filter cap, wait",                            "pour":0},
    {"t":90,"label":"Flip & press", "desc":"Carefully flip onto cup, press over 25s",                     "pour":0},
    {"t":120,"label":"Done",        "desc":"Stop at the hiss — don''t squeeze more",                      "pour":0}
  ]'::jsonb,
  '{"sweetness":7,"acidity":6,"body":8,"bitterness":5,"aftertaste":7}'::jsonb
),
(
  'aeropress', 'Tim Wendelboe AP', 'Tim Wendelboe',
  15, 220, 90, round(220.0/15, 2), 135, 'Intermediate', true,
  '[
    {"t":0, "label":"Bloom",     "desc":"Pour 30g water, stir once, bloom 30s",                           "pour":30},
    {"t":30,"label":"Fill",      "desc":"Pour to 220g, don''t stir again",                                "pour":190},
    {"t":60,"label":"Cap & wait","desc":"Attach cap immediately to trap heat",                             "pour":0},
    {"t":90,"label":"Press",     "desc":"Press slowly over 45 seconds",                                   "pour":0},
    {"t":135,"label":"Done",     "desc":"Stop when you feel resistance",                                  "pour":0}
  ]'::jsonb,
  '{"sweetness":7,"acidity":7,"body":7,"bitterness":4,"aftertaste":7}'::jsonb
),
(
  'aeropress', 'Hoffmann Ultimate Aeropress', 'James Hoffmann',
  11, 200, 95, round(200.0/11, 2), 180, 'Advanced', true,
  '[
    {"t":0,  "label":"Add water","desc":"Pour 200g quickly, stir once gently",                             "pour":200},
    {"t":15, "label":"Wait",     "desc":"Let it steep untouched",                                          "pour":0},
    {"t":120,"label":"Swirl",    "desc":"Swirl the Aeropress gently to settle grounds",                    "pour":0},
    {"t":150,"label":"Press",    "desc":"Press slowly over 30 seconds",                                    "pour":0},
    {"t":180,"label":"Done",     "desc":"Stop before the hiss for cleaner cup",                            "pour":0}
  ]'::jsonb,
  '{"sweetness":7,"acidity":7,"body":6,"bitterness":4,"aftertaste":8}'::jsonb
),
(
  'aeropress', 'Fast & Strong', 'Community',
  18, 150, 92, round(150.0/18, 2), 65, 'Beginner', true,
  '[
    {"t":0, "label":"Add water",   "desc":"Pour 150g water, stir vigorously",                             "pour":150},
    {"t":15,"label":"Short steep", "desc":"Cap quickly, brief rest",                                      "pour":0},
    {"t":45,"label":"Press",       "desc":"Press firmly over 20 seconds",                                 "pour":0},
    {"t":65,"label":"Dilute",      "desc":"Add 100g hot water to the cup to taste",                       "pour":0}
  ]'::jsonb,
  '{"sweetness":5,"acidity":5,"body":9,"bitterness":7,"aftertaste":6}'::jsonb
),
(
  'aeropress', 'Iced Aeropress', 'Community',
  18, 120, 88, round(120.0/18, 2), 100, 'Beginner', true,
  '[
    {"t":0, "label":"Ice in cup",   "desc":"Fill cup with 100g ice",                                      "pour":0},
    {"t":10,"label":"Add water",    "desc":"Pour 120g hot water into Aeropress, stir",                    "pour":120},
    {"t":45,"label":"Steep",        "desc":"Cap and rest briefly",                                        "pour":0},
    {"t":75,"label":"Press",        "desc":"Press onto ice over 25 seconds",                              "pour":0},
    {"t":100,"label":"Stir & serve","desc":"Stir to melt ice and chill. Top up if needed",                "pour":0}
  ]'::jsonb,
  '{"sweetness":5,"acidity":8,"body":5,"bitterness":4,"aftertaste":6}'::jsonb
),

-- Chemex
(
  'chemex', 'Classic Chemex 6-cup', 'Chemex Co.',
  42, 700, 96, round(700.0/42, 2), 330, 'Advanced', true,
  '[
    {"t":0,  "label":"Bloom",      "desc":"Pour 100g water (2.5x dose), swirl carafe gently",             "pour":100},
    {"t":45, "label":"First pour", "desc":"Pour to 300g in slow spirals",                                 "pour":200},
    {"t":120,"label":"Second pour","desc":"Pour to 500g, maintaining level",                              "pour":200},
    {"t":210,"label":"Final pour", "desc":"Pour to 700g",                                                 "pour":200},
    {"t":330,"label":"Drawdown",   "desc":"Target 5:30 total. Remove filter, swirl to mix",               "pour":0}
  ]'::jsonb,
  '{"sweetness":7,"acidity":8,"body":5,"bitterness":3,"aftertaste":8}'::jsonb
),
(
  'chemex', 'Chemex Single Cup', 'Community',
  22, 360, 96, round(360.0/22, 2), 240, 'Advanced', true,
  '[
    {"t":0,  "label":"Bloom",     "desc":"Pour 50g water, swirl",                                         "pour":50},
    {"t":40, "label":"Main pour", "desc":"Pour to 200g in slow circles",                                  "pour":150},
    {"t":100,"label":"Final pour","desc":"Pour to 360g, gently",                                          "pour":160},
    {"t":240,"label":"Drawdown",  "desc":"Target 4:30 total",                                             "pour":0}
  ]'::jsonb,
  '{"sweetness":7,"acidity":8,"body":5,"bitterness":3,"aftertaste":7}'::jsonb
),

-- French Press
(
  'french', 'Hoffmann French Press', 'James Hoffmann',
  30, 500, 95, round(500.0/30, 2), 540, 'Beginner', true,
  '[
    {"t":0,  "label":"Pour water", "desc":"Pour all 500g water quickly over grounds",                     "pour":500},
    {"t":240,"label":"Break crust","desc":"Gently stir the crust with a spoon, 3 times",                  "pour":0},
    {"t":260,"label":"Skim",       "desc":"Scoop off floating foam and grounds with 2 spoons",            "pour":0},
    {"t":300,"label":"Rest",       "desc":"Let it settle — grounds sink to the bottom",                   "pour":0},
    {"t":540,"label":"Pour gently","desc":"Pour slowly without plunging — the filter stays up top",       "pour":0}
  ]'::jsonb,
  '{"sweetness":7,"acidity":5,"body":9,"bitterness":5,"aftertaste":7}'::jsonb
),
(
  'french', 'Classic French Press', 'Community',
  30, 500, 94, round(500.0/30, 2), 270, 'Beginner', true,
  '[
    {"t":0,  "label":"Pour water",    "desc":"Pour 500g water over grounds, stir briefly",                "pour":500},
    {"t":30, "label":"Attach plunger","desc":"Place plunger on top (don''t press)",                       "pour":0},
    {"t":240,"label":"Press",         "desc":"Press slowly and steadily to the bottom",                   "pour":0},
    {"t":270,"label":"Serve",         "desc":"Decant immediately — don''t let it sit on grounds",         "pour":0}
  ]'::jsonb,
  '{"sweetness":6,"acidity":5,"body":9,"bitterness":6,"aftertaste":6}'::jsonb
),

-- Moka Pot
(
  'moka', 'Stovetop Classic', 'Bialetti',
  18, 200, 100, round(200.0/18, 2), 330, 'Intermediate', true,
  '[
    {"t":0,  "label":"Pre-heat water","desc":"Fill bottom chamber with pre-heated water to the valve",    "pour":0},
    {"t":30, "label":"Add grounds",   "desc":"Fill basket level — don''t tamp. Assemble tightly",         "pour":0},
    {"t":60, "label":"Medium heat",   "desc":"Place on stove, lid open, medium flame",                   "pour":0},
    {"t":180,"label":"Listen",        "desc":"Coffee begins streaming — honey-colored, steady",           "pour":0},
    {"t":300,"label":"Pull off heat", "desc":"Remove when stream turns pale/blonde",                      "pour":0},
    {"t":330,"label":"Cool the base", "desc":"Run cold water on the bottom to stop extraction",           "pour":0}
  ]'::jsonb,
  '{"sweetness":5,"acidity":5,"body":9,"bitterness":7,"aftertaste":6}'::jsonb
),
(
  'moka', 'Moka Concentrate', 'Community',
  14, 150, 100, round(150.0/14, 2), 360, 'Intermediate', true,
  '[
    {"t":0,  "label":"Hot water in base","desc":"Fill with 150g pre-heated water",                        "pour":0},
    {"t":30, "label":"Level the basket", "desc":"Fill basket, level flat — no tamping",                   "pour":0},
    {"t":60, "label":"Low-medium heat",  "desc":"Assemble, place on gentle flame",                        "pour":0},
    {"t":240,"label":"Stream starts",    "desc":"Watch for steady honey stream",                          "pour":0},
    {"t":360,"label":"Done",             "desc":"Off heat when it sputters, cool base",                   "pour":0}
  ]'::jsonb,
  '{"sweetness":4,"acidity":4,"body":10,"bitterness":8,"aftertaste":6}'::jsonb
),

-- Espresso
(
  'espresso', 'Modern Espresso', 'Lance Hedrick',
  18, 36, 93, round(36.0/18, 2), 55, 'Expert', true,
  '[
    {"t":0, "label":"Flush the group",   "desc":"Run 2s flush to stabilize temperature",                  "pour":0},
    {"t":5, "label":"Dose & distribute", "desc":"Grind 18g in, WDT with needles to break clumps",        "pour":0},
    {"t":20,"label":"Tamp",              "desc":"Level, even tamp. ~15kg pressure",                      "pour":0},
    {"t":25,"label":"Lock & pull",       "desc":"Lock portafilter, start shot immediately",               "pour":0},
    {"t":30,"label":"Extraction",        "desc":"Target 36g out in 25-30s. Mouse-tail pour",              "pour":36},
    {"t":55,"label":"Stop",              "desc":"Stop when blonding starts or at 36g",                   "pour":0}
  ]'::jsonb,
  '{"sweetness":6,"acidity":7,"body":9,"bitterness":6,"aftertaste":8}'::jsonb
),
(
  'espresso', 'Classic Italian Shot', 'SCA',
  18, 36, 92, round(36.0/18, 2), 27, 'Expert', true,
  '[
    {"t":0, "label":"Flush",  "desc":"Brief group flush to purge",                                        "pour":0},
    {"t":5, "label":"Dose",   "desc":"Grind 18g directly into portafilter",                               "pour":0},
    {"t":15,"label":"Tamp",   "desc":"Firm, level tamp",                                                  "pour":0},
    {"t":22,"label":"Pull",   "desc":"Lock and start immediately",                                        "pour":0},
    {"t":27,"label":"Extract","desc":"Aim for 36g out in 25s",                                            "pour":36}
  ]'::jsonb,
  '{"sweetness":5,"acidity":6,"body":9,"bitterness":7,"aftertaste":7}'::jsonb
),

-- Latte
(
  'latte', 'Classic Latte', 'Barista Guild',
  18, 36, 93, round(36.0/18, 2), 105, 'Expert', true,
  '[
    {"t":0,  "label":"Pull shot",  "desc":"Pull 36g espresso directly into warmed cup",                   "pour":36},
    {"t":30, "label":"Purge wand", "desc":"Quick steam blast to clear condensation",                      "pour":0},
    {"t":40, "label":"Steam milk", "desc":"Stretch 3-5s at surface, then texture deep. Target 60°C",     "pour":0},
    {"t":90, "label":"Tap & swirl","desc":"Tap pitcher to pop bubbles, swirl to integrate",               "pour":0},
    {"t":105,"label":"Pour",       "desc":"Pour from height to blend, close to surface for art",          "pour":200}
  ]'::jsonb,
  '{"sweetness":7,"acidity":4,"body":9,"bitterness":3,"aftertaste":7}'::jsonb
),
(
  'latte', 'Iced Latte', 'Community',
  18, 36, 93, round(36.0/18, 2), 75, 'Intermediate', true,
  '[
    {"t":0, "label":"Ice the glass", "desc":"Fill a tall glass with ice",                                 "pour":0},
    {"t":10,"label":"Cold milk",     "desc":"Pour 200g cold whole milk over ice",                         "pour":200},
    {"t":30,"label":"Pull shot",     "desc":"Pull 36g espresso into a separate vessel",                   "pour":36},
    {"t":60,"label":"Pour over milk","desc":"Pour espresso slowly over the milk",                         "pour":0},
    {"t":75,"label":"Stir & serve",  "desc":"Stir before drinking to combine",                            "pour":0}
  ]'::jsonb,
  '{"sweetness":6,"acidity":5,"body":8,"bitterness":3,"aftertaste":6}'::jsonb
),

-- Cappuccino
(
  'cappuccino', 'Italian Cappuccino', 'SCA Standard',
  18, 36, 93, round(36.0/18, 2), 110, 'Expert', true,
  '[
    {"t":0,  "label":"Pull shot",   "desc":"Pull 36g espresso into warmed 150ml cup",                     "pour":36},
    {"t":30, "label":"Purge wand",  "desc":"Quick steam blast",                                           "pour":0},
    {"t":40, "label":"Stretch milk","desc":"Longer stretch — 6-8s of ''tssss'' for thick foam",           "pour":0},
    {"t":75, "label":"Texture",     "desc":"Submerge wand, spin to polish. Target 60°C",                  "pour":0},
    {"t":110,"label":"Pour & spoon","desc":"Pour milk, then spoon the thick foam on top",                 "pour":120}
  ]'::jsonb,
  '{"sweetness":6,"acidity":5,"body":8,"bitterness":5,"aftertaste":7}'::jsonb
),
(
  'cappuccino', 'Dry Cappuccino', 'Community',
  18, 36, 93, round(36.0/18, 2), 110, 'Expert', true,
  '[
    {"t":0,  "label":"Pull shot",          "desc":"36g espresso into warm cup",                           "pour":36},
    {"t":30, "label":"Aggressive stretch", "desc":"8-10s of air to build very thick foam",                "pour":0},
    {"t":75, "label":"Minimal texture",    "desc":"Brief spin — you want stiff foam, not velvet",         "pour":0},
    {"t":110,"label":"Spoon foam",         "desc":"Spoon only the foam onto the shot. Skip the milk",     "pour":0}
  ]'::jsonb,
  '{"sweetness":4,"acidity":6,"body":7,"bitterness":7,"aftertaste":6}'::jsonb
),

-- Flat White
(
  'flatwhite', 'Aussie Flat White', 'Melbourne Standard',
  18, 36, 93, round(36.0/18, 2), 100, 'Expert', true,
  '[
    {"t":0,  "label":"Pull ristretto", "desc":"36g out from 18g in — more concentrated shot",             "pour":36},
    {"t":30, "label":"Purge wand",     "desc":"Clear condensation with a brief blast",                    "pour":0},
    {"t":40, "label":"Minimal stretch","desc":"Just 2-3s of air — no visible bubbles",                    "pour":0},
    {"t":60, "label":"Texture deep",   "desc":"Spin wand deep to create silky microfoam. 60°C",           "pour":0},
    {"t":100,"label":"Pour low",       "desc":"Pour from low height to integrate fully",                  "pour":150}
  ]'::jsonb,
  '{"sweetness":6,"acidity":5,"body":9,"bitterness":4,"aftertaste":8}'::jsonb
);

-- ── Curated Indian beans ──────────────────────────────────────────────────────
insert into public.beans (user_id, roaster, origin, roast_level, tasting_notes, source) values
  (null, 'Blue Tokai',         'Coorg, Karnataka',     'Medium',      'Chocolate, nutty, smooth',              'curated'),
  (null, 'Subko',              'Chikmagalur',           'Dark',        'Dark cocoa, brown sugar, full body',    'curated'),
  (null, 'Araku Coffee',       'Kerala',                'Medium-Dark', 'Earthy, low acid, musty sweetness',     'curated'),
  (null, 'Kapi Kottai',        'BR Hills',              'Light',       'Strawberry, wine, juicy',               'curated'),
  (null, 'Maverick & Farmer',  'Chikmagalur',           'Medium',      'Caramel, orange, honey',                'curated'),
  (null, 'Naivo Coffee',       'Karnataka',             'Light',       'Citrus, jasmine, clean',                'curated'),
  (null, 'Quick Brown Fox',    'Yercaud, Tamil Nadu',   'Medium-Dark', 'Almond, dark chocolate, syrupy',        'curated'),
  (null, 'Araku Coffee',       'Andhra Pradesh',        'Light-Medium','Honey, mango, complex',                 'curated');
