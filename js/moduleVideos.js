// Module Videos Data with English and Tagalog Captions
// Videos organized by era and lesson, with bilingual captions derived from script files

const moduleVideos = {
    'early-spanish': {
        lessons: [
            {
                lessonId: 1,
                title: 'Pre-Colonial Philippines',
                videoFile: 'assets/ModuleVideos/early%20spanish/Early%20Spanish%201.mp4',
                captions: {
                    en: [
                        { time: 0, text: "Before 1521, the Philippines was made up of independent communities called barangays, each led by a datu or chieftain." },
                        { time: 8, text: "Filipinos had already developed their own writing system called baybayin and maintained active trade relationships with China, Japan, and other Asian neighbors." },
                        { time: 18, text: "Society was organized into distinct classes including nobles (maharlika), freemen, and slaves." },
                        { time: 25, text: "Traditional religious practices centered around animism, while some communities in the south had already embraced Islamic influences brought by traders from neighboring regions." }
                    ],
                    tl: [
                        { time: 0, text: "Bago ang 1521, ang Pilipinas ay binubuo ng mga malayang pamayanan na tinatawag na barangay, na bawat isa ay pinamumunuan ng isang datu o pinuno." },
                        { time: 8, text: "Ang mga Pilipino ay may sariling sistema ng pagsulat na tinatawag na Baybayin at aktibong nakikipagkalakalan sa Tsina, Japan, at iba pang bansa sa Asya." },
                        { time: 18, text: "Ang lipunan ay nahahati sa mga magkakaibang uri kabilang ang mga maharlika, malalayang tao, at alipin." },
                        { time: 25, text: "Ang mga tradisyonal na paniniwala ay nakasentro sa animismo, habang ang ilang pamayanan sa timog ay naimpluwensyahan na ng Islam na dala ng mga mangangalakal." }
                    ]
                }
            },
            {
                lessonId: 2,
                title: "Magellan's Arrival (1521)",
                videoFile: 'assets/ModuleVideos/early%20spanish/Early%20spanish%202.mp4',
                captions: {
                    en: [
                        { time: 0, text: "On March 16, 1521, Portuguese explorer Ferdinand Magellan, sailing under the Spanish flag, arrived in the Philippines." },
                        { time: 8, text: "He was seeking a westward route to the valuable Spice Islands." },
                        { time: 14, text: "The journey unfolded through Magellan first landing and proceeding to Cebu by March 28." },
                        { time: 22, text: "On April 14, 1521, Raja Humabon with his followers converted to Christianity in what would become the first Catholic mass in the Philippines." },
                        { time: 32, text: "This religious conversion set the stage for the historic Battle of Mactan that followed on April 27." }
                    ],
                    tl: [
                        { time: 0, text: "Noong Marso 16, 1521, ang Portuges na manggagalugad na si Ferdinand Magellan, na naglalayag sa ilalim ng bandila ng Espanya, ay dumating sa Pilipinas." },
                        { time: 8, text: "Siya ay naghahanap ng kanlurang ruta patungo sa mahahalagang Spice Islands." },
                        { time: 14, text: "Ang paglalakbay ay nagpatuloy sa pamamagitan ng pagdating ni Magellan sa Cebu noong Marso 28." },
                        { time: 22, text: "Noong Abril 14, 1521, si Raja Humabon at ang kanyang mga tagasunod ay naging Kristiyano sa unang misa Katoliko sa Pilipinas." },
                        { time: 32, text: "Ang pagbabagong ito ng relihiyon ang naghanda sa makasaysayang Labanan sa Mactan na sumunod noong Abril 27." }
                    ]
                }
            },
            {
                lessonId: 3,
                title: 'Lapu-Lapu: The Hero',
                videoFile: 'assets/ModuleVideos/early%20spanish/early%20spanish%203.mp4',
                captions: {
                    en: [
                        { time: 0, text: "Lapu-Lapu stands as a towering figure in Philippine history as the datu of Mactan Island in Cebu." },
                        { time: 8, text: "He is honored as the first Filipino hero for bravely resisting foreign colonization." },
                        { time: 14, text: "In 1521, he refused Ferdinand Magellan's demand for submission to Spanish rule." },
                        { time: 20, text: "He led his warriors in battle, defeating and killing the famed explorer." },
                        { time: 26, text: "This victory proved that Western powers could be challenged." },
                        { time: 32, text: "Often depicted wielding a kampilan, Lapu-Lapu symbolizes courage, independence, and the defense of Filipino sovereignty." }
                    ],
                    tl: [
                        { time: 0, text: "Si Lapu-Lapu ay isang pangunahing pigura sa kasaysayan ng Pilipinas bilang datu ng Isla ng Mactan sa Cebu." },
                        { time: 8, text: "Siya ay iginagalang bilang unang bayaning Pilipino dahil sa matapang na paglaban sa dayuhang pananakop." },
                        { time: 14, text: "Noong 1521, tinanggihan niya ang kahilingan ni Ferdinand Magellan na sumuko sa pamamahala ng Espanya." },
                        { time: 20, text: "Pinamunuan niya ang kanyang mga mandirigma sa labanan, tinalo at pinatay ang sikat na manggagalugad." },
                        { time: 26, text: "Ang tagumpay na ito ay nagpatunay na ang mga Kanluraning kapangyarihan ay maaaring hamunin." },
                        { time: 32, text: "Madalas na inilalarawan na may hawak na kampilan, si Lapu-Lapu ay sumisimbolo ng katapangan, kalayaan, at pagtatanggol ng soberanya ng Pilipino." }
                    ]
                }
            },
            {
                lessonId: 4,
                title: 'Battle of Mactan',
                videoFile: 'assets/ModuleVideos/early%20spanish/early%20spanish%204.mp4',
                captions: {
                    en: [
                        { time: 0, text: "The Battle of Mactan, on April 27, 1521, marked a pivotal moment in Philippine history." },
                        { time: 7, text: "It began when Ferdinand Magellan demanded submission from Lapu-Lapu." },
                        { time: 13, text: "Magellan led a small Spanish force against a much larger group of Filipino warriors." },
                        { time: 20, text: "Although the Spaniards had superior weapons and armor, they struggled in the shallow waters and unfamiliar terrain." },
                        { time: 28, text: "Using their knowledge of the land and strong unity, Lapu-Lapu's forces overwhelmed the invaders." },
                        { time: 35, text: "They successfully defended their independence and traditional way of life." }
                    ],
                    tl: [
                        { time: 0, text: "Ang Labanan sa Mactan, noong Abril 27, 1521, ay nagmarka ng isang mahalagang sandali sa kasaysayan ng Pilipinas." },
                        { time: 7, text: "Nagsimula ito nang hingin ni Ferdinand Magellan na sumuko si Lapu-Lapu." },
                        { time: 13, text: "Pinamunuan ni Magellan ang isang maliit na puwersang Espanyol laban sa mas malaking grupo ng mga mandirigmang Pilipino." },
                        { time: 20, text: "Bagaman ang mga Espanyol ay may mas mahusay na mga armas at baluti, nahirapan sila sa mababaw na tubig at hindi pamilyar na lupain." },
                        { time: 28, text: "Gamit ang kanilang kaalaman sa lupa at malakas na pagkakaisa, ang mga puwersa ni Lapu-Lapu ay dinagsa ang mga mananakop." },
                        { time: 35, text: "Matagumpay nilang ipinagtanggol ang kanilang kalayaan at tradisyonal na paraan ng pamumuhay." }
                    ]
                }
            },
            {
                lessonId: 5,
                title: 'Aftermath & Legacy',
                videoFile: 'assets/ModuleVideos/early%20spanish/Early%20Spanish%205.mp4',
                captions: {
                    en: [
                        { time: 0, text: "Although the victory at Mactan showed that Filipinos could resist foreign powers, it did not stop Spanish colonization." },
                        { time: 8, text: "After the battle, Magellan's remaining crew left the Philippines, but Spain continued to pursue control of the islands." },
                        { time: 16, text: "In 1543, the archipelago was named Las Islas Filipinas in honor of King Philip II." },
                        { time: 23, text: "The turning point came in 1565, when Miguel López de Legazpi established permanent Spanish settlements." },
                        { time: 31, text: "By 1571, Manila became the colonial capital, beginning over three centuries of Spanish rule." },
                        { time: 38, text: "This reshaped Philippine society and culture forever." }
                    ],
                    tl: [
                        { time: 0, text: "Bagaman ang tagumpay sa Mactan ay nagpakita na ang mga Pilipino ay kayang labanan ang mga dayuhang kapangyarihan, hindi nito pinigilan ang kolonisasyon ng Espanya." },
                        { time: 8, text: "Pagkatapos ng labanan, ang natitirang tripulante ni Magellan ay umalis sa Pilipinas, ngunit ipinagpatuloy ng Espanya ang pagkontrol sa mga isla." },
                        { time: 16, text: "Noong 1543, ang kapuluan ay pinangalanang Las Islas Filipinas bilang parangal kay Haring Philip II." },
                        { time: 23, text: "Ang turning point ay dumating noong 1565, nang magtatag si Miguel López de Legazpi ng permanenteng mga paninirahan ng Espanyol." },
                        { time: 31, text: "Noong 1571, ang Maynila ay naging kabisera ng kolonya, na nagsisimula ng higit sa tatlong siglo ng pamamahala ng Espanya." },
                        { time: 38, text: "Binago nito ang lipunan at kultura ng Pilipinas magpakailanman." }
                    ]
                }
            }
        ]
    },
    'late-spanish': {
        lessons: [
            {
                lessonId: 1,
                title: 'Jose Rizal',
                videoFile: 'assets/ModuleVideos/late%20spanish/Late%20spanish%201.mp4',
                captions: {
                    en: [
                        { time: 0, text: "Dr. Jose Rizal was a Filipino writer, doctor, and reformist who fought Spanish abuse through peaceful means." },
                        { time: 8, text: "He studied in Europe and used his education to speak out against injustice." },
                        { time: 14, text: "His novels Noli Me Tangere and El Filibusterismo exposed the cruelty and corruption of Spanish rule." },
                        { time: 22, text: "These works awakened Filipino nationalism across the nation." },
                        { time: 27, text: "Rizal also founded La Liga Filipina to promote peaceful reforms." },
                        { time: 33, text: "His execution on December 30, 1896, made him a national hero and inspired Filipinos to continue the fight for freedom." }
                    ],
                    tl: [
                        { time: 0, text: "Si Dr. Jose Rizal ay isang Pilipinong manunulat, doktor, at repormista na lumaban sa pang-aabuso ng Espanya sa mapayapang paraan." },
                        { time: 8, text: "Nag-aral siya sa Europa at ginamit ang kanyang edukasyon upang magsalita laban sa kawalang-katarungan." },
                        { time: 14, text: "Ang kanyang mga nobela na Noli Me Tangere at El Filibusterismo ay naglantad ng kalupitan at katiwalian ng pamamahala ng Espanya." },
                        { time: 22, text: "Ang mga akdang ito ay gumising sa nasyonalismong Pilipino sa buong bansa." },
                        { time: 27, text: "Itinatag din ni Rizal ang La Liga Filipina upang isulong ang mapayapang mga reporma." },
                        { time: 33, text: "Ang kanyang pagbaril noong Disyembre 30, 1896, ay ginawa siyang pambansang bayani at nag-inspire sa mga Pilipino na ipagpatuloy ang laban para sa kalayaan." }
                    ]
                }
            },
            {
                lessonId: 2,
                title: 'Andres Bonifacio',
                videoFile: 'assets/ModuleVideos/late%20spanish/late%20spanish%202.mp4',
                captions: {
                    en: [
                        { time: 0, text: "Andres Bonifacio, known as the Father of the Philippine Revolution, founded the Katipunan or KKK in 1892." },
                        { time: 8, text: "It was a secret group that aimed to gain independence through armed struggle." },
                        { time: 14, text: "Unlike Jose Rizal, Bonifacio believed fighting was necessary to end Spanish rule." },
                        { time: 21, text: "The revolution began in 1896 with the Cry of Pugad Lawin." },
                        { time: 26, text: "Members tore their cedulas to reject Spanish authority." },
                        { time: 31, text: "As leader of the Katipunan, Bonifacio organized revolutionary forces across Luzon, showing the strong desire of Filipinos for freedom." }
                    ],
                    tl: [
                        { time: 0, text: "Si Andres Bonifacio, na kilala bilang Ama ng Rebolusyong Pilipino, ay nagtatag ng Katipunan o KKK noong 1892." },
                        { time: 8, text: "Ito ay isang lihim na grupo na naglalayong makamit ang kalayaan sa pamamagitan ng armadong pakikibaka." },
                        { time: 14, text: "Hindi tulad ni Jose Rizal, naniniwala si Bonifacio na ang pakikipaglaban ay kinakailangan upang wakasan ang pamamahala ng Espanya." },
                        { time: 21, text: "Nagsimula ang rebolusyon noong 1896 sa Sigaw ng Pugad Lawin." },
                        { time: 26, text: "Pinunit ng mga kasapi ang kanilang mga sedula upang tanggihan ang awtoridad ng Espanya." },
                        { time: 31, text: "Bilang pinuno ng Katipunan, inorganisa ni Bonifacio ang mga rebolusyonaryong puwersa sa buong Luzon, na nagpapakita ng malakas na pagnanais ng mga Pilipino para sa kalayaan." }
                    ]
                }
            },
            {
                lessonId: 3,
                title: 'Emilio Aguinaldo',
                videoFile: 'assets/ModuleVideos/late%20spanish/Late%20Spanish%203.mp4',
                captions: {
                    en: [
                        { time: 0, text: "Emilio Aguinaldo became an important leader of the Philippine Revolution through his success in battles, especially the victory at Imus." },
                        { time: 9, text: "His leadership earned him respect, and he later became the first president of the revolutionary government and the Philippines." },
                        { time: 18, text: "On June 12, 1898, Aguinaldo proclaimed Philippine independence in Kawit, Cavite." },
                        { time: 25, text: "The Philippine flag was first raised and the national anthem was played." },
                        { time: 31, text: "In 1899, the Malolos Congress created the Malolos Constitution." },
                        { time: 37, text: "This formed Asia's first democratic republic, showing Filipinos' dream of self-rule." }
                    ],
                    tl: [
                        { time: 0, text: "Si Emilio Aguinaldo ay naging mahalagang pinuno ng Rebolusyong Pilipino sa pamamagitan ng kanyang tagumpay sa mga labanan, lalo na ang tagumpay sa Imus." },
                        { time: 9, text: "Ang kanyang pamumuno ay nagkamit sa kanya ng respeto, at naging unang pangulo siya ng rebolusyonaryong pamahalaan at ng Pilipinas." },
                        { time: 18, text: "Noong Hunyo 12, 1898, ipinahayag ni Aguinaldo ang kalayaan ng Pilipinas sa Kawit, Cavite." },
                        { time: 25, text: "Ang watawat ng Pilipinas ay unang itinaas at ang pambansang awit ay tinugtog." },
                        { time: 31, text: "Noong 1899, nilikha ng Kongreso ng Malolos ang Konstitusyon ng Malolos." },
                        { time: 37, text: "Ito ang bumuo ng unang demokratikong republika ng Asya, na nagpapakita ng pangarap ng mga Pilipino sa sariling pamamahala." }
                    ]
                }
            },
            {
                lessonId: 4,
                title: 'Apolinario Mabini',
                videoFile: 'assets/ModuleVideos/late%20spanish/Late%20Spanish%204.mp4',
                captions: {
                    en: [
                        { time: 0, text: "Apolinario Mabini was known as the 'Brains of the Revolution' and served as Emilio Aguinaldo's most trusted adviser." },
                        { time: 9, text: "Even though he was paralyzed due to illness, his intelligence and leadership greatly helped the revolution." },
                        { time: 17, text: "Mabini played a key role in writing the Malolos Constitution." },
                        { time: 22, text: "This became the foundation of the First Philippine Republic." },
                        { time: 27, text: "As the first Prime Minister, he believed in true independence." },
                        { time: 32, text: "He warned Filipinos against replacing one foreign ruler with another, emphasizing the need for a government that truly served the Filipino people." }
                    ],
                    tl: [
                        { time: 0, text: "Si Apolinario Mabini ay kilala bilang 'Utak ng Rebolusyon' at nagsilbing pinaka-tinatanggap na tagapayo ni Emilio Aguinaldo." },
                        { time: 9, text: "Kahit na siya ay paralitiko dahil sa sakit, ang kanyang katalinuhan at pamumuno ay lubos na nakatulong sa rebolusyon." },
                        { time: 17, text: "Si Mabini ay may mahalagang papel sa pagsulat ng Konstitusyon ng Malolos." },
                        { time: 22, text: "Ito ang naging pundasyon ng Unang Republika ng Pilipinas." },
                        { time: 27, text: "Bilang unang Punong Ministro, naniniwala siya sa tunay na kalayaan." },
                        { time: 32, text: "Binabalaan niya ang mga Pilipino laban sa pagpapalit ng isang dayuhang pinuno ng iba, na binibigyang-diin ang pangangailangan para sa isang pamahalaang tunay na naglilingkod sa mga Pilipino." }
                    ]
                }
            },
            {
                lessonId: 5,
                title: 'Treaty of Paris',
                videoFile: 'assets/ModuleVideos/late%20spanish/Late%20Spanish%205.mp4',
                captions: {
                    en: [
                        { time: 0, text: "The Spanish-American War of 1898 reshaped the Philippines' future and Pacific power." },
                        { time: 6, text: "Spain's defeat ended centuries of colonial rule." },
                        { time: 11, text: "On December 10, 1898, the Treaty of Paris transferred control." },
                        { time: 17, text: "For twenty million dollars, Spain gave the Philippines to the U.S." },
                        { time: 23, text: "Three hundred thirty-three years of Spanish rule came to an end." },
                        { time: 29, text: "Independence did not follow—American rule began instead." },
                        { time: 35, text: "Filipino revolutionaries were excluded and ignored. This injustice ignited a stronger Filipino nationalism." },
                        { time: 43, text: "Heroes like Rizal and Bonifacio inspired the fight for freedom. Their sacrifices shaped the nation's identity." }
                    ],
                    tl: [
                        { time: 0, text: "Ang Digmaang Espanyol-Amerikano ng 1898 ay muling hinubog ang kinabukasan ng Pilipinas at kapangyarihan sa Pasipiko." },
                        { time: 6, text: "Ang pagkatalo ng Espanya ay nagtapos ng mga siglo ng kolonyal na pamamahala." },
                        { time: 11, text: "Noong Disyembre 10, 1898, inilipat ng Kasunduan sa Paris ang kontrol." },
                        { time: 17, text: "Sa halagang dalawampung milyong dolyar, ibinigay ng Espanya ang Pilipinas sa U.S." },
                        { time: 23, text: "Tatlong daan at tatlumpu't tatlong taon ng pamamahala ng Espanya ang natapos." },
                        { time: 29, text: "Hindi sumunod ang kalayaan—nagsimula ang pamamahala ng Amerika." },
                        { time: 35, text: "Ang mga rebolusyonaryong Pilipino ay hindi isinama at hindi pinansin. Ang kawalang-katarungang ito ay nagpasiklab ng mas malakas na nasyonalismong Pilipino." },
                        { time: 43, text: "Ang mga bayani tulad nina Rizal at Bonifacio ay nag-inspire ng laban para sa kalayaan. Ang kanilang mga sakripisyo ay humubog sa pagkakakilanlan ng bansa." }
                    ]
                }
            }
        ]
    },
    'american-colonial': {
        lessons: [
            {
                lessonId: 1,
                title: 'The Transition',
                videoFile: 'assets/ModuleVideos/American%20Colonial/American%20Colonial%20Chapter%201.mp4',
                captions: {
                    en: [
                        { time: 0, text: "War broke out between Spain and the U.S., ending Spanish power in the Philippines." },
                        { time: 6, text: "Spain and the U.S. decided the fate of Spain's colonies." },
                        { time: 11, text: "Filipinos declared independence, hoping for freedom." },
                        { time: 16, text: "Commodore George Dewey led U.S. forces into Manila Bay." },
                        { time: 22, text: "American ships defeated the Spanish fleet quickly." },
                        { time: 27, text: "Spain lost naval control of the Philippines." },
                        { time: 32, text: "Spain ceded the Philippines to the U.S. for $20 million." },
                        { time: 38, text: "Filipino leaders were excluded from the talks. Filipinos felt betrayed by the outcome." },
                        { time: 46, text: "Spanish rule ended, but American rule began." }
                    ],
                    tl: [
                        { time: 0, text: "Sumiklab ang digmaan sa pagitan ng Espanya at U.S., na nagtapos ng kapangyarihan ng Espanya sa Pilipinas." },
                        { time: 6, text: "Ang Espanya at U.S. ang nagpasya sa kapalaran ng mga kolonya ng Espanya." },
                        { time: 11, text: "Nagdeklara ng kalayaan ang mga Pilipino, na umaasang makamit ang kalayaan." },
                        { time: 16, text: "Pinamunuan ni Commodore George Dewey ang mga puwersa ng U.S. sa Look ng Maynila." },
                        { time: 22, text: "Mabilis na tinalo ng mga barko ng Amerika ang plota ng Espanya." },
                        { time: 27, text: "Nawala ang kontrol ng Espanya sa dagat ng Pilipinas." },
                        { time: 32, text: "Ibinigay ng Espanya ang Pilipinas sa U.S. sa halagang $20 milyon." },
                        { time: 38, text: "Ang mga lider ng Pilipino ay hindi isinama sa mga usapan. Naramdaman ng mga Pilipino na sila ay pinagtaksilan." },
                        { time: 46, text: "Natapos ang pamamahala ng Espanya, ngunit nagsimula ang pamamahala ng Amerika." }
                    ]
                }
            },
            {
                lessonId: 2,
                title: 'Philippine-American War',
                videoFile: 'assets/ModuleVideos/American%20Colonial/American%20Colonial%20Chapter%202.mp4',
                captions: {
                    en: [
                        { time: 0, text: "In 1899, fighting began between Filipino and American forces." },
                        { time: 6, text: "President Emilio Aguinaldo led Filipinos in the fight for independence." },
                        { time: 12, text: "Filipino troops faced a stronger, better-armed American army." },
                        { time: 18, text: "The war brought destruction to Filipino communities." },
                        { time: 23, text: "Early battles, like the Battle of Manila, used conventional warfare." },
                        { time: 29, text: "General Antonio Luna improved Filipino military organization." },
                        { time: 35, text: "Filipino forces shifted to guerrilla warfare to continue resisting." },
                        { time: 41, text: "American troops took control of major Philippine cities." },
                        { time: 47, text: "In 1901, Aguinaldo was captured by American forces. Some Filipino fighters continued resisting in rural areas." },
                        { time: 55, text: "The war left a lasting legacy of sacrifice and nationalism." }
                    ],
                    tl: [
                        { time: 0, text: "Noong 1899, nagsimula ang labanan sa pagitan ng mga puwersa ng Pilipino at Amerikano." },
                        { time: 6, text: "Pinamunuan ni Pangulong Emilio Aguinaldo ang mga Pilipino sa laban para sa kalayaan." },
                        { time: 12, text: "Ang mga tropang Pilipino ay humarap sa mas malakas, mas mahusay na armadong hukbo ng Amerika." },
                        { time: 18, text: "Ang digmaan ay nagdala ng pagkawasak sa mga pamayanang Pilipino." },
                        { time: 23, text: "Ang mga unang labanan, tulad ng Labanan sa Maynila, ay gumamit ng conventional warfare." },
                        { time: 29, text: "Pinabuti ni Heneral Antonio Luna ang organisasyong militar ng Pilipino." },
                        { time: 35, text: "Lumipat ang mga puwersang Pilipino sa digmaang gerilya upang magpatuloy sa paglaban." },
                        { time: 41, text: "Kinuha ng mga tropang Amerikano ang kontrol ng mga pangunahing lungsod ng Pilipinas." },
                        { time: 47, text: "Noong 1901, nahuli si Aguinaldo ng mga puwersang Amerikano. Ang ilang mga mandirigmang Pilipino ay nagpatuloy sa paglaban sa mga rural na lugar." },
                        { time: 55, text: "Ang digmaan ay nag-iwan ng pangmatagalang pamana ng sakripisyo at nasyonalismo." }
                    ]
                }
            },
            {
                lessonId: 3,
                title: 'Benevolent Assimilation',
                videoFile: 'assets/ModuleVideos/American%20Colonial/American%20Colonial%20Chapter%203.mp4',
                captions: {
                    en: [
                        { time: 0, text: "The U.S. introduced 'benevolent assimilation' to control and govern the Philippines." },
                        { time: 6, text: "American troops enforced order and pacified communities." },
                        { time: 11, text: "American-style reforms reshaped Philippine society and government." },
                        { time: 17, text: "Public schools taught English across the Philippines." },
                        { time: 22, text: "These changes altered Filipino culture and language." },
                        { time: 27, text: "Limited democratic institutions were introduced. Filipinos had little real control over governance." },
                        { time: 35, text: "Roads, bridges, and railways modernized transportation." },
                        { time: 40, text: "New systems improved communication and travel. Health programs improved sanitation and disease control." },
                        { time: 48, text: "Modernization mainly served American economic interests. The Philippines modernized, but remained under U.S. control." }
                    ],
                    tl: [
                        { time: 0, text: "Ipinakilala ng U.S. ang 'benevolent assimilation' upang kontrolin at pamahalaan ang Pilipinas." },
                        { time: 6, text: "Ang mga tropang Amerikano ay nagpatupad ng kaayusan at nagpakalma sa mga pamayanan." },
                        { time: 11, text: "Ang mga repormang istilo ng Amerika ay muling hinubog ang lipunan at pamahalaan ng Pilipinas." },
                        { time: 17, text: "Ang mga pampublikong paaralan ay nagturo ng Ingles sa buong Pilipinas." },
                        { time: 22, text: "Ang mga pagbabagong ito ay nagbago sa kultura at wika ng Pilipino." },
                        { time: 27, text: "Limitadong mga demokratikong institusyon ang ipinakilala. Ang mga Pilipino ay may kaunting tunay na kontrol sa pamamahala." },
                        { time: 35, text: "Ang mga kalsada, tulay, at riles ay nagpaunlad ng transportasyon." },
                        { time: 40, text: "Ang mga bagong sistema ay nagpabuti ng komunikasyon at paglalakbay. Ang mga programa sa kalusugan ay nagpabuti ng sanitation at kontrol ng sakit." },
                        { time: 48, text: "Ang modernisasyon ay pangunahing nagsilbi sa mga interes na pang-ekonomiya ng Amerika. Nag-modernize ang Pilipinas, ngunit nanatili sa ilalim ng kontrol ng U.S." }
                    ]
                }
            }
        ]
    },
    'ww2': {
        lessons: [
            {
                lessonId: 1,
                title: 'Japanese Invasion',
                videoFile: 'assets/ModuleVideos/WW2%20Era/WW2%20Chapter%201.mp4',
                captions: {
                    en: [
                        { time: 0, text: "On December 8, 1941, Japan launched a surprise attack on the Philippines." },
                        { time: 6, text: "Japanese forces attacked strategic areas across the archipelago." },
                        { time: 11, text: "Air raids destroyed Clark Air Base and Allied aircraft." },
                        { time: 17, text: "Japanese troops landed along Philippine coastlines." },
                        { time: 22, text: "Filipino-American defenses were quickly overwhelmed." },
                        { time: 27, text: "General Douglas MacArthur led the Allied defense." },
                        { time: 32, text: "Allied forces withdrew to the Bataan Peninsula." },
                        { time: 37, text: "Corregidor became a key defensive position." },
                        { time: 42, text: "Troops prepared defenses in Bataan and Corregidor." },
                        { time: 47, text: "Despite shortages, defenders fought to delay Japan. The defenders waited for reinforcements that never came." }
                    ],
                    tl: [
                        { time: 0, text: "Noong Disyembre 8, 1941, naglunsad ang Japan ng sorpresang atake sa Pilipinas." },
                        { time: 6, text: "Inatake ng mga puwersang Hapon ang mga estratehikong lugar sa buong kapuluan." },
                        { time: 11, text: "Sinira ng mga pag-atake sa hangin ang Clark Air Base at mga eroplano ng Allied." },
                        { time: 17, text: "Dumaong ang mga tropang Hapon sa mga baybayin ng Pilipinas." },
                        { time: 22, text: "Mabilis na napabagsak ang mga depensa ng Filipino-Amerikano." },
                        { time: 27, text: "Si Heneral Douglas MacArthur ang nanguna sa depensa ng Allied." },
                        { time: 32, text: "Umatras ang mga puwersang Allied sa Tangway ng Bataan." },
                        { time: 37, text: "Ang Corregidor ay naging isang pangunahing posisyong depensibo." },
                        { time: 42, text: "Naghanda ang mga tropa ng mga depensa sa Bataan at Corregidor." },
                        { time: 47, text: "Sa kabila ng kakulangan, lumaban ang mga depensor upang maantala ang Japan. Naghintay ang mga depensor ng reinforcements na hindi dumating." }
                    ]
                }
            },
            {
                lessonId: 2,
                title: 'Bataan Death March',
                videoFile: 'assets/ModuleVideos/WW2%20Era/WW2%20Chapter%202.mp4',
                captions: {
                    en: [
                        { time: 0, text: "On April 9, 1942, Allied forces in Bataan surrendered." },
                        { time: 6, text: "Thousands of Filipino and American prisoners were forced to march." },
                        { time: 12, text: "Prisoners endured extreme heat and exhaustion." },
                        { time: 17, text: "Many collapsed from hunger and dehydration." },
                        { time: 22, text: "Prisoners suffered abuse from their captors." },
                        { time: 27, text: "Thousands died along the march." },
                        { time: 32, text: "The march became one of the war's darkest events." },
                        { time: 37, text: "Survivors carried lifelong physical and emotional scars." },
                        { time: 43, text: "The world reacted with shock and outrage." },
                        { time: 48, text: "The march stands as a symbol of sacrifice and resilience." }
                    ],
                    tl: [
                        { time: 0, text: "Noong Abril 9, 1942, sumuko ang mga puwersang Allied sa Bataan." },
                        { time: 6, text: "Libu-libong bilanggong Filipino at Amerikano ang pinilit na magmartsa." },
                        { time: 12, text: "Ang mga bilanggo ay nagtiis ng matinding init at pagod." },
                        { time: 17, text: "Marami ang bumagsak dahil sa gutom at pagkauhaw." },
                        { time: 22, text: "Ang mga bilanggo ay nakaranas ng pang-aabuso mula sa kanilang mga tagapagbilanggo." },
                        { time: 27, text: "Libu-libo ang namatay sa kahabaan ng martsa." },
                        { time: 32, text: "Ang martsa ay naging isa sa pinakamadilim na pangyayari ng digmaan." },
                        { time: 37, text: "Ang mga nakaligtas ay nagdala ng panghabang-buhay na pisikal at emosyonal na mga sugat." },
                        { time: 43, text: "Ang mundo ay nagtugon ng pagkabigla at galit." },
                        { time: 48, text: "Ang martsa ay nakatayo bilang simbolo ng sakripisyo at katatagan." }
                    ]
                }
            },
            {
                lessonId: 3,
                title: 'Filipino Resistance',
                videoFile: 'assets/ModuleVideos/WW2%20Era/WW2%20Chapter%203.mp4',
                captions: {
                    en: [
                        { time: 0, text: "Filipino civilians became guerrilla fighters, resisting Japanese occupation." },
                        { time: 6, text: "Resistance leaders planned operations in hidden shelters." },
                        { time: 11, text: "Guerrillas moved carefully through jungles, relying on the land." },
                        { time: 17, text: "Under darkness, they sabotaged Japanese supply depots." },
                        { time: 23, text: "Guerrillas ambushed convoys, disrupting enemy supply lines." },
                        { time: 29, text: "Civilians secretly provided food, messages, and supplies." },
                        { time: 35, text: "Radio operators sent vital intelligence to Allied forces." },
                        { time: 41, text: "Guerrillas guided civilians to safety from patrols." },
                        { time: 47, text: "They rescued Allied prisoners through dangerous jungle routes." },
                        { time: 53, text: "As liberation neared, scouts watched enemy movements." }
                    ],
                    tl: [
                        { time: 0, text: "Ang mga sibilyang Pilipino ay naging mga mandirigmang gerilya, lumalaban sa okupasyon ng Hapon." },
                        { time: 6, text: "Ang mga lider ng paglaban ay nagplano ng mga operasyon sa mga nakatagong kanlungan." },
                        { time: 11, text: "Ang mga gerilya ay maingat na gumalaw sa mga kagubatan, umaasa sa lupa." },
                        { time: 17, text: "Sa ilalim ng kadiliman, sinabotahe nila ang mga bodega ng suplay ng Hapon." },
                        { time: 23, text: "Inambush ng mga gerilya ang mga convoy, sinira ang mga linya ng suplay ng kaaway." },
                        { time: 29, text: "Lihim na nagbigay ang mga sibilyan ng pagkain, mensahe, at suplay." },
                        { time: 35, text: "Ang mga radio operator ay nagpadala ng mahahalagang impormasyon sa mga puwersang Allied." },
                        { time: 41, text: "Ang mga gerilya ay ginabayan ang mga sibilyan sa kaligtasan mula sa mga patrol." },
                        { time: 47, text: "Sinagip nila ang mga bilanggong Allied sa mapanganib na mga ruta sa kagubatan." },
                        { time: 53, text: "Habang papalapit ang paglaya, binabantayan ng mga scout ang mga kilos ng kaaway." }
                    ]
                }
            },
            {
                lessonId: 4,
                title: 'Liberation',
                videoFile: 'assets/ModuleVideos/WW2%20Era/WW2%20Chapter%204.mp4',
                captions: {
                    en: [
                        { time: 0, text: "General MacArthur vowed to return—a promise that gave Filipinos hope." },
                        { time: 6, text: "In October 1944, Allied forces sailed toward Leyte." },
                        { time: 11, text: "On October 20, 1944, MacArthur returned to Philippine soil." },
                        { time: 17, text: "Filipinos welcomed the Allies with relief and hope." },
                        { time: 22, text: "The Battle of Leyte Gulf erupted, deciding the Pacific war." },
                        { time: 28, text: "Japan's naval power was shattered." },
                        { time: 33, text: "Allied and Filipino forces reclaimed the country." },
                        { time: 38, text: "Manila was liberated, but left in ruins." },
                        { time: 43, text: "The war left deep scars on the Filipino people." },
                        { time: 48, text: "Japanese resistance collapsed by mid-1945. The Philippines emerged free, united by sacrifice." }
                    ],
                    tl: [
                        { time: 0, text: "Si Heneral MacArthur ay nangako na babalik—isang pangako na nagbigay pag-asa sa mga Pilipino." },
                        { time: 6, text: "Noong Oktubre 1944, ang mga puwersang Allied ay naglayag patungo sa Leyte." },
                        { time: 11, text: "Noong Oktubre 20, 1944, bumalik si MacArthur sa lupain ng Pilipinas." },
                        { time: 17, text: "Tinanggap ng mga Pilipino ang mga Allies na may ginhawa at pag-asa." },
                        { time: 22, text: "Sumiklab ang Labanan sa Golpo ng Leyte, nagpasya sa digmaan sa Pasipiko." },
                        { time: 28, text: "Nawasak ang kapangyarihan sa dagat ng Japan." },
                        { time: 33, text: "Nabawi ng mga puwersang Allied at Pilipino ang bansa." },
                        { time: 38, text: "Nalaya ang Maynila, ngunit naiwan na wasak." },
                        { time: 43, text: "Ang digmaan ay nag-iwan ng malalim na sugat sa mga Pilipinong tao." },
                        { time: 48, text: "Bumagsak ang paglaban ng Hapon noong kalagitnaan ng 1945. Lumitaw ang Pilipinas na malaya, pinag-isa ng sakripisyo." }
                    ]
                }
            },
            {
                lessonId: 5,
                title: 'Independence',
                videoFile: 'assets/ModuleVideos/WW2%20Era/WW2%20Chapter%205.mp4',
                captions: {
                    en: [
                        { time: 0, text: "After decades of American rule, the Philippines neared freedom." },
                        { time: 6, text: "On July 4, 1946, the Philippines became an independent nation." },
                        { time: 12, text: "Independence came as the country lay in ruins." },
                        { time: 17, text: "Despite hardship, Filipinos looked forward with hope." },
                        { time: 22, text: "Manuel Roxas became the first president of the republic." },
                        { time: 28, text: "The nation began rebuilding its institutions and economy." },
                        { time: 34, text: "Recovery was slow, but daily life returned." },
                        { time: 39, text: "The Philippines kept close ties with the United States." },
                        { time: 45, text: "Postwar agreements shaped the young nation's path." },
                        { time: 50, text: "The Philippines worked to define its national identity. Independence marked the start of self-determination." }
                    ],
                    tl: [
                        { time: 0, text: "Pagkatapos ng mga dekada ng pamamahala ng Amerika, papalapit na ang Pilipinas sa kalayaan." },
                        { time: 6, text: "Noong Hulyo 4, 1946, ang Pilipinas ay naging isang malayang bansa." },
                        { time: 12, text: "Dumating ang kalayaan habang ang bansa ay wasak." },
                        { time: 17, text: "Sa kabila ng kahirapan, tumingin ang mga Pilipino sa harap na may pag-asa." },
                        { time: 22, text: "Si Manuel Roxas ang naging unang pangulo ng republika." },
                        { time: 28, text: "Nagsimulang itayo muli ng bansa ang mga institusyon at ekonomiya nito." },
                        { time: 34, text: "Mabagal ang pagbangon, ngunit bumalik ang pang-araw-araw na buhay." },
                        { time: 39, text: "Ang Pilipinas ay nagpanatili ng malapit na ugnayan sa Estados Unidos." },
                        { time: 45, text: "Ang mga kasunduang pagkatapos ng digmaan ay humubog sa landas ng batang bansa." },
                        { time: 50, text: "Nagtrabaho ang Pilipinas upang tukuyin ang pambansang pagkakakilanlan nito. Ang kalayaan ay nagmarka ng simula ng pagpapasya sa sarili." }
                    ]
                }
            }
        ]
    }
};

// Function to get video data for a specific lesson
function getVideoForLesson(eraKey, lessonId) {
    const eraVideos = moduleVideos[eraKey];
    if (!eraVideos) return null;
    
    const lessonVideo = eraVideos.lessons.find(l => l.lessonId === lessonId);
    return lessonVideo || null;
}

// Function to get captions for current language
function getCaptionsForLesson(eraKey, lessonId, language) {
    const videoData = getVideoForLesson(eraKey, lessonId);
    if (!videoData || !videoData.captions) return [];
    
    return videoData.captions[language] || videoData.captions['en'] || [];
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { moduleVideos, getVideoForLesson, getCaptionsForLesson };
}
