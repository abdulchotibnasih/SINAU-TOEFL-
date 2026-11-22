/* ============================================================
   BANK SOAL LISTENING
   Setiap audio = 1 objek di array window.TOEFL_BANK.listening:
   { id, kind: "conversation" | "lecture", title, context,
     speakers: { KODE: { name, gender: "M" | "F" } },
     script: [{ s: KODE atau "N" (narator), t: "kalimat" }],
     questions: [{ id, type, prompt, options, answer, why, notes }] }
   type: gist | detail | function | attitude | inference | organization
   ============================================================ */
window.TOEFL_BANK = window.TOEFL_BANK || {};
window.TOEFL_BANK.listening = [
  {
    id: "l1",
    kind: "conversation",
    title: "Campus Conversation: Finding a Checked-Out Book",
    context: "Listen to a conversation between a student and a librarian.",
    speakers: { W: { name: "Student", gender: "F" }, M: { name: "Librarian", gender: "M" } },
    script: [
      { s: "N", t: "Listen to a conversation between a student and a librarian." },
      { s: "W", t: "Hi, excuse me. I’m looking for a book called Trade Routes of the Medieval Mediterranean, but the catalog says it’s checked out." },
      { s: "M", t: "Let me take a look. Yes, it’s checked out until the end of the month." },
      { s: "W", t: "The end of the month? My paper is due next Friday. I really need chapter four. It’s about grain shipments, which is basically my whole topic." },
      { s: "M", t: "Okay, you’ve got a few options. The first thing most people think of is interlibrary loan. We’d borrow a copy from another university." },
      { s: "W", t: "That sounds perfect." },
      { s: "M", t: "Well, it can be. But it usually takes five to seven business days, and sometimes longer near the end of the semester. So it might arrive after your deadline." },
      { s: "W", t: "Oh. That’s cutting it close." },
      { s: "M", t: "Right. A faster option is a recall. Anyone can place one. The person who has the book gets a notice and has to return it within three days. Then we hold it for you at the front desk." },
      { s: "W", t: "Three days. That would still give me almost a week. But I feel a little bad making someone return it early." },
      { s: "M", t: "I understand, but that’s exactly what the system is for. Books on our shelves are meant to circulate. And there’s one more thing you can do in the meantime. We have a chapter scanning service. If another library has the book, they can scan a single chapter and email it to you, usually within forty-eight hours." },
      { s: "W", t: "Wait, just one chapter? That’s all I really need." },
      { s: "M", t: "Then I’d do both. Place the recall so you have the full book for your citations, and request the scan of chapter four so you can start reading this weekend." },
      { s: "W", t: "That’s a great idea. Can I do both online?" },
      { s: "M", t: "You can. The recall button is right on the catalog page, and the scanning request form is under Services." }
    ],
    questions: [
      {
        id: "l1q1", type: "gist",
        prompt: "Why does the woman go to see the librarian?",
        options: [
          "To return a book that is overdue",
          "To get a book she needs for a research paper",
          "To apply for a job at the front desk",
          "To learn how to search the online catalog"
        ],
        answer: 1,
        why: "Di awal percakapan, mahasiswi mencari buku yang sedang dipinjam orang lain dan menjelaskan bahwa ia membutuhkan bab 4 untuk paper yang harus dikumpulkan Jumat depan. Soal gist menanyakan tujuan utama percakapan.",
        notes: [
          "Ia tidak mengembalikan buku; justru ia ingin meminjam buku yang sedang dipinjam orang lain.",
          "",
          "Front desk hanya disebut sebagai tempat buku akan disimpan untuknya, bukan tempat melamar kerja.",
          "Ia sudah memakai katalog (dan tahu bukunya dipinjam); masalahnya adalah ketersediaan buku, bukan cara menggunakan katalog."
        ]
      },
      {
        id: "l1q2", type: "detail",
        prompt: "Why does the librarian suggest that interlibrary loan may not be the best choice?",
        options: [
          "It is available only to graduate students.",
          "The book might not arrive before the woman’s deadline.",
          "No other university owns a copy of the book.",
          "It is more expensive than placing a recall."
        ],
        answer: 1,
        why: "Pustakawan menyebut interlibrary loan biasanya butuh 5–7 hari kerja, bahkan lebih lama di akhir semester, “so it might arrive after your deadline.”",
        notes: [
          "Tidak ada pembatasan untuk mahasiswa pascasarjana; ia bahkan berkata “anyone can place” sebuah recall.",
          "",
          "Pustakawan tidak menyatakan universitas lain tidak memiliki buku itu; layanan scan justru mengandalkan perpustakaan lain yang punya buku tersebut.",
          "Biaya tidak pernah disebut dalam percakapan."
        ]
      },
      {
        id: "l1q3", type: "function",
        prompt: "Listen again to part of the conversation. Why does the librarian say: “Books on our shelves are meant to circulate”?",
        options: [
          "To reassure the woman that placing a recall is appropriate",
          "To explain that the library plans to buy more copies",
          "To suggest that the current borrower has broken a rule",
          "To remind the woman to return her own books on time"
        ],
        answer: 0,
        why: "Kalimat ini menjawab perasaan bersalah mahasiswi (“I feel a little bad...”). Pustakawan menegaskan bahwa sistem recall memang dibuat agar buku berputar di antara pengguna, jadi ia tidak perlu merasa tidak enak. Soal function menanyakan MAKSUD pembicara.",
        notes: [
          "",
          "Tidak ada rencana pembelian buku baru yang disebut.",
          "Peminjam saat ini tidak melanggar aturan; buku dipinjam secara sah hingga akhir bulan.",
          "Mahasiswi tidak memiliki buku yang terlambat; pernyataan ini tidak ditujukan kepadanya sebagai peringatan."
        ]
      }
    ]
  },
  {
    id: "l2",
    kind: "conversation",
    title: "Campus Conversation: Narrowing a Research Topic",
    context: "Listen to a conversation between a student and his professor.",
    speakers: { M: { name: "Student", gender: "M" }, W: { name: "Professor", gender: "F" } },
    script: [
      { s: "N", t: "Listen to a conversation between a student and his professor." },
      { s: "M", t: "Professor Alvarez? Do you have a minute? It’s about my research proposal." },
      { s: "W", t: "Of course, Daniel. Come in. You submitted the one on solar energy, right?" },
      { s: "M", t: "Right. And I’ve been having second thoughts. Every time I start reading, I find another hundred articles. I don’t know where to begin." },
      { s: "W", t: "I’m not surprised. Solar energy is the subject of entire journals. Honestly, when I read your proposal, my main note was going to be that it’s far too broad." },
      { s: "M", t: "That’s actually why I’m here. Over the break I went home, and my town just opened a community solar garden. It’s a field of panels, and people who can’t put panels on their own roofs, like renters, can buy a share and get a credit on their electricity bill." },
      { s: "W", t: "Now that’s interesting. So what would your question be?" },
      { s: "M", t: "I guess whether these projects really help lower income households, or whether it’s mostly people who could already afford solar." },
      { s: "W", t: "That’s a genuine research question. It’s specific, and the answer isn’t obvious. My only concern is data. Where would your evidence come from?" },
      { s: "M", t: "I hadn’t thought that far yet." },
      { s: "W", t: "Well, community solar is usually run by a cooperative or a utility. They often keep records on who subscribes. Not names, but income ranges or zip codes. I’d contact the manager and ask whether they’d share summary data, or even agree to an interview." },
      { s: "M", t: "I could do that. My neighbor actually works for the cooperative." },
      { s: "W", t: "Perfect. Just remember that any interview needs approval from the ethics review board first. It’s a short form, but it takes about a week." },
      { s: "M", t: "Okay. So should I rewrite the proposal?" },
      { s: "W", t: "Yes. Send me a revised version by Monday. And start the ethics form now, so it doesn’t hold you up later." }
    ],
    questions: [
      {
        id: "l2q1", type: "gist",
        prompt: "What is the main purpose of the conversation?",
        options: [
          "To ask the professor for a deadline extension",
          "To discuss narrowing the focus of a research project",
          "To complain about the number of assigned readings",
          "To get permission to work for an energy cooperative"
        ],
        answer: 1,
        why: "Mahasiswa datang karena topik “solar energy” terlalu luas, lalu mengusulkan topik yang lebih spesifik (community solar garden dan rumah tangga berpendapatan rendah). Seluruh percakapan berpusat pada penyempitan topik riset.",
        notes: [
          "Tidak ada permintaan perpanjangan waktu; profesor justru memberi tenggat baru (Senin).",
          "",
          "Ia menyebut banyaknya artikel sebagai alasan bingung, bukan keluhan tentang bacaan wajib kuliah.",
          "Koperasi disebut sebagai sumber data, dan yang bekerja di sana adalah tetangganya, bukan dirinya."
        ]
      },
      {
        id: "l2q2", type: "detail",
        prompt: "What is the professor’s main concern about the student’s new topic?",
        options: [
          "It is too similar to other students’ topics.",
          "It may be difficult to obtain the data he needs.",
          "Community solar gardens are too new to study.",
          "His neighbor might give biased information."
        ],
        answer: 1,
        why: "Profesor berkata secara eksplisit: “My only concern is data. Where would your evidence come from?”",
        notes: [
          "Topik mahasiswa lain tidak pernah dibahas.",
          "",
          "Profesor justru menyebut topik ini menarik dan merupakan “genuine research question”; kebaruan tidak dianggap masalah.",
          "Profesor menjawab “Perfect” saat tetangga disebut; tidak ada kekhawatiran soal bias."
        ]
      },
      {
        id: "l2q3", type: "inference",
        prompt: "What will the student probably do first?",
        options: [
          "Interview his neighbor about the solar garden",
          "Start the application for ethics review",
          "Read more general articles about solar energy",
          "Take photographs of the solar garden"
        ],
        answer: 1,
        why: "Profesor menegaskan wawancara harus disetujui dewan etik lebih dulu (prosesnya sekitar seminggu) dan menyarankan “start the ethics form now”. Jadi langkah logis pertama adalah mengurus formulir etik.",
        notes: [
          "Wawancara belum boleh dilakukan sebelum ada persetujuan etik, jadi ini tidak mungkin menjadi langkah pertama.",
          "",
          "Ini justru masalah awalnya (topik terlalu luas); ia tidak akan kembali ke bacaan umum.",
          "Foto tidak pernah disebut dalam percakapan."
        ]
      }
    ]
  },
  {
    id: "l3",
    kind: "lecture",
    title: "Academic Lecture (Sains/Teknologi): Biomimicry in Engineering",
    context: "Listen to part of a lecture in an engineering class.",
    speakers: { W: { name: "Professor", gender: "F" }, M: { name: "Student", gender: "M" } },
    script: [
      { s: "N", t: "Listen to part of a lecture in an engineering class." },
      { s: "W", t: "Okay, so last time we talked about materials that fail under stress. Today I want to look at a design approach called biomimicry. Basically, it means solving human engineering problems by studying how living things have already solved similar ones. Evolution has had millions of years to test designs, so it makes sense to borrow from it." },
      { s: "W", t: "My favorite example comes from Japan. In the 1990s, engineers had a problem with the Shinkansen, the high speed bullet train. When the train entered a tunnel at high speed, it pushed a wall of air ahead of it. That air was compressed, and when it burst out of the other end of the tunnel, it created a loud boom. It was loud enough that people living nearby complained." },
      { s: "W", t: "Now, one of the engineers, Eiji Nakatsu, happened to be a bird watcher. And he asked himself: is there an animal that moves quickly from one medium into another, say from air into water, without making a splash? The answer was the kingfisher. The kingfisher dives into water to catch fish, and it barely disturbs the surface. Its beak is long and wedge shaped, so it gradually increases in width. That lets the water flow around it rather than being pushed ahead of it." },
      { s: "W", t: "So the engineers redesigned the nose of the train to imitate the kingfisher’s beak. And the results were impressive. The tunnel boom was largely eliminated, and the new train used about fifteen percent less electricity while traveling about ten percent faster." },
      { s: "M", t: "So, was the beak shape copied exactly?" },
      { s: "W", t: "Good question. No, and this is an important point. Biomimicry isn’t about copying nature exactly. The engineers ran simulations and tested many variations. The kingfisher gave them the principle, a gradual change in cross section, and then they optimized it for a train. Nature provides the starting idea, not the final blueprint." },
      { s: "W", t: "Let me give you one more quick example so you see the range. Lotus leaves stay clean even in muddy water, because their surface has tiny bumps covered with wax. Water droplets roll off and carry dirt with them. That principle has inspired self cleaning paints and glass. Again, the same pattern: observe the structure, understand why it works, then adapt it." }
    ],
    questions: [
      {
        id: "l3q1", type: "gist",
        prompt: "What is the lecture mainly about?",
        options: [
          "The history of high-speed rail in Japan",
          "Applying solutions found in living things to engineering problems",
          "How kingfishers evolved to catch fish",
          "Why tunnels amplify the sound of trains"
        ],
        answer: 1,
        why: "Profesor membuka dengan mendefinisikan biomimicry dan memberi dua contoh (kingfisher–Shinkansen, daun teratai–cat yang membersihkan diri sendiri). Topik utamanya adalah konsep biomimicry, bukan salah satu contoh saja.",
        notes: [
          "Shinkansen hanya contoh, bukan topik utama; sejarah kereta Jepang tidak dibahas.",
          "",
          "Kingfisher dibahas sebagai inspirasi desain, bukan dari sisi evolusi berburunya.",
          "Ledakan suara di terowongan adalah masalah dalam contoh, bukan fokus kuliah."
        ]
      },
      {
        id: "l3q2", type: "detail",
        prompt: "According to the professor, what problem did the redesigned train nose solve?",
        options: [
          "Trains had difficulty climbing steep hills.",
          "A loud boom occurred when trains exited tunnels.",
          "Birds frequently collided with the train.",
          "Passengers felt uncomfortable pressure changes."
        ],
        answer: 1,
        why: "Udara yang terkompresi di depan kereta keluar dari ujung terowongan dan menimbulkan “a loud boom”. Desain hidung baru “largely eliminated” masalah ini.",
        notes: [
          "Tanjakan tidak pernah disebut.",
          "",
          "Burung hanya sumber inspirasi; tidak ada masalah tabrakan burung.",
          "Perubahan tekanan terdengar masuk akal secara teknis, tetapi profesor hanya membahas kebisingan yang dikeluhkan warga sekitar, bukan kenyamanan penumpang."
        ]
      },
      {
        id: "l3q3", type: "function",
        prompt: "Why does the professor say: “Nature provides the starting idea, not the final blueprint”?",
        options: [
          "To stress that engineers adapt and test natural principles rather than copying them",
          "To suggest that the kingfisher-inspired design was ultimately a failure",
          "To criticize engineers who rely too heavily on nature",
          "To introduce the topic of the next lecture"
        ],
        answer: 0,
        why: "Kalimat ini menjawab pertanyaan mahasiswa apakah bentuk paruh disalin persis. Profesor menegaskan bahwa alam memberi prinsip awal, lalu insinyur menguji dan mengoptimalkannya.",
        notes: [
          "",
          "Desainnya justru berhasil (lebih hemat 15% dan lebih cepat 10%).",
          "Nada profesor positif terhadap biomimicry; tidak ada kritik.",
          "Profesor langsung melanjutkan dengan contoh daun teratai di kuliah yang sama, bukan memperkenalkan topik minggu depan."
        ]
      }
    ]
  },
  {
    id: "l4",
    kind: "lecture",
    title: "Academic Lecture (Sosial/Sejarah): The Erie Canal",
    context: "Listen to part of a lecture in a United States history class.",
    speakers: { M: { name: "Professor", gender: "M" }, W: { name: "Student", gender: "F" } },
    script: [
      { s: "N", t: "Listen to part of a lecture in a United States history class." },
      { s: "M", t: "Today we’re going to talk about a project that a lot of people at the time considered ridiculous: the Erie Canal. When it was proposed in the early eighteen hundreds, critics nicknamed it Clinton’s Ditch, after DeWitt Clinton, the New York governor who championed it. The plan was to dig a canal about three hundred and sixty three miles long, connecting the Hudson River near Albany with Lake Erie at Buffalo. Remember, this was before railroads. And the federal government refused to fund it, so New York State paid for it itself." },
      { s: "M", t: "Why was it such a big deal? Well, think about the geography. Before the canal, the Appalachian Mountains made it difficult and expensive to move goods between the East Coast and the interior. Shipping a ton of flour overland from Buffalo to New York City could cost around a hundred dollars and take weeks. After the canal opened in eighteen twenty five, the cost dropped to roughly ten dollars, and the trip took about eight or nine days." },
      { s: "W", t: "So it was mostly about cheaper shipping?" },
      { s: "M", t: "That was the immediate effect, yes. But the long term consequences were much broader. First, New York City became the dominant port in the country. Goods from the Great Lakes region flowed through it, so it outgrew rivals like Philadelphia and Boston. Second, the canal accelerated the settlement of the Midwest. Farmers in places like Ohio and Michigan could suddenly sell their crops in eastern markets, which made moving west far more attractive. And towns along the route, like Syracuse and Rochester, grew rapidly." },
      { s: "M", t: "There’s an irony here, though. Within a few decades, railroads began to take over much of the traffic. Trains were faster, and they didn’t freeze in winter, which the canal did. So you could say the canal’s greatest legacy wasn’t the waterway itself. It was the way it permanently shifted trade patterns, and those patterns stayed even after the technology changed." }
    ],
    questions: [
      {
        id: "l4q1", type: "detail",
        prompt: "According to the professor, how was the construction of the Erie Canal funded?",
        options: [
          "By the federal government",
          "By the state of New York",
          "By private railroad companies",
          "By merchants from Philadelphia and Boston"
        ],
        answer: 1,
        why: "Profesor menyatakan “the federal government refused to fund it, so New York State paid for it itself.”",
        notes: [
          "Pemerintah federal justru menolak mendanai. Jebakan karena kata “federal” disebut dalam audio.",
          "",
          "Kanal dibangun sebelum era kereta api; perusahaan kereta justru menjadi pesaing di kemudian hari.",
          "Philadelphia dan Boston disebut sebagai pelabuhan saingan yang kalah bersaing, bukan penyandang dana."
        ]
      },
      {
        id: "l4q2", type: "organization",
        prompt: "How does the professor organize his explanation of the canal’s importance?",
        options: [
          "He compares the canal with similar canals in Europe.",
          "He describes its immediate effect and then its broader long-term consequences.",
          "He lists the engineering problems in the order they were solved.",
          "He tells the story of the canal from the perspective of DeWitt Clinton."
        ],
        answer: 1,
        why: "Setelah mahasiswa bertanya apakah intinya hanya ongkos kirim murah, profesor menjawab “That was the immediate effect... But the long term consequences were much broader”, lalu menjelaskan dampak jangka panjang (New York jadi pelabuhan dominan, Midwest berkembang). Ini pola dampak langsung lalu dampak jangka panjang.",
        notes: [
          "Tidak ada perbandingan dengan kanal di Eropa.",
          "",
          "Masalah teknik pembangunan kanal tidak dibahas.",
          "Clinton hanya disebut sebagai asal julukan “Clinton’s Ditch”, bukan sudut pandang penceritaan."
        ]
      },
      {
        id: "l4q3", type: "inference",
        prompt: "What does the professor imply about the legacy of the Erie Canal?",
        options: [
          "It was ultimately a failure because railroads replaced it.",
          "Its effect on trade patterns lasted longer than its importance as a transport route.",
          "It should not have been built without federal support.",
          "It would still carry most freight today if it did not freeze in winter."
        ],
        answer: 1,
        why: "Profesor menyebut ironi: kereta api mengambil alih lalu lintas, tetapi “those patterns stayed even after the technology changed.” Artinya pengaruh kanal terhadap pola perdagangan lebih tahan lama daripada fungsinya sebagai jalur transportasi.",
        notes: [
          "Profesor tidak menyebutnya gagal; ia menyebut warisannya “greatest legacy”.",
          "",
          "Tidak ada penilaian bahwa kanal seharusnya tidak dibangun tanpa dana federal.",
          "Pembekuan di musim dingin hanya salah satu kelemahan; kereta juga lebih cepat. Kesimpulan ini terlalu jauh."
        ]
      }
    ]
  },
  {
    id: "l5",
    kind: "lecture",
    title: "Academic Lecture (Seni/Lingkungan): Spiral Jetty and Land Art",
    context: "Listen to part of a lecture in an art history class.",
    speakers: { W: { name: "Professor", gender: "F" }, M: { name: "Student", gender: "M" } },
    script: [
      { s: "N", t: "Listen to part of a lecture in an art history class." },
      { s: "W", t: "In the late nineteen sixties, a number of American artists became frustrated with the gallery system. They felt that art had turned into a product, something to be bought, sold, and hung on a wall. Their response was to leave the gallery altogether and make works directly in the landscape, often in remote places. This movement is usually called land art, or earth art." },
      { s: "W", t: "The most famous example is probably Spiral Jetty, created by Robert Smithson in nineteen seventy. It’s a coil of black basalt rock and earth, about fifteen hundred feet long, that extends from the shore into the Great Salt Lake in Utah. Smithson chose the site partly because of the water’s unusual color. In that part of the lake, salt tolerant bacteria and algae tint the water a reddish pink, so the dark spiral stands out dramatically." },
      { s: "M", t: "Why a spiral, though?" },
      { s: "W", t: "Smithson gave several explanations, which is very typical of him. One was a local legend that the lake was connected to the ocean by an underground channel that created a whirlpool. But the deeper idea relates to a concept he was obsessed with: entropy, the tendency of things to break down into disorder over time. Smithson didn’t want a permanent, unchanging monument. He wanted a work that would be shaped by natural forces." },
      { s: "W", t: "And that’s exactly what happened. Just a couple of years after it was built, the lake level rose, and the jetty stayed underwater for most of the next three decades. When drought lowered the water around the year two thousand, it reemerged, but it had changed. The black rocks were now encrusted with white salt crystals. Many visitors felt it was more beautiful than before." },
      { s: "W", t: "This raises an interesting question for conservation. Should we preserve land art in its original condition, or let nature continue to transform it? Smithson’s own writings suggest he would have accepted the change, since it’s consistent with his ideas about entropy. But today the lake is shrinking because of water diversion, and the jetty now sits far from the water’s edge, which some argue alters its meaning in a way he never intended." }
    ],
    questions: [
      {
        id: "l5q1", type: "detail",
        prompt: "According to the professor, why did land artists move away from galleries?",
        options: [
          "Galleries charged artists too much to exhibit.",
          "They believed art had become a commercial product.",
          "They wanted to conduct geological research.",
          "Museums refused to display very large works."
        ],
        answer: 1,
        why: "Profesor menjelaskan para seniman merasa “art had turned into a product, something to be bought, sold, and hung on a wall.”",
        notes: [
          "Biaya pameran tidak disebut.",
          "",
          "Mereka berkarya di alam, tetapi tujuannya artistik, bukan penelitian geologi.",
          "Tidak ada informasi bahwa museum menolak karya besar."
        ]
      },
      {
        id: "l5q2", type: "detail",
        prompt: "According to the professor, what concept was central to Smithson’s thinking about Spiral Jetty?",
        options: [
          "Permanence, the idea that art should last forever",
          "Entropy, the tendency of things to move toward disorder",
          "Symmetry, the balance found in natural forms",
          "A local legend about an underground whirlpool"
        ],
        answer: 1,
        why: "Profesor menyebut legenda pusaran air sebagai salah satu penjelasan, tetapi “the deeper idea relates to... entropy.” Kata “deeper” menandai gagasan yang lebih mendasar.",
        notes: [
          "Berlawanan dengan audio: Smithson “didn’t want a permanent, unchanging monument.”",
          "",
          "Simetri tidak pernah disebut.",
          "Legenda memang disebut, tetapi hanya sebagai salah satu penjelasan, bukan gagasan pokoknya. Ini pengecoh yang paling sering dipilih."
        ]
      },
      {
        id: "l5q3", type: "attitude",
        prompt: "What does the professor suggest about how Smithson would likely have viewed the salt-encrusted jetty?",
        options: [
          "He would have wanted it restored to its original appearance.",
          "He would probably have accepted the change as fitting his ideas.",
          "He would have preferred to move it into a gallery.",
          "He would have considered it ruined by visitors."
        ],
        answer: 1,
        why: "Profesor berkata “Smithson’s own writings suggest he would have accepted the change, since it’s consistent with his ideas about entropy.”",
        notes: [
          "Restorasi ke kondisi asli bertentangan dengan konsep entropi yang ia pegang.",
          "",
          "Ia justru meninggalkan galeri; memindahkan karya ke galeri bertentangan dengan gerakan land art.",
          "Perubahan disebabkan oleh naik turunnya air dan kristal garam, bukan pengunjung."
        ]
      }
    ]
  }
];
