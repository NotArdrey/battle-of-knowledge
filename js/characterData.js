// Historical contributions for each character
const characterContributions = {
    'Lapu-Lapu': {
        type: 'hero',
        contributions: {
            en: [
                'First Filipino hero to resist Spanish colonization',
                'Defeated Ferdinand Magellan in the Battle of Mactan on April 27, 1521',
                'Chieftain of Mactan who defended Philippine sovereignty',
                'Symbol of Filipino resistance and bravery',
                'His victory delayed Spanish colonization for several decades'
            ],
            tl: [
                'Unang bayaning Pilipino na lumaban sa kolonisasyon ng Espanya',
                'Tinalo si Ferdinand Magellan sa Labanan ng Mactan noong Abril 27, 1521',
                'Datu ng Mactan na ipinagtanggol ang soberanya ng Pilipinas',
                'Simbolo ng paglaban at katapangan ng Pilipino',
                'Ang kanyang tagumpay ay nagpahinto ng kolonisasyon ng Espanya ng ilang dekada'
            ]
        }
    },
    'Raja Humabon': {
        type: 'hero',
        contributions: {
            en: [
                'Rajah of Cebu who initially allied with Magellan',
                'First Filipino ruler to be baptized as a Christian (renamed Carlos)',
                'Played a crucial role in early Spanish-Filipino relations',
                'His alliance with Spain marked the beginning of Spanish influence',
                'Helped facilitate early trade and cultural exchange'
            ],
            tl: [
                'Rajah ng Cebu na nakipagtulungan kay Magellan',
                'Unang pinunong Pilipino na nabinyagan bilang Kristiyano (pinalitan ng pangalang Carlos)',
                'Gumampan ng mahalagang papel sa unang ugnayan ng Espanya at Pilipino',
                'Ang kanyang alyansa sa Espanya ay nagsimula ng impluwensya ng Espanya',
                'Tumulong sa pagpapadaloy ng unang kalakalan at palitan ng kultura'
            ]
        }
    },
    'Ferdinand Magellan': {
        type: 'villain',
        contributions: {
            en: [
                'Portuguese explorer who led the first circumnavigation expedition',
                'Arrived in the Philippines on March 16, 1521',
                'Claimed the islands for Spain',
                'Introduced Christianity to the Philippines',
                'Killed in the Battle of Mactan by Lapu-Lapu\'s forces'
            ],
            tl: [
                'Manlalakbay na Portuges na nanguna sa unang paglilibot sa mundo',
                'Dumating sa Pilipinas noong Marso 16, 1521',
                'Inangkin ang mga isla para sa Espanya',
                'Nagpakilala ng Kristiyanismo sa Pilipinas',
                'Napatay sa Labanan ng Mactan ng mga tauhan ni Lapu-Lapu'
            ]
        }
    },
    'Spanish Soldier': {
        type: 'villain',
        contributions: {
            en: [
                'Represented Spanish colonial military forces during the late colonial period',
                'Enforced Spanish rule and colonial policies throughout the archipelago',
                'Participated in suppressing the Philippine Revolution (1896-1898)',
                'Maintained Spanish military presence for over 300 years',
                'Faced Filipino revolutionaries in numerous battles across Luzon'
            ],
            tl: [
                'Kumakatawan sa mga pwersang militar ng kolonyal na Espanya sa huling panahon ng kolonyal',
                'Nagpatupad ng pamamahala at patakaran ng Espanya sa buong kapuluan',
                'Lumahok sa pagsugpo ng Rebolusyong Pilipino (1896-1898)',
                'Nagpanatili ng presensya militar ng Espanya ng mahigit 300 taon',
                'Hinarap ang mga rebolusyonaryong Pilipino sa maraming labanan sa Luzon'
            ]
        }
    },
    'Early Spanish Soldier': {
        type: 'villain',
        contributions: {
            en: [
                'Part of Ferdinand Magellan\'s expedition in 1521',
                'Among the first Spanish forces to arrive in the Philippine islands',
                'Participated in the Battle of Mactan against Lapu-Lapu\'s warriors',
                'Witnessed the death of Magellan and the defeat of the Spanish expedition',
                'Represented the beginning of Spanish attempts to colonize the Philippines'
            ],
            tl: [
                'Bahagi ng ekspedisyon ni Ferdinand Magellan noong 1521',
                'Kabilang sa mga unang pwersang Espanyol na dumating sa kapuluang Pilipinas',
                'Lumahok sa Labanan ng Mactan laban sa mga mandirigma ni Lapu-Lapu',
                'Nakasaksi sa kamatayan ni Magellan at pagkatalo ng ekspedisyong Espanyol',
                'Kumakatawan sa simula ng pagtatangka ng Espanya na sakupin ang Pilipinas'
            ]
        }
    },
    'Jose Rizal': {
        type: 'hero',
        contributions: {
            en: [
                'National hero of the Philippines',
                'Wrote "Noli Me Tangere" (1887) and "El Filibusterismo" (1891)',
                'Exposed Spanish colonial abuses through his writings',
                'Founded La Liga Filipina to unite Filipinos',
                'Executed on December 30, 1896, inspiring the Philippine Revolution',
                'Advocated for peaceful reforms and education'
            ],
            tl: [
                'Pambansang bayani ng Pilipinas',
                'Sumulat ng "Noli Me Tangere" (1887) at "El Filibusterismo" (1891)',
                'Inilantad ang mga pang-aabuso ng kolonyal na Espanya sa kanyang mga sinulat',
                'Nagtayo ng La Liga Filipina upang pagsamahin ang mga Pilipino',
                'Pinatay noong Disyembre 30, 1896, na nag-udyok sa Rebolusyong Pilipino',
                'Ipinaglaban ang mapayapang reporma at edukasyon'
            ]
        }
    },
    'Andres Bonifacio': {
        type: 'hero',
        contributions: {
            en: [
                'Founded the Katipunan (KKK) on July 7, 1892',
                'Started the Philippine Revolution with the Cry of Pugad Lawin (1896)',
                'Known as the "Father of the Philippine Revolution"',
                'Led armed resistance against Spanish colonial rule',
                'Symbolized the struggle of the common Filipino masses'
            ],
            tl: [
                'Nagtayo ng Katipunan (KKK) noong Hulyo 7, 1892',
                'Nagsimula ng Rebolusyong Pilipino sa Sigaw ng Pugad Lawin (1896)',
                'Kilala bilang "Ama ng Rebolusyong Pilipino"',
                'Nanguna sa armadong paglaban laban sa pamamahala ng kolonyal na Espanya',
                'Sumisimbolo sa pakikibaka ng karaniwang masang Pilipino'
            ]
        }
    },
    'Emilio Aguinaldo': {
        type: 'hero',
        contributions: {
            en: [
                'First President of the Philippines',
                'Led Filipino forces during the Philippine Revolution',
                'Declared Philippine Independence on June 12, 1898',
                'Commander-in-chief of revolutionary forces',
                'Led resistance during Philippine-American War',
                'Youngest general in the revolutionary army at age 28'
            ],
            tl: [
                'Unang Pangulo ng Pilipinas',
                'Nanguna sa mga pwersang Pilipino sa panahon ng Rebolusyong Pilipino',
                'Ipinahayag ang Kalayaan ng Pilipinas noong Hunyo 12, 1898',
                'Kumander-heneral ng mga pwersang rebolusyonaryo',
                'Nanguna sa paglaban sa panahon ng Digmaang Pilipino-Amerikano',
                'Pinakabatang heneral sa hukbong rebolusyonaryo sa edad na 28'
            ]
        }
    },
    'Apolinario Mabini': {
        type: 'hero',
        contributions: {
            en: [
                'Known as the "Brains of the Revolution"',
                'First Prime Minister and Foreign Minister of the Philippines',
                'Chief adviser to President Emilio Aguinaldo',
                'Wrote the Malolos Constitution',
                'Advocated for Philippine independence and sovereignty',
                'Continued to serve despite being paralyzed from polio'
            ],
            tl: [
                'Kilala bilang "Utak ng Rebolusyon"',
                'Unang Punong Ministro at Kalihim ng Ugnayang Panlabas ng Pilipinas',
                'Pangunahing tagapayo ni Pangulong Emilio Aguinaldo',
                'Sumulat ng Saligang Batas ng Malolos',
                'Ipinaglaban ang kalayaan at soberanya ng Pilipinas',
                'Patuloy na naglingkod kahit paralizado mula sa polio'
            ]
        }
    },
    'Spanish Commander': {
        type: 'villain',
        contributions: {
            en: [
                'Led Spanish military operations during the late colonial period',
                'Commanded forces against Filipino revolutionaries',
                'Enforced harsh colonial policies and martial law',
                'Represented Spanish military authority during the revolution'
            ],
            tl: [
                'Nanguna sa mga operasyong militar ng Espanya sa huling panahon ng kolonyal',
                'Nag-utos ng mga pwersa laban sa mga rebolusyonaryong Pilipino',
                'Nagpatupad ng malupit na patakaran kolonyal at batas militar',
                'Kumakatawan sa awtoridad militar ng Espanya sa panahon ng rebolusyon'
            ]
        }
    },
    'General Antonio Luna': {
        type: 'hero',
        contributions: {
            en: [
                'Brother of painter Juan Luna, one of the greatest Filipino military leaders',
                'Led Filipino forces during the Philippine-American War as Commanding General',
                'Known for brilliant military tactics and fierce discipline',
                'Commanded the defense of Northern Luzon against American forces',
                'Assassinated on June 5, 1899 in Cabanatuan',
                'His death significantly weakened Filipino resistance against Americans'
            ],
            tl: [
                'Kapatid ng pintor na si Juan Luna, isa sa pinakadakilang pinunong militar na Pilipino',
                'Nanguna sa mga pwersang Pilipino sa panahon ng Digmaang Pilipino-Amerikano bilang Heneral',
                'Kilala sa kahusayan ng taktika at mahigpit na disiplina',
                'Nag-utos ng depensa ng Hilagang Luzon laban sa mga Amerikano',
                'Pinaslang noong Hunyo 5, 1899 sa Cabanatuan',
                'Ang kanyang kamatayan ay labis na nagpahina ng paglaban ng Pilipino laban sa mga Amerikano'
            ]
        }
    },
    'General Juan Luna': {
        type: 'hero',
        contributions: {
            en: [
                'Renowned Filipino painter, not a military general',
                'Won gold medal at the 1884 Madrid Exposition for "Spoliarium"',
                'His masterpiece depicted the suffering of the Filipino people under Spanish rule',
                'Inspired Filipino nationalism through his art',
                'Brother of General Antonio Luna',
                'Considered one of the greatest Filipino artists in history'
            ],
            tl: [
                'Tanyag na pintor na Pilipino, hindi heneral militar',
                'Nanalo ng gintong medalya sa 1884 Madrid Exposition para sa "Spoliarium"',
                'Ang kanyang obra maestra ay naglalarawan ng paghihirap ng mga Pilipino sa ilalim ng Espanya',
                'Nag-udyok ng nasyonalismong Pilipino sa pamamagitan ng kanyang sining',
                'Kapatid ni Heneral Antonio Luna',
                'Itinuturing na isa sa pinakadakilang artistang Pilipino sa kasaysayan'
            ]
        }
    },
    'Commodore George Dewey': {
        type: 'villain',
        contributions: {
            en: [
                'Commander of US Asiatic Squadron',
                'Defeated Spanish fleet in Battle of Manila Bay (May 1, 1898)',
                'His victory marked the end of Spanish colonial rule',
                'Enabled American occupation of the Philippines',
                'Famous for saying "You may fire when ready, Gridley"'
            ],
            tl: [
                'Kumander ng US Asiatic Squadron',
                'Tinalo ang hukbong-dagat ng Espanya sa Labanan ng Look ng Maynila (Mayo 1, 1898)',
                'Ang kanyang tagumpay ay nagtanda ng wakas ng pamamahala ng kolonyal na Espanya',
                'Nagbigay-daan sa pag-okupa ng Amerika sa Pilipinas',
                'Sikat sa pagsasabi ng "You may fire when ready, Gridley"'
            ]
        }
    },
    'American Soldier': {
        type: 'villain',
        contributions: {
            en: [
                'Represented American colonial forces',
                'Fought in the Philippine-American War (1899-1902)',
                'Enforced American colonial policies',
                'Participated in campaigns against Filipino revolutionaries'
            ],
            tl: [
                'Kumakatawan sa mga pwersang kolonyal ng Amerika',
                'Lumaban sa Digmaang Pilipino-Amerikano (1899-1902)',
                'Nagpatupad ng mga patakaran kolonyal ng Amerika',
                'Lumahok sa mga kampanya laban sa mga rebolusyonaryong Pilipino'
            ]
        }
    },
    'Douglas MacArthur': {
        type: 'hero',
        contributions: {
            en: [
                'American general who led Allied forces in the Pacific',
                'Promised "I shall return" when forced to leave Philippines in 1942',
                'Returned and liberated the Philippines in 1944',
                'Led the recapture of Manila from Japanese forces',
                'Helped restore Philippine independence after WWII',
                'Received the rank of Field Marshal in the Philippine Army'
            ],
            tl: [
                'Heneral ng Amerika na nanguna sa mga pwersang Alyado sa Pasipiko',
                'Nangako ng "Babalik ako" nang sapilitang umalis sa Pilipinas noong 1942',
                'Bumalik at pinalaya ang Pilipinas noong 1944',
                'Nanguna sa muling pagsakop ng Maynila mula sa mga pwersang Hapon',
                'Tumulong sa pagbabalik ng kalayaan ng Pilipinas pagkatapos ng WWII',
                'Nakatanggap ng ranggo ng Field Marshal sa Hukbong Pilipino'
            ]
        }
    },
    'Japanese Soldier': {
        type: 'villain',
        contributions: {
            en: [
                'Participated in Japanese invasion of Philippines (1941)',
                'Fought in the Battle of Bataan and Corregidor',
                'Enforced Japanese occupation from 1942-1945',
                'Represented Imperial Japanese military presence'
            ],
            tl: [
                'Lumahok sa pagsalakay ng mga Hapon sa Pilipinas (1941)',
                'Lumaban sa Labanan ng Bataan at Corregidor',
                'Nagpatupad ng pag-okupang Hapon mula 1942-1945',
                'Kumakatawan sa presensya militar ng Imperyong Hapon'
            ]
        }
    }
};
