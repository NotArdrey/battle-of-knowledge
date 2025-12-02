// Multilingual questions for each era
const questionsData = {
    'early-spanish': {
        en: [
            {
                question: "Who was the first Filipino hero to resist Spanish colonization?",
                answers: ["Lapu-Lapu", "Jose Rizal", "Andres Bonifacio", "Emilio Aguinaldo"],
                correct: "Lapu-Lapu"
            },
            {
                question: "In what year did Ferdinand Magellan arrive in the Philippines?",
                answers: ["1521", "1565", "1898", "1896"],
                correct: "1521"
            },
            {
                question: "Where did the Battle of Mactan take place?",
                answers: ["Cebu", "Manila", "Bataan", "Mindanao"],
                correct: "Cebu"
            },
            {
                question: "Who was the chieftain of Mactan during the Spanish arrival?",
                answers: ["Lapu-Lapu", "Raja Humabon", "Datu Sikatuna", "Datu Puti"],
                correct: "Lapu-Lapu"
            },
            {
                question: "Who was the chieftain who welcomed Magellan and converted to Christianity?",
                answers: ["Raja Humabon", "Lapu-Lapu", "Datu Sikatuna", "Sultan Kudarat"],
                correct: "Raja Humabon"
            },
            {
                question: "What was the original name of the Philippines before Spanish colonization?",
                answers: ["Las Islas Filipinas", "Maharlika", "Ophir", "Pearl of the Orient"],
                correct: "Maharlika"
            },
            {
                question: "How did Ferdinand Magellan die?",
                answers: ["Killed in Battle of Mactan", "Died of illness", "Drowned at sea", "Returned to Spain"],
                correct: "Killed in Battle of Mactan"
            },
            {
                question: "What weapon was Lapu-Lapu famous for using?",
                answers: ["Kampilan (sword)", "Bow and arrow", "Spear", "Shield"],
                correct: "Kampilan (sword)"
            },
            {
                question: "What year did Spain officially colonize the Philippines?",
                answers: ["1565", "1521", "1571", "1600"],
                correct: "1565"
            },
            {
                question: "Who led the first successful Spanish expedition to colonize the Philippines?",
                answers: ["Miguel Lopez de Legazpi", "Ferdinand Magellan", "Ruy Lopez de Villalobos", "Martin de Goiti"],
                correct: "Miguel Lopez de Legazpi"
            }
        ],
        tl: [
            {
                question: "Sino ang unang bayaning Pilipino na lumaban sa pananakop ng Espanya?",
                answers: ["Lapu-Lapu", "Jose Rizal", "Andres Bonifacio", "Emilio Aguinaldo"],
                correct: "Lapu-Lapu"
            },
            {
                question: "Anong taon dumating si Ferdinand Magellan sa Pilipinas?",
                answers: ["1521", "1565", "1898", "1896"],
                correct: "1521"
            },
            {
                question: "Saan naganap ang Labanan sa Mactan?",
                answers: ["Cebu", "Maynila", "Bataan", "Mindanao"],
                correct: "Cebu"
            },
            {
                question: "Sino ang pinuno ng Mactan noong dumating ang mga Espanyol?",
                answers: ["Lapu-Lapu", "Raja Humabon", "Datu Sikatuna", "Datu Puti"],
                correct: "Lapu-Lapu"
            },
            {
                question: "Sino ang pinunong tumanggap kay Magellan at naging Kristiyano?",
                answers: ["Raja Humabon", "Lapu-Lapu", "Datu Sikatuna", "Sultan Kudarat"],
                correct: "Raja Humabon"
            },
            {
                question: "Ano ang orihinal na pangalan ng Pilipinas bago sakupin ng Espanya?",
                answers: ["Las Islas Filipinas", "Maharlika", "Ophir", "Perlas ng Silangan"],
                correct: "Maharlika"
            },
            {
                question: "Paano namatay si Ferdinand Magellan?",
                answers: ["Napatay sa Labanan sa Mactan", "Namatay sa sakit", "Nalunod sa dagat", "Bumalik sa Espanya"],
                correct: "Napatay sa Labanan sa Mactan"
            },
            {
                question: "Anong sandata ang ginagamit ni Lapu-Lapu?",
                answers: ["Kampilan (espada)", "Pana at palaso", "Sibat", "Kalasag"],
                correct: "Kampilan (espada)"
            },
            {
                question: "Anong taon opisyal na sinakop ng Espanya ang Pilipinas?",
                answers: ["1565", "1521", "1571", "1600"],
                correct: "1565"
            },
            {
                question: "Sino ang nanguna sa unang matagumpay na ekspedisyon ng Espanya sa Pilipinas?",
                answers: ["Miguel Lopez de Legazpi", "Ferdinand Magellan", "Ruy Lopez de Villalobos", "Martin de Goiti"],
                correct: "Miguel Lopez de Legazpi"
            }
        ]
    },
    'late-spanish': {
        en: [
            {
                question: "Who wrote 'Noli Me Tangere'?",
                answers: ["Jose Rizal", "Andres Bonifacio", "Emilio Aguinaldo", "Apolinario Mabini"],
                correct: "Jose Rizal"
            },
            {
                question: "What year was Jose Rizal executed?",
                answers: ["1896", "1898", "1899", "1900"],
                correct: "1896"
            },
            {
                question: "Who founded the Katipunan?",
                answers: ["Andres Bonifacio", "Emilio Aguinaldo", "Jose Rizal", "Apolinario Mabini"],
                correct: "Andres Bonifacio"
            },
            {
                question: "When did the Philippines declare independence from Spain?",
                answers: ["June 12, 1898", "June 12, 1896", "July 4, 1946", "December 30, 1896"],
                correct: "June 12, 1898"
            },
            {
                question: "Who was known as the 'Brains of the Revolution'?",
                answers: ["Apolinario Mabini", "Emilio Aguinaldo", "Andres Bonifacio", "Antonio Luna"],
                correct: "Apolinario Mabini"
            },
            {
                question: "What was the full name of the Katipunan?",
                answers: ["Kataas-taasang Kagalang-galangang Katipunan ng mga Anak ng Bayan", "Katipunan ng mga Bayani", "Katipunan ng Pilipinas", "Kataas-taasang Katipunan"],
                correct: "Kataas-taasang Kagalang-galangang Katipunan ng mga Anak ng Bayan"
            },
            {
                question: "Where was Jose Rizal executed?",
                answers: ["Bagumbayan (Luneta)", "Fort Santiago", "Kawit, Cavite", "Calamba, Laguna"],
                correct: "Bagumbayan (Luneta)"
            },
            {
                question: "Who was the first President of the Philippines?",
                answers: ["Emilio Aguinaldo", "Andres Bonifacio", "Manuel Quezon", "Sergio Osmeña"],
                correct: "Emilio Aguinaldo"
            },
            {
                question: "What was Jose Rizal's second novel?",
                answers: ["El Filibusterismo", "Mi Ultimo Adios", "Noli Me Tangere", "Sobre la Indolencia"],
                correct: "El Filibusterismo"
            },
            {
                question: "What was the secret password of the Katipunan?",
                answers: ["Anak ng Bayan", "Kalayaan", "Kapatiran", "Kagitingan"],
                correct: "Anak ng Bayan"
            }
        ],
        tl: [
            {
                question: "Sino ang sumulat ng 'Noli Me Tangere'?",
                answers: ["Jose Rizal", "Andres Bonifacio", "Emilio Aguinaldo", "Apolinario Mabini"],
                correct: "Jose Rizal"
            },
            {
                question: "Anong taon binaril si Jose Rizal?",
                answers: ["1896", "1898", "1899", "1900"],
                correct: "1896"
            },
            {
                question: "Sino ang nagtatag ng Katipunan?",
                answers: ["Andres Bonifacio", "Emilio Aguinaldo", "Jose Rizal", "Apolinario Mabini"],
                correct: "Andres Bonifacio"
            },
            {
                question: "Kailan idineklara ang kalayaan ng Pilipinas mula sa Espanya?",
                answers: ["Hunyo 12, 1898", "Hunyo 12, 1896", "Hulyo 4, 1946", "Disyembre 30, 1896"],
                correct: "Hunyo 12, 1898"
            },
            {
                question: "Sino ang kilala bilang 'Utak ng Rebolusyon'?",
                answers: ["Apolinario Mabini", "Emilio Aguinaldo", "Andres Bonifacio", "Antonio Luna"],
                correct: "Apolinario Mabini"
            },
            {
                question: "Ano ang buong pangalan ng Katipunan?",
                answers: ["Kataas-taasang Kagalang-galangang Katipunan ng mga Anak ng Bayan", "Katipunan ng mga Bayani", "Katipunan ng Pilipinas", "Kataas-taasang Katipunan"],
                correct: "Kataas-taasang Kagalang-galangang Katipunan ng mga Anak ng Bayan"
            },
            {
                question: "Saan binaril si Jose Rizal?",
                answers: ["Bagumbayan (Luneta)", "Fort Santiago", "Kawit, Cavite", "Calamba, Laguna"],
                correct: "Bagumbayan (Luneta)"
            },
            {
                question: "Sino ang unang Pangulo ng Pilipinas?",
                answers: ["Emilio Aguinaldo", "Andres Bonifacio", "Manuel Quezon", "Sergio Osmeña"],
                correct: "Emilio Aguinaldo"
            },
            {
                question: "Ano ang pangalawang nobela ni Jose Rizal?",
                answers: ["El Filibusterismo", "Mi Ultimo Adios", "Noli Me Tangere", "Sobre la Indolencia"],
                correct: "El Filibusterismo"
            },
            {
                question: "Ano ang lihim na password ng Katipunan?",
                answers: ["Anak ng Bayan", "Kalayaan", "Kapatiran", "Kagitingan"],
                correct: "Anak ng Bayan"
            }
        ]
    },
    'american-colonial': {
        en: [
            {
                question: "What battle marked the beginning of American-Philippine War?",
                answers: ["Battle of Manila Bay", "Battle of Mactan", "Battle of Bataan", "Battle of Tirad Pass"],
                correct: "Battle of Manila Bay"
            },
            {
                question: "Who was the American naval commander during the Battle of Manila Bay?",
                answers: ["George Dewey", "Douglas MacArthur", "Arthur MacArthur", "William Howard Taft"],
                correct: "George Dewey"
            },
            {
                question: "What year did the Spanish-American War begin?",
                answers: ["1898", "1896", "1899", "1901"],
                correct: "1898"
            },
            {
                question: "Who was the Filipino general who fought at Tirad Pass?",
                answers: ["Gregorio del Pilar", "Antonio Luna", "Emilio Aguinaldo", "Juan Luna"],
                correct: "Gregorio del Pilar"
            },
            {
                question: "What treaty ended the Spanish-American War?",
                answers: ["Treaty of Paris", "Treaty of Versailles", "Treaty of Manila", "Treaty of Biak-na-Bato"],
                correct: "Treaty of Paris"
            },
            {
                question: "How much did the United States pay Spain for the Philippines?",
                answers: ["$20 million", "$10 million", "$50 million", "$100 million"],
                correct: "$20 million"
            },
            {
                question: "Who was known as the 'Boy General' of the Philippine Revolution?",
                answers: ["Gregorio del Pilar", "Emilio Aguinaldo", "Antonio Luna", "Manuel Tinio"],
                correct: "Gregorio del Pilar"
            },
            {
                question: "What was General Antonio Luna's role in the Philippine-American War?",
                answers: ["Chief of War Operations", "President", "Naval Commander", "Foreign Minister"],
                correct: "Chief of War Operations"
            },
            {
                question: "When did the Philippine-American War officially end?",
                answers: ["1902", "1898", "1905", "1910"],
                correct: "1902"
            },
            {
                question: "What American colonial policy introduced public education in the Philippines?",
                answers: ["Thomasites Program", "Jones Law", "Tydings-McDuffie Act", "Philippine Bill"],
                correct: "Thomasites Program"
            }
        ],
        tl: [
            {
                question: "Anong labanan ang nagsimula ng Digmaang Pilipino-Amerikano?",
                answers: ["Labanan sa Manila Bay", "Labanan sa Mactan", "Labanan sa Bataan", "Labanan sa Tirad Pass"],
                correct: "Labanan sa Manila Bay"
            },
            {
                question: "Sino ang Amerikanong naval commander sa Labanan sa Manila Bay?",
                answers: ["George Dewey", "Douglas MacArthur", "Arthur MacArthur", "William Howard Taft"],
                correct: "George Dewey"
            },
            {
                question: "Anong taon nagsimula ang Digmaang Espanyol-Amerikano?",
                answers: ["1898", "1896", "1899", "1901"],
                correct: "1898"
            },
            {
                question: "Sino ang heneral na nakipaglaban sa Tirad Pass?",
                answers: ["Gregorio del Pilar", "Antonio Luna", "Emilio Aguinaldo", "Juan Luna"],
                correct: "Gregorio del Pilar"
            },
            {
                question: "Anong kasunduan ang nagwakas sa Digmaang Espanyol-Amerikano?",
                answers: ["Kasunduan sa Paris", "Kasunduan sa Versailles", "Kasunduan sa Manila", "Kasunduan sa Biak-na-Bato"],
                correct: "Kasunduan sa Paris"
            },
            {
                question: "Magkano ang binayad ng Estados Unidos sa Espanya para sa Pilipinas?",
                answers: ["$20 milyon", "$10 milyon", "$50 milyon", "$100 milyon"],
                correct: "$20 milyon"
            },
            {
                question: "Sino ang kilala bilang 'Batang Heneral' ng Rebolusyong Pilipino?",
                answers: ["Gregorio del Pilar", "Emilio Aguinaldo", "Antonio Luna", "Manuel Tinio"],
                correct: "Gregorio del Pilar"
            },
            {
                question: "Ano ang tungkulin ni Heneral Antonio Luna sa Digmaang Pilipino-Amerikano?",
                answers: ["Hepe ng Operasyon sa Digmaan", "Pangulo", "Kumander ng Hukbong-Dagat", "Ministro ng Ugnayang Panlabas"],
                correct: "Hepe ng Operasyon sa Digmaan"
            },
            {
                question: "Kailan opisyal na natapos ang Digmaang Pilipino-Amerikano?",
                answers: ["1902", "1898", "1905", "1910"],
                correct: "1902"
            },
            {
                question: "Anong patakaran ng Amerikano ang nagdala ng pampublikong edukasyon sa Pilipinas?",
                answers: ["Programa ng Thomasites", "Batas Jones", "Batas Tydings-McDuffie", "Philippine Bill"],
                correct: "Programa ng Thomasites"
            }
        ]
    },
    'ww2': {
        en: [
            {
                question: "Who promised to return to the Philippines during World War II?",
                answers: ["Douglas MacArthur", "George Dewey", "Franklin Roosevelt", "Dwight Eisenhower"],
                correct: "Douglas MacArthur"
            },
            {
                question: "What year did Japan invade the Philippines?",
                answers: ["1941", "1942", "1945", "1940"],
                correct: "1941"
            },
            {
                question: "Where did the Bataan Death March take place?",
                answers: ["Bataan Peninsula", "Manila", "Cebu", "Mindanao"],
                correct: "Bataan Peninsula"
            },
            {
                question: "When was the Philippines liberated from Japan?",
                answers: ["1945", "1944", "1946", "1943"],
                correct: "1945"
            },
            {
                question: "What famous words did MacArthur say when he left the Philippines?",
                answers: ["I shall return", "We will be back", "Never surrender", "Victory awaits"],
                correct: "I shall return"
            },
            {
                question: "Where did MacArthur land when he returned to the Philippines?",
                answers: ["Leyte", "Bataan", "Manila", "Corregidor"],
                correct: "Leyte"
            },
            {
                question: "What was the last stronghold of American and Filipino forces before surrender?",
                answers: ["Corregidor", "Bataan", "Manila", "Fort Santiago"],
                correct: "Corregidor"
            },
            {
                question: "What date did Japan attack the Philippines?",
                answers: ["December 8, 1941", "December 7, 1941", "January 2, 1942", "September 21, 1944"],
                correct: "December 8, 1941"
            },
            {
                question: "Who was the Filipino general who fought alongside MacArthur?",
                answers: ["General Vicente Lim", "General Emilio Aguinaldo", "General Antonio Luna", "General Gregorio del Pilar"],
                correct: "General Vicente Lim"
            },
            {
                question: "What battle is considered the largest naval battle in history during WWII?",
                answers: ["Battle of Leyte Gulf", "Battle of Manila Bay", "Battle of Coral Sea", "Battle of Midway"],
                correct: "Battle of Leyte Gulf"
            }
        ],
        tl: [
            {
                question: "Sino ang nangakong babalik sa Pilipinas noong Ikalawang Digmaang Pandaigdig?",
                answers: ["Douglas MacArthur", "George Dewey", "Franklin Roosevelt", "Dwight Eisenhower"],
                correct: "Douglas MacArthur"
            },
            {
                question: "Anong taon sinakop ng Japan ang Pilipinas?",
                answers: ["1941", "1942", "1945", "1940"],
                correct: "1941"
            },
            {
                question: "Saan naganap ang Bataan Death March?",
                answers: ["Bataan Peninsula", "Maynila", "Cebu", "Mindanao"],
                correct: "Bataan Peninsula"
            },
            {
                question: "Kailan pinalaya ang Pilipinas mula sa Japan?",
                answers: ["1945", "1944", "1946", "1943"],
                correct: "1945"
            },
            {
                question: "Ano ang sikat na sinabi ni MacArthur nang umalis siya sa Pilipinas?",
                answers: ["I shall return", "We will be back", "Never surrender", "Victory awaits"],
                correct: "I shall return"
            },
            {
                question: "Saan bumalik si MacArthur sa Pilipinas?",
                answers: ["Leyte", "Bataan", "Maynila", "Corregidor"],
                correct: "Leyte"
            },
            {
                question: "Ano ang huling kuta ng mga pwersa ng Amerikano at Pilipino bago sumuko?",
                answers: ["Corregidor", "Bataan", "Maynila", "Fort Santiago"],
                correct: "Corregidor"
            },
            {
                question: "Anong petsa sinalakay ng Japan ang Pilipinas?",
                answers: ["Disyembre 8, 1941", "Disyembre 7, 1941", "Enero 2, 1942", "Setyembre 21, 1944"],
                correct: "Disyembre 8, 1941"
            },
            {
                question: "Sino ang heneralng Pilipino na nakipaglaban kasama ni MacArthur?",
                answers: ["Heneral Vicente Lim", "Heneral Emilio Aguinaldo", "Heneral Antonio Luna", "Heneral Gregorio del Pilar"],
                correct: "Heneral Vicente Lim"
            },
            {
                question: "Anong labanan ang itinuturing na pinakamalaking labanan sa dagat sa WWII?",
                answers: ["Labanan sa Leyte Gulf", "Labanan sa Manila Bay", "Labanan sa Coral Sea", "Labanan sa Midway"],
                correct: "Labanan sa Leyte Gulf"
            }
        ]
    }
};

// Current questions array based on selected language and era
let questions = [];
