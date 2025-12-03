// Learning module content for each era
const learningData = {
    'early-spanish': {
        en: {
            title: 'Early Spanish Era (1521)',
            subtitle: 'The Battle of Mactan and First Contact',
            lessons: [
                {
                    id: 1,
                    title: '🏝️ Pre-Colonial Philippines',
                    icon: '🏝️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Life Before the Spanish</h3>
                        <p class="mb-3">Before 1521, the Philippines was made up of independent communities called <strong>barangays</strong>. Each barangay was led by a <strong>datu</strong> or chieftain.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Key Facts:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Filipinos had their own writing system called <strong>Baybayin</strong></li>
                            <li>They traded with China, Japan, and other Asian countries</li>
                            <li>Society was divided into nobles (maharlika), freemen, and slaves</li>
                            <li>They practiced animism and some communities had Islamic influences</li>
                        </ul>
                        
                        <div class="bg-blue-100 border-l-4 border-blue-500 p-4 mt-4">
                            <p class="font-semibold">💡 Did you know?</p>
                            <p>Ancient Filipinos were skilled navigators and boat builders, trading across Southeast Asia!</p>
                        </div>
                    `
                },
                {
                    id: 2,
                    title: '⛵ Magellan\'s Arrival (1521)',
                    icon: '⛵',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Ferdinand Magellan Arrives</h3>
                        <p class="mb-3">On <strong>March 16, 1521</strong>, Portuguese explorer Ferdinand Magellan, sailing for Spain, arrived in the Philippines seeking a westward route to the Spice Islands.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Timeline of Events:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li><strong>March 16, 1521:</strong> Magellan lands in Homonhon Island</li>
                            <li><strong>March 28, 1521:</strong> Arrives in Cebu</li>
                            <li><strong>April 14, 1521:</strong> Raja Humabon and his people convert to Christianity</li>
                            <li><strong>April 27, 1521:</strong> Battle of Mactan</li>
                        </ul>
                        
                        <div class="bg-amber-100 border-l-4 border-amber-500 p-4 mt-4">
                            <p class="font-semibold">⚠️ Important:</p>
                            <p>Magellan claimed the islands for Spain and attempted to convert the natives to Christianity. This led to conflict with local chieftains who resisted foreign control.</p>
                        </div>
                    `
                },
                {
                    id: 3,
                    title: '⚔️ Lapu-Lapu: The First Hero',
                    icon: '⚔️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Lapu-Lapu: Defender of Mactan</h3>
                        <p class="mb-3"><strong>Lapu-Lapu</strong> was the datu (chieftain) of Mactan Island in Cebu. He is celebrated as the first Filipino hero who resisted foreign colonization.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Why is Lapu-Lapu Important?</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>He <strong>refused to submit</strong> to Magellan and Spanish authority</li>
                            <li>He defended Filipino sovereignty and independence</li>
                            <li>He defeated one of history's greatest explorers</li>
                            <li>He symbolizes Filipino courage and resistance</li>
                        </ul>
                        
                        <h4 class="font-bold mt-4 mb-2">His Weapon:</h4>
                        <p class="mb-3">Lapu-Lapu is often depicted wielding a <strong>kampilan</strong>, a traditional Filipino sword known for its distinctive design and effectiveness in battle.</p>
                        
                        <div class="bg-green-100 border-l-4 border-green-500 p-4 mt-4">
                            <p class="font-semibold">🏆 Legacy:</p>
                            <p>Lapu-Lapu is honored as the first Filipino to resist European colonization. His statue stands proudly in Mactan, Cebu!</p>
                        </div>
                    `
                },
                {
                    id: 4,
                    title: '🗡️ The Battle of Mactan',
                    icon: '🗡️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">The Battle of Mactan (April 27, 1521)</h3>
                        <p class="mb-3">The <strong>Battle of Mactan</strong> was a historic battle where Filipino warriors, led by Lapu-Lapu, defeated Spanish forces led by Ferdinand Magellan.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">What Happened?</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Magellan demanded Lapu-Lapu submit to Spanish authority</li>
                            <li>Lapu-Lapu refused and prepared to defend his island</li>
                            <li>Magellan led 49 soldiers to attack Mactan</li>
                            <li>About 1,500 Filipino warriors fought against them</li>
                            <li>Magellan was killed in the battle</li>
                            <li>The Spanish forces retreated in defeat</li>
                        </ul>
                        
                        <h4 class="font-bold mt-4 mb-2">Why Did the Filipinos Win?</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li><strong>Home advantage:</strong> Knew the terrain and shallow waters</li>
                            <li><strong>Numbers:</strong> Outnumbered the Spanish forces</li>
                            <li><strong>Strategy:</strong> Used tactics that countered Spanish weapons</li>
                            <li><strong>Determination:</strong> Fighting for their homeland and freedom</li>
                        </ul>
                        
                        <div class="bg-red-100 border-l-4 border-red-500 p-4 mt-4">
                            <p class="font-semibold">⚡ Battle Outcome:</p>
                            <p>This was a significant victory for the Filipinos and showed that Western powers could be defeated. However, Spain would return in 1565 to establish permanent colonial rule.</p>
                        </div>
                    `
                },
                {
                    id: 5,
                    title: '🏛️ After the Battle',
                    icon: '🏛️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">The Aftermath and Spanish Return</h3>
                        <p class="mb-3">Although Lapu-Lapu won the Battle of Mactan, the Spanish would eventually return to colonize the Philippines.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">What Happened Next:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li><strong>1521:</strong> Magellan's remaining crew left the Philippines</li>
                            <li><strong>1543:</strong> Ruy López de Villalobos named the islands "Las Islas Filipinas" after King Philip II of Spain</li>
                            <li><strong>1565:</strong> Miguel López de Legazpi led a successful expedition to colonize the Philippines</li>
                            <li><strong>1571:</strong> Manila was established as the colonial capital</li>
                            <li><strong>1565-1898:</strong> Spain ruled the Philippines for 333 years</li>
                        </ul>
                        
                        <h4 class="font-bold mt-4 mb-2">Spanish Colonial Impact:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Introduction of Christianity (Roman Catholicism)</li>
                            <li>Change from Baybayin to Latin alphabet</li>
                            <li>Establishment of schools and universities</li>
                            <li>Creation of a centralized government system</li>
                            <li>Exploitation of Filipino labor and resources</li>
                        </ul>
                        
                        <div class="bg-purple-100 border-l-4 border-purple-500 p-4 mt-4">
                            <p class="font-semibold">📚 Remember:</p>
                            <p>While the Battle of Mactan was a victory, it was only the beginning of a long struggle for Philippine independence that wouldn't be achieved until 1898-1946.</p>
                        </div>
                    `
                }
            ]
        },
        tl: {
            title: 'Unang Panahon ng Espanyol (1521)',
            subtitle: 'Ang Labanan sa Mactan at Unang Pagdating',
            lessons: [
                {
                    id: 1,
                    title: '🏝️ Pilipinas Bago ang Pananakop',
                    icon: '🏝️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Buhay Bago Dumating ang Espanyol</h3>
                        <p class="mb-3">Bago ang 1521, ang Pilipinas ay binuo ng mga malayang pamayanan na tinatawag na <strong>barangay</strong>. Ang bawat barangay ay pinamumunuan ng isang <strong>datu</strong> o pinuno.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Mahahalagang Kaalaman:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Mayroon nang sariling sistema ng pagsulat ang mga Pilipino na tinatawag na <strong>Baybayin</strong></li>
                            <li>Nakikipagkalakalan sila sa Tsina, Japan, at iba pang bansa sa Asya</li>
                            <li>Ang lipunan ay nahahati sa maharlika, malaya, at alipin</li>
                            <li>Nagsasagawa sila ng animismo at may mga komunidad na may impluwensya ng Islam</li>
                        </ul>
                        
                        <div class="bg-blue-100 border-l-4 border-blue-500 p-4 mt-4">
                            <p class="font-semibold">💡 Alam mo ba?</p>
                            <p>Ang mga sinaunang Pilipino ay bihasang mandaragat at gumagawa ng bangka, nakikipagkalakalan sa buong Timog-Silangang Asya!</p>
                        </div>
                    `
                },
                {
                    id: 2,
                    title: '⛵ Pagdating ni Magellan (1521)',
                    icon: '⛵',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Dumating si Ferdinand Magellan</h3>
                        <p class="mb-3">Noong <strong>Marso 16, 1521</strong>, dumating sa Pilipinas si Ferdinand Magellan, isang Portuges na mandaragat na naglalayag para sa Espanya, na naghahanap ng kanlurang ruta patungo sa Spice Islands.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Talaan ng mga Pangyayari:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li><strong>Marso 16, 1521:</strong> Dumating si Magellan sa Isla ng Homonhon</li>
                            <li><strong>Marso 28, 1521:</strong> Dumating sa Cebu</li>
                            <li><strong>Abril 14, 1521:</strong> Naging Kristiyano si Raja Humabon at ang kanyang mga tao</li>
                            <li><strong>Abril 27, 1521:</strong> Labanan sa Mactan</li>
                        </ul>
                        
                        <div class="bg-amber-100 border-l-4 border-amber-500 p-4 mt-4">
                            <p class="font-semibold">⚠️ Mahalaga:</p>
                            <p>Inangkin ni Magellan ang mga isla para sa Espanya at sinubukan niyang gawin Kristiyano ang mga katutubo. Ito ay nagdulot ng salungatan sa mga pinunong lokal na tumangging sumuko.</p>
                        </div>
                    `
                },
                {
                    id: 3,
                    title: '⚔️ Lapu-Lapu: Ang Unang Bayani',
                    icon: '⚔️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Lapu-Lapu: Tagapagtanggol ng Mactan</h3>
                        <p class="mb-3">Si <strong>Lapu-Lapu</strong> ay ang datu (pinuno) ng Isla ng Mactan sa Cebu. Siya ay kinikilala bilang unang bayaning Pilipino na lumaban sa dayuhang pananakop.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Bakit Mahalaga si Lapu-Lapu?</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li><strong>Tumanggi siyang sumuko</strong> kay Magellan at sa awtoridad ng Espanya</li>
                            <li>Ipinagtanggol niya ang kalayaan at soberanya ng mga Pilipino</li>
                            <li>Tinalo niya ang isa sa pinakadakilang mandaragat sa kasaysayan</li>
                            <li>Sumasagisag siya sa tapang at paglaban ng mga Pilipino</li>
                        </ul>
                        
                        <h4 class="font-bold mt-4 mb-2">Ang Kanyang Sandata:</h4>
                        <p class="mb-3">Si Lapu-Lapu ay madalas na inilalarawan na may hawak na <strong>kampilan</strong>, isang tradisyonal na espada ng Pilipino na kilala sa natatanging disenyo at epektibong paggamit sa labanan.</p>
                        
                        <div class="bg-green-100 border-l-4 border-green-500 p-4 mt-4">
                            <p class="font-semibold">🏆 Pamana:</p>
                            <p>Si Lapu-Lapu ay ginagalang bilang unang Pilipinong lumaban sa pananakop ng mga Europeo. Ang kanyang estatwa ay nakatayo nang may karangalan sa Mactan, Cebu!</p>
                        </div>
                    `
                },
                {
                    id: 4,
                    title: '🗡️ Ang Labanan sa Mactan',
                    icon: '🗡️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Ang Labanan sa Mactan (Abril 27, 1521)</h3>
                        <p class="mb-3">Ang <strong>Labanan sa Mactan</strong> ay isang makasaysayang labanan kung saan tinalo ng mga mandirigmang Pilipino, na pinamumunuan ni Lapu-Lapu, ang mga pwersang Espanyol na pinamumunuan ni Ferdinand Magellan.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Ano ang Nangyari?</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Hiniling ni Magellan na sumuko si Lapu-Lapu sa awtoridad ng Espanya</li>
                            <li>Tumanggi si Lapu-Lapu at naghanda na ipagtanggol ang kanyang isla</li>
                            <li>Namuno si Magellan ng 49 sundalo upang atakihin ang Mactan</li>
                            <li>Humigit-kumulang 1,500 mandirigmang Pilipino ang lumaban sa kanila</li>
                            <li>Napatay si Magellan sa labanan</li>
                            <li>Umatras ang mga pwersang Espanyol sa pagkatalo</li>
                        </ul>
                        
                        <h4 class="font-bold mt-4 mb-2">Bakit Nanalo ang mga Pilipino?</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li><strong>Bentahe sa tahanan:</strong> Kilala ang lupain at mababaw na tubig</li>
                            <li><strong>Bilang:</strong> Higit na marami kaysa sa mga pwersang Espanyol</li>
                            <li><strong>Estratehiya:</strong> Gumamit ng taktika na kumontra sa mga sandata ng Espanyol</li>
                            <li><strong>Determinasyon:</strong> Lumalaban para sa kanilang lupain at kalayaan</li>
                        </ul>
                        
                        <div class="bg-red-100 border-l-4 border-red-500 p-4 mt-4">
                            <p class="font-semibold">⚡ Resulta ng Labanan:</p>
                            <p>Ito ay isang mahalagang tagumpay para sa mga Pilipino at nagpakita na matatalo ang mga pwersang Kanluranin. Gayunpaman, babalik ang Espanya noong 1565 upang magtatag ng permanenteng kolonyal na pamamahala.</p>
                        </div>
                    `
                },
                {
                    id: 5,
                    title: '🏛️ Pagkatapos ng Labanan',
                    icon: '🏛️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Ang Sumunod at Pagbabalik ng mga Espanyol</h3>
                        <p class="mb-3">Bagaman nanalo si Lapu-Lapu sa Labanan sa Mactan, babalik din ang mga Espanyol upang sakupin ang Pilipinas.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Ano ang Sumunod na Nangyari:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li><strong>1521:</strong> Umalis sa Pilipinas ang natitirang tripulante ni Magellan</li>
                            <li><strong>1543:</strong> Pinangalanan ni Ruy López de Villalobos ang mga isla bilang "Las Islas Filipinas" ayon kay Haring Philip II ng Espanya</li>
                            <li><strong>1565:</strong> Namuno si Miguel López de Legazpi ng matagumpay na ekspedisyon upang sakupin ang Pilipinas</li>
                            <li><strong>1571:</strong> Itinatag ang Maynila bilang kabisera ng kolonya</li>
                            <li><strong>1565-1898:</strong> Namahala ang Espanya sa Pilipinas ng 333 taon</li>
                        </ul>
                        
                        <h4 class="font-bold mt-4 mb-2">Epekto ng Kolonyal na Pamamahala ng Espanya:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Pagdating ng Kristiyanismo (Katoliko Romano)</li>
                            <li>Pagbabago mula sa Baybayin tungo sa Latin na alpabeto</li>
                            <li>Pagtatayo ng mga paaralan at unibersidad</li>
                            <li>Paglikha ng sentralisadong sistema ng pamahalaan</li>
                            <li>Pagsasamantala sa paggawa at likas na yaman ng mga Pilipino</li>
                        </ul>
                        
                        <div class="bg-purple-100 border-l-4 border-purple-500 p-4 mt-4">
                            <p class="font-semibold">📚 Tandaan:</p>
                            <p>Bagaman ang Labanan sa Mactan ay isang tagumpay, ito ay simula lamang ng isang mahabang pakikibaka para sa kalayaan ng Pilipinas na hindi makakamit hanggang 1898-1946.</p>
                        </div>
                    `
                }
            ]
        }
    },
    'late-spanish': {
        en: {
            title: 'Late Spanish Era (1896-1898)',
            subtitle: 'The Philippine Revolution',
            lessons: [
                {
                    id: 1,
                    title: '📖 Jose Rizal: The Reformist',
                    icon: '📖',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Dr. Jose Rizal - National Hero</h3>
                        <p class="mb-3"><strong>Jose Rizal</strong> (1861-1896) was a Filipino nationalist, writer, and polymath who advocated for reforms through peaceful means.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Key Contributions:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Wrote <strong>"Noli Me Tangere"</strong> (1887) exposing Spanish abuses</li>
                            <li>Wrote <strong>"El Filibusterismo"</strong> (1891) showing revolution's path</li>
                            <li>Founded the La Liga Filipina for peaceful reforms</li>
                            <li>Executed on December 30, 1896, becoming a martyr</li>
                        </ul>
                    `
                },
                {
                    id: 2,
                    title: '✊ The Katipunan Revolution',
                    icon: '✊',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Andres Bonifacio and the KKK</h3>
                        <p class="mb-3"><strong>Andres Bonifacio</strong> founded the <strong>Katipunan</strong> (KKK) in 1892, a secret society that aimed to gain independence through armed revolution.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Revolutionary Events:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li><strong>Cry of Pugad Lawin</strong> (August 23, 1896) - Start of revolution</li>
                            <li>Bonifacio declared "Supremo" of the Katipunan</li>
                            <li>Battles against Spanish forces across Luzon</li>
                        </ul>
                    `
                },
                {
                    id: 3,
                    title: '🇵🇭 Philippine Independence',
                    icon: '🇵🇭',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Emilio Aguinaldo's Leadership</h3>
                        <p class="mb-3"><strong>Emilio Aguinaldo</strong> became the first President of the Philippines and declared independence on June 12, 1898.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Major Events:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Battle of Imus - First major victory</li>
                            <li>Declaration of Independence - June 12, 1898</li>
                            <li>Malolos Constitution - First democratic constitution in Asia</li>
                        </ul>
                    `
                },
                {
                    id: 4,
                    title: '⚖️ The Brains of the Revolution',
                    icon: '⚖️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Apolinario Mabini</h3>
                        <p class="mb-3"><strong>Apolinario Mabini</strong>, known as the "Brains of the Revolution," was the chief adviser to Aguinaldo despite being paralyzed.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">His Contributions:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Wrote the Malolos Constitution</li>
                            <li>Served as first Prime Minister</li>
                            <li>Advocated for true independence, not just change of colonizers</li>
                        </ul>
                    `
                },
                {
                    id: 5,
                    title: '🌅 End of Spanish Rule',
                    icon: '🌅',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Treaty of Paris (1898)</h3>
                        <p class="mb-3">Spain ceded the Philippines to the United States for $20 million, ending 333 years of Spanish colonial rule.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Legacy:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Filipino nationalism awakened</li>
                            <li>Heroes' sacrifices inspired future generations</li>
                            <li>Beginning of American colonial period</li>
                        </ul>
                    `
                }
            ]
        },
        tl: {
            title: 'Huling Panahon ng Espanyol (1896-1898)',
            subtitle: 'Ang Rebolusyong Pilipino',
            lessons: [
                {
                    id: 1,
                    title: '📖 Jose Rizal: Ang Repormista',
                    icon: '📖',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Dr. Jose Rizal - Pambansang Bayani</h3>
                        <p class="mb-3">Si <strong>Jose Rizal</strong> (1861-1896) ay isang nasyonalista, manunulat, at polymath na nagsulong ng mga reporma sa mapayapang paraan.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Mga Kontribusyon:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Sumulat ng <strong>"Noli Me Tangere"</strong> (1887) na naglalantad sa mga pang-aabuso ng Espanyol</li>
                            <li>Sumulat ng <strong>"El Filibusterismo"</strong> (1891) na nagpapakita ng landas ng rebolusyon</li>
                            <li>Nagtayo ng La Liga Filipina para sa mapayapang reporma</li>
                            <li>Binaril noong Disyembre 30, 1896, naging martir</li>
                        </ul>
                    `
                },
                {
                    id: 2,
                    title: '✊ Ang Rebolusyong Katipunan',
                    icon: '✊',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Andres Bonifacio at ang KKK</h3>
                        <p class="mb-3">Itinatag ni <strong>Andres Bonifacio</strong> ang <strong>Katipunan</strong> (KKK) noong 1892, isang lihim na samahan na naglalayong makamit ang kalayaan sa pamamagitan ng armadong rebolusyon.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Mga Pangyayari sa Rebolusyon:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li><strong>Sigaw sa Pugad Lawin</strong> (Agosto 23, 1896) - Simula ng rebolusyon</li>
                            <li>Ipinahayag na "Supremo" ng Katipunan si Bonifacio</li>
                            <li>Mga labanan laban sa mga pwersang Espanyol sa buong Luzon</li>
                        </ul>
                    `
                },
                {
                    id: 3,
                    title: '🇵🇭 Kalayaan ng Pilipinas',
                    icon: '🇵🇭',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Pamumuno ni Emilio Aguinaldo</h3>
                        <p class="mb-3">Naging unang Pangulo ng Pilipinas si <strong>Emilio Aguinaldo</strong> at ipinahayag ang kalayaan noong Hunyo 12, 1898.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Mahahalagang Pangyayari:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Labanan sa Imus - Unang malaking tagumpay</li>
                            <li>Deklarasyon ng Kalayaan - Hunyo 12, 1898</li>
                            <li>Konstitusyon ng Malolos - Unang demokratikong konstitusyon sa Asya</li>
                        </ul>
                    `
                },
                {
                    id: 4,
                    title: '⚖️ Ang Utak ng Rebolusyon',
                    icon: '⚖️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Apolinario Mabini</h3>
                        <p class="mb-3">Si <strong>Apolinario Mabini</strong>, kilala bilang "Utak ng Rebolusyon," ay pangunahing tagapayo ni Aguinaldo kahit na paralitiko.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Kanyang Kontribusyon:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Sumulat ng Konstitusyon ng Malolos</li>
                            <li>Naging unang Punong Ministro</li>
                            <li>Nagsulong ng tunay na kalayaan, hindi lamang pagpalit ng mananakop</li>
                        </ul>
                    `
                },
                {
                    id: 5,
                    title: '🌅 Wakas ng Pamamahala ng Espanyol',
                    icon: '🌅',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Kasunduan sa Paris (1898)</h3>
                        <p class="mb-3">Ibinigay ng Espanya ang Pilipinas sa Estados Unidos kapalit ng $20 milyon, na nagwakas sa 333 taong kolonyal na pamamahala ng Espanyol.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Pamana:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Gumising ang nasyonalismong Pilipino</li>
                            <li>Ang sakripisyo ng mga bayani ay nag-inspire sa susunod na henerasyon</li>
                            <li>Simula ng panahong kolonyal ng Amerika</li>
                        </ul>
                    `
                }
            ]
        }
    },
    'american-colonial': {
        en: {
            title: 'American Colonial Era (1899-1946)',
            subtitle: 'Philippine-American War and Colonial Period',
            lessons: [
                {
                    id: 1,
                    title: '🦅 American Arrival',
                    icon: '🦅',
                    content: `
                        <h3 class="text-xl font-bold mb-3">From Spanish to American Rule</h3>
                        <p class="mb-3">After defeating Spain in the Spanish-American War (1898), the United States took control of the Philippines through the Treaty of Paris.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Key Events:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Battle of Manila Bay (May 1, 1898) - Dewey defeats Spanish fleet</li>
                            <li>Treaty of Paris - Philippines sold to US for $20 million</li>
                            <li>Filipinos felt betrayed - fought for independence, not new colonizers</li>
                        </ul>
                    `
                },
                {
                    id: 2,
                    title: '⚔️ Philippine-American War',
                    icon: '⚔️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">The War for Independence (1899-1902)</h3>
                        <p class="mb-3">Filipinos under Aguinaldo fought against American occupation in a brutal three-year war.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Major Battles:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Battle of Manila (February 1899) - War begins</li>
                            <li>General Antonio Luna's campaigns</li>
                            <li>Guerrilla warfare tactics</li>
                            <li>Aguinaldo's capture (1901) ends organized resistance</li>
                        </ul>
                    `
                },
                {
                    id: 3,
                    title: '🏫 American Colonial Policy',
                    icon: '🏫',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Benevolent Assimilation</h3>
                        <p class="mb-3">America implemented "benevolent assimilation" - claiming to prepare Filipinos for self-governance.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Changes Implemented:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Public education system in English</li>
                            <li>Democratic institutions established</li>
                            <li>Infrastructure development</li>
                            <li>American culture and values promoted</li>
                        </ul>
                    `
                },
                {
                    id: 4,
                    title: '📜 Steps to Independence',
                    icon: '📜',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Path to Self-Government</h3>
                        <p class="mb-3">The US gradually granted more autonomy to the Philippines through various acts.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Legislative Milestones:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li><strong>1935:</strong> Commonwealth established under Manuel L. Quezon</li>
                            <li><strong>Tydings-McDuffie Act:</strong> Promised independence in 10 years</li>
                            <li>Filipino leaders prepared for self-governance</li>
                        </ul>
                    `
                },
                {
                    id: 5,
                    title: '🌟 Legacy of American Period',
                    icon: '🌟',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Impact on Philippine Society</h3>
                        <p class="mb-3">American colonization left lasting effects on Philippine culture, education, and government.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Lasting Influences:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>English as second official language</li>
                            <li>American-style education system</li>
                            <li>Democratic government structure</li>
                            <li>Strong US-Philippine relations continue today</li>
                        </ul>
                    `
                }
            ]
        },
        tl: {
            title: 'Panahon ng Kolonyal na Amerika (1899-1946)',
            subtitle: 'Digmaang Pilipino-Amerikano at Panahong Kolonyal',
            lessons: [
                {
                    id: 1,
                    title: '🦅 Pagdating ng Amerika',
                    icon: '🦅',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Mula sa Espanyol tungo sa Pamamahala ng Amerika</h3>
                        <p class="mb-3">Pagkatapos talunin ang Espanya sa Digmaang Espanyol-Amerikano (1898), kinontrol ng Estados Unidos ang Pilipinas sa pamamagitan ng Kasunduan sa Paris.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Mahahalagang Pangyayari:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Labanan sa Look ng Maynila (Mayo 1, 1898) - Tinalo ni Dewey ang hukbong-dagat ng Espanya</li>
                            <li>Kasunduan sa Paris - Ibinenta ang Pilipinas sa US sa halagang $20 milyon</li>
                            <li>Nakaramdam ng pagkakatraydor ang mga Pilipino - nakipaglaban para sa kalayaan, hindi para sa bagong mananakop</li>
                        </ul>
                    `
                },
                {
                    id: 2,
                    title: '⚔️ Digmaang Pilipino-Amerikano',
                    icon: '⚔️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Digmaan para sa Kalayaan (1899-1902)</h3>
                        <p class="mb-3">Ang mga Pilipino sa pamumuno ni Aguinaldo ay nakipaglaban sa okupasyon ng Amerika sa isang malupit na tatlong taong digmaan.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Pangunahing Labanan:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Labanan sa Maynila (Pebrero 1899) - Nagsimula ang digmaan</li>
                            <li>Mga kampanya ni Heneral Antonio Luna</li>
                            <li>Taktika ng gerilya</li>
                            <li>Pagkakahuli kay Aguinaldo (1901) ay nagwakas sa organisadong paglaban</li>
                        </ul>
                    `
                },
                {
                    id: 3,
                    title: '🏫 Patakaran ng Kolonyal na Amerika',
                    icon: '🏫',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Benevolent Assimilation</h3>
                        <p class="mb-3">Ipinatupad ng Amerika ang "benevolent assimilation" - nag-aangkin na inihahanda ang mga Pilipino para sa sariling pamamahala.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Mga Pagbabagong Ipinatupad:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Sistema ng pampublikong edukasyon sa Ingles</li>
                            <li>Mga institusyong demokratiko</li>
                            <li>Pagpapaunlad ng imprastraktura</li>
                            <li>Isinulong ang kultura at mga halaga ng Amerika</li>
                        </ul>
                    `
                },
                {
                    id: 4,
                    title: '📜 Hakbang tungo sa Kalayaan',
                    icon: '📜',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Landas tungo sa Sariling Pamahalaan</h3>
                        <p class="mb-3">Unti-unting binigyan ng mas malaking awtonomiya ng US ang Pilipinas sa pamamagitan ng iba't ibang batas.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Mga Mahalagang Batas:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li><strong>1935:</strong> Itinatag ang Commonwealth sa ilalim ni Manuel L. Quezon</li>
                            <li><strong>Batas na Tydings-McDuffie:</strong> Nangako ng kalayaan sa loob ng 10 taon</li>
                            <li>Naghanda ang mga pinunong Pilipino para sa sariling pamamahala</li>
                        </ul>
                    `
                },
                {
                    id: 5,
                    title: '🌟 Pamana ng Panahong Amerikano',
                    icon: '🌟',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Epekto sa Lipunang Pilipino</h3>
                        <p class="mb-3">Ang pananakop ng Amerika ay nag-iwan ng pangmatagalang epekto sa kultura, edukasyon, at pamahalaan ng Pilipinas.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Pangmatagalang Impluwensya:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Ingles bilang ikalawang opisyal na wika</li>
                            <li>Sistema ng edukasyon na estilo ng Amerika</li>
                            <li>Istruktura ng demokratikong pamahalaan</li>
                            <li>Malakas na relasyon ng US-Pilipinas hanggang ngayon</li>
                        </ul>
                    `
                }
            ]
        }
    },
    'ww2': {
        en: {
            title: 'World War 2 Era (1941-1945)',
            subtitle: 'Japanese Occupation and Liberation',
            lessons: [
                {
                    id: 1,
                    title: '💣 Japanese Invasion',
                    icon: '💣',
                    content: `
                        <h3 class="text-xl font-bold mb-3">December 8, 1941</h3>
                        <p class="mb-3">Hours after attacking Pearl Harbor, Japan invaded the Philippines, beginning a brutal three-year occupation.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Initial Invasion:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Air raids on Clark Air Base and Manila</li>
                            <li>Japanese forces land in multiple locations</li>
                            <li>Filipino and American forces retreat to Bataan</li>
                        </ul>
                    `
                },
                {
                    id: 2,
                    title: '🏴 Bataan Death March',
                    icon: '🏴',
                    content: `
                        <h3 class="text-xl font-bold mb-3">The Infamous March (April 1942)</h3>
                        <p class="mb-3">After the fall of Bataan, 75,000 Filipino and American prisoners were forced to march 65 miles in brutal conditions.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">The Horror:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Extreme heat, no food or water</li>
                            <li>Thousands died from exhaustion and brutality</li>
                            <li>Became symbol of Japanese war crimes</li>
                        </ul>
                    `
                },
                {
                    id: 3,
                    title: '🗡️ Filipino Resistance',
                    icon: '🗡️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Guerrilla Warfare</h3>
                        <p class="mb-3">Filipino guerrilla fighters conducted resistance operations throughout the occupation.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Resistance Activities:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Sabotage of Japanese facilities</li>
                            <li>Intelligence gathering for Allies</li>
                            <li>Protection of Filipino civilians</li>
                            <li>Preparation for Allied return</li>
                        </ul>
                    `
                },
                {
                    id: 4,
                    title: '🇺🇸 MacArthur Returns',
                    icon: '🇺🇸',
                    content: `
                        <h3 class="text-xl font-bold mb-3">"I Shall Return" - October 1944</h3>
                        <p class="mb-3">General Douglas MacArthur fulfilled his promise, landing at Leyte to liberate the Philippines.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Liberation Campaign:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Battle of Leyte Gulf - largest naval battle in history</li>
                            <li>Liberation of Manila (February 1945)</li>
                            <li>Japanese resistance ends (August 1945)</li>
                        </ul>
                    `
                },
                {
                    id: 5,
                    title: '🕊️ Path to Independence',
                    icon: '🕊️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">July 4, 1946</h3>
                        <p class="mb-3">After the war, the United States granted the Philippines full independence as promised.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Post-War Period:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Massive reconstruction needed</li>
                            <li>Manuel Roxas became first president of independent Philippines</li>
                            <li>Strong ties with US maintained</li>
                            <li>Beginning of modern Philippine republic</li>
                        </ul>
                    `
                }
            ]
        },
        tl: {
            title: 'Panahon ng Ikalawang Digmaang Pandaigdig (1941-1945)',
            subtitle: 'Okupasyon ng Hapon at Paglaya',
            lessons: [
                {
                    id: 1,
                    title: '💣 Pagsalakay ng Hapon',
                    icon: '💣',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Disyembre 8, 1941</h3>
                        <p class="mb-3">Ilang oras pagkatapos atakihin ang Pearl Harbor, sinakop ng Hapon ang Pilipinas, nagsimula ng malupit na tatlong taong okupasyon.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Unang Pagsalakay:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Pananalasa sa hangin sa Clark Air Base at Maynila</li>
                            <li>Puwersa ng Hapon ay umatake sa maraming lugar</li>
                            <li>Puwersa ng Pilipino at Amerikano ay umatras sa Bataan</li>
                        </ul>
                    `
                },
                {
                    id: 2,
                    title: '🏴 Martsa ng Kamatayan sa Bataan',
                    icon: '🏴',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Ang Bantog na Martsa (Abril 1942)</h3>
                        <p class="mb-3">Pagkatapos mahulog ng Bataan, 75,000 mga bilanggong Pilipino at Amerikano ay pinilit na maglakad ng 65 milya sa malupit na kondisyon.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Ang Kakila-kilabot:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Matinding init, walang pagkain o tubig</li>
                            <li>Libu-libong namatay dahil sa pagod at karahasan</li>
                            <li>Naging simbolo ng mga krimen sa digmaan ng Hapon</li>
                        </ul>
                    `
                },
                {
                    id: 3,
                    title: '🗡️ Paglaban ng mga Pilipino',
                    icon: '🗡️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Digmaang Gerilya</h3>
                        <p class="mb-3">Ang mga gerilyang Pilipino ay nagsagawa ng mga operasyon ng paglaban sa buong okupasyon.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Mga Aktibidad ng Paglaban:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Sabotahe ng mga pasilidad ng Hapon</li>
                            <li>Pagtitipon ng impormasyon para sa mga Alyado</li>
                            <li>Proteksyon ng mga sibilyang Pilipino</li>
                            <li>Paghahanda para sa pagbabalik ng mga Alyado</li>
                        </ul>
                    `
                },
                {
                    id: 4,
                    title: '🇺🇸 Pagbabalik ni MacArthur',
                    icon: '🇺🇸',
                    content: `
                        <h3 class="text-xl font-bold mb-3">"I Shall Return" - Oktubre 1944</h3>
                        <p class="mb-3">Tinupad ni Heneral Douglas MacArthur ang kanyang pangako, umatake sa Leyte upang palayain ang Pilipinas.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Kampanya ng Paglaya:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Labanan sa Golpo ng Leyte - pinakamalaking labanan sa dagat sa kasaysayan</li>
                            <li>Paglaya ng Maynila (Pebrero 1945)</li>
                            <li>Pagtatapos ng paglaban ng Hapon (Agosto 1945)</li>
                        </ul>
                    `
                },
                {
                    id: 5,
                    title: '🕊️ Landas tungo sa Kalayaan',
                    icon: '🕊️',
                    content: `
                        <h3 class="text-xl font-bold mb-3">Hulyo 4, 1946</h3>
                        <p class="mb-3">Pagkatapos ng digmaan, binigyan ng Estados Unidos ang Pilipinas ng ganap na kalayaan gaya ng ipinangako.</p>
                        
                        <h4 class="font-bold mt-4 mb-2">Panahon Pagkatapos ng Digmaan:</h4>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Kailangan ng malaking rekonstruksyon</li>
                            <li>Si Manuel Roxas ang naging unang pangulo ng malayang Pilipinas</li>
                            <li>Nananatiling malakas ang ugnayan sa US</li>
                            <li>Simula ng modernong republika ng Pilipinas</li>
                        </ul>
                    `
                }
            ]
        }
    }
};
