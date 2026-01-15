-- ============================================
-- BATTLE OF KNOWLEDGE - COMPLETE DATABASE SETUP
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- STEP 1: Add is_system column to custom_questions if not exists
ALTER TABLE custom_questions ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT FALSE;

-- STEP 2: Add is_system column to custom_lessons if not exists  
ALTER TABLE custom_lessons ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT FALSE;

-- STEP 3: Make created_by nullable (if not already)
ALTER TABLE custom_questions ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE custom_lessons ALTER COLUMN created_by DROP NOT NULL;

-- STEP 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_system ON custom_questions(is_system);
CREATE INDEX IF NOT EXISTS idx_lessons_system ON custom_lessons(is_system);

-- STEP 5: Clear existing system content (safe to re-run)
DELETE FROM custom_questions WHERE is_system = true;
DELETE FROM custom_lessons WHERE is_system = true;

-- ============================================
-- SYSTEM QUESTIONS (40 total - 10 per era)
-- ============================================

-- EARLY SPANISH ERA QUESTIONS
INSERT INTO custom_questions (era_key, question_text_en, question_text_tl, correct_answer_en, correct_answer_tl, wrong_answers_en, wrong_answers_tl, difficulty, is_active, is_approved, is_system) VALUES
('early-spanish', 'Who was the first Filipino hero to resist Spanish colonization?', 'Sino ang unang bayaning Pilipino na lumaban sa pananakop ng Espanya?', 'Lapu-Lapu', 'Lapu-Lapu', '["Jose Rizal", "Andres Bonifacio", "Emilio Aguinaldo"]', '["Jose Rizal", "Andres Bonifacio", "Emilio Aguinaldo"]', 'easy', true, true, true),
('early-spanish', 'In what year did Ferdinand Magellan arrive in the Philippines?', 'Anong taon dumating si Ferdinand Magellan sa Pilipinas?', '1521', '1521', '["1565", "1898", "1896"]', '["1565", "1898", "1896"]', 'easy', true, true, true),
('early-spanish', 'Where did the Battle of Mactan take place?', 'Saan naganap ang Labanan sa Mactan?', 'Cebu', 'Cebu', '["Manila", "Bataan", "Mindanao"]', '["Maynila", "Bataan", "Mindanao"]', 'easy', true, true, true),
('early-spanish', 'Who was the chieftain of Mactan during the Spanish arrival?', 'Sino ang pinuno ng Mactan noong dumating ang mga Espanyol?', 'Lapu-Lapu', 'Lapu-Lapu', '["Raja Humabon", "Datu Sikatuna", "Datu Puti"]', '["Raja Humabon", "Datu Sikatuna", "Datu Puti"]', 'easy', true, true, true),
('early-spanish', 'Who was the chieftain who welcomed Magellan and converted to Christianity?', 'Sino ang pinunong tumanggap kay Magellan at naging Kristiyano?', 'Raja Humabon', 'Raja Humabon', '["Lapu-Lapu", "Datu Sikatuna", "Sultan Kudarat"]', '["Lapu-Lapu", "Datu Sikatuna", "Sultan Kudarat"]', 'medium', true, true, true),
('early-spanish', 'What was the original name of the Philippines before Spanish colonization?', 'Ano ang orihinal na pangalan ng Pilipinas bago sakupin ng Espanya?', 'Maharlika', 'Maharlika', '["Las Islas Filipinas", "Ophir", "Pearl of the Orient"]', '["Las Islas Filipinas", "Ophir", "Perlas ng Silangan"]', 'medium', true, true, true),
('early-spanish', 'How did Ferdinand Magellan die?', 'Paano namatay si Ferdinand Magellan?', 'Killed in Battle of Mactan', 'Napatay sa Labanan sa Mactan', '["Died of illness", "Drowned at sea", "Returned to Spain"]', '["Namatay sa sakit", "Nalunod sa dagat", "Bumalik sa Espanya"]', 'easy', true, true, true),
('early-spanish', 'What weapon was Lapu-Lapu famous for using?', 'Anong sandata ang ginagamit ni Lapu-Lapu?', 'Kampilan (sword)', 'Kampilan (espada)', '["Bow and arrow", "Spear", "Shield"]', '["Pana at palaso", "Sibat", "Kalasag"]', 'medium', true, true, true),
('early-spanish', 'What year did Spain officially colonize the Philippines?', 'Anong taon opisyal na sinakop ng Espanya ang Pilipinas?', '1565', '1565', '["1521", "1571", "1600"]', '["1521", "1571", "1600"]', 'medium', true, true, true),
('early-spanish', 'Who led the first successful Spanish expedition to colonize the Philippines?', 'Sino ang nanguna sa unang matagumpay na ekspedisyon ng Espanya sa Pilipinas?', 'Miguel Lopez de Legazpi', 'Miguel Lopez de Legazpi', '["Ferdinand Magellan", "Ruy Lopez de Villalobos", "Martin de Goiti"]', '["Ferdinand Magellan", "Ruy Lopez de Villalobos", "Martin de Goiti"]', 'hard', true, true, true);

-- LATE SPANISH ERA QUESTIONS
INSERT INTO custom_questions (era_key, question_text_en, question_text_tl, correct_answer_en, correct_answer_tl, wrong_answers_en, wrong_answers_tl, difficulty, is_active, is_approved, is_system) VALUES
('late-spanish', 'Who wrote ''Noli Me Tangere''?', 'Sino ang sumulat ng ''Noli Me Tangere''?', 'Jose Rizal', 'Jose Rizal', '["Andres Bonifacio", "Emilio Aguinaldo", "Apolinario Mabini"]', '["Andres Bonifacio", "Emilio Aguinaldo", "Apolinario Mabini"]', 'easy', true, true, true),
('late-spanish', 'What year was Jose Rizal executed?', 'Anong taon binaril si Jose Rizal?', '1896', '1896', '["1898", "1899", "1900"]', '["1898", "1899", "1900"]', 'easy', true, true, true),
('late-spanish', 'Who founded the Katipunan?', 'Sino ang nagtatag ng Katipunan?', 'Andres Bonifacio', 'Andres Bonifacio', '["Emilio Aguinaldo", "Jose Rizal", "Apolinario Mabini"]', '["Emilio Aguinaldo", "Jose Rizal", "Apolinario Mabini"]', 'easy', true, true, true),
('late-spanish', 'When did the Philippines declare independence from Spain?', 'Kailan idineklara ang kalayaan ng Pilipinas mula sa Espanya?', 'June 12, 1898', 'Hunyo 12, 1898', '["June 12, 1896", "July 4, 1946", "December 30, 1896"]', '["Hunyo 12, 1896", "Hulyo 4, 1946", "Disyembre 30, 1896"]', 'easy', true, true, true),
('late-spanish', 'Who was known as the ''Brains of the Revolution''?', 'Sino ang kilala bilang ''Utak ng Rebolusyon''?', 'Apolinario Mabini', 'Apolinario Mabini', '["Emilio Aguinaldo", "Andres Bonifacio", "Antonio Luna"]', '["Emilio Aguinaldo", "Andres Bonifacio", "Antonio Luna"]', 'medium', true, true, true),
('late-spanish', 'What was the full name of the Katipunan?', 'Ano ang buong pangalan ng Katipunan?', 'Kataas-taasang Kagalang-galangang Katipunan ng mga Anak ng Bayan', 'Kataas-taasang Kagalang-galangang Katipunan ng mga Anak ng Bayan', '["Katipunan ng mga Bayani", "Katipunan ng Pilipinas", "Kataas-taasang Katipunan"]', '["Katipunan ng mga Bayani", "Katipunan ng Pilipinas", "Kataas-taasang Katipunan"]', 'hard', true, true, true),
('late-spanish', 'Where was Jose Rizal executed?', 'Saan binaril si Jose Rizal?', 'Bagumbayan (Luneta)', 'Bagumbayan (Luneta)', '["Fort Santiago", "Kawit, Cavite", "Calamba, Laguna"]', '["Fort Santiago", "Kawit, Cavite", "Calamba, Laguna"]', 'medium', true, true, true),
('late-spanish', 'Who was the first President of the Philippines?', 'Sino ang unang Pangulo ng Pilipinas?', 'Emilio Aguinaldo', 'Emilio Aguinaldo', '["Andres Bonifacio", "Manuel Quezon", "Sergio Osmeña"]', '["Andres Bonifacio", "Manuel Quezon", "Sergio Osmeña"]', 'easy', true, true, true),
('late-spanish', 'What was Jose Rizal''s second novel?', 'Ano ang pangalawang nobela ni Jose Rizal?', 'El Filibusterismo', 'El Filibusterismo', '["Mi Ultimo Adios", "Noli Me Tangere", "Sobre la Indolencia"]', '["Mi Ultimo Adios", "Noli Me Tangere", "Sobre la Indolencia"]', 'medium', true, true, true),
('late-spanish', 'What was the secret password of the Katipunan?', 'Ano ang lihim na password ng Katipunan?', 'Anak ng Bayan', 'Anak ng Bayan', '["Kalayaan", "Kapatiran", "Kagitingan"]', '["Kalayaan", "Kapatiran", "Kagitingan"]', 'hard', true, true, true);

-- AMERICAN COLONIAL ERA QUESTIONS
INSERT INTO custom_questions (era_key, question_text_en, question_text_tl, correct_answer_en, correct_answer_tl, wrong_answers_en, wrong_answers_tl, difficulty, is_active, is_approved, is_system) VALUES
('american-colonial', 'What battle marked the beginning of American-Philippine War?', 'Anong labanan ang nagsimula ng Digmaang Pilipino-Amerikano?', 'Battle of Manila Bay', 'Labanan sa Manila Bay', '["Battle of Mactan", "Battle of Bataan", "Battle of Tirad Pass"]', '["Labanan sa Mactan", "Labanan sa Bataan", "Labanan sa Tirad Pass"]', 'medium', true, true, true),
('american-colonial', 'Who was the American naval commander during the Battle of Manila Bay?', 'Sino ang Amerikanong naval commander sa Labanan sa Manila Bay?', 'George Dewey', 'George Dewey', '["Douglas MacArthur", "Arthur MacArthur", "William Howard Taft"]', '["Douglas MacArthur", "Arthur MacArthur", "William Howard Taft"]', 'medium', true, true, true),
('american-colonial', 'What year did the Spanish-American War begin?', 'Anong taon nagsimula ang Digmaang Espanyol-Amerikano?', '1898', '1898', '["1896", "1899", "1901"]', '["1896", "1899", "1901"]', 'easy', true, true, true),
('american-colonial', 'Who was the Filipino general who fought at Tirad Pass?', 'Sino ang heneral na nakipaglaban sa Tirad Pass?', 'Gregorio del Pilar', 'Gregorio del Pilar', '["Antonio Luna", "Emilio Aguinaldo", "Juan Luna"]', '["Antonio Luna", "Emilio Aguinaldo", "Juan Luna"]', 'medium', true, true, true),
('american-colonial', 'What treaty ended the Spanish-American War?', 'Anong kasunduan ang nagwakas sa Digmaang Espanyol-Amerikano?', 'Treaty of Paris', 'Kasunduan sa Paris', '["Treaty of Versailles", "Treaty of Manila", "Treaty of Biak-na-Bato"]', '["Kasunduan sa Versailles", "Kasunduan sa Manila", "Kasunduan sa Biak-na-Bato"]', 'medium', true, true, true),
('american-colonial', 'How much did the United States pay Spain for the Philippines?', 'Magkano ang binayad ng Estados Unidos sa Espanya para sa Pilipinas?', '$20 million', '$20 milyon', '["$10 million", "$50 million", "$100 million"]', '["$10 milyon", "$50 milyon", "$100 milyon"]', 'hard', true, true, true),
('american-colonial', 'Who was known as the ''Boy General'' of the Philippine Revolution?', 'Sino ang kilala bilang ''Batang Heneral'' ng Rebolusyong Pilipino?', 'Gregorio del Pilar', 'Gregorio del Pilar', '["Emilio Aguinaldo", "Antonio Luna", "Manuel Tinio"]', '["Emilio Aguinaldo", "Antonio Luna", "Manuel Tinio"]', 'medium', true, true, true),
('american-colonial', 'What was General Antonio Luna''s role in the Philippine-American War?', 'Ano ang tungkulin ni Heneral Antonio Luna sa Digmaang Pilipino-Amerikano?', 'Chief of War Operations', 'Hepe ng Operasyon sa Digmaan', '["President", "Naval Commander", "Foreign Minister"]', '["Pangulo", "Kumander ng Hukbong-Dagat", "Ministro ng Ugnayang Panlabas"]', 'hard', true, true, true),
('american-colonial', 'When did the Philippine-American War officially end?', 'Kailan opisyal na natapos ang Digmaang Pilipino-Amerikano?', '1902', '1902', '["1898", "1905", "1910"]', '["1898", "1905", "1910"]', 'medium', true, true, true),
('american-colonial', 'What American colonial policy introduced public education in the Philippines?', 'Anong patakaran ng Amerikano ang nagdala ng pampublikong edukasyon sa Pilipinas?', 'Thomasites Program', 'Programa ng Thomasites', '["Jones Law", "Tydings-McDuffie Act", "Philippine Bill"]', '["Batas Jones", "Batas Tydings-McDuffie", "Philippine Bill"]', 'hard', true, true, true);

-- WW2 ERA QUESTIONS
INSERT INTO custom_questions (era_key, question_text_en, question_text_tl, correct_answer_en, correct_answer_tl, wrong_answers_en, wrong_answers_tl, difficulty, is_active, is_approved, is_system) VALUES
('ww2', 'Who promised to return to the Philippines during World War II?', 'Sino ang nangakong babalik sa Pilipinas noong Ikalawang Digmaang Pandaigdig?', 'Douglas MacArthur', 'Douglas MacArthur', '["George Dewey", "Franklin Roosevelt", "Dwight Eisenhower"]', '["George Dewey", "Franklin Roosevelt", "Dwight Eisenhower"]', 'easy', true, true, true),
('ww2', 'What year did Japan invade the Philippines?', 'Anong taon sinakop ng Japan ang Pilipinas?', '1941', '1941', '["1942", "1945", "1940"]', '["1942", "1945", "1940"]', 'easy', true, true, true),
('ww2', 'Where did the Bataan Death March take place?', 'Saan naganap ang Bataan Death March?', 'Bataan Peninsula', 'Bataan Peninsula', '["Manila", "Cebu", "Mindanao"]', '["Maynila", "Cebu", "Mindanao"]', 'easy', true, true, true),
('ww2', 'When was the Philippines liberated from Japan?', 'Kailan pinalaya ang Pilipinas mula sa Japan?', '1945', '1945', '["1944", "1946", "1943"]', '["1944", "1946", "1943"]', 'easy', true, true, true),
('ww2', 'What famous words did MacArthur say when he left the Philippines?', 'Ano ang sikat na sinabi ni MacArthur nang umalis siya sa Pilipinas?', 'I shall return', 'I shall return', '["We will be back", "Never surrender", "Victory awaits"]', '["We will be back", "Never surrender", "Victory awaits"]', 'easy', true, true, true),
('ww2', 'Where did MacArthur land when he returned to the Philippines?', 'Saan bumalik si MacArthur sa Pilipinas?', 'Leyte', 'Leyte', '["Bataan", "Manila", "Corregidor"]', '["Bataan", "Maynila", "Corregidor"]', 'medium', true, true, true),
('ww2', 'What was the last stronghold of American and Filipino forces before surrender?', 'Ano ang huling kuta ng mga pwersa ng Amerikano at Pilipino bago sumuko?', 'Corregidor', 'Corregidor', '["Bataan", "Manila", "Fort Santiago"]', '["Bataan", "Maynila", "Fort Santiago"]', 'medium', true, true, true),
('ww2', 'What date did Japan attack the Philippines?', 'Anong petsa sinalakay ng Japan ang Pilipinas?', 'December 8, 1941', 'Disyembre 8, 1941', '["December 7, 1941", "January 2, 1942", "September 21, 1944"]', '["Disyembre 7, 1941", "Enero 2, 1942", "Setyembre 21, 1944"]', 'medium', true, true, true),
('ww2', 'Who was the Filipino general who fought alongside MacArthur?', 'Sino ang heneralng Pilipino na nakipaglaban kasama ni MacArthur?', 'General Vicente Lim', 'Heneral Vicente Lim', '["General Emilio Aguinaldo", "General Antonio Luna", "General Gregorio del Pilar"]', '["Heneral Emilio Aguinaldo", "Heneral Antonio Luna", "Heneral Gregorio del Pilar"]', 'hard', true, true, true),
('ww2', 'What battle is considered the largest naval battle in history during WWII?', 'Anong labanan ang itinuturing na pinakamalaking labanan sa dagat sa WWII?', 'Battle of Leyte Gulf', 'Labanan sa Leyte Gulf', '["Battle of Manila Bay", "Battle of Coral Sea", "Battle of Midway"]', '["Labanan sa Manila Bay", "Labanan sa Coral Sea", "Labanan sa Midway"]', 'hard', true, true, true);

-- ============================================
-- SYSTEM LESSONS (18 total)
-- ============================================

-- EARLY SPANISH ERA LESSONS
INSERT INTO custom_lessons (era_key, lesson_order, title_en, title_tl, content_en, content_tl, icon, is_active, is_approved, is_system) VALUES
('early-spanish', 1, 'Pre-Colonial Philippines', 'Pilipinas Bago ang Kolonisasyon', 
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Life Before the Spanish</h3><p class="mb-3">Before 1521, the Philippines was made up of independent communities called <strong>barangays</strong>, each led by a <strong>datu</strong> or chieftain.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Buhay Bago ang mga Espanyol</h3><p class="mb-3">Bago ang 1521, ang Pilipinas ay binubuo ng mga independyenteng komunidad na tinatawag na <strong>barangay</strong>.</p></div>', '1', true, true, true),

('early-spanish', 2, 'Magellan''s Arrival (1521)', 'Pagdating ni Magellan (1521)',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ferdinand Magellan Arrives</h3><p class="mb-3">On <strong>March 16, 1521</strong>, Portuguese explorer Ferdinand Magellan arrived in the Philippines.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Dumating si Ferdinand Magellan</h3><p class="mb-3">Noong <strong>Marso 16, 1521</strong>, dumating si Ferdinand Magellan sa Pilipinas.</p></div>', '2', true, true, true),

('early-spanish', 3, 'Lapu-Lapu: The Hero', 'Lapu-Lapu: Ang Bayani',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Defender of Mactan</h3><p class="mb-3"><strong>Lapu-Lapu</strong> was the chieftain of Mactan Island who refused to submit to Spanish rule.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Tagapagtanggol ng Mactan</h3><p class="mb-3">Si <strong>Lapu-Lapu</strong> ang pinuno ng Pulo ng Mactan.</p></div>', '3', true, true, true),

('early-spanish', 4, 'The Battle of Mactan', 'Ang Labanan sa Mactan',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">April 27, 1521</h3><p class="mb-3">The <strong>Battle of Mactan</strong> took place on April 27, 1521. Magellan was killed in the battle.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Abril 27, 1521</h3><p class="mb-3">Ang <strong>Labanan sa Mactan</strong> ay naganap noong Abril 27, 1521.</p></div>', '4', true, true, true),

('early-spanish', 5, 'Legacy of Resistance', 'Pamana ng Paglaban',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Spirit of Filipino Resistance</h3><p class="mb-3">The Battle of Mactan established a powerful legacy of Filipino resistance against foreign domination.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Diwa ng Paglaban</h3><p class="mb-3">Ang Labanan sa Mactan ay nagtatag ng malakas na pamana ng paglaban ng mga Pilipino.</p></div>', '5', true, true, true);

-- LATE SPANISH ERA LESSONS
INSERT INTO custom_lessons (era_key, lesson_order, title_en, title_tl, content_en, content_tl, icon, is_active, is_approved, is_system) VALUES
('late-spanish', 1, 'Spanish Colonial Rule', 'Pamumuno ng Kolonyal na Espanyol',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">333 Years of Spanish Rule</h3><p class="mb-3">Spain colonized the Philippines for 333 years (1565-1898).</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">333 Taon ng Pamumuno ng Espanya</h3><p class="mb-3">Sinakop ng Espanya ang Pilipinas sa loob ng 333 taon.</p></div>', '1', true, true, true),

('late-spanish', 2, 'Jose Rizal: National Hero', 'Jose Rizal: Pambansang Bayani',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Pen is Mightier Than the Sword</h3><p class="mb-3"><strong>Jose Rizal</strong> (1861-1896) was a doctor, writer, and reformist.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Panulat ay Mas Makapangyarihan</h3><p class="mb-3">Si <strong>Jose Rizal</strong> (1861-1896) ay isang doktor at manunulat.</p></div>', '2', true, true, true),

('late-spanish', 3, 'The Katipunan', 'Ang Katipunan',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Secret Revolutionary Society</h3><p class="mb-3">The <strong>Katipunan</strong> was founded by <strong>Andres Bonifacio</strong> on July 7, 1892.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Lihim na Samahan</h3><p class="mb-3">Ang <strong>Katipunan</strong> ay itinatag ni <strong>Andres Bonifacio</strong>.</p></div>', '3', true, true, true),

('late-spanish', 4, 'The Philippine Revolution', 'Ang Rebolusyong Pilipino',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Cry of Pugad Lawin</h3><p class="mb-3">On August 23, 1896, the Philippine Revolution began.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Sigaw ng Pugad Lawin</h3><p class="mb-3">Noong Agosto 23, 1896, nagsimula ang Rebolusyong Pilipino.</p></div>', '4', true, true, true),

('late-spanish', 5, 'Philippine Independence', 'Kalayaan ng Pilipinas',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">June 12, 1898</h3><p class="mb-3">On <strong>June 12, 1898</strong>, General <strong>Emilio Aguinaldo</strong> declared Philippine independence.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Hunyo 12, 1898</h3><p class="mb-3">Noong <strong>Hunyo 12, 1898</strong>, idineklara ni <strong>Emilio Aguinaldo</strong> ang kalayaan.</p></div>', '5', true, true, true);

-- AMERICAN COLONIAL ERA LESSONS
INSERT INTO custom_lessons (era_key, lesson_order, title_en, title_tl, content_en, content_tl, icon, is_active, is_approved, is_system) VALUES
('american-colonial', 1, 'American Arrival', 'Pagdating ng mga Amerikano',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">A New Colonial Power</h3><p class="mb-3">In 1898, the United States defeated Spain in the Spanish-American War.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Bagong Kapangyarihan</h3><p class="mb-3">Noong 1898, tinalo ng Estados Unidos ang Espanya.</p></div>', '1', true, true, true),

('american-colonial', 2, 'Philippine-American War', 'Digmaang Pilipino-Amerikano',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Fight for True Independence</h3><p class="mb-3">The <strong>Philippine-American War</strong> (1899-1902) erupted on February 4, 1899.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Laban para sa Kalayaan</h3><p class="mb-3">Ang <strong>Digmaang Pilipino-Amerikano</strong> ay nagsimula noong Pebrero 4, 1899.</p></div>', '2', true, true, true),

('american-colonial', 3, 'American Colonial Policies', 'Mga Patakaran ng Amerika',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Education and Infrastructure</h3><p class="mb-3">The Americans introduced public education through the <strong>Thomasites</strong>.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Edukasyon at Imprastruktura</h3><p class="mb-3">Ipinakilala ng mga Amerikano ang pampublikong edukasyon.</p></div>', '3', true, true, true);

-- WW2 ERA LESSONS
INSERT INTO custom_lessons (era_key, lesson_order, title_en, title_tl, content_en, content_tl, icon, is_active, is_approved, is_system) VALUES
('ww2', 1, 'Japanese Invasion', 'Pagsalakay ng mga Hapon',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">December 8, 1941</h3><p class="mb-3">Japan invaded the Philippines on <strong>December 8, 1941</strong>.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Disyembre 8, 1941</h3><p class="mb-3">Sinalakay ng Japan ang Pilipinas noong <strong>Disyembre 8, 1941</strong>.</p></div>', '1', true, true, true),

('ww2', 2, 'Bataan Death March', 'Martsa ng Kamatayan sa Bataan',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">A Tragic Chapter</h3><p class="mb-3">The <strong>Bataan Death March</strong> claimed thousands of lives in April 1942.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Masaklap na Kabanata</h3><p class="mb-3">Ang <strong>Bataan Death March</strong> ay kumitil ng libu-libong buhay.</p></div>', '2', true, true, true),

('ww2', 3, 'Filipino Resistance', 'Paglaban ng mga Pilipino',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Guerrilla Warfare</h3><p class="mb-3">Filipino guerrilla fighters continued to resist Japanese occupation.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Digmaang Gerilya</h3><p class="mb-3">Patuloy na lumaban ang mga Pilipinong gerilya.</p></div>', '3', true, true, true),

('ww2', 4, 'MacArthur Returns', 'Bumalik si MacArthur',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">October 20, 1944</h3><p class="mb-3">General Douglas MacArthur returned to the Philippines on <strong>October 20, 1944</strong>.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Oktubre 20, 1944</h3><p class="mb-3">Bumalik si MacArthur sa Pilipinas noong <strong>Oktubre 20, 1944</strong>.</p></div>', '4', true, true, true),

('ww2', 5, 'Liberation and Independence', 'Pagpapalaya at Kalayaan',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">July 4, 1946</h3><p class="mb-3">On <strong>July 4, 1946</strong>, the Philippines gained full independence.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Hulyo 4, 1946</h3><p class="mb-3">Noong <strong>Hulyo 4, 1946</strong>, nakuha ng Pilipinas ang buong kalayaan.</p></div>', '5', true, true, true);

-- ============================================
-- VERIFY INSERTED DATA
-- ============================================
SELECT 'System Questions' as type, COUNT(*) as count FROM custom_questions WHERE is_system = true
UNION ALL
SELECT 'System Lessons' as type, COUNT(*) as count FROM custom_lessons WHERE is_system = true;
