// Historical contributions for each character
const characterContributions = {
    'Lapu-Lapu': {
        type: 'hero',
        contributions: [
            'First Filipino hero to resist Spanish colonization',
            'Defeated Ferdinand Magellan in the Battle of Mactan on April 27, 1521',
            'Chieftain of Mactan who defended Philippine sovereignty',
            'Symbol of Filipino resistance and bravery',
            'His victory delayed Spanish colonization for several decades'
        ]
    },
    'Raja Humabon': {
        type: 'hero',
        contributions: [
            'Rajah of Cebu who initially allied with Magellan',
            'First Filipino ruler to be baptized as a Christian (renamed Carlos)',
            'Played a crucial role in early Spanish-Filipino relations',
            'His alliance with Spain marked the beginning of Spanish influence',
            'Helped facilitate early trade and cultural exchange'
        ]
    },
    'Ferdinand Magellan': {
        type: 'villain',
        contributions: [
            'Portuguese explorer who led the first circumnavigation expedition',
            'Arrived in the Philippines on March 16, 1521',
            'Claimed the islands for Spain',
            'Introduced Christianity to the Philippines',
            'Killed in the Battle of Mactan by Lapu-Lapu\'s forces'
        ]
    },
    'Spanish Soldier': {
        type: 'villain',
        contributions: [
            'Represented Spanish colonial military forces',
            'Enforced Spanish rule and colonial policies',
            'Participated in the conquest and pacification of Philippine territories',
            'Maintained Spanish military presence for over 300 years'
        ]
    },
    'Jose Rizal': {
        type: 'hero',
        contributions: [
            'National hero of the Philippines',
            'Wrote "Noli Me Tangere" (1887) and "El Filibusterismo" (1891)',
            'Exposed Spanish colonial abuses through his writings',
            'Founded La Liga Filipina to unite Filipinos',
            'Executed on December 30, 1896, inspiring the Philippine Revolution',
            'Advocated for peaceful reforms and education'
        ]
    },
    'Andres Bonifacio': {
        type: 'hero',
        contributions: [
            'Founded the Katipunan (KKK) on July 7, 1892',
            'Started the Philippine Revolution with the Cry of Pugad Lawin (1896)',
            'Known as the "Father of the Philippine Revolution"',
            'Led armed resistance against Spanish colonial rule',
            'Symbolized the struggle of the common Filipino masses'
        ]
    },
    'Emilio Aguinaldo': {
        type: 'hero',
        contributions: [
            'First President of the Philippines',
            'Led Filipino forces during the Philippine Revolution',
            'Declared Philippine Independence on June 12, 1898',
            'Commander-in-chief of revolutionary forces',
            'Led resistance during Philippine-American War',
            'Youngest general in the revolutionary army at age 28'
        ]
    },
    'Apolinario Mabini': {
        type: 'hero',
        contributions: [
            'Known as the "Brains of the Revolution"',
            'First Prime Minister and Foreign Minister of the Philippines',
            'Chief adviser to President Emilio Aguinaldo',
            'Wrote the Malolos Constitution',
            'Advocated for Philippine independence and sovereignty',
            'Continued to serve despite being paralyzed from polio'
        ]
    },
    'Spanish Commander': {
        type: 'villain',
        contributions: [
            'Led Spanish military operations during the late colonial period',
            'Commanded forces against Filipino revolutionaries',
            'Enforced harsh colonial policies and martial law',
            'Represented Spanish military authority during the revolution'
        ]
    },
    'General Juan Luna': {
        type: 'hero',
        contributions: [
            'Brother of painter Juan Luna, one of the greatest Filipino military leaders',
            'Led Filipino forces during the Philippine-American War',
            'Known for brilliant military tactics and strategies',
            'Commanded the defense of Northern Luzon',
            'Assassinated in 1899, reportedly on orders from Aguinaldo',
            'His death weakened Filipino resistance against Americans'
        ]
    },
    'Commodore George Dewey': {
        type: 'villain',
        contributions: [
            'Commander of US Asiatic Squadron',
            'Defeated Spanish fleet in Battle of Manila Bay (May 1, 1898)',
            'His victory marked the end of Spanish colonial rule',
            'Enabled American occupation of the Philippines',
            'Famous for saying "You may fire when ready, Gridley"'
        ]
    },
    'American Soldier': {
        type: 'villain',
        contributions: [
            'Represented American colonial forces',
            'Fought in the Philippine-American War (1899-1902)',
            'Enforced American colonial policies',
            'Participated in campaigns against Filipino revolutionaries'
        ]
    },
    'Douglas MacArthur': {
        type: 'hero',
        contributions: [
            'American general who led Allied forces in the Pacific',
            'Promised "I shall return" when forced to leave Philippines in 1942',
            'Returned and liberated the Philippines in 1944',
            'Led the recapture of Manila from Japanese forces',
            'Helped restore Philippine independence after WWII',
            'Received the rank of Field Marshal in the Philippine Army'
        ]
    },
    'Japanese Commander': {
        type: 'villain',
        contributions: [
            'Led Japanese occupation forces during WWII',
            'Commanded military operations against Filipino and Allied forces',
            'Enforced harsh Japanese occupation policies',
            'Responsible for wartime atrocities and civilian suffering'
        ]
    },
    'Japanese Soldier': {
        type: 'villain',
        contributions: [
            'Participated in Japanese invasion of Philippines (1941)',
            'Fought in the Battle of Bataan and Corregidor',
            'Enforced Japanese occupation from 1942-1945',
            'Represented Imperial Japanese military presence'
        ]
    }
};
