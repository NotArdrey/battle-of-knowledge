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
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Life Before the Spanish</h3>
                            <p class="mb-3">Before 1521, the Philippines was made up of independent communities called <strong>barangays</strong>, each led by a <strong>datu</strong> or chieftain. Filipinos had developed their own writing system called <strong>Baybayin</strong> and maintained active trade relationships with China, Japan, and other Asian countries.</p>
                            
                            <p class="mb-3">Society was organized into distinct classes including nobles (maharlika), freemen, and slaves. Traditional religious practices centered around animism, while some communities in the south had already embraced Islamic influences brought by traders from neighboring regions.</p>
                            
                            <div class="bg-blue-100 border-l-4 border-blue-500 p-4 mt-4">
                                <p class="font-semibold">💡 Did you know?</p>
                                <p>Ancient Filipinos were skilled navigators and boat builders, trading across Southeast Asia! Their advanced maritime technology allowed them to establish trade networks throughout the region long before European contact.</p>
                            </div>
                        </div>
                    `
                },
                {
                    id: 2,
                    title: '⛵ Magellan\'s Arrival (1521)',
                    icon: '⛵',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Ferdinand Magellan Arrives</h3>
                            <p class="mb-3">On <strong>March 16, 1521</strong>, Portuguese explorer Ferdinand Magellan, sailing under the Spanish flag, arrived in the Philippines while seeking a westward route to the valuable Spice Islands. His expedition represented Spain's first attempt to establish a presence in the archipelago.</p>
                            
                            <p class="mb-3">The journey unfolded through several key events: Magellan first landed in Homonhon Island on March 16, then proceeded to Cebu by March 28. On April 14, 1521, Raja Humabon and approximately 800 of his followers converted to Christianity in what would become the first Catholic mass in the Philippines. This religious conversion set the stage for the historic Battle of Mactan that followed on April 27.</p>
                            
                            <div class="bg-amber-100 border-l-4 border-amber-500 p-4 mt-4">
                                <p class="font-semibold">⚠️ Important Context:</p>
                                <p>Magellan immediately claimed the islands for Spain and began efforts to convert native populations to Christianity. This aggressive approach created tensions with local leaders who valued their independence and traditional ways of life, leading to inevitable conflicts over sovereignty and cultural autonomy.</p>
                            </div>
                        </div>
                    `
                },
                {
                    id: 3,
                    title: '⚔️ Lapu-Lapu: The First Hero',
                    icon: '⚔️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Lapu-Lapu: Defender of Mactan</h3>
                            <p class="mb-3"><strong>Lapu-Lapu</strong> stands as a towering figure in Philippine history as the datu (chieftain) of Mactan Island in Cebu. He is celebrated as the first Filipino hero who demonstrated courageous resistance against foreign colonization, refusing to submit to Magellan's demands for submission to Spanish authority.</p>
                            
                            <p class="mb-3">His significance extends beyond military victory. Lapu-Lapu defended Filipino sovereignty and independence at a crucial moment, proving that Western powers could be challenged. He achieved this by defeating one of history's most celebrated explorers, Ferdinand Magellan, whose previous accomplishments included leading the first circumnavigation of the globe.</p>
                            
                            <p class="mb-3">Lapu-Lapu is traditionally depicted wielding a <strong>kampilan</strong>, a distinctive Filipino sword known for its effectiveness in close combat. This weapon symbolizes both his martial prowess and his commitment to defending his people's way of life against foreign imposition.</p>
                            
                            <div class="bg-green-100 border-l-4 border-green-500 p-4 mt-4">
                                <p class="font-semibold">🏆 Lasting Legacy:</p>
                                <p>Lapu-Lapu is honored as the first Filipino to successfully resist European colonization, setting a powerful precedent for future generations. His statue stands proudly in Mactan, Cebu, serving as an enduring symbol of Filipino courage, independence, and national pride that continues to inspire Filipinos today.</p>
                            </div>
                        </div>
                    `
                },
                {
                    id: 4,
                    title: '🗡️ The Battle of Mactan',
                    icon: '🗡️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">The Battle of Mactan (April 27, 1521)</h3>
                            <p class="mb-3">The <strong>Battle of Mactan</strong> represents a pivotal moment in Philippine history, where Filipino warriors led by Lapu-Lapu decisively defeated Spanish forces commanded by Ferdinand Magellan. This confrontation erupted when Magellan demanded that Lapu-Lapu submit to Spanish authority, a demand that the proud chieftain refused, choosing instead to defend his island and people's independence.</p>
                            
                            <p class="mb-3">The battle unfolded with Magellan leading only 49 Spanish soldiers against approximately 1,500 Filipino warriors. Despite being heavily outnumbered and facing unfamiliar terrain, the Spanish initially relied on their technological advantages, including firearms and metal armor. However, Lapu-Lapu's forces skillfully exploited their knowledge of the local environment, particularly the shallow waters that hindered Spanish mobility and naval support.</p>
                            
                            <p class="mb-3">Several factors contributed to the Filipino victory. The home advantage proved crucial as local warriors knew every detail of the terrain and tidal patterns. Their superior numbers allowed for envelopment tactics that neutralized Spanish firepower. Most importantly, Lapu-Lapu's forces fought with extraordinary determination, defending their homeland and traditional way of life against foreign domination.</p>
                            
                            <div class="bg-red-100 border-l-4 border-red-500 p-4 mt-4">
                                <p class="font-semibold">⚡ Historical Significance:</p>
                                <p>This decisive victory demonstrated that Western colonial powers could be successfully resisted, even with their technological advantages. The death of Magellan marked a temporary setback for Spanish expansion in the region. However, Spain would return in 1565 under Miguel López de Legazpi to establish permanent colonial rule, beginning 333 years of Spanish administration in the Philippines.</p>
                            </div>
                        </div>
                    `
                },
                {
                    id: 5,
                    title: '🏛️ After the Battle',
                    icon: '🏛️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">The Aftermath and Spanish Return</h3>
                            <p class="mb-3">Although Lapu-Lapu's victory at Mactan demonstrated Filipino resistance capability, it only delayed rather than prevented Spanish colonization. Following the battle, Magellan's remaining crew hastily departed the Philippines, but Spain maintained its interest in the strategically located archipelago. In 1543, explorer Ruy López de Villalobos formally named the islands "Las Islas Filipinas" in honor of King Philip II of Spain, establishing the geographical identity that would endure for centuries.</p>
                            
                            <p class="mb-3">The decisive turning point came in 1565 when Miguel López de Legazpi led a successful expedition that established permanent Spanish settlement. By 1571, Manila had been founded as the colonial capital, beginning 333 years of Spanish rule that would fundamentally reshape Philippine society. This colonial period introduced Christianity, particularly Roman Catholicism, which became deeply embedded in Filipino culture and identity.</p>
                            
                            <p class="mb-3">Spanish colonization brought profound changes including the replacement of the indigenous Baybayin script with the Latin alphabet, establishment of formal educational institutions and universities, creation of a centralized governmental system, and unfortunately, systematic exploitation of Filipino labor and natural resources. The encomienda system in particular created conditions of forced labor and tribute collection that heavily burdened the native population.</p>
                            
                            <div class="bg-purple-100 border-l-4 border-purple-500 p-4 mt-4">
                                <p class="font-semibold">📚 Historical Perspective:</p>
                                <p>While the Battle of Mactan represented an important victory for Filipino sovereignty, it marked only the beginning of a long struggle for independence that would span centuries. The complete independence of the Philippines would not be achieved until 1898 from Spain and 1946 from the United States, making the journey from Lapu-Lapu's resistance to full nationhood a story of persistent struggle and gradual self-determination.</p>
                            </div>
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
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Buhay Bago Dumating ang Espanyol</h3>
                            <p class="mb-3">Bago ang 1521, ang Pilipinas ay binubuo ng mga malayang pamayanan na tinatawag na <strong>barangay</strong>, na bawat isa ay pinamumunuan ng isang <strong>datu</strong> o pinuno. Ang mga Pilipino ay may sariling sistema ng pagsulat na tinatawag na <strong>Baybayin</strong> at aktibong nakikipagkalakalan sa Tsina, Japan, at iba pang bansa sa Asya.</p>
                            
                            <p class="mb-3">Ang lipunan ay nahahati sa mga magkakaibang uri kabilang ang mga maharlika (noble), malalayang tao, at alipin. Ang mga tradisyonal na paniniwala ay nakasentro sa animismo, habang ang ilang pamayanan sa timog ay naimpluwensyahan na ng Islam na dala ng mga mangangalakal mula sa kalapit na rehiyon.</p>
                            
                            <div class="bg-blue-100 border-l-4 border-blue-500 p-4 mt-4">
                                <p class="font-semibold">💡 Alam mo ba?</p>
                                <p>Ang mga sinaunang Pilipino ay bihasang mandaragat at tagagawa ng bangka, nakikipagkalakalan sa buong Timog-Silangang Asya! Ang kanilang advanced na teknolohiya sa paglalayag ay nagbigay-daan sa pagtatatag ng mga network ng kalakalan sa rehiyon bago pa man dumating ang mga Europeo.</p>
                            </div>
                        </div>
                    `
                },
                {
                    id: 2,
                    title: '⛵ Pagdating ni Magellan (1521)',
                    icon: '⛵',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Dumating si Ferdinand Magellan</h3>
                            <p class="mb-3">Noong <strong>Marso 16, 1521</strong>, ang Portuges na manggagalugad na si Ferdinand Magellan, na naglalayag sa ilalim ng bandila ng Espanya, ay dumating sa Pilipinas habang naghahanap ng kanlurang ruta patungo sa mahahalagang Spice Islands. Ang kanyang ekspedisyon ay kumakatawan sa unang pagtatangka ng Espanya na magtatag ng presensya sa kapuluan.</p>
                            
                            <p class="mb-3">Ang paglalakbay ay nagpatuloy sa pamamagitan ng ilang mahahalagang pangyayari: Unang dumating si Magellan sa Isla ng Homonhon noong Marso 16, pagkatapos ay nagtungo sa Cebu noong Marso 28. Noong Abril 14, 1521, si Raja Humabon at humigit-kumulang 800 ng kanyang mga tagasunod ay naging Kristiyano sa unang misa Katoliko sa Pilipinas. Ang pagbabagong ito ng relihiyon ang naghanda sa makasaysayang Labanan sa Mactan na sumunod noong Abril 27.</p>
                            
                            <div class="bg-amber-100 border-l-4 border-amber-500 p-4 mt-4">
                                <p class="font-semibold">⚠️ Mahalagang Konteksto:</p>
                                <p>Agad na inangkin ni Magellan ang mga isla para sa Espanya at nagsimulang i-convert ang mga katutubo sa Kristiyanismo. Ang agresibong paraang ito ay lumikha ng mga pag-igting sa mga lokal na pinuno na pinahahalagahan ang kanilang kalayaan at tradisyonal na pamumuhay, na humantong sa hindi maiiwasang mga salungatan tungkol sa soberanya at kultural na awtonomiya.</p>
                            </div>
                        </div>
                    `
                },
                {
                    id: 3,
                    title: '⚔️ Lapu-Lapu: Ang Unang Bayani',
                    icon: '⚔️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Lapu-Lapu: Tagapagtanggol ng Mactan</h3>
                            <p class="mb-3">Si <strong>Lapu-Lapu</strong> ay isang pangunahing pigura sa kasaysayan ng Pilipinas bilang datu (pinuno) ng Isla ng Mactan sa Cebu. Siya ay ipinagdiriwang bilang unang bayaning Pilipino na nagpakita ng matapang na paglaban sa dayuhang pananakop, na tumangging sumuko sa mga kahilingan ni Magellan para magpasailalim sa awtoridad ng Espanya.</p>
                            
                            <p class="mb-3">Ang kanyang kahalagahan ay lampas sa panalong militar. Ipinagtanggol ni Lapu-Lapu ang soberanya at kalayaan ng Pilipino sa isang mahalagang sandali, na nagpapatunay na ang mga Kanluraning kapangyarihan ay maaaring hamunin. Nakamit niya ito sa pamamagitan ng pagtalo sa isa sa pinakasikat na manggagalugad sa kasaysayan, si Ferdinand Magellan, na ang mga naunang nagawa ay kinabibilangan ng pagiging unang nakapaglibot sa mundo.</p>
                            
                            <p class="mb-3">Si Lapu-Lapu ay tradisyonal na inilalarawan na may hawak na <strong>kampilan</strong>, isang natatanging espada ng Pilipino na kilala sa bisa nito sa malapit na labanan. Ang sandatang ito ay sumisimbolo sa kanyang kasanayan sa pakikidigma at kanyang pangako na ipagtanggol ang pamumuhay ng kanyang mga tao laban sa dayuhang pagpataw.</p>
                            
                            <div class="bg-green-100 border-l-4 border-green-500 p-4 mt-4">
                                <p class="font-semibold">🏆 Pangmatagalang Pamana:</p>
                                <p>Si Lapu-Lapu ay iginagalang bilang unang Pilipinong matagumpay na lumaban sa pananakop ng Europeo, na nagtakda ng isang makapangyarihang precedent para sa susunod na mga henerasyon. Ang kanyang estatwa ay nakatayo nang may karangalan sa Mactan, Cebu, na nagsisilbing pangmatagalang simbolo ng katapangan, kalayaan, at pambansang pagmamataas ng Pilipino na patuloy na nagbibigay-inspirasyon sa mga Pilipino hanggang ngayon.</p>
                            </div>
                        </div>
                    `
                },
                {
                    id: 4,
                    title: '🗡️ Ang Labanan sa Mactan',
                    icon: '🗡️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Ang Labanan sa Mactan (Abril 27, 1521)</h3>
                            <p class="mb-3">Ang <strong>Labanan sa Mactan</strong> ay kumakatawan sa isang mahalagang sandali sa kasaysayan ng Pilipinas, kung saan ang mga mandirigmang Pilipino sa pamumuno ni Lapu-Lapu ay tinalo ang mga puwersang Espanyol sa pamumuno ni Ferdinand Magellan. Ang labanang ito ay sumiklab nang hingin ni Magellan na sumuko si Lapu-Lapu sa awtoridad ng Espanya, isang kahilingan na tinanggihan ng mapagmataas na pinuno, at pinili na ipagtanggol ang kanyang isla at kalayaan ng kanyang mga tao.</p>
                            
                            <p class="mb-3">Ang labanan ay nagpatuloy na pinamumunuan lamang ni Magellan ang 49 sundalong Espanyol laban sa humigit-kumulang 1,500 mandirigmang Pilipino. Sa kabila ng pagiging labis na naiiba sa bilang at pagharap sa pamilyar na lupain, ang mga Espanyol ay una nang umasa sa kanilang mga teknolohikal na kalamangan, kabilang ang mga armas at metal na baluti. Gayunpaman, ang mga puwersa ni Lapu-Lapu ay mahusay na sinamantala ang kanilang kaalaman sa lokal na kapaligiran, lalo na ang mababaw na tubig na humadlang sa paggalaw at suporta sa dagat ng mga Espanyol.</p>
                            
                            <p class="mb-3">Ilang mga kadahilanan ang nag-ambag sa tagumpay ng mga Pilipino. Ang bentahe sa tahanan ay naging mahalaga dahil alam ng mga lokal na mandirigma ang bawat detalye ng lupain at mga pattern ng alon. Ang kanilang superior na numero ay nagpapahintulot ng mga taktika ng pagpapalibot na neutralisado ang apoy ng mga Espanyol. Higit sa lahat, ang mga puwersa ni Lapu-Lapu ay lumaban nang may pambihirang determinasyon, na ipinagtatanggol ang kanilang lupain at tradisyonal na paraan ng pamumuhay laban sa dayuhang dominasyon.</p>
                            
                            <div class="bg-red-100 border-l-4 border-red-500 p-4 mt-4">
                                <p class="font-semibold">⚡ Makasaysayang Kahalagahan:</p>
                                <p>Ang mapagpasyang tagumpay na ito ay nagpakita na ang mga Kanluraning kolonyal na kapangyarihan ay maaaring matagumpay na labanan, kahit na may kanilang mga teknolohikal na kalamangan. Ang pagkamatay ni Magellan ay nagmarka ng pansamantalang pagkaantala para sa pagpapalawak ng Espanya sa rehiyon. Gayunpaman, babalik ang Espanya noong 1565 sa ilalim ni Miguel López de Legazpi upang magtatag ng permanenteng kolonyal na pamamahala, na nagsisimula ng 333 taon ng pamamahala ng Espanya sa Pilipinas.</p>
                            </div>
                        </div>
                    `
                },
                {
                    id: 5,
                    title: '🏛️ Pagkatapos ng Labanan',
                    icon: '🏛️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Ang Sumunod at Pagbabalik ng mga Espanyol</h3>
                            <p class="mb-3">Bagaman ang tagumpay ni Lapu-Lapu sa Mactan ay nagpakita ng kakayahan ng paglaban ng mga Pilipino, ito ay nagpahaba lamang sa halip na pigilan ang kolonisasyon ng Espanya. Kasunod ng labanan, ang natitirang tripulante ni Magellan ay mabilis na umalis sa Pilipinas, ngunit pinananatili ng Espanya ang interes nito sa estratihikong kapuluan. Noong 1543, ang manggagalugad na si Ruy López de Villalobos ay pormal na pinangalanan ang mga isla bilang "Las Islas Filipinas" bilang parangal kay Haring Philip II ng Espanya, na itinatag ang pagkakakilanlang heograpiko na mananatili sa maraming siglo.</p>
                            
                            <p class="mb-3">Ang mapagpasyang punto ng pagbabago ay naganap noong 1565 nang pangunahan ni Miguel López de Legazpi ang isang matagumpay na ekspedisyon na nagtatag ng permanenteng paninirahan ng Espanya. Noong 1571, itinatag ang Maynila bilang kabisera ng kolonya, na nagsisimula ng 333 taon ng pamamahala ng Espanya na magbabago nang pangunahin sa lipunang Pilipino. Ang panahong kolonyal na ito ay nagpakilala ng Kristiyanismo, partikular na Katolisismo Romano, na naging malalim na naka-embed sa kultura at pagkakakilanlan ng Pilipino.</p>
                            
                            <p class="mb-3">Ang kolonisasyon ng Espanya ay nagdala ng malalim na mga pagbabago kabilang ang pagpapalit ng katutubong Baybayin script sa alpabetong Latin, pagtatatag ng pormal na mga institusyong pang-edukasyon at mga unibersidad, paglikha ng isang sentralisadong sistema ng pamahalaan, at sa kasamaang-palad, sistematikong pagsasamantala sa paggawa at likas na yaman ng Pilipino. Ang sistema ng encomienda sa partikular ay lumikha ng mga kondisyon ng sapilitang paggawa at koleksyon ng tributo na mabigat na pabigat sa katutubong populasyon.</p>
                            
                            <div class="bg-purple-100 border-l-4 border-purple-500 p-4 mt-4">
                                <p class="font-semibold">📚 Makasaysayang Pananaw:</p>
                                <p>Habang ang Labanan sa Mactan ay kumakatawan sa isang mahalagang tagumpay para sa soberanya ng Pilipino, ito ay nagmarka lamang ng simula ng isang mahabang pakikibaka para sa kalayaan na tatagal ng mga siglo. Ang kumpletong kalayaan ng Pilipinas ay hindi makakamit hanggang 1898 mula sa Espanya at 1946 mula sa Estados Unidos, na ginagawa ang paglalakbay mula sa paglaban ni Lapu-Lapu tungo sa ganap na pagka-bansa bilang isang kwento ng patuloy na pakikibaka at unti-unting pagpapasya sa sarili.</p>
                            </div>
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
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Dr. Jose Rizal - National Hero</h3>
                            <p class="mb-3"><strong>Jose Rizal</strong> (1861-1896) emerged as a multifaceted Filipino nationalist, prolific writer, and accomplished polymath who advocated for meaningful reforms through peaceful, intellectual means rather than armed confrontation. His exceptional education in Europe, where he earned degrees in medicine and philosophy, provided him with the tools to analyze and critique Spanish colonial policies with unprecedented sophistication.</p>
                            
                            <p class="mb-3">Rizal's literary masterpieces, <strong>"Noli Me Tangere"</strong> (1887) and <strong>"El Filibusterismo"</strong> (1891), served as powerful social critiques that exposed the systematic abuses and corruption of Spanish colonial authorities and the clergy. These novels, written in Spanish to reach both Filipino and Spanish audiences, awakened national consciousness among educated Filipinos and inspired discussions about identity, justice, and self-determination.</p>
                            
                            <p class="mb-3">Beyond his writing, Rizal founded La Liga Filipina in 1892, an organization dedicated to promoting peaceful reforms, education, and economic cooperation among Filipinos. His execution by firing squad on December 30, 1896, transformed him from a reformist intellectual into a national martyr, galvanizing revolutionary sentiments and demonstrating Spain's unwillingness to implement meaningful changes in its colonial administration.</p>
                        </div>
                    `
                },
                {
                    id: 2,
                    title: '✊ The Katipunan Revolution',
                    icon: '✊',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Andres Bonifacio and the KKK</h3>
                            <p class="mb-3"><strong>Andres Bonifacio</strong>, often called the "Father of the Philippine Revolution," founded the <strong>Katipunan</strong> (KKK) in 1892 as a secret revolutionary society committed to achieving Philippine independence through armed struggle. Unlike Rizal's reformist approach, Bonifacio believed that only direct confrontation could liberate Filipinos from Spanish oppression, drawing inspiration from both local grievances and global revolutionary movements.</p>
                            
                            <p class="mb-3">The revolution officially commenced with the historic <strong>Cry of Pugad Lawin</strong> on August 23, 1896, when Katipuneros tore their cedulas (community tax certificates) as a symbolic rejection of Spanish authority. Bonifacio, declared "Supremo" of the Katipunan, organized revolutionary forces across Luzon, establishing a parallel government structure and military organization that challenged Spanish control in both rural and urban areas.</p>
                            
                            <p class="mb-3">Initial military engagements revealed both the determination of Filipino revolutionaries and the challenges they faced against better-equipped Spanish forces. Despite early setbacks, the Katipunan's network continued to expand, demonstrating widespread popular support for independence and establishing the organizational foundation for sustained revolutionary activity throughout the archipelago.</p>
                        </div>
                    `
                },
                {
                    id: 3,
                    title: '🇵🇭 Philippine Independence',
                    icon: '🇵🇭',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Emilio Aguinaldo's Leadership</h3>
                            <p class="mb-3"><strong>Emilio Aguinaldo</strong> rose to prominence through military success and political maneuvering, eventually becoming the first President of the revolutionary government and later the First President of the Philippines. His leadership during critical battles, particularly the victory at Imus, demonstrated strategic capabilities that earned him respect and authority within the revolutionary movement.</p>
                            
                            <p class="mb-3">The culmination of revolutionary efforts occurred on <strong>June 12, 1898</strong>, when Aguinaldo proclaimed Philippine independence from the balcony of his home in Kawit, Cavite. This historic declaration, accompanied by the first public display of the Philippine flag and performance of the national anthem, represented the formal assertion of Filipino sovereignty after more than three centuries of Spanish colonial rule.</p>
                            
                            <p class="mb-3">Subsequent developments included the establishment of the Malolos Congress and the drafting of the Malolos Constitution in 1899, which created Asia's first democratic republic. This constitutional framework established a presidential system with separation of powers, bill of rights, and provisions for popular sovereignty, reflecting the influence of both Western political thought and Filipino revolutionary aspirations.</p>
                        </div>
                    `
                },
                {
                    id: 4,
                    title: '⚖️ The Brains of the Revolution',
                    icon: '⚖️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Apolinario Mabini</h3>
                            <p class="mb-3"><strong>Apolinario Mabini</strong>, revered as the "Brains of the Revolution" and the "Sublime Paralytic," served as Emilio Aguinaldo's most trusted adviser and the intellectual architect of the First Philippine Republic. Despite being paralyzed from the waist down due to polio, Mabini's brilliant legal mind and profound understanding of governance proved invaluable to the revolutionary cause.</p>
                            
                            <p class="mb-3">Mabini's most significant contribution was drafting the Malolos Constitution, which established the legal and political foundations for Asia's first democratic republic. His constitutional vision balanced executive authority with legislative oversight while incorporating protections for individual rights, demonstrating sophisticated political thinking that drew from both Western constitutional traditions and Filipino revolutionary principles.</p>
                            
                            <p class="mb-3">As the first Prime Minister and Secretary of Foreign Affairs, Mabini advocated for genuine independence rather than mere substitution of colonial powers. He consistently warned against American intentions in the Philippines and emphasized the importance of establishing a government truly representative of Filipino interests and aspirations, principles that would guide his political philosophy throughout the revolutionary period and beyond.</p>
                        </div>
                    `
                },
                {
                    id: 5,
                    title: '🌅 End of Spanish Rule',
                    icon: '🌅',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Treaty of Paris (1898)</h3>
                            <p class="mb-3">The Spanish-American War of 1898 dramatically altered the Philippines' political landscape, as Spain's defeat led to the <strong>Treaty of Paris</strong> on December 10, 1898, which ceded the Philippines to the United States for $20 million. This diplomatic agreement marked the formal end of 333 years of Spanish colonial rule, though it simultaneously initiated American colonial administration without consulting the Filipino people or recognizing the newly declared Philippine Republic.</p>
                            
                            <p class="mb-3">The revolutionary period awakened a powerful sense of Filipino nationalism that transcended regional loyalties and created a shared national identity. The sacrifices of revolutionary heroes like Rizal, Bonifacio, and countless others inspired generations of Filipinos to continue the struggle for genuine independence, sovereignty, and self-determination against subsequent colonial powers.</p>
                            
                            <p class="mb-3">Despite the transfer from Spanish to American rule, the Philippine Revolution established important precedents for self-governance, constitutional democracy, and national identity formation. These foundations would prove crucial during the subsequent American colonial period and ultimately contribute to the achievement of full independence in 1946, creating a continuous narrative of resistance and nation-building that defines modern Philippine history.</p>
                        </div>
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
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Dr. Jose Rizal - Pambansang Bayani</h3>
                            <p class="mb-3">Si <strong>Jose Rizal</strong> (1861-1896) ay lumitaw bilang isang maraming talentong nasyonalistang Pilipino, produktibong manunulat, at accomplished polymath na nagsulong ng makabuluhang mga reporma sa pamamagitan ng mapayapa, intelektuwal na pamamaraan sa halip na armadong pakikipagtagpo. Ang kanyang pambihirang edukasyon sa Europa, kung saan siya nakakuha ng mga degree sa medisina at pilosopiya, ay nagbigay sa kanya ng mga kasangkapan upang suriin at punahin ang mga patakaran ng kolonyal ng Espanya na may walang katulad na sopistikasyon.</p>
                            
                            <p class="mb-3">Ang mga obra maestra ni Rizal, ang <strong>"Noli Me Tangere"</strong> (1887) at <strong>"El Filibusterismo"</strong> (1891), ay nagsilbing malakas na mga kritika sa lipunan na naglantad ng sistematikong pang-aabuso at katiwalian ng mga awtoridad ng kolonyal ng Espanya at ng klero. Ang mga nobelang ito, na isinulat sa Espanyol upang maabot ang kapwa Pilipino at Espanyol na madla, ay gumising sa pambansang kamalayan sa mga edukadong Pilipino at nag-inspire ng mga talakayan tungkol sa pagkakakilanlan, katarungan, at pagpapasya sa sarili.</p>
                            
                            <p class="mb-3">Bukod sa kanyang pagsusulat, itinatag ni Rizal ang La Liga Filipina noong 1892, isang samahan na nakatuon sa pagsusulong ng mapayapang mga reporma, edukasyon, at kooperasyong pang-ekonomiya sa mga Pilipino. Ang kanyang pagbaril sa pamamagitan ng firing squad noong Disyembre 30, 1896, ay nagbago sa kanya mula sa isang repormistang intelektwal tungo sa isang pambansang martir, nagpatingkad sa mga damdaming rebolusyonaryo at nagpapakita ng kawalan ng kagustuhan ng Espanya na ipatupad ang makabuluhang mga pagbabago sa kanyang kolonyal na administrasyon.</p>
                        </div>
                    `
                },
                {
                    id: 2,
                    title: '✊ Ang Rebolusyong Katipunan',
                    icon: '✊',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Andres Bonifacio at ang KKK</h3>
                            <p class="mb-3">Si <strong>Andres Bonifacio</strong>, madalas na tinatawag na "Ama ng Rebolusyong Pilipino," ay itinatag ang <strong>Katipunan</strong> (KKK) noong 1892 bilang isang lihim na rebolusyonaryong samahan na nakatuon sa pagkamit ng kalayaan ng Pilipinas sa pamamagitan ng armadong pakikibaka. Hindi tulad ng repormistang pamamaraan ni Rizal, naniniwala si Bonifacio na tanging direktang pakikipagtagpo ang makapagpapalaya sa mga Pilipino mula sa pang-aapi ng Espanya, na kumukuha ng inspirasyon mula sa parehong lokal na mga hinaing at pandaigdigang mga kilusang rebolusyonaryo.</p>
                            
                            <p class="mb-3">Ang rebolusyon ay opisyal na nagsimula sa makasaysayang <strong>Sigaw ng Pugad Lawin</strong> noong Agosto 23, 1896, nang punitin ng mga Katipunero ang kanilang mga sedula (mga sertipiko ng buwis sa pamayanan) bilang simbolikong pagtanggi sa awtoridad ng Espanya. Si Bonifacio, na idineklarang "Supremo" ng Katipunan, ay nag-organisa ng mga rebolusyonaryong puwersa sa buong Luzon, na nagtatag ng isang parallel na istruktura ng pamahalaan at organisasyong militar na humamon sa kontrol ng Espanya sa parehong rural at urban na lugar.</p>
                            
                            <p class="mb-3">Ang mga paunang pakikipag-engkwentro sa militar ay nagbunyag ng parehong determinasyon ng mga rebolusyonaryong Pilipino at ang mga hamon na kanilang kinaharap laban sa mas mahusay na kagamitang mga puwersa ng Espanya. Sa kabila ng mga paunang pagkabigo, ang network ng Katipunan ay patuloy na lumawak, na nagpapakita ng malawak na suporta ng mga tao para sa kalayaan at pagtatatag ng pundasyong organisasyonal para sa patuloy na rebolusyonaryong aktibidad sa buong kapuluan.</p>
                        </div>
                    `
                },
                {
                    id: 3,
                    title: '🇵🇭 Kalayaan ng Pilipinas',
                    icon: '🇵🇭',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Pamumuno ni Emilio Aguinaldo</h3>
                            <p class="mb-3">Si <strong>Emilio Aguinaldo</strong> ay umangat sa katanyagan sa pamamagitan ng tagumpay sa militar at pamamalitang pampulitika, sa kalaunan ay naging unang Pangulo ng rebolusyonaryong pamahalaan at sa kalaunan ang Unang Pangulo ng Pilipinas. Ang kanyang pamumuno sa panahon ng mga kritikal na labanan, partikular na ang tagumpay sa Imus, ay nagpakita ng mga kakayahan sa estratehiya na nagkamit sa kanya ng respeto at awtoridad sa loob ng kilusang rebolusyonaryo.</p>
                            
                            <p class="mb-3">Ang kasukdulan ng mga pagsisikap ng rebolusyon ay naganap noong <strong>Hunyo 12, 1898</strong>, nang iproklama ni Aguinaldo ang kalayaan ng Pilipinas mula sa balkonahe ng kanyang tahanan sa Kawit, Cavite. Ang makasaysayang deklarasyong ito, kasama ang unang pampublikong pagpapakita ng watawat ng Pilipinas at pagganap ng pambansang awit, ay kumakatawan sa pormal na pag-aangkin ng soberanya ng Pilipino pagkatapos ng higit sa tatlong siglo ng pananakop ng Espanya.</p>
                            
                            <p class="mb-3">Ang mga sumunod na pag-unlad ay kinabibilangan ng pagtatatag ng Kongreso ng Malolos at ang pagdraft ng Konstitusyon ng Malolos noong 1899, na lumikha ng unang demokratikong republika ng Asya. Ang balangkas na konstitusyonal na ito ay nagtatag ng isang sistemang pampanguluhan na may paghihiwalay ng mga kapangyarihan, bill of rights, at mga probisyon para sa popular na soberanya, na sumasalamin sa impluwensya ng parehong Kanluraning kaisipang pampulitika at mga aspirasyong rebolusyonaryo ng Pilipino.</p>
                        </div>
                    `
                },
                {
                    id: 4,
                    title: '⚖️ Ang Utak ng Rebolusyon',
                    icon: '⚖️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Apolinario Mabini</h3>
                            <p class="mb-3">Si <strong>Apolinario Mabini</strong>, iginagalang bilang "Utak ng Rebolusyon" at ang "Sublime Paralytic," ay nagsilbing pinaka-tinatanggap na tagapayo ni Emilio Aguinaldo at ang intelektuwal na arkitekto ng Unang Republika ng Pilipinas. Sa kabila ng pagiging paralitiko mula sa baywang pababa dahil sa polio, ang makinang na legal na isip ni Mabini at malalim na pag-unawa sa pamamahala ay napatunayang napakahalaga sa dahilan ng rebolusyon.</p>
                            
                            <p class="mb-3">Ang pinakamahalagang kontribusyon ni Mabini ay ang pagdraft ng Konstitusyon ng Malolos, na nagtatag ng mga legal at pampulitikang pundasyon para sa unang demokratikong republika ng Asya. Ang kanyang bisyon sa konstitusyon ay nagbalanse ng awtoridad ng ehekutibo sa pangangasiwa ng lehislatibo habang isinasama ang mga proteksyon para sa mga indibidwal na karapatan, na nagpapakita ng sopistikadong kaisipang pampulitika na hinango mula sa parehong Kanluraning tradisyong konstitusyonal at mga prinsipyo ng rebolusyonaryong Pilipino.</p>
                            
                            <p class="mb-3">Bilang unang Punong Ministro at Kalihim ng Ugnayang Panlabas, nagsulong si Mabini ng tunay na kalayaan sa halip na simpleng pagpapalit ng mga kolonyal na kapangyarihan. Siya ay patuloy na nagbabala laban sa mga intensyon ng Amerika sa Pilipinas at binigyang-diin ang kahalagahan ng pagtatatag ng isang pamahalaan na tunay na kumakatawan sa mga interes at aspirasyon ng Pilipino, mga prinsipyo na gagabay sa kanyang pilosopiyang pampulitika sa buong panahon ng rebolusyon at higit pa.</p>
                        </div>
                    `
                },
                {
                    id: 5,
                    title: '🌅 Wakas ng Pamamahala ng Espanyol',
                    icon: '🌅',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Kasunduan sa Paris (1898)</h3>
                            <p class="mb-3">Ang Digmaang Espanyol-Amerikano ng 1898 ay dramatikong nagbago sa tanawin ng pulitika ng Pilipinas, dahil ang pagkatalo ng Espanya ay humantong sa <strong>Kasunduan sa Paris</strong> noong Disyembre 10, 1898, na ibinigay ang Pilipinas sa Estados Unidos sa halagang $20 milyon. Ang kasunduang diplomatiko na ito ay nagmarka ng pormal na pagtatapos ng 333 taon ng pananakop ng Espanya, bagaman ito ay sabay na nagpasimula ng pamamahala ng kolonyal ng Amerika nang hindi kumunsulta sa mga Pilipino o kinikilala ang bagong idineklarang Republika ng Pilipinas.</p>
                            
                            <p class="mb-3">Ang panahon ng rebolusyon ay gumising sa isang malakas na pakiramdam ng nasyonalismong Pilipino na lumampas sa mga katapatan sa rehiyon at lumikha ng isang ibinahaging pambansang pagkakakilanlan. Ang mga sakripisyo ng mga bayaning rebolusyonaryo tulad nina Rizal, Bonifacio, at marami pang iba ay nag-inspire sa mga henerasyon ng mga Pilipino na ipagpatuloy ang pakikibaka para sa tunay na kalayaan, soberanya, at pagpapasya sa sarili laban sa mga sumunod na kolonyal na kapangyarihan.</p>
                            
                            <p class="mb-3">Sa kabila ng paglipat mula sa pamamahala ng Espanya tungo sa Amerika, ang Rebolusyong Pilipino ay nagtatag ng mahahalagang precedent para sa sariling pamamahala, demokratikong konstitusyon, at pagbuo ng pambansang pagkakakilanlan. Ang mga pundasyong ito ay magpapatunay na mahalaga sa panahon ng kasunod na kolonyal na panahon ng Amerika at sa huli ay mag-ambag sa pagkamit ng ganap na kalayaan noong 1946, na lumilikha ng tuluy-tuloy na salaysay ng paglaban at pagbuo ng bansa na tumutukoy sa modernong kasaysayan ng Pilipinas.</p>
                        </div>
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
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">From Spanish to American Rule</h3>
                            <p class="mb-3">Following American victory in the Spanish-American War of 1898, the United States assumed control of the Philippines through the Treaty of Paris, initiating a dramatic transition from Spanish to American colonial administration. This geopolitical shift occurred without Filipino consultation or consent, creating immediate tensions between Filipino revolutionary forces who had just declared independence and the new American colonial authorities.</p>
                            
                            <p class="mb-3">Key events defined this transitional period, beginning with Commodore George Dewey's decisive naval victory in the Battle of Manila Bay on May 1, 1898, which shattered Spanish naval power in the Pacific. The subsequent Treaty of Paris formalized the transfer of sovereignty, with Spain receiving $20 million compensation for the Philippines, Guam, and Puerto Rico. This transaction between colonial powers disregarded the established Philippine Republic, leading many Filipinos to feel betrayed after fighting for independence only to face new colonial masters.</p>
                        </div>
                    `
                },
                {
                    id: 2,
                    title: '⚔️ Philippine-American War',
                    icon: '⚔️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">The War for Independence (1899-1902)</h3>
                            <p class="mb-3">Filipino forces under Emilio Aguinaldo's leadership engaged American occupation troops in a brutal three-year conflict known as the Philippine-American War, which represented a continuation of the struggle for genuine independence rather than mere colonial substitution. This asymmetrical warfare pitted Filipino revolutionary forces against better-equipped American troops, resulting in significant casualties and widespread destruction across the archipelago.</p>
                            
                            <p class="mb-3">Major military engagements included the Battle of Manila in February 1899, which marked the conventional warfare phase of the conflict, and the subsequent campaigns led by General Antonio Luna, whose tactical innovations and organizational reforms demonstrated Filipino military capability. As American forces established control over urban areas, Filipino resistance shifted to guerrilla warfare tactics that leveraged local knowledge and popular support, prolonging the conflict and increasing its intensity.</p>
                            
                            <p class="mb-3">The capture of Aguinaldo in 1901 effectively ended organized conventional resistance, though sporadic guerrilla warfare continued in various regions. The war's conclusion established American colonial authority while simultaneously creating enduring narratives of resistance and sacrifice that would influence subsequent Philippine nationalist movements throughout the American colonial period and beyond.</p>
                        </div>
                    `
                },
                {
                    id: 3,
                    title: '🏫 American Colonial Policy',
                    icon: '🏫',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Benevolent Assimilation</h3>
                            <p class="mb-3">American colonial administration implemented a policy of "benevolent assimilation," which claimed to prepare Filipinos for eventual self-governance while maintaining colonial control. This approach combined military pacification with social, educational, and political reforms designed to reshape Philippine society according to American models and values, creating a complex legacy of both development and dependency.</p>
                            
                            <p class="mb-3">Significant changes included the establishment of a comprehensive public education system using English as the medium of instruction, which dramatically increased literacy rates while simultaneously creating linguistic and cultural shifts. American authorities also introduced democratic institutions, including elections for local offices and eventually national legislative bodies, though these operated within the constraints of colonial oversight and limited Filipino autonomy.</p>
                            
                            <p class="mb-3">Infrastructure development received substantial American investment, with improvements in transportation networks, communication systems, and public health facilities that modernized Philippine society. However, these developments often served American economic interests and facilitated resource extraction, creating patterns of dependency that would shape Philippine economic development for decades.</p>
                        </div>
                    `
                },
                {
                    id: 4,
                    title: '📜 Steps to Independence',
                    icon: '📜',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Path to Self-Government</h3>
                            <p class="mb-3">The United States gradually granted increased autonomy to the Philippines through a series of legislative acts that created a pathway toward eventual independence. The Jones Act of 1916 established the principle of Philippine independence while creating a bicameral Philippine legislature with greater Filipino participation, marking an important step toward self-governance within the colonial framework.</p>
                            
                            <p class="mb-3">The Tydings-McDuffie Act of 1934 proved particularly significant, establishing the Philippine Commonwealth with a ten-year transition period leading to full independence in 1946. This legislation created a semi-autonomous government under Filipino leadership, with Manuel L. Quezon elected as the first Commonwealth President in 1935, representing the highest level of self-government achieved under American colonial administration.</p>
                            
                            <p class="mb-3">Filipino leaders used this transitional period to develop governmental institutions, draft a new constitution, and prepare for complete sovereignty. This decade of Commonwealth government allowed Filipinos to gain administrative experience and establish governance patterns that would continue after independence, though the outbreak of World War II would dramatically interrupt this transition process.</p>
                        </div>
                    `
                },
                {
                    id: 5,
                    title: '🌟 Legacy of American Period',
                    icon: '🌟',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Impact on Philippine Society</h3>
                            <p class="mb-3">American colonization left enduring impacts on Philippine culture, education, government, and international relations that continue to shape contemporary Philippine society. The establishment of English as the second official language created linguistic patterns that facilitated international communication and educational access while simultaneously marginalizing indigenous languages and creating complex questions of national identity.</p>
                            
                            <p class="mb-3">The American-style education system introduced Western pedagogical methods, curricular content, and institutional structures that transformed Philippine education while also inculcating American cultural values and historical perspectives. This educational legacy created a bilingual, Western-oriented elite while also providing broader literacy and educational opportunities that empowered social mobility and national development.</p>
                            
                            <p class="mb-3">Democratic government structures introduced during the American period, including the presidential system, separation of powers, and constitutional governance, established patterns that would endure after independence. The strong United States-Philippines relationship initiated during this colonial period continues to influence Philippine foreign policy, security arrangements, and economic relations, creating a complex post-colonial relationship that balances historical connections with contemporary national interests.</p>
                        </div>
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
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Mula sa Espanyol tungo sa Pamamahala ng Amerika</h3>
                            <p class="mb-3">Kasunod ng tagumpay ng Amerika sa Digmaang Espanyol-Amerikano ng 1898, ang Estados Unidos ay nagsagawa ng kontrol sa Pilipinas sa pamamagitan ng Kasunduan sa Paris, na nagsimula ng isang dramatikong paglipat mula sa administrasyon ng kolonyal ng Espanya tungo sa Amerika. Ang pagbabagong heopolitikal na ito ay naganap nang walang konsultasyon o pahintulot ng mga Pilipino, na lumikha ng agarang mga pag-igting sa pagitan ng mga rebolusyonaryong puwersa ng Pilipino na kakadeklara lamang ng kalayaan at mga bagong awtoridad ng kolonyal ng Amerika.</p>
                            
                            <p class="mb-3">Ang mga pangunahing pangyayari ay tumukoy sa panahon ng paglipat na ito, na nagsisimula sa mapagpasyang tagumpay sa dagat ni Commodore George Dewey sa Labanan sa Look ng Maynila noong Mayo 1, 1898, na sinira ang kapangyarihang pandagat ng Espanya sa Pasipiko. Ang kasunod na Kasunduan sa Paris ay pormal na naglipat ng soberanya, na tumatanggap ang Espanya ng $20 milyong kompensasyon para sa Pilipinas, Guam, at Puerto Rico. Ang transaksyong ito sa pagitan ng mga kolonyal na kapangyarihan ay hindi isinasaalang-alang ang itinatag na Republika ng Pilipinas, na humantong sa maraming Pilipino na makaramdam ng pagkakatraydor pagkatapos makipaglaban para sa kalayaan upang harapin lamang ang mga bagong kolonyal na panginoon.</p>
                        </div>
                    `
                },
                {
                    id: 2,
                    title: '⚔️ Digmaang Pilipino-Amerikano',
                    icon: '⚔️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Digmaan para sa Kalayaan (1899-1902)</h3>
                            <p class="mb-3">Ang mga puwersa ng Pilipino sa pamumuno ni Emilio Aguinaldo ay nakipag-engkwentro sa mga tropa ng okupasyon ng Amerika sa isang malupit na tatlong taong labanan na kilala bilang Digmaang Pilipino-Amerikano, na kumakatawan sa pagpapatuloy ng pakikibaka para sa tunay na kalayaan sa halip na simpleng pagpapalit ng kolonyal. Ang asimetrikong digmaang ito ay pinagtagpo ang mga rebolusyonaryong puwersa ng Pilipino laban sa mas mahusay na kagamitang mga tropa ng Amerika, na nagresulta sa makabuluhang mga nasawi at malawakang pagkawasak sa buong kapuluan.</p>
                            
                            <p class="mb-3">Ang mga pangunahing pakikipag-engkwentro sa militar ay kinabibilangan ng Labanan sa Maynila noong Pebrero 1899, na nagmarka ng yugto ng konbensyonal na digmaan ng salungatan, at ang mga kasunod na kampanya sa pamumuno ni Heneral Antonio Luna, na ang mga taktikang inobasyon at reporma sa organisasyon ay nagpakita ng kakayahan ng militar ng Pilipino. Habang itinatatag ng mga puwersa ng Amerika ang kontrol sa mga urban na lugar, ang paglaban ng Pilipino ay lumipat sa mga taktika ng digmaang gerilya na nagsamantala sa lokal na kaalaman at suporta ng mga tao, na nagpahaba sa salungatan at nagpataas ng intensity nito.</p>
                            
                            <p class="mb-3">Ang pagkakahuli kay Aguinaldo noong 1901 ay epektibong nagtapos sa organisadong konbensyonal na paglaban, bagaman ang pana-panahong digmaang gerilya ay nagpatuloy sa iba't ibang rehiyon. Ang konklusyon ng digmaan ay nagtatag ng awtoridad ng kolonyal ng Amerika habang sabay na lumilikha ng pangmatagalang mga salaysay ng paglaban at sakripisyo na makakaimpluwensya sa mga kasunod na kilusang nasyonalista ng Pilipino sa buong panahon ng kolonyal ng Amerika at higit pa.</p>
                        </div>
                    `
                },
                {
                    id: 3,
                    title: '🏫 Patakaran ng Kolonyal na Amerika',
                    icon: '🏫',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Benevolent Assimilation</h3>
                            <p class="mb-3">Ang administrasyon ng kolonyal ng Amerika ay nagpatupad ng isang patakaran ng "benevolent assimilation," na nag-aangkin na inihahanda ang mga Pilipino para sa kalaunang sariling pamamahala habang pinapanatili ang kontrol ng kolonyal. Ang pamamaraang ito ay pinagsama ang pacification ng militar sa mga reporma sa lipunan, edukasyon, at pampulitika na idinisenyo upang muling hugis ang lipunan ng Pilipinas ayon sa mga modelo at halaga ng Amerika, na lumilikha ng isang kumplikadong pamana ng parehong pag-unlad at pagdepende.</p>
                            
                            <p class="mb-3">Ang mga makabuluhang pagbabago ay kinabibilangan ng pagtatatag ng isang komprehensibong sistema ng pampublikong edukasyon na gumagamit ng Ingles bilang midyum ng pagtuturo, na dramatikong nagpataas ng mga rate ng literacy habang sabay na lumilikha ng mga pagbabago sa lingguwistika at kultura. Ang mga awtoridad ng Amerika ay nagpakilala rin ng mga demokratikong institusyon, kabilang ang mga halalan para sa mga lokal na opisina at kalaunan mga pambansang katawang lehislatibo, bagaman ang mga ito ay nagpapatakbo sa loob ng mga hadlang ng pangangasiwa ng kolonyal at limitadong awtonomiya ng Pilipino.</p>
                            
                            <p class="mb-3">Ang pagpapaunlad ng imprastraktura ay tumanggap ng makabuluhang pamumuhunan ng Amerika, na may mga pagpapabuti sa mga network ng transportasyon, sistema ng komunikasyon, at mga pasilidad ng pampublikong kalusugan na nag-modernize sa lipunan ng Pilipinas. Gayunpaman, ang mga pag-unlad na ito ay madalas na nagsilbi sa mga interes ng ekonomiya ng Amerika at nagpadali sa pagkuha ng mga mapagkukunan, na lumilikha ng mga pattern ng pagdepende na maghuhugis sa pag-unlad ng ekonomiya ng Pilipinas sa loob ng mga dekada.</p>
                        </div>
                    `
                },
                {
                    id: 4,
                    title: '📜 Hakbang tungo sa Kalayaan',
                    icon: '📜',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Landas tungo sa Sariling Pamahalaan</h3>
                            <p class="mb-3">Ang Estados Unidos ay unti-unting nagbigay ng mas mataas na awtonomiya sa Pilipinas sa pamamagitan ng isang serye ng mga batas na lehislatibo na lumikha ng isang landas patungo sa kalaunang kalayaan. Ang Batas Jones ng 1916 ay nagtatag ng prinsipyo ng kalayaan ng Pilipinas habang lumilikha ng isang bicameral na lehislatura ng Pilipinas na may mas malaking partisipasyon ng Pilipino, na nagmamarka ng isang mahalagang hakbang tungo sa sariling pamamahala sa loob ng balangkas ng kolonyal.</p>
                            
                            <p class="mb-3">Ang Batas Tydings-McDuffie ng 1934 ay napatunayang partikular na makabuluhan, na nagtatag ng Commonwealth ng Pilipinas na may sampung taong panahon ng paglipat na humahantong sa ganap na kalayaan noong 1946. Ang batas na ito ay lumikha ng isang semi-autonomous na pamahalaan sa ilalim ng pamumuno ng Pilipino, na si Manuel L. Quezon ay nahalal bilang unang Pangulo ng Commonwealth noong 1935, na kumakatawan sa pinakamataas na antas ng sariling pamahalaan na nakamit sa ilalim ng administrasyon ng kolonyal ng Amerika.</p>
                            
                            <p class="mb-3">Ang mga pinuno ng Pilipino ay gumamit ng panahon ng paglipat na ito upang bumuo ng mga institusyong pampamahalaan, mag-draft ng isang bagong konstitusyon, at maghanda para sa kumpletong soberanya. Ang dekadang ito ng pamahalaan ng Commonwealth ay nagpapahintulot sa mga Pilipino na makakuha ng karanasan sa administratibo at magtatag ng mga pattern ng pamamahala na magpapatuloy pagkatapos ng kalayaan, bagaman ang pagsiklab ng Ikalawang Digmaang Pandaigdig ay dramatikong makakaabala sa prosesong ito ng paglipat.</p>
                        </div>
                    `
                },
                {
                    id: 5,
                    title: '🌟 Pamana ng Panahong Amerikano',
                    icon: '🌟',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Epekto sa Lipunang Pilipino</h3>
                            <p class="mb-3">Ang pananakop ng Amerika ay nag-iwan ng pangmatagalang mga epekto sa kultura, edukasyon, pamahalaan, at ugnayang internasyonal ng Pilipinas na patuloy na humuhubog sa kontemporaryong lipunan ng Pilipinas. Ang pagtatatag ng Ingles bilang ikalawang opisyal na wika ay lumikha ng mga pattern ng lingguwistika na nagpadali sa komunikasyong internasyonal at pag-access sa edukasyon habang sabay na nagmamarginalisa sa mga katutubong wika at lumilikha ng mga kumplikadong tanong ng pambansang pagkakakilanlan.</p>
                            
                            <p class="mb-3">Ang sistema ng edukasyon na estilo ng Amerika ay nagpakilala ng mga Kanluraning pamamaraan ng pedagogical, nilalaman ng kurikulum, at mga istrukturang institusyonal na nagbago sa edukasyon ng Pilipinas habang dinidikta rin ang mga halaga at pananaw sa kasaysayan ng kultura ng Amerika. Ang pamana ng edukasyong ito ay lumikha ng isang bilingual, Kanluraning-oriented na elite habang nagbibigay din ng mas malawak na literacy at mga oportunidad sa edukasyon na nagbigay-kapangyarihan sa sosyal na paggalaw at pambansang pag-unlad.</p>
                            
                            <p class="mb-3">Ang mga istruktura ng demokratikong pamahalaan na ipinakilala sa panahon ng Amerika, kabilang ang sistemang pampanguluhan, paghihiwalay ng mga kapangyarihan, at konstitusyonal na pamamahala, ay nagtatag ng mga pattern na mananatili pagkatapos ng kalayaan. Ang malakas na relasyon ng Estados Unidos-Pilipinas na sinimulan sa panahong kolonyal na ito ay patuloy na nakakaimpluwensya sa patakarang panlabas ng Pilipinas, mga pagsasaayos ng seguridad, at ugnayang pang-ekonomiya, na lumilikha ng isang kumplikadong post-kolonyal na relasyon na nagbabalanse ng mga makasaysayang koneksyon sa kontemporaryong mga interes ng bansa.</p>
                        </div>
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
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">December 8, 1941</h3>
                            <p class="mb-3">Within hours of the attack on Pearl Harbor, Japanese forces launched simultaneous invasions across the Philippines on December 8, 1941, initiating a brutal three-year occupation that would profoundly impact Philippine society and infrastructure. This coordinated assault targeted strategic locations throughout the archipelago, overwhelming the combined Filipino-American defenses and establishing Japanese military control within months.</p>
                            
                            <p class="mb-3">The initial invasion featured devastating air raids on Clark Air Base and other military installations that crippled Allied air power in the region, followed by amphibious landings at multiple points along the Philippine coastline. Filipino and American forces under General Douglas MacArthur executed a strategic withdrawal to the Bataan Peninsula and Corregidor Island, where they established defensive positions intended to delay Japanese advance until reinforcements could arrive from the United States.</p>
                        </div>
                    `
                },
                {
                    id: 2,
                    title: '🏴 Bataan Death March',
                    icon: '🏴',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">The Infamous March (April 1942)</h3>
                            <p class="mb-3">Following the surrender of Bataan on April 9, 1942, approximately 75,000 Filipino and American prisoners of war were subjected to the notorious Bataan Death March, a 65-mile forced march under brutal conditions that resulted in thousands of deaths from exhaustion, dehydration, and deliberate cruelty. This traumatic event became one of the most infamous Japanese war crimes of the Pacific Theater, symbolizing the harsh realities of Japanese occupation.</p>
                            
                            <p class="mb-3">Prisoners endured extreme tropical heat with minimal food and water while facing systematic physical abuse from their Japanese captors. The march's horrific conditions and high mortality rate created lasting trauma among survivors while simultaneously strengthening Allied resolve and generating international condemnation of Japanese military conduct. The Bataan Death March remains a powerful symbol of Filipino and American shared sacrifice and resilience during World War II.</p>
                        </div>
                    `
                },
                {
                    id: 3,
                    title: '🗡️ Filipino Resistance',
                    icon: '🗡️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Guerrilla Warfare and Underground Movements</h3>
                            <p class="mb-3">Throughout the Japanese occupation, Filipino guerrilla fighters organized extensive resistance networks that conducted sabotage operations, gathered intelligence for Allied forces, and maintained parallel governance structures in many regions. These resistance movements included both organized military units and civilian underground organizations that collaborated to undermine Japanese control and support eventual liberation.</p>
                            
                            <p class="mb-3">Resistance activities encompassed diverse strategies including sabotage of Japanese military facilities and supply lines, establishment of clandestine communication networks, protection of civilians from Japanese reprisals, and preparation for the eventual Allied return. Filipino guerrillas also played crucial roles in rescuing Allied prisoners, gathering topographic intelligence for planned invasions, and maintaining Filipino morale during the occupation's darkest periods.</p>
                        </div>
                    `
                },
                {
                    id: 4,
                    title: '🇺🇸 MacArthur Returns',
                    icon: '🇺🇸',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">"I Shall Return" - October 1944</h3>
                            <p class="mb-3">General Douglas MacArthur fulfilled his famous promise by leading Allied forces back to the Philippines with the landing at Leyte on October 20, 1944, initiating the campaign to liberate the archipelago from Japanese occupation. This historic return marked a turning point in the Pacific War and represented both a strategic military objective and a symbolic commitment to Philippine liberation.</p>
                            
                            <p class="mb-3">The subsequent Battle of Leyte Gulf, fought from October 23-26, 1944, emerged as the largest naval battle in history and effectively destroyed Japanese naval power in the Pacific. Allied forces progressed through the Philippines with the liberation of Manila in February 1945, though this victory came at tremendous cost as Japanese troops fought tenaciously and inflicted widespread destruction during their retreat. Organized Japanese resistance in the Philippines concluded following the formal Japanese surrender in August 1945.</p>
                        </div>
                    `
                },
                {
                    id: 5,
                    title: '🕊️ Path to Independence',
                    icon: '🕊️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">July 4, 1946: Realization of Independence</h3>
                            <p class="mb-3">The United States granted the Philippines full independence on July 4, 1946, fulfilling the promise made in the Tydings-McDuffie Act and marking the end of 48 years of American colonial administration. This long-awaited independence occurred against the backdrop of a war-ravaged nation facing massive reconstruction challenges, economic dislocation, and complex political transitions.</p>
                            
                            <p class="mb-3">Manuel Roxas assumed office as the first President of the independent Republic of the Philippines, inheriting a nation devastated by war but determined to establish sovereign governance. The postwar period required rebuilding infrastructure, revitalizing the economy, and addressing the social trauma caused by Japanese occupation, all while navigating the complex dynamics of the emerging Cold War international order.</p>
                            
                            <p class="mb-3">Despite independence, the Philippines maintained strong political, economic, and military ties with the United States through various agreements including the Military Bases Agreement and the Philippine Trade Act. These relationships created both opportunities and constraints for the newly independent nation as it sought to define its position in the postwar world while addressing pressing domestic challenges and establishing its identity as a sovereign Asian republic.</p>
                        </div>
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
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Disyembre 8, 1941</h3>
                            <p class="mb-3">Sa loob ng ilang oras pagkatapos ng atake sa Pearl Harbor, ang mga puwersa ng Hapon ay nagsimula ng sabay-sabay na pagsalakay sa buong Pilipinas noong Disyembre 8, 1941, na nagsisimula ng isang malupit na tatlong taong okupasyon na magkakaroon ng malalim na epekto sa lipunan at imprastraktura ng Pilipinas. Ang coordinated na pag-atake na ito ay tumarget sa mga estratehikong lokasyon sa buong kapuluan, na napabagsak ang pinagsamang depensa ng Pilipino-Amerikano at nagtatag ng kontrol ng militar ng Hapon sa loob ng ilang buwan.</p>
                            
                            <p class="mb-3">Ang unang pagsalakay ay nagtampok ng mga nagwawasak na pananalasa sa hangin sa Clark Air Base at iba pang mga pasilidad ng militar na nagpahina sa kapangyarihan ng hangin ng Allies sa rehiyon, na sinundan ng mga amphibious landing sa maraming punto sa kahabaan ng baybayin ng Pilipinas. Ang mga puwersa ng Pilipino at Amerikano sa ilalim ni Heneral Douglas MacArthur ay nagsagawa ng isang estratehikong pag-atras sa Tangway ng Bataan at Isla ng Corregidor, kung saan sila nagtatag ng mga posisyong depensibo na nilayon upang maantala ang pagsulong ng Hapon hanggang sa makarating ang mga reinforcements mula sa Estados Unidos.</p>
                        </div>
                    `
                },
                {
                    id: 2,
                    title: '🏴 Martsa ng Kamatayan sa Bataan',
                    icon: '🏴',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Ang Bantog na Martsa (Abril 1942)</h3>
                            <p class="mb-3">Kasunod ng pagsuko ng Bataan noong Abril 9, 1942, humigit-kumulang 75,000 mga bilanggong digmaang Pilipino at Amerikano ay napailalim sa kilalang-kilalang Bataan Death March, isang 65-milyang sapilitang pagmamartsa sa ilalim ng malupit na kondisyon na nagresulta sa libu-libong pagkamatay dahil sa pagod, dehydration, at sinadyang kalupitan. Ang traumatikong pangyayaring ito ay naging isa sa pinakasikat na krimen sa digmaan ng Hapon sa Pacific Theater, na sumisimbolo sa mga malupit na realidad ng okupasyon ng Hapon.</p>
                            
                            <p class="mb-3">Ang mga bilanggo ay nagtiis ng matinding tropikal na init na may kaunting pagkain at tubig habang nahaharap sa sistematikong pisikal na pang-aabuso mula sa kanilang mga Hapong captor. Ang mga kakila-kilabot na kondisyon ng martsa at mataas na rate ng pagkamatay ay lumikha ng pangmatagalang trauma sa mga nakaligtas habang sabay na pinalakas ang determinasyon ng Allies at lumikha ng internasyonal na pagkondena sa pag-uugali ng militar ng Hapon. Ang Bataan Death March ay nananatiling isang makapangyarihang simbolo ng ibinahaging sakripisyo at katatagan ng Pilipino at Amerikano sa panahon ng Ikalawang Digmaang Pandaigdig.</p>
                        </div>
                    `
                },
                {
                    id: 3,
                    title: '🗡️ Paglaban ng mga Pilipino',
                    icon: '🗡️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Digmaang Gerilya at Mga Kilusang Underground</h3>
                            <p class="mb-3">Sa buong okupasyon ng Hapon, ang mga gerilyang Pilipino ay nag-organisa ng malawak na mga network ng paglaban na nagsagawa ng mga operasyon ng sabotahe, nagtipon ng impormasyon para sa mga puwersa ng Allies, at nagpanatili ng mga parallel na istruktura ng pamamahala sa maraming rehiyon. Ang mga kilusang paglaban na ito ay kinabibilangan ng parehong organisadong mga yunit ng militar at mga organisasyong underground ng sibilyan na nagtulungan upang pahinain ang kontrol ng Hapon at suportahan ang kalaunang paglaya.</p>
                            
                            <p class="mb-3">Ang mga aktibidad ng paglaban ay sumasaklaw sa magkakaibang mga estratehiya kabilang ang sabotahe ng mga pasilidad at linya ng suplay ng militar ng Hapon, pagtatatag ng mga lihim na network ng komunikasyon, proteksyon ng mga sibilyan mula sa mga paghihiganti ng Hapon, at paghahanda para sa kalaunang pagbabalik ng Allies. Ang mga gerilyang Pilipino ay gumampan din ng mahahalagang papel sa pagsagip sa mga bilanggong Allies, pagtitipon ng impormasyon sa topograpiko para sa mga planong pagsalakay, at pagpapanatili ng moral ng Pilipino sa panahon ng pinakamadilim na panahon ng okupasyon.</p>
                        </div>
                    `
                },
                {
                    id: 4,
                    title: '🇺🇸 Pagbabalik ni MacArthur',
                    icon: '🇺🇸',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">"I Shall Return" - Oktubre 1944</h3>
                            <p class="mb-3">Tinupad ni Heneral Douglas MacArthur ang kanyang bantog na pangako sa pamamagitan ng pagpapangunang mga puwersa ng Allies pabalik sa Pilipinas sa pag-landing sa Leyte noong Oktubre 20, 1944, na nagsisimula ng kampanya upang palayain ang kapuluan mula sa okupasyon ng Hapon. Ang makasaysayang pagbabalik na ito ay nagmarka ng isang turning point sa Digmaang Pasipiko at kumakatawan sa parehong isang estratehikong layunin ng militar at isang simbolikong pangako sa paglaya ng Pilipinas.</p>
                            
                            <p class="mb-3">Ang kasunod na Labanan sa Golpo ng Leyte, na nakipaglaban mula Oktubre 23-26, 1944, ay lumitaw bilang pinakamalaking labanan sa dagat sa kasaysayan at epektibong winasak ang kapangyarihan ng dagat ng Hapon sa Pasipiko. Ang mga puwersa ng Allies ay nagpatuloy sa Pilipinas sa paglaya ng Maynila noong Pebrero 1945, bagaman ang tagumpay na ito ay dumating sa napakalaking halaga habang ang mga tropa ng Hapon ay matatag na nakipaglaban at nagdulot ng malawakang pagkawasak sa panahon ng kanilang pag-atras. Ang organisadong paglaban ng Hapon sa Pilipinas ay natapos kasunod ng pormal na pagsuko ng Hapon noong Agosto 1945.</p>
                        </div>
                    `
                },
                {
                    id: 5,
                    title: '🕊️ Landas tungo sa Kalayaan',
                    icon: '🕊️',
                    content: `
                        <div class="space-y-4">
                            <h3 class="text-xl font-bold mb-3">Hulyo 4, 1946: Pagkamit ng Kalayaan</h3>
                            <p class="mb-3">Ang Estados Unidos ay nagbigay ng ganap na kalayaan sa Pilipinas noong Hulyo 4, 1946, na tinutupad ang pangakong ginawa sa Batas Tydings-McDuffie at nagmamarka ng pagtatapos ng 48 taon ng administrasyon ng kolonyal ng Amerika. Ang matagal nang hinihintay na kalayaan na ito ay naganap sa background ng isang bansang winasak ng digmaan na nahaharap sa malalaking hamon sa rekonstruksyon, dislocation ng ekonomiya, at mga kumplikadong paglipat sa pulitika.</p>
                            
                            <p class="mb-3">Si Manuel Roxas ay nagsimula ng tungkulin bilang unang Pangulo ng malayang Republika ng Pilipinas, na minana ang isang bansang winasak ng digmaan ngunit determinado na magtatag ng soberanong pamamahala. Ang panahon pagkatapos ng digmaan ay nangangailangan ng muling pagbuo ng imprastraktura, pagbibigay-buhay sa ekonomiya, at pagtugon sa trauma sa lipunan na sanhi ng okupasyon ng Hapon, lahat habang nag-navigate sa mga kumplikadong dynamics ng umuusbong na internasyonal na order ng Cold War.</p>
                            
                            <p class="mb-3">Sa kabila ng kalayaan, ang Pilipinas ay nanatiling malakas na pampulitika, pang-ekonomiya, at mga ugnayang militar sa Estados Unidos sa pamamagitan ng iba't ibang kasunduan kabilang ang Military Bases Agreement at Philippine Trade Act. Ang mga relasyong ito ay lumikha ng parehong mga oportunidad at hadlang para sa bagong malayang bansa habang ito ay naghahanap na tukuyin ang posisyon nito sa postwar na mundo habang tinutugunan ang mga nagpupumilit na hamon sa domestiko at itinatag ang pagkakakilanlan nito bilang isang soberanong republika ng Asya.</p>
                        </div>
                    `
                }
            ]
        }
    }
};
