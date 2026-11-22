/* ============================================================
   BANK SOAL READING
   Setiap bacaan = 1 objek di array window.TOEFL_BANK.reading:
   { id, topic, title, paragraphs: [teks paragraf...],
     vocab: { kata: { pos, meaning, syn: [...], forms: [bentuk lain] } },
     questions: [{ id, type, paragraph (indeks mulai 0), target (khusus vocab),
                   prompt, options: [A,B,C,D], answer (indeks 0-3),
                   why: "alasan benar", notes: [alasan salah per opsi, "" utk opsi benar] }] }
   type: factual | negative | inference | vocab | rhetorical
   id harus unik di seluruh bank soal.
   ============================================================ */
window.TOEFL_BANK = window.TOEFL_BANK || {};
window.TOEFL_BANK.reading = [
  {
    id: "r1",
    topic: "Sains / Biologi",
    title: "Mycorrhizal Networks: The Hidden Partnership Beneath the Forest",
    paragraphs: [
      "Beneath nearly every forest floor lies a vast network of fungal threads that most visitors never notice. These threads, called hyphae, form intimate associations with plant roots known as mycorrhizae, a term derived from the Greek words for “fungus” and “root.” Such associations are remarkably ubiquitous: scientists estimate that roughly 90 percent of land plant species form them. In the partnership, the fungus colonizes the root and extends its hyphae far into the surrounding soil, where the threads, being much thinner than roots, can penetrate tiny pores that roots cannot reach.",
      "The exchange at the heart of this relationship is essentially a trade. The fungus absorbs water and scarce mineral nutrients, particularly phosphorus and nitrogen, and transfers them to the plant. In return, the plant supplies the fungus with sugars produced through photosynthesis, sometimes as much as 20 percent of the carbon it fixes. Because fungi cannot photosynthesize, they depend entirely on this supply of carbon. For the plant, the arrangement is equally valuable: experiments have shown that seedlings deprived of their fungal partners often grow slowly and are more vulnerable to drought, especially in nutrient-poor soils.",
      "In the 1990s, researchers made a discovery that altered how ecologists view forests. Using carbon isotopes as tracers, they demonstrated that carbon could travel from one tree to another through shared fungal networks. In one well-known study, carbon moved from paper birch trees growing in full sun to Douglas fir seedlings growing in deep shade. Some scientists proposed that large “mother trees” might use these networks to nourish their offspring, and the image of a cooperative “wood wide web” quickly captured the public imagination.",
      "More recently, however, several ecologists have urged caution. They point out that the amount of carbon transferred in field studies is often small and that most experiments cannot rule out alternative pathways, such as movement through the soil itself rather than through fungal threads. Furthermore, fungi are not passive pipelines; they pursue their own interests and may allocate resources in ways that benefit themselves rather than any particular tree. None of these critics deny that mycorrhizal networks exist or that they matter. Rather, they argue that claims about deliberate cooperation among trees have outpaced the evidence."
    ],
    vocab: {
      ubiquitous: { pos: "adj", meaning: "ada di mana-mana; sangat umum dijumpai", syn: ["widespread", "pervasive", "omnipresent"] },
      intimate: { pos: "adj", meaning: "sangat dekat/erat (hubungan fisik atau fungsional)", syn: ["close", "tight", "direct"] },
      colonizes: { pos: "v", meaning: "menempati dan berkembang di suatu tempat", syn: ["occupies", "inhabits", "settles in"], forms: ["colonize", "colonized"] },
      penetrate: { pos: "v", meaning: "menembus; masuk ke dalam", syn: ["enter", "pierce", "pass into"] },
      scarce: { pos: "adj", meaning: "langka; jumlahnya sedikit", syn: ["limited", "rare", "in short supply"] },
      deprived: { pos: "adj/v", meaning: "kehilangan; tidak mendapatkan sesuatu yang dibutuhkan", syn: ["lacking", "denied", "stripped of"] },
      vulnerable: { pos: "adj", meaning: "rentan; mudah terkena dampak buruk", syn: ["susceptible", "exposed", "at risk"] },
      tracers: { pos: "n", meaning: "penanda/pelacak (zat yang dipakai untuk melacak pergerakan)", syn: ["markers", "indicators", "labels"], forms: ["tracer"] },
      allocate: { pos: "v", meaning: "membagikan; mengalokasikan sumber daya", syn: ["distribute", "assign", "apportion"] },
      passive: { pos: "adj", meaning: "pasif; tidak bertindak sendiri", syn: ["inactive", "inert", "unresponsive"] },
      outpaced: { pos: "v", meaning: "melaju lebih cepat dari; melampaui", syn: ["exceeded", "surpassed", "gotten ahead of"], forms: ["outpace"] }
    },
    questions: [
      {
        id: "r1q1", type: "vocab", paragraph: 0, target: "ubiquitous",
        prompt: "The word “ubiquitous” in paragraph 1 is closest in meaning to",
        options: ["beneficial", "widespread", "ancient", "complex"],
        answer: 1,
        why: "“Ubiquitous” berarti ada di mana-mana. Konteks kalimat berikutnya mendukung: sekitar 90% spesies tumbuhan darat membentuk asosiasi ini, artinya asosiasi tersebut tersebar sangat luas (widespread).",
        notes: [
          "“Beneficial” (menguntungkan) memang benar untuk mikoriza secara umum, tetapi bukan makna kata “ubiquitous”. Ini jebakan karena faktanya benar namun maknanya salah.",
          "",
          "“Ancient” (kuno) tidak didukung konteks; kalimat membahas persebaran, bukan usia.",
          "“Complex” (rumit) tidak sesuai; angka 90% menunjukkan seberapa luas, bukan seberapa rumit."
        ]
      },
      {
        id: "r1q2", type: "factual", paragraph: 1,
        prompt: "According to paragraph 2, what does the plant provide to the fungus?",
        options: [
          "Water drawn from deep layers of the soil",
          "Phosphorus and nitrogen",
          "Sugars produced through photosynthesis",
          "Protection from drought"
        ],
        answer: 2,
        why: "Paragraf 2 menyatakan “the plant supplies the fungus with sugars produced through photosynthesis”. Jamur tidak bisa berfotosintesis sehingga bergantung pada gula dari tumbuhan.",
        notes: [
          "Air justru diserap oleh jamur dan diberikan kepada tumbuhan, bukan sebaliknya. Arah pertukarannya terbalik.",
          "Fosfor dan nitrogen juga diberikan jamur kepada tumbuhan. Opsi ini membalik peran kedua pihak.",
          "",
          "Ketahanan terhadap kekeringan adalah manfaat yang diterima tumbuhan dari jamur, bukan sesuatu yang diberikan tumbuhan."
        ]
      },
      {
        id: "r1q3", type: "rhetorical", paragraph: 2,
        prompt: "Why does the author mention “paper birch trees growing in full sun” and “Douglas fir seedlings growing in deep shade” in paragraph 3?",
        options: [
          "To give an example showing that carbon can move between different trees through fungal networks",
          "To argue that birch trees photosynthesize more efficiently than fir trees",
          "To show that seedlings are unable to survive in deep shade",
          "To explain why mother trees are always older than nearby trees"
        ],
        answer: 0,
        why: "Kalimat sebelumnya menyatakan klaim umum bahwa karbon bisa berpindah antarpohon lewat jaringan jamur. Penyebutan birch dan Douglas fir adalah contoh konkret (illustration) dari klaim tersebut. Soal rhetorical purpose menanyakan FUNGSI informasi, bukan isinya.",
        notes: [
          "",
          "Penulis tidak membandingkan efisiensi fotosintesis kedua jenis pohon; perbedaan sinar matahari hanya menjelaskan arah aliran karbon.",
          "Teks tidak mengatakan bibit tidak bisa bertahan di tempat teduh; yang dibahas adalah bibit menerima karbon. Ini terlalu ekstrem.",
          "“Mother trees” baru disebut di kalimat berikutnya dan bukan tujuan contoh ini; kata “always” juga tidak didukung teks."
        ]
      },
      {
        id: "r1q4", type: "negative", paragraph: 3,
        prompt: "According to paragraph 4, all of the following are reasons some ecologists urge caution EXCEPT:",
        options: [
          "The quantity of carbon transferred in field studies is often small.",
          "Carbon might travel through the soil rather than through fungal threads.",
          "Fungi may distribute resources in ways that serve their own interests.",
          "Mycorrhizal networks may not actually exist in most forests."
        ],
        answer: 3,
        why: "Paragraf 4 secara eksplisit menyatakan “None of these critics deny that mycorrhizal networks exist.” Jadi opsi D BUKAN alasan para kritikus, sehingga inilah jawaban soal EXCEPT.",
        notes: [
          "Disebutkan langsung: “the amount of carbon transferred in field studies is often small.” Ini memang alasan kritikus.",
          "Disebutkan sebagai “alternative pathways, such as movement through the soil itself.” Ini alasan kritikus.",
          "Disebutkan: fungi “pursue their own interests and may allocate resources” untuk diri sendiri. Ini alasan kritikus.",
          ""
        ]
      }
    ]
  },
  {
    id: "r2",
    topic: "Sejarah / Arkeologi",
    title: "Urban Planning in the Indus Valley Civilization",
    paragraphs: [
      "Between roughly 2600 and 1900 BCE, a remarkable urban civilization flourished along the Indus River and its tributaries in what is now Pakistan and northwestern India. Its largest cities, including Harappa and Mohenjo-daro, may each have housed tens of thousands of people. Although the civilization covered an area larger than that of contemporary Egypt or Mesopotamia, it remained largely unknown to the modern world until the 1920s, when excavations revealed brick cities buried beneath centuries of accumulated silt.",
      "What has most impressed archaeologists is the degree of planning evident in these cities. Major streets were laid out on a roughly north–south and east–west grid, and houses were built of baked bricks whose dimensions followed a consistent ratio of 1:2:4 across hundreds of kilometers. Perhaps most striking was the sophisticated drainage system: many homes had private bathing areas connected to covered drains that ran beneath the streets, with access holes that allowed the channels to be inspected and cleaned. Such infrastructure would not be common in other parts of the world for thousands of years.",
      "This uniformity raises an intriguing puzzle. In Egypt and Mesopotamia, large-scale construction projects are usually associated with powerful kings who commemorated themselves with monumental palaces, tombs, and inscriptions. Yet Indus sites have yielded no unmistakable royal palaces, no lavish royal burials, and few depictions of warfare. Some scholars therefore conclude that Indus society was governed not by a single monarch but by a council of merchants, priests, or landowners. Others caution that the absence of evidence is not necessarily evidence of absence, since the Indus script, found on thousands of small seals, has never been deciphered.",
      "The decline of the Indus cities after about 1900 BCE was gradual rather than sudden. Many urban centers were slowly abandoned as populations shifted toward smaller villages in the east. Researchers have linked this transformation to a combination of factors, including a weakening of the monsoon rains, changes in the courses of rivers, and a reduction in long-distance trade with Mesopotamia. Rather than collapsing in a single catastrophe, the civilization appears to have adapted to new conditions by reorganizing itself into a less centralized way of life."
    ],
    vocab: {
      flourished: { pos: "v", meaning: "berkembang pesat; berjaya", syn: ["thrived", "prospered", "bloomed"], forms: ["flourish"] },
      tributaries: { pos: "n", meaning: "anak sungai", syn: ["branches", "feeder streams"], forms: ["tributary"] },
      contemporary: { pos: "adj", meaning: "sezaman; hidup/terjadi pada masa yang sama", syn: ["coexisting", "of the same period"] },
      accumulated: { pos: "adj/v", meaning: "terkumpul sedikit demi sedikit; menumpuk", syn: ["gathered", "built up", "amassed"] },
      evident: { pos: "adj", meaning: "terlihat jelas; nyata", syn: ["apparent", "visible", "obvious"] },
      sophisticated: { pos: "adj", meaning: "canggih; rumit dan maju", syn: ["advanced", "complex", "refined"] },
      commemorated: { pos: "v", meaning: "memperingati; mengabadikan", syn: ["honored", "celebrated", "memorialized"], forms: ["commemorate"] },
      monumental: { pos: "adj", meaning: "sangat besar dan megah (bangunan)", syn: ["massive", "grand", "imposing"] },
      lavish: { pos: "adj", meaning: "mewah; berlimpah", syn: ["extravagant", "luxurious", "opulent"] },
      deciphered: { pos: "v", meaning: "dipecahkan/diterjemahkan (tulisan atau kode)", syn: ["decoded", "interpreted", "translated"], forms: ["decipher"] },
      gradual: { pos: "adj", meaning: "bertahap; perlahan", syn: ["slow", "progressive", "step-by-step"] }
    },
    questions: [
      {
        id: "r2q1", type: "factual", paragraph: 1,
        prompt: "According to paragraph 2, which feature of Indus cities would not become common in other parts of the world for thousands of years?",
        options: [
          "Streets arranged on a grid pattern",
          "Bricks made in standardized proportions",
          "Covered drains connected to private bathing areas",
          "Houses built entirely of baked bricks"
        ],
        answer: 2,
        why: "Kalimat “Such infrastructure would not be common...” langsung mengikuti penjelasan tentang sistem drainase tertutup yang terhubung ke kamar mandi pribadi. Kata “such infrastructure” merujuk ke drainase tersebut.",
        notes: [
          "Grid jalan memang disebut di paragraf 2, tetapi pernyataan “not common for thousands of years” tidak dikaitkan dengannya.",
          "Rasio bata 1:2:4 menunjukkan keseragaman, tetapi bukan fitur yang dirujuk oleh “such infrastructure”.",
          "",
          "Teks menyebut rumah dibangun dengan baked bricks, tetapi tidak menyatakan hal itu langka di tempat lain. Selain itu “entirely” tidak didukung teks."
        ]
      },
      {
        id: "r2q2", type: "inference", paragraph: 2,
        prompt: "What can be inferred from paragraph 3 about the Indus script?",
        options: [
          "It was used mainly to record religious ceremonies.",
          "If it were deciphered, it might reveal information about how Indus society was governed.",
          "It was borrowed from the writing systems of Mesopotamia.",
          "It was understood only by a small council of merchants."
        ],
        answer: 1,
        why: "Penulis mengutip pendapat bahwa “absence of evidence is not necessarily evidence of absence” karena aksara Indus belum terpecahkan. Implikasinya: jika aksara itu dapat dibaca, mungkin akan muncul bukti tentang penguasa atau sistem pemerintahan. Inilah inferensi yang paling didukung.",
        notes: [
          "Tidak ada informasi tentang isi aksara (religius atau bukan); ini spekulasi di luar teks.",
          "",
          "Teks tidak membahas asal-usul aksara Indus atau hubungannya dengan tulisan Mesopotamia.",
          "Dewan pedagang disebut sebagai kemungkinan bentuk pemerintahan, bukan sebagai pihak yang bisa membaca aksara. Opsi ini mencampur dua informasi yang tidak berhubungan."
        ]
      },
      {
        id: "r2q3", type: "vocab", paragraph: 2, target: "lavish",
        prompt: "The word “lavish” in paragraph 3 is closest in meaning to",
        options: ["hidden", "ancient", "extravagant", "sacred"],
        answer: 2,
        why: "“Lavish” berarti mewah atau berlimpah. Dalam konteks “lavish royal burials”, maksudnya makam kerajaan yang mewah, sejalan dengan “monumental palaces” yang disebut sebelumnya.",
        notes: [
          "“Hidden” (tersembunyi) tidak sesuai; kalimat membahas tidak ditemukannya makam mewah, bukan makam tersembunyi.",
          "“Ancient” (kuno) benar secara fakta untuk situs itu, tetapi bukan arti kata “lavish”.",
          "",
          "“Sacred” (suci) bisa terdengar cocok dengan konteks makam, tetapi bukan makna “lavish”. Jebakan asosiasi topik."
        ]
      },
      {
        id: "r2q4", type: "rhetorical", paragraph: 3,
        prompt: "Why does the author state that the decline of the Indus cities “was gradual rather than sudden”?",
        options: [
          "To challenge the idea that a single disaster destroyed the civilization",
          "To explain why the Indus script has never been deciphered",
          "To show that the Indus decline happened faster than Egypt’s",
          "To suggest that the abandoned cities were later rebuilt"
        ],
        answer: 0,
        why: "Paragraf 4 diakhiri dengan “Rather than collapsing in a single catastrophe, the civilization appears to have adapted...”. Pernyataan “gradual rather than sudden” berfungsi menolak anggapan kehancuran mendadak akibat satu bencana.",
        notes: [
          "",
          "Aksara Indus dibahas di paragraf 3 dan tidak berkaitan dengan proses kemunduran.",
          "Tidak ada perbandingan kecepatan kemunduran dengan Mesir di paragraf 4.",
          "Teks menyebut penduduk pindah ke desa-desa yang lebih kecil, bukan bahwa kota dibangun kembali."
        ]
      }
    ]
  },
  {
    id: "r3",
    topic: "Ekologi / Geologi",
    title: "Karst Landscapes: How Water Sculpts Stone",
    paragraphs: [
      "Some of the world’s most dramatic scenery, including towering stone pinnacles, disappearing rivers, and immense caves, is found in regions known as karst. Karst landscapes develop primarily on limestone, a sedimentary rock composed largely of calcium carbonate that accumulated over millions of years from the shells and skeletons of marine organisms. Unlike most rocks, which are worn away chiefly by physical forces such as wind and ice, limestone is especially susceptible to chemical dissolution. As a result, karst regions are shaped less by erosion at the surface than by water working its way through the rock itself.",
      "The process begins in the atmosphere and the soil. As rain falls, it absorbs small amounts of carbon dioxide, forming a weak carbonic acid. When this water percolates through soil rich in decaying organic matter, it picks up still more carbon dioxide and becomes more acidic. Upon reaching the limestone, the acidic water slowly dissolves the calcium carbonate, enlarging the natural cracks and joints in the rock. Over tens of thousands of years, these widened fractures can grow into underground channels capable of carrying entire rivers.",
      "The surface expression of this hidden activity is often subtle until it becomes sudden. As underground cavities enlarge, the rock above them may lose its support and collapse, producing a sinkhole. Sinkholes range from shallow depressions a few meters wide to vast pits hundreds of meters deep. In some regions, streams flowing across the surface abruptly vanish into such openings, only to reemerge as springs many kilometers away. Because water moves rapidly through these channels with little natural filtration, pollutants introduced at the surface can contaminate distant wells within days.",
      "Karst environments also preserve an extraordinary record of the past. Inside caves, water dripping from the ceiling deposits thin layers of calcite that build up into formations called stalactites and stalagmites. Because the chemical composition of each layer reflects conditions at the time it formed, scientists can analyze these formations to reconstruct changes in rainfall and temperature over hundreds of thousands of years. In this sense, caves function as natural archives, and their formations are among the most precise climate records available on land."
    ],
    vocab: {
      pinnacles: { pos: "n", meaning: "puncak runcing (bebatuan)", syn: ["peaks", "spires", "summits"], forms: ["pinnacle"] },
      sedimentary: { pos: "adj", meaning: "sedimen; terbentuk dari endapan", syn: ["deposited", "layered"] },
      susceptible: { pos: "adj", meaning: "rentan; mudah terpengaruh", syn: ["vulnerable", "prone", "liable"] },
      dissolution: { pos: "n", meaning: "pelarutan (zat padat larut dalam cairan)", syn: ["dissolving", "breakdown", "decomposition"] },
      percolates: { pos: "v", meaning: "merembes; meresap perlahan melalui pori-pori", syn: ["seeps", "filters", "trickles"], forms: ["percolate"] },
      subtle: { pos: "adj", meaning: "halus; tidak mudah terlihat", syn: ["faint", "slight", "inconspicuous"] },
      abruptly: { pos: "adv", meaning: "secara tiba-tiba", syn: ["suddenly", "unexpectedly", "sharply"] },
      filtration: { pos: "n", meaning: "penyaringan", syn: ["purification", "screening", "straining"] },
      contaminate: { pos: "v", meaning: "mencemari", syn: ["pollute", "taint", "foul"] },
      reconstruct: { pos: "v", meaning: "merekonstruksi; menyusun kembali gambaran masa lalu", syn: ["recreate", "rebuild", "piece together"] },
      archives: { pos: "n", meaning: "arsip; tempat penyimpanan catatan", syn: ["records", "repositories", "collections"], forms: ["archive"] }
    },
    questions: [
      {
        id: "r3q1", type: "vocab", paragraph: 0, target: "susceptible",
        prompt: "The word “susceptible” in paragraph 1 is closest in meaning to",
        options: ["resistant", "vulnerable", "identical", "unrelated"],
        answer: 1,
        why: "“Susceptible to chemical dissolution” berarti mudah terkena pelarutan kimia. Sinonim terdekat adalah “vulnerable” (rentan). Kontras dengan batuan lain yang terkikis terutama oleh angin dan es mendukung makna ini.",
        notes: [
          "“Resistant” (tahan) adalah antonimnya. Jebakan klasik dengan makna yang berlawanan.",
          "",
          "“Identical” (identik) tidak masuk akal dalam frasa “identical to chemical dissolution”.",
          "“Unrelated” (tidak berhubungan) bertentangan dengan inti paragraf yang menjelaskan bahwa batu kapur sangat dipengaruhi pelarutan."
        ]
      },
      {
        id: "r3q2", type: "negative", paragraph: 1,
        prompt: "According to paragraph 2, all of the following contribute to making water able to dissolve limestone EXCEPT:",
        options: [
          "carbon dioxide absorbed from the atmosphere",
          "carbon dioxide picked up from decaying organic matter",
          "minerals released when wind erodes the rock surface",
          "the formation of a weak carbonic acid"
        ],
        answer: 2,
        why: "Paragraf 2 hanya menyebut CO₂ dari atmosfer, CO₂ dari bahan organik yang membusuk, dan terbentuknya asam karbonat lemah. Mineral dari erosi angin tidak disebut sebagai faktor; bahkan paragraf 1 menyatakan karst justru TIDAK terutama dibentuk oleh kekuatan fisik seperti angin.",
        notes: [
          "Disebutkan: “As rain falls, it absorbs small amounts of carbon dioxide.”",
          "Disebutkan: air yang merembes melalui tanah kaya bahan organik “picks up still more carbon dioxide”.",
          "",
          "Disebutkan: CO₂ + air hujan “forming a weak carbonic acid”."
        ]
      },
      {
        id: "r3q3", type: "inference", paragraph: 2,
        prompt: "What can be inferred from paragraph 3 about people who obtain drinking water from wells in karst regions?",
        options: [
          "Their water is generally cleaner than water in other regions.",
          "Their water may be affected by pollution that originates far from their wells.",
          "They rarely experience sinkholes near their homes.",
          "They depend mainly on rivers that flow across the surface."
        ],
        answer: 1,
        why: "Teks menyatakan air bergerak cepat melalui saluran bawah tanah dengan sedikit penyaringan alami sehingga polutan di permukaan dapat mencemari “distant wells within days”. Kesimpulannya, pengguna sumur bisa terdampak polusi dari lokasi yang jauh.",
        notes: [
          "Berlawanan dengan teks; minimnya penyaringan justru membuat air lebih rentan tercemar.",
          "",
          "Teks tidak membahas frekuensi sinkhole di dekat permukiman; ini tidak bisa disimpulkan.",
          "Teks justru menyebut sungai di permukaan bisa menghilang ke dalam tanah; tidak ada informasi tentang ketergantungan pada sungai permukaan."
        ]
      },
      {
        id: "r3q4", type: "factual", paragraph: 3,
        prompt: "According to paragraph 4, why are cave formations such as stalagmites valuable to scientists?",
        options: [
          "They reveal how quickly caves are likely to collapse.",
          "The chemistry of their layers records past climate conditions.",
          "They indicate where underground rivers will reemerge.",
          "They prevent pollutants from reaching groundwater."
        ],
        answer: 1,
        why: "Paragraf 4: “the chemical composition of each layer reflects conditions at the time it formed”, sehingga ilmuwan bisa merekonstruksi perubahan curah hujan dan suhu. Fungsi ini disebut “natural archives”.",
        notes: [
          "Keruntuhan gua dibahas di paragraf 3 (sinkhole), bukan sebagai kegunaan stalagmit.",
          "",
          "Kemunculan kembali sungai (springs) dibahas di paragraf 3 dan tidak berkaitan dengan formasi gua.",
          "Teks tidak menyebut formasi gua menyaring polutan; ini informasi yang tidak ada."
        ]
      }
    ]
  },
  {
    id: "r4",
    topic: "Ekonomi / Psikologi",
    title: "Anchoring: Why the First Number Matters",
    paragraphs: [
      "When people estimate an uncertain quantity, they rarely start from nothing. Instead, they often begin with an initial value, sometimes one that is obviously irrelevant, and adjust from there. Psychologists Amos Tversky and Daniel Kahneman called this tendency anchoring. In one classic experiment, participants watched a wheel of fortune that was rigged to stop at either 10 or 65 and were then asked to estimate the percentage of African nations in the United Nations. Those who had seen the higher number gave substantially higher estimates, even though the wheel plainly had nothing to do with the question.",
      "Why should an arbitrary number exert such influence? One explanation holds that people adjust away from an anchor but stop too soon, once they reach a value that seems plausible. Because the adjustment is insufficient, the final estimate remains biased toward the starting point. A second explanation proposes that the anchor selectively activates information consistent with it: someone considering whether a price of $500 is reasonable may begin, without realizing it, to recall features that would justify a high price. Both mechanisms may operate, and their relative importance appears to depend on the situation.",
      "Anchoring has considerable consequences in economic life. Retailers frequently display an item’s “original” price beside a reduced sale price, making the discounted figure appear more attractive by comparison. In negotiations, research suggests that the party who makes the first offer often secures a more favorable outcome, because that offer serves as a reference point for the remainder of the discussion. Even experienced professionals are not immune. In one study, real estate agents who were given different listing prices for the same house produced appraisals that were noticeably skewed toward the price they had seen.",
      "Can the effect be counteracted? Some strategies show modest success. Deliberately generating reasons why an anchor might be inappropriate, a technique sometimes called “considering the opposite,” can reduce its pull. Expertise and motivation offer limited protection: offering participants rewards for accuracy has produced mixed results, partly because people are often unaware that they have been influenced in the first place. For this reason, many researchers argue that the most reliable defense is structural rather than psychological: designing decision processes so that potentially misleading reference points are never encountered at all."
    ],
    vocab: {
      rigged: { pos: "adj/v", meaning: "diatur/dimanipulasi agar hasilnya sudah ditentukan", syn: ["fixed", "manipulated", "set up"], forms: ["rig"] },
      substantially: { pos: "adv", meaning: "secara signifikan; jauh", syn: ["considerably", "significantly", "markedly"] },
      arbitrary: { pos: "adj", meaning: "sembarang; acak tanpa alasan", syn: ["random", "unfounded", "capricious"] },
      plausible: { pos: "adj", meaning: "masuk akal; dapat dipercaya", syn: ["believable", "credible", "reasonable"] },
      insufficient: { pos: "adj", meaning: "tidak cukup", syn: ["inadequate", "deficient", "lacking"] },
      mechanisms: { pos: "n", meaning: "mekanisme; cara sesuatu bekerja", syn: ["processes", "means", "systems"], forms: ["mechanism"] },
      immune: { pos: "adj", meaning: "kebal; tidak terpengaruh", syn: ["resistant", "unaffected", "protected"] },
      skewed: { pos: "adj", meaning: "condong/bias ke satu arah", syn: ["biased", "distorted", "slanted"] },
      counteracted: { pos: "v", meaning: "dilawan; dinetralkan efeknya", syn: ["offset", "neutralized", "countered"], forms: ["counteract"] },
      modest: { pos: "adj", meaning: "sedang; tidak besar", syn: ["moderate", "limited", "small"] },
      structural: { pos: "adj", meaning: "berkaitan dengan struktur/sistem", syn: ["systemic", "organizational"] }
    },
    questions: [
      {
        id: "r4q1", type: "rhetorical", paragraph: 0,
        prompt: "Why does the author mention the “wheel of fortune” experiment in paragraph 1?",
        options: [
          "To demonstrate that even an obviously irrelevant number can influence people’s estimates",
          "To criticize the research methods used by Tversky and Kahneman",
          "To explain how nations are admitted to the United Nations",
          "To argue that most people are skilled at estimating percentages"
        ],
        answer: 0,
        why: "Eksperimen roda keberuntungan adalah bukti dari klaim bahwa titik awal, bahkan yang jelas tidak relevan, memengaruhi estimasi. Kalimat terakhir paragraf menegaskan roda itu “plainly had nothing to do with the question”.",
        notes: [
          "",
          "Penulis tidak mengkritik metode; eksperimen ini disebut “classic” dan dipakai sebagai bukti.",
          "PBB hanya objek pertanyaan dalam eksperimen; penulis tidak menjelaskan proses keanggotaan PBB.",
          "Berlawanan dengan isi; eksperimen menunjukkan estimasi orang mudah bias."
        ]
      },
      {
        id: "r4q2", type: "vocab", paragraph: 1, target: "plausible",
        prompt: "The word “plausible” in paragraph 2 is closest in meaning to",
        options: ["believable", "precise", "generous", "final"],
        answer: 0,
        why: "“Plausible” berarti masuk akal atau dapat dipercaya. Konteksnya: orang berhenti menyesuaikan perkiraan begitu mencapai nilai yang “terasa masuk akal”, meskipun belum tentu tepat.",
        notes: [
          "",
          "“Precise” (tepat/akurat) keliru; inti argumen justru bahwa nilai itu terasa masuk akal tetapi masih bias, jadi belum tentu tepat.",
          "“Generous” (murah hati/besar) tidak berhubungan dengan konteks estimasi.",
          "“Final” mungkin terasa cocok karena orang berhenti di situ, tetapi itu bukan arti kata “plausible”."
        ]
      },
      {
        id: "r4q3", type: "inference", paragraph: 2,
        prompt: "Based on paragraph 3, a seller who wants to obtain a high price in a negotiation would most likely benefit from",
        options: [
          "waiting for the buyer to make the first offer",
          "making an ambitious first offer",
          "avoiding any mention of specific numbers",
          "asking an experienced appraiser to set the price"
        ],
        answer: 1,
        why: "Paragraf 3 menyatakan pihak yang mengajukan tawaran pertama sering mendapat hasil lebih baik karena tawaran itu menjadi titik acuan (anchor). Maka penjual yang ingin harga tinggi sebaiknya membuka dengan tawaran tinggi.",
        notes: [
          "Ini kebalikannya; menunggu berarti membiarkan pembeli menentukan anchor yang rendah.",
          "",
          "Tanpa menyebut angka, penjual kehilangan kesempatan memasang anchor yang menguntungkan.",
          "Teks justru menunjukkan profesional berpengalaman (agen properti) pun terpengaruh anchoring, jadi ini bukan solusi yang didukung."
        ]
      },
      {
        id: "r4q4", type: "factual", paragraph: 3,
        prompt: "According to paragraph 4, why have rewards for accuracy produced mixed results in reducing anchoring?",
        options: [
          "Rewards tend to make participants overconfident.",
          "People are often unaware that they have been influenced.",
          "Experts usually refuse to take part in such studies.",
          "The rewards offered were too small to matter."
        ],
        answer: 1,
        why: "Teks menyatakan hasilnya beragam “partly because people are often unaware that they have been influenced in the first place.” Orang tidak bisa mengoreksi bias yang tidak mereka sadari.",
        notes: [
          "Rasa terlalu percaya diri tidak disebut di paragraf 4.",
          "",
          "Tidak ada informasi bahwa para ahli menolak ikut penelitian.",
          "Besar kecilnya hadiah tidak dibahas sama sekali."
        ]
      }
    ]
  }
];
