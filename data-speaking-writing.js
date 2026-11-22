/* ============================================================
   BANK TASK SPEAKING & WRITING
   Speaking: window.TOEFL_BANK.speaking
     independent: { id, kind:"independent", title, prompt, prepTime, speakTime,
                    keywords, structure, pitfalls, sample }
     integrated : tambah subtype ("campus"|"academic"), reading:{time,title,text},
                  listening:{context, speakers, script}
   Writing: window.TOEFL_BANK.writing
     discussion : { id, kind:"discussion", title, course, professor:{name,post},
                    students:[{name,post}], time (detik), minWords, keywords, keyPoints, sample }
     integrated : { id, kind:"integrated", title, reading:{title, paragraphs},
                    lecture:{context, speakers, script}, prompt, time, minWords, maxWords,
                    keywords, keyPoints, sample }
   keywords dipakai untuk estimasi skor otomatis (cakupan poin kunci).
   ============================================================ */
window.TOEFL_BANK = window.TOEFL_BANK || {};
window.TOEFL_BANK.speaking = [
  {
    id: "s1",
    kind: "independent",
    title: "Independent 1: Required Online Course",
    prompt: "Do you agree or disagree with the following statement? University students should be required to take at least one course entirely online before they graduate. Use specific reasons and examples to support your answer.",
    prepTime: 15,
    speakTime: 45,
    keywords: ["agree", "online", "time", "deadline", "discipline", "manage", "remote", "work", "example", "skill", "company", "video"],
    structure: [
      "Kalimat 1: nyatakan posisi dengan tegas (I agree / I disagree that...). Jangan mengulang seluruh pertanyaan.",
      "Alasan 1 + penjelasan singkat (mis. melatih manajemen waktu & disiplin diri).",
      "Alasan 2 + contoh pribadi yang spesifik (nama mata kuliah, situasi, hasil).",
      "Satu kalimat penutup bila waktu masih tersisa ±5 detik."
    ],
    pitfalls: [
      "Intro terlalu panjang sehingga contoh terpotong waktu.",
      "Contoh terlalu umum (“many people say...”). Penilai mencari detail konkret.",
      "Berpindah posisi di tengah jawaban (setuju, lalu “but actually...”).",
      "Diam lebih dari 2–3 detik. Lebih baik gunakan filler alami seperti “What I mean is...”."
    ],
    sample: "I agree that students should take at least one fully online course before graduating, mainly because it prepares them for the way people actually work today. First, an online course forces you to manage your own time. There’s no professor reminding you about deadlines in person, so you have to plan your week and stay disciplined. Second, many companies now rely on remote collaboration. For example, last semester I took an online statistics course where we finished a group project entirely through shared spreadsheets and weekly video calls. At first it felt awkward, but by the end I was confident coordinating with people I’d never met face to face, and that’s a skill I’ll definitely need after graduation."
  },
  {
    id: "s2",
    kind: "independent",
    title: "Independent 2: Planned or Spontaneous Travel",
    prompt: "Some people prefer to plan every detail of a trip in advance. Others prefer to be spontaneous and decide what to do after they arrive. Which approach do you prefer, and why? Include details and examples in your explanation.",
    prepTime: 15,
    speakTime: 45,
    keywords: ["prefer", "plan", "advance", "money", "time", "cheaper", "book", "stress", "relax", "example", "trip", "ticket"],
    structure: [
      "Kalimat 1: pilih SATU pendekatan (I prefer to plan... / I’d rather be spontaneous...).",
      "Alasan 1: hemat waktu dan biaya, dengan detail angka atau situasi.",
      "Contoh nyata: perjalanan tertentu (tempat, siapa, apa hasilnya).",
      "Alasan 2 singkat: mengurangi stres / lebih menikmati perjalanan."
    ],
    pitfalls: [
      "Menjawab “both have advantages” tanpa memilih. Task independent menuntut posisi yang jelas.",
      "Contoh bersifat hipotetis (“if I go to Japan...”) padahal pengalaman nyata lebih meyakinkan.",
      "Terlalu banyak alasan (3–4) tetapi semuanya dangkal. Dua alasan yang berkembang lebih baik.",
      "Kecepatan bicara terlalu cepat sehingga pelafalan tidak jelas."
    ],
    sample: "Personally, I prefer to plan most of the details of a trip in advance. The main reason is that it saves both time and money. When I book transportation and accommodation early, prices are usually much lower, and I don’t waste the first day trying to find a place to stay. For instance, when my friends and I visited Yogyakarta last year, we reserved our guesthouse and train tickets a month ahead, and we paid almost thirty percent less than the walk-in rates. Another reason is that planning reduces stress. Because I’m not constantly worried about the next step, I can actually relax and enjoy the places I’m visiting."
  },
  {
    id: "s3",
    kind: "integrated",
    subtype: "campus",
    title: "Integrated (Campus): App-Only Campus Café",
    reading: {
      time: 45,
      title: "Campus Café Goes App-Only",
      text: "Beginning next semester, the Main Street Café will stop accepting cash and card payments at the counter. Instead, all orders must be placed and paid for in advance through the university’s dining app. Dining Services says the change will significantly shorten lines, since students’ food will be prepared before they arrive and they will simply pick it up. In addition, eliminating cash handling will reduce operating costs, allowing the café to keep its prices low for students."
    },
    listening: {
      context: "Now listen to two students discussing the announcement.",
      speakers: { M: { name: "Man", gender: "M" }, W: { name: "Woman", gender: "F" } },
      script: [
        { s: "N", t: "Now listen to two students discussing the announcement." },
        { s: "M", t: "Did you see the café is going app-only? Sounds kind of convenient." },
        { s: "W", t: "Convenient for some people, maybe. But I don’t think it’s going to do what they’re promising. Take the lines. Sure, you won’t wait to order. But at noon, when everyone gets out of class at the same time, hundreds of app orders will come in at once. The kitchen can only make food so fast. So instead of a line at the register, you’ll have a crowd standing around the pickup counter. That’s exactly what happened when the bookstore coffee shop tried it last year." },
        { s: "M", t: "Huh, I remember that. It was pretty packed." },
        { s: "W", t: "Right. And second, the whole plan assumes everyone has a working smartphone with them all the time. What if your phone’s dead? Or what about new international students who haven’t set up a local payment method yet? They just can’t eat there? Saving money on cash handling doesn’t help much if a bunch of students can’t even buy anything." },
        { s: "M", t: "That’s a fair point." }
      ]
    },
    prompt: "The woman expresses her opinion about the café’s new policy. Briefly summarize the policy. Then state her opinion and explain the reasons she gives for holding that opinion.",
    prepTime: 30,
    speakTime: 60,
    keywords: ["app", "advance", "lines", "shorter", "costs", "cash", "disagree", "noon", "kitchen", "pickup", "bookstore", "phone", "dead", "international", "payment"],
    structure: [
      "Ringkas kebijakan dalam 1–2 kalimat: apa yang berubah + 2 alasan resmi.",
      "Nyatakan sikap si wanita: she disagrees / she doesn’t think it’s a good idea.",
      "Alasan 1 + detail: pesanan menumpuk saat jam makan siang, antrean pindah ke counter (contoh kedai kopi toko buku).",
      "Alasan 2 + detail: tidak semua orang bisa memakai aplikasi (baterai habis, mahasiswa internasional).",
      "Kalimat penutup singkat bila waktu tersisa."
    ],
    pitfalls: [
      "Menghabiskan terlalu banyak waktu untuk merangkum bacaan. Fokus utama adalah pendapat si wanita.",
      "Memberikan opini pribadi. Task ini meminta laporan pendapat pembicara, bukan pendapat Anda.",
      "Lupa contoh pendukung (bookstore coffee shop) yang membuat jawaban lebih lengkap.",
      "Salah menyebut siapa yang berpendapat (the man vs the woman)."
    ],
    sample: "According to the announcement, the campus café will become app-only, so students will have to order and pay in advance through the dining app. The university says this will make lines shorter and lower costs by getting rid of cash handling. However, the woman disagrees with the plan for two reasons. First, she doesn’t think lines will really get shorter. At lunchtime, when classes end at the same time, hundreds of orders will arrive together, and the kitchen can’t prepare them that fast. So the crowd will just move from the register to the pickup counter, which is what happened at the bookstore coffee shop last year. Second, she points out that not everyone can use the app. If someone’s phone is dead, or an international student hasn’t set up a local payment method, they won’t be able to buy food at all. So in her view, the cost savings aren’t worth it."
  },
  {
    id: "s4",
    kind: "integrated",
    subtype: "academic",
    title: "Integrated (Academic): Warning Coloration",
    reading: {
      time: 45,
      title: "Aposematism",
      text: "Many animals avoid predators by blending into their surroundings. Some species, however, take the opposite approach. They display bright, conspicuous colors or bold patterns that make them easy to spot. This strategy, known as aposematism, or warning coloration, signals to predators that the animal is dangerous or unpleasant to eat, often because it is toxic or has a painful sting. After an unpleasant encounter, predators learn to associate the distinctive appearance with the bad experience and avoid similar-looking prey in the future."
    },
    listening: {
      context: "Now listen to part of a lecture on this topic in a biology class.",
      speakers: { W: { name: "Professor", gender: "F" } },
      script: [
        { s: "N", t: "Now listen to part of a lecture on this topic in a biology class." },
        { s: "W", t: "Let me give you two examples of how this works in nature. First, think about poison dart frogs, which live in the rainforests of Central and South America. These tiny frogs are brilliant blue, yellow, or red. You can see them from far away, which seems like a terrible idea for a small animal. But their skin contains powerful toxins. A snake or bird that tries to eat one gets sick very quickly. And here’s the key: the next time that predator sees a bright little frog, it leaves it alone. The color works like a label that says, don’t eat me." },
        { s: "W", t: "The second example is the monarch butterfly, the orange and black butterfly that many of you have probably seen. Monarch caterpillars feed on a plant called milkweed, which contains chemicals that are poisonous to many animals. The caterpillars store these chemicals in their bodies, and they’re still there when the caterpillar becomes a butterfly. In a famous experiment, researchers fed monarchs to blue jays. The birds ate one, then vomited soon afterward. After that single experience, many of the jays refused to touch monarchs at all. In fact, they would avoid them just from seeing that orange and black pattern." }
      ]
    },
    prompt: "Using the examples from the lecture, explain what warning coloration is and how it protects animals.",
    prepTime: 30,
    speakTime: 60,
    keywords: ["bright", "colors", "predators", "toxic", "poison", "dart", "frog", "skin", "monarch", "butterfly", "milkweed", "blue jay", "vomit", "avoid", "learn"],
    structure: [
      "Definisikan konsep dari bacaan dengan kata-kata sendiri (1–2 kalimat).",
      "Contoh 1 (poison dart frog): warna cerah + racun di kulit, predator sakit lalu menghindar.",
      "Contoh 2 (monarch butterfly): makan milkweed, racun tersimpan, blue jay muntah lalu menghindari pola oranye-hitam.",
      "Hubungkan kembali dengan konsep: predator belajar mengaitkan warna dengan pengalaman buruk."
    ],
    pitfalls: [
      "Hanya menjelaskan definisi tanpa menghubungkan ke contoh kuliah.",
      "Menyalin kata per kata dari bacaan (gunakan parafrase).",
      "Lupa menjelaskan langkah “learning” (predator belajar dari pengalaman). Ini inti konsepnya.",
      "Menyebut detail yang tidak ada di kuliah (mis. spesies lain)."
    ],
    sample: "The reading describes warning coloration, which is when an animal has bright, easy-to-see colors that tell predators it’s dangerous or bad to eat. After a bad experience, predators learn to connect that look with being sick, so they avoid it. The professor gives two examples. The first is the poison dart frog. Even though it’s tiny, it’s bright blue, yellow, or red, so it’s very visible. But its skin has strong toxins, so a snake or bird that eats one gets sick, and after that, the predator leaves these colorful frogs alone. The second example is the monarch butterfly. Its caterpillars eat milkweed, which is poisonous, and they keep the poison in their bodies. In an experiment, blue jays that ate a monarch threw up, and afterward many of them refused to eat monarchs just from seeing the orange and black pattern. So in both cases, the bright colors protect the animal by warning predators."
  },
  {
    id: "s5",
    kind: "integrated",
    subtype: "academic",
    title: "Integrated (Academic): Loss Leader Pricing",
    reading: {
      time: 45,
      title: "Loss Leader Pricing",
      text: "Retailers sometimes sell certain products at a price below what those products cost them. This strategy, known as loss leader pricing, may seem to make little economic sense. However, the goal is not to profit from the discounted item itself. Rather, the low price attracts customers into the store, where they are likely to purchase additional, full-priced items. As long as the profit from these additional purchases exceeds the loss on the discounted product, the strategy increases the business’s overall earnings."
    },
    listening: {
      context: "Now listen to part of a lecture on this topic in a business class.",
      speakers: { M: { name: "Professor", gender: "M" } },
      script: [
        { s: "N", t: "Now listen to part of a lecture on this topic in a business class." },
        { s: "M", t: "There’s a grocery store near my apartment that sells eggs for almost nothing. I’m pretty sure they lose money on every carton. But notice where the eggs are: all the way in the back corner of the store. So to get them, I walk past the fresh bread, the snacks, the coffee. And I almost never leave with just eggs. Last week I went in for a dozen eggs and walked out with about forty dollars’ worth of groceries. The store doesn’t care about losing a dollar on the eggs, because it made far more on everything else I bought." },
        { s: "M", t: "The same idea works in a completely different industry: video game consoles. When a company launches a new console, it often sells the machine for less than it costs to make. Sounds crazy, right? But once you own the console, you need games for it, and those games are where the company makes its money. They also sell online subscriptions and extra controllers. Over a few years, a typical player spends much more on games and services than the company lost on the console itself." }
      ]
    },
    prompt: "Using the examples from the lecture, explain the concept of loss leader pricing.",
    prepTime: 30,
    speakTime: 60,
    keywords: ["below", "cost", "attract", "customers", "eggs", "back", "store", "bread", "snacks", "forty", "console", "games", "subscriptions", "profit", "lose"],
    structure: [
      "Definisi: menjual produk di bawah biaya untuk menarik pelanggan yang lalu membeli barang lain berharga penuh.",
      "Contoh 1: telur murah diletakkan di bagian belakang toko, pelanggan melewati roti/snack, belanja ±$40.",
      "Contoh 2: konsol game dijual rugi, keuntungan dari game, langganan online, dan controller.",
      "Simpulkan: kerugian kecil tertutup keuntungan pembelian lain."
    ],
    pitfalls: [
      "Tidak menjelaskan MENGAPA telur diletakkan di belakang toko (strategi melewati produk lain).",
      "Lupa angka/detail spesifik ($40) yang memperkuat penjelasan.",
      "Menceritakan contoh tanpa menghubungkannya kembali ke definisi konsep.",
      "Memberikan kritik pribadi tentang strategi ini (tidak diminta)."
    ],
    sample: "The reading explains loss leader pricing. A store sells a product for less than it costs, not to make money on that item, but to bring customers in so they’ll buy other full-priced products. The professor gives two examples. First, a grocery store near his apartment sells eggs so cheaply that it probably loses money on them. But the eggs are in the back corner, so customers have to walk past bread, snacks, and coffee. He went in for eggs and spent about forty dollars, so the store easily made up for the loss. The second example is video game consoles. Companies often sell a new console below its production cost. However, owners then have to buy games, and they also pay for online subscriptions and extra controllers. Over several years, players spend far more on these than the company lost on the console. So in both cases, a small loss on one item leads to bigger overall profit."
  }
];

window.TOEFL_BANK.writing = [
  {
    id: "w1",
    kind: "discussion",
    title: "Academic Discussion: Car-Free Downtowns",
    course: "Urban Studies",
    professor: {
      name: "Dr. Okafor",
      post: "Over the next few weeks, we’ll look at how cities manage traffic and pollution. Several European cities have banned private cars from their historic downtown areas, allowing only pedestrians, bicycles, public transportation, and delivery vehicles. Supporters say these bans make city centers healthier and more pleasant; critics argue they hurt local businesses and make life harder for people who depend on cars. What do you think? Should more cities ban private cars from their downtown areas? Why or why not?"
    },
    students: [
      { name: "Claire", post: "I think more cities should do this. When cars are removed, the air gets cleaner almost immediately, and streets become safer for children and older people. In my hometown, the main square was closed to cars three years ago, and now it’s full of outdoor cafés and street markets. It feels like a completely different place." },
      { name: "Kenji", post: "I understand the environmental benefits, but a complete ban is too extreme. Not everyone can walk or cycle long distances. People with disabilities, parents with young kids, and workers carrying heavy equipment rely on their cars. If downtown becomes difficult to reach, they might stop going there, and shops would lose customers." }
    ],
    time: 600,
    minWords: 100,
    keywords: ["ban", "cars", "downtown", "public transportation", "business", "shops", "Kenji", "Claire", "example", "however", "because", "accessible", "transit"],
    keyPoints: [
      "Ambil posisi jelas sejak kalimat pertama (mendukung larangan, dengan syarat tertentu).",
      "Tambahkan ide BARU: larangan berhasil jika diiringi investasi transportasi umum dan pengecualian akses (bukan sekadar mengulang Claire).",
      "Tanggapi kekhawatiran Kenji secara langsung (aksesibilitas dan bisnis) dengan solusi konkret.",
      "Gunakan contoh spesifik (kota Pontevedra, Spanyol) sebagai bukti."
    ],
    sample: "I believe more cities should ban private cars from their downtown areas, but only if the ban is designed carefully. Kenji raises a valid concern about accessibility, yet I think his argument actually shows why the policy needs good planning rather than why it should be rejected. A successful ban should include exceptions for people with disabilities and frequent, affordable public transportation that connects the center to every neighborhood. When those conditions are met, businesses tend to benefit rather than suffer. For example, Pontevedra, a small city in Spain, removed most cars from its center in the late 1990s, and instead of emptying out, the area attracted new residents and shops because people enjoyed spending time there. In short, the real question is not whether to ban cars, but how to replace them with better options."
  },
  {
    id: "w2",
    kind: "discussion",
    title: "Academic Discussion: Remote Work vs. Office",
    course: "Business Management",
    professor: {
      name: "Dr. Lin",
      post: "Since 2020, many companies have allowed employees to work from home some or all of the time. Now some firms are requiring employees to return to the office full-time, arguing that in-person work improves collaboration and company culture. Others say remote work increases productivity and helps them hire talented people from anywhere. In your opinion, which policy is better for a company in the long run: requiring employees to work in the office, or allowing them to work remotely? Explain your reasoning."
    },
    students: [
      { name: "Marcus", post: "I’d choose remote work. Without a daily commute, employees have more time and energy, and many people get more focused work done at home. Plus, a company that allows remote work can hire the best person for the job even if they live in another city or country." },
      { name: "Priya", post: "I think the office is better, especially for new employees. During my internship, I learned the most from overhearing conversations and asking quick questions to people sitting near me. That kind of informal learning is really hard to replicate on a video call." }
    ],
    time: 600,
    minWords: 100,
    keywords: ["remote", "office", "company", "employees", "Priya", "Marcus", "mentor", "cost", "productivity", "for example", "however", "long run", "talent"],
    keyPoints: [
      "Pilih satu kebijakan secara tegas (remote, dengan struktur pendukung).",
      "Ide baru: penghematan biaya kantor bisa diinvestasikan ke program mentoring dan pertemuan rutin.",
      "Tanggapi argumen Priya (pembelajaran informal) dengan solusi, bukan diabaikan.",
      "Hubungkan ke “in the long run” sesuai pertanyaan dosen (retensi karyawan, biaya, talenta)."
    ],
    sample: "In my view, allowing remote work is the better long-term policy, although Priya makes an important point about how new employees learn. I agree that informal learning happens naturally in an office, but companies can design for it instead of forcing everyone back full-time. The money a company saves on office space can be reinvested in structured mentoring, such as pairing each new hire with an experienced colleague for daily video check-ins, and bringing teams together in person a few times a year. Meanwhile, the long-term benefits of remote work are hard to ignore. A firm that can hire from anywhere has access to a much larger pool of talent, and employees who avoid long commutes are often less likely to quit. Since replacing an employee is expensive, better retention alone can make remote work the smarter choice."
  },
  {
    id: "w3",
    kind: "discussion",
    title: "Academic Discussion: Plastic Bans vs. Education",
    course: "Environmental Science",
    professor: {
      name: "Dr. Rahman",
      post: "Plastic waste is one of the most visible environmental problems today, and governments have tried different approaches to reduce it. Some have banned single-use items such as plastic bags and straws. Others have focused on education campaigns that encourage people to reduce, reuse, and recycle voluntarily. Which approach do you think is more effective in reducing plastic waste: government bans or public education? Why?"
    },
    students: [
      { name: "Sofia", post: "Bans are definitely more effective. Education campaigns have been around for decades, and plastic use keeps rising. When my country banned plastic bags in supermarkets, people started bringing their own bags within a few months, because they simply had no other choice." },
      { name: "Ahmed", post: "I think education matters more. Bans only cover a few items, like bags and straws, but plastic is in almost everything we buy. If people don’t understand why plastic is harmful, they’ll just switch to other disposable products. Education changes habits for the long term." }
    ],
    time: 600,
    minWords: 100,
    keywords: ["ban", "education", "plastic", "producers", "companies", "packaging", "Ahmed", "Sofia", "regulation", "for example", "however", "habits", "effective"],
    keyPoints: [
      "Posisi: regulasi/larangan lebih efektif, tetapi diperluas ke produsen.",
      "Ide baru: tanggung jawab produsen atas kemasan (extended producer responsibility) menjawab kritik Ahmed bahwa larangan hanya mencakup sedikit barang.",
      "Bangun di atas bukti Sofia, tetapi jangan sekadar mengulangnya.",
      "Akui peran edukasi sebagai pelengkap untuk menunjukkan pemikiran yang seimbang."
    ],
    sample: "I agree with Sofia that government action is more effective than education alone, but I think Ahmed has identified the weakness of current bans: they target only a few visible items. The solution is not to give up on regulation but to aim it at producers instead of shoppers. Most plastic waste comes from packaging that consumers never chose, such as the wrapping on snacks or electronics. If companies were legally responsible for collecting and recycling the packaging they create, they would have a strong financial reason to design products with less plastic. This kind of rule changes thousands of products at once, which no education campaign could achieve. Education is still useful for explaining why these rules exist, but on its own it depends on millions of individual choices, while regulating producers changes the system itself."
  },
  {
    id: "w4",
    kind: "integrated",
    title: "Integrated Writing: Daylight Saving Time",
    reading: {
      title: "The Case for Daylight Saving Time",
      paragraphs: [
        "Daylight saving time (DST), the practice of setting clocks forward by one hour during the warmer months, has been adopted by many countries. Although it is sometimes criticized, there are several good reasons to continue the practice.",
        "First, DST saves energy. When clocks are moved forward, there is an extra hour of natural daylight in the evening, when most people are awake and active at home. As a result, households need less electric lighting, and total electricity consumption decreases. This was, in fact, one of the main reasons DST was introduced in the early twentieth century.",
        "Second, DST improves road safety. Evening hours, when people are commuting home from work, are among the most dangerous times on the road. Extra daylight during this period makes it easier for drivers to see pedestrians and other vehicles. Several studies have found that fatal accidents involving pedestrians decline when evenings are brighter.",
        "Third, DST benefits the economy. With more daylight after work, people are more likely to go shopping, eat at restaurants, and take part in outdoor activities such as golf. Business groups representing retailers and the leisure industry have long supported DST because it increases consumer spending."
      ]
    },
    lecture: {
      context: "Now listen to part of a lecture on the topic you just read about.",
      speakers: { M: { name: "Professor", gender: "M" } },
      script: [
        { s: "N", t: "Now listen to part of a lecture on the topic you just read about." },
        { s: "M", t: "The arguments in the reading might have made sense a hundred years ago, but recent evidence doesn’t really support them." },
        { s: "M", t: "Let’s start with energy. Lighting used to account for a big share of household electricity. But today, lighting is a small part of energy use, especially with efficient LED bulbs. What matters more now is heating and air conditioning. A large study in the state of Indiana, which adopted daylight saving time statewide in two thousand six, actually found that household electricity use went up slightly, by about one percent. Why? Because extra evening daylight in summer means more air conditioning in the hot late afternoon, and darker mornings mean more heating in spring and fall. So any savings on lighting were canceled out." },
        { s: "M", t: "Second, safety. Yes, brighter evenings may help a little. But the reading ignores what happens when the clocks change. In the days right after the spring transition, when people lose an hour of sleep, studies have found a noticeable rise in traffic accidents, because drivers are tired. And darker mornings mean children walking to school in the dark. So the overall safety benefit is questionable at best." },
        { s: "M", t: "Finally, the economy. The reading assumes that extra daylight makes people spend more money. But mostly, people just shift their spending. Money spent on an evening round of golf is often money that would have been spent on something else, like a movie on the weekend. Total spending doesn’t really grow, it just moves around. Meanwhile, the switch itself has real costs, like lower productivity from tired workers on the Monday after the change. Some economists estimate these costs at hundreds of millions of dollars a year in the United States alone." }
      ]
    },
    prompt: "Summarize the points made in the lecture, being sure to explain how they cast doubt on the specific points made in the reading passage.",
    time: 1200,
    minWords: 150,
    maxWords: 225,
    keywords: ["lecture", "reading", "energy", "lighting", "air conditioning", "heating", "Indiana", "percent", "accidents", "sleep", "mornings", "spending", "shift", "productivity", "however", "contradicts"],
    keyPoints: [
      "Poin 1 – Energi: pencahayaan kini kecil porsinya; studi Indiana menunjukkan konsumsi listrik naik ±1% karena AC dan pemanas. Membantah klaim hemat energi.",
      "Poin 2 – Keselamatan: kecelakaan naik setelah transisi musim semi (kurang tidur) + pagi lebih gelap bagi anak sekolah. Membantah klaim jalan lebih aman.",
      "Poin 3 – Ekonomi: belanja hanya berpindah, tidak bertambah; ada biaya produktivitas ratusan juta dolar. Membantah klaim manfaat ekonomi.",
      "Struktur ideal: 1 paragraf pembuka + 3 paragraf isi (lecture vs reading), tanpa opini pribadi."
    ],
    sample: "The reading claims that daylight saving time is beneficial because it saves energy, improves road safety, and boosts the economy. However, the lecturer argues that recent evidence casts doubt on each of these points.\n\nFirst, the lecturer challenges the idea that DST saves energy. While lighting was once a major part of household electricity use, it is now relatively minor, especially with LED bulbs. Heating and air conditioning matter far more. In fact, a study in Indiana found that electricity use rose by about one percent after DST was adopted, because people used more air conditioning on bright summer evenings and more heating on dark mornings.\n\nSecond, the lecturer questions the safety argument. Although brighter evenings may help slightly, accidents increase in the days after the spring clock change because drivers have lost sleep. Darker mornings also force children to walk to school in the dark.\n\nFinally, the lecturer disputes the economic benefit. Rather than increasing total spending, extra daylight simply shifts it from one activity to another, such as from weekend movies to evening golf. Moreover, the time change itself reduces productivity, costing the United States hundreds of millions of dollars each year."
  },
  {
    id: "w5",
    kind: "integrated",
    title: "Integrated Writing: Is the Voynich Manuscript a Hoax?",
    reading: {
      title: "The Voynich Manuscript: A Clever Hoax",
      paragraphs: [
        "The Voynich manuscript is a book of about 240 pages filled with handwritten text in an unknown script and strange illustrations of plants, stars, and human figures. Since it was brought to public attention in 1912 by the book dealer Wilfrid Voynich, cryptographers and linguists have failed to decipher it. Many researchers now believe the reason is simple: the text is meaningless, and the manuscript is a hoax.",
        "First, the script does not match any known language. Despite more than a century of effort by expert codebreakers, including some who broke military codes during the Second World War, no one has identified a single word with confidence. If the text represented a real language, at least some progress should have been made by now.",
        "Second, the text contains patterns that are highly unusual for natural language. Certain words are repeated two or three times in a row, and many words differ from one another by only a single letter. Such repetitiveness suggests that the words were produced mechanically, for example by copying from a table, rather than written to communicate meaning.",
        "Third, many of the illustrated plants do not correspond to any species known to botanists. This suggests that the creator simply invented the images to make the book look like a valuable scientific or medical text that could be sold to a wealthy collector. Some even suspect that Voynich himself produced the manuscript."
      ]
    },
    lecture: {
      context: "Now listen to part of a lecture on the topic you just read about.",
      speakers: { W: { name: "Professor", gender: "F" } },
      script: [
        { s: "N", t: "Now listen to part of a lecture on the topic you just read about." },
        { s: "W", t: "Calling the Voynich manuscript a hoax is tempting, because it explains everything at once. But when you look closely, each argument in the reading has serious problems." },
        { s: "W", t: "First, the fact that nobody has deciphered it doesn’t mean the text is meaningless. Some ancient scripts took decades to crack. And when researchers analyze the text statistically, it behaves like a real language. In every natural language, a few words are used very often and most words are rare, following a pattern called Zipf’s law. The Voynich text follows that pattern. Also, certain words appear mostly in the plant section and others mostly in the astronomy section, just as a real book would use different vocabulary for different topics. A random hoax would be very unlikely to show that kind of structure." },
        { s: "W", t: "Second, repetition isn’t actually unusual. Many real languages repeat words on purpose. In Indonesian and Malay, for example, repeating a word can make it plural, like anak anak, meaning children. And words that differ by just one letter are common in languages with lots of grammatical endings, like Latin, where a single noun can have many slightly different forms." },
        { s: "W", t: "Finally, the plants. In two thousand nine, scientists used radiocarbon dating on the manuscript’s pages, which are made of animal skin, and dated them to the early fourteen hundreds. That essentially rules out Voynich himself as the author. And medieval plant drawings were often inaccurate. Artists copied from earlier copies, simplified the shapes, and sometimes combined parts of different plants. So unrecognizable plants are exactly what we might expect from a genuine book of that period." }
      ]
    },
    prompt: "Summarize the points made in the lecture, being sure to explain how they cast doubt on the specific points made in the reading passage.",
    time: 1200,
    minWords: 150,
    maxWords: 225,
    keywords: ["lecture", "reading", "hoax", "decipher", "statistically", "Zipf", "sections", "vocabulary", "repetition", "Indonesian", "Latin", "endings", "radiocarbon", "1400s", "medieval", "copied", "however"],
    keyPoints: [
      "Poin 1 – Belum terpecahkan ≠ tak bermakna: teks mengikuti hukum Zipf dan kosakata berkelompok per bagian. Membantah poin “tidak cocok dengan bahasa mana pun”.",
      "Poin 2 – Repetisi wajar: reduplikasi (anak-anak) dan akhiran gramatikal seperti Latin. Membantah poin pola tidak alami.",
      "Poin 3 – Penanggalan radiokarbon awal 1400-an menggugurkan tuduhan bahwa Voynich pemalsunya; gambar tanaman abad pertengahan memang sering tidak akurat. Membantah poin ilustrasi palsu.",
      "Hindari menyalin kalimat bacaan; gunakan frasa penghubung “The lecturer refutes/challenges...”."
    ],
    sample: "The reading argues that the Voynich manuscript is a hoax because its script matches no known language, its text is unnaturally repetitive, and its plants are invented. The lecturer, however, challenges each of these claims.\n\nFirst, she explains that failing to decipher the text does not prove it is meaningless, since some ancient scripts took decades to decode. Statistical analysis shows that the manuscript follows Zipf’s law, as all natural languages do, and that certain words cluster in specific sections, just as a real book uses topic-specific vocabulary. A random hoax would be unlikely to have such structure.\n\nSecond, the lecturer points out that repetition is normal in many languages. Indonesian and Malay, for instance, repeat words to form plurals, and languages with many grammatical endings, such as Latin, naturally produce words that differ by a single letter.\n\nFinally, she casts doubt on the claim that the plants were invented to fool a buyer. Radiocarbon dating in 2009 placed the pages in the early 1400s, which rules out Voynich as the forger. Moreover, medieval artists often copied and simplified earlier drawings, so unrecognizable plants are exactly what one would expect from an authentic manuscript of that era."
  }
];
