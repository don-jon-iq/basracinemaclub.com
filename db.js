const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'cinema.db');

function getDb() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}

function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS seasons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      country TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'regular',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS films (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      season_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      director TEXT NOT NULL,
      year_decade TEXT NOT NULL,
      description TEXT NOT NULL,
      poster_image TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS directors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      season_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      bio TEXT NOT NULL,
      portrait_image TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS director_films (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      director_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      year TEXT NOT NULL,
      description TEXT NOT NULL,
      poster_image TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (director_id) REFERENCES directors(id) ON DELETE CASCADE
    );
  `);

  // Seed admin if not exists
  const adminExists = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin');
  if (!adminExists) {
    const hash = bcrypt.hashSync('basracinema2024', 10);
    db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', hash);
  }

  // Seed data if no seasons exist
  const seasonCount = db.prepare('SELECT COUNT(*) as count FROM seasons').get();
  if (seasonCount.count === 0) {
    seedData(db);
  }

  db.close();
}

function seedData(db) {
  const insertSeason = db.prepare(
    'INSERT INTO seasons (title, country, description, type, sort_order) VALUES (?, ?, ?, ?, ?)'
  );
  const insertFilm = db.prepare(
    'INSERT INTO films (season_id, title, director, year_decade, description, poster_image, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const insertDirector = db.prepare(
    'INSERT INTO directors (season_id, name, bio, portrait_image, sort_order) VALUES (?, ?, ?, ?, ?)'
  );
  const insertDirFilm = db.prepare(
    'INSERT INTO director_films (director_id, title, year, description, poster_image, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const seedAll = db.transaction(() => {
    // Season 1 — American Cinema
    const s1 = insertSeason.run(
      'American Cinema', 'American Cinema',
      'American cinema has played a pivotal role in shaping the global film industry. From classic Hollywood masterpieces to groundbreaking independent films, it has consistently pushed boundaries — leaving an indelible mark on the art form.',
      'regular', 1
    );
    const s1Films = [
      ['Citizen Kane', 'Orson Welles', '1940s', "Following the death of publishing tycoon Charles Foster Kane, reporters scramble to uncover the meaning of his final utterance: 'Rosebud.'", 'img/season-1-img/citzen.jpg'],
      ['Vertigo', 'Alfred Hitchcock', '1950s', 'A former detective wrestling with personal demons becomes obsessed with the hauntingly beautiful woman he has been hired to trail.', 'img/season-1-img/vertgo.jpg'],
      ['2001: A Space Odyssey', 'Stanley Kubrick', '1960s', 'After uncovering a mysterious artifact beneath the Lunar surface, a spacecraft is sent to Jupiter — manned by two men and the supercomputer H.A.L.', 'img/season-1-img/download (2).jpg'],
      ['Apocalypse Now', 'Francis Ford Coppola', '1970s', 'A U.S. Army officer in Vietnam is tasked with assassinating a renegade Special Forces Colonel who sees himself as a god.', 'img/season-1-img/apocalypse now.jpg'],
      ['Taxi Driver', 'Martin Scorsese', '1970s', 'A mentally unstable veteran works as a nighttime taxi driver in New York City, where the decadence and sleaze fuels his urge for violent action.', 'img/season-1-img/images.jpg'],
      ['Blade Runner', 'Ridley Scott', '1980s', 'A blade runner must pursue and terminate four replicants who stole a ship in space and have returned to Earth to find their creator.', 'img/season-1-img/blade runner.jpg'],
      ['Love Streams', 'John Cassavetes', '1980s', 'Two closely bound, emotionally wounded souls reunite after years apart.', 'img/season-1-img/love streams.jpg'],
      ['The Thin Red Line', 'Terrence Malick', '1990s', "Adaptation of James Jones' autobiographical 1962 novel, focusing on the conflict at Guadalcanal during the Second World War.", 'img/season-1-img/the thin red line.jpg'],
      ['Dead Man', 'Jim Jarmusch', '1990s', 'On the run after murdering a man, accountant William Blake encounters a strange man named Nobody who prepares him for his journey into the spiritual world.', 'img/season-1-img/dead man.jpg'],
      ['There Will Be Blood', 'Paul Thomas Anderson', '2007', 'A story of family, religion, hatred, oil and madness — focusing on a turn-of-the-century prospector in the early days of the business.', 'img/season-1-img/there will be blood.jpg'],
      ['The Tree of Life', 'Terrence Malick', '2000s', "The story of a family in Waco, Texas in 1956. The eldest son witnesses the loss of innocence and struggles with his parents' conflicting teachings.", 'img/season-1-img/the tree of life.jpg'],
    ];
    s1Films.forEach((f, i) => insertFilm.run(s1.lastInsertRowid, f[0], f[1], f[2], f[3], f[4], i + 1));

    // Season 2 — Iranian Cinema
    const s2 = insertSeason.run(
      'Iranian Cinema', 'Iranian Cinema',
      'Iranian cinema holds significant importance in the global film landscape, captivating audiences with its unique storytelling and artistic expression that speaks directly to the Iraqi soul.',
      'regular', 2
    );
    const s2Films = [
      ['The Cow', 'Dariush Mehrjui', '1969', 'A seminal film exploring loss and identity through the psychological transformation of a villager who assumes the persona of his cherished cow.', 'img/season-2-img/the cow.jpg'],
      ['The Cyclist', 'Mohsen Makhmalbaf', '1989', 'The relentless struggle of a cyclist trying to support his family in a war-torn landscape — a profound reflection on the human spirit and resilience.', 'img/season-2-img/the cyclist.jpg'],
      ['A Moment of Innocence', 'Mohsen Makhmalbaf', '1996', 'A captivating film that blurs the boundaries between reality and fiction, bringing together actual participants of a violent incident to reinterpret the event.', 'img/season-2-img/A moment of inocence.jpg'],
      ['The Circle', 'Jafar Panahi', '2000', 'A gripping film that exposes the harsh realities faced by women in a patriarchal society — a powerful exploration of gender inequality.', 'img/season-2-img/the Circle.jpg'],
      ['Crimson Gold', 'Jafar Panahi', '2003', 'A compelling film exploring the impact of socio-economic disparities and poverty in Tehran — a thought-provoking commentary on social injustice.', 'img/season-2-img/crimson gold.jpg'],
      ['About Elly', 'Asghar Farhadi', '2009', 'A gripping drama exploring the consequences of secrets and lies within a group of friends during a weekend trip, delving into the fragility of trust.', 'img/season-2-img/about elly.jpg'],
      ['There is No Evil', 'Mohammad Rasoulof', '2020', 'An anthology of interconnected stories examining moral dilemmas faced by individuals in a repressive society — questioning power, authority, and individual agency.', 'img/season-2-img/there is no evil.jpg'],
    ];
    s2Films.forEach((f, i) => insertFilm.run(s2.lastInsertRowid, f[0], f[1], f[2], f[3], f[4], i + 1));

    // Season 3 — Japanese Cinema
    const s3 = insertSeason.run(
      'Japanese Cinema', 'Japanese Cinema',
      'A carefully curated journey into the world of Japanese cinema — intricate visuals, profound emotions, and masterful storytelling that transcends culture and era.',
      'regular', 3
    );
    const s3Films = [
      ['Rashomon', 'Akira Kurosawa', '1950', 'A groundbreaking exploration of multiple perspectives on a crime, challenging the audience\'s perception of truth and human nature.', 'img/season-3-img/Rashomon.png'],
      ['Tokyo Story', 'Yasujirō Ozu', '1953', 'An elderly couple visits their busy adult children in Tokyo — a poignant masterpiece on generational gap, changing values, and the universal themes of love and loss.', 'img/season-3-img/Tokyo Story.webp'],
      ['Harakiri', 'Masaki Kobayashi', '1962', 'A searing critique of the samurai code and feudal hierarchy — themes of honor, duty, and maintaining integrity in the face of oppressive systems.', 'img/season-3-img/Harakiri.jpg'],
      ['Ugetsu', 'Kenji Mizoguchi', '1953', 'Reality and the supernatural intertwine to explore the price of ambition and the destructive nature of desire — a profound meditation on the human condition.', 'img/season-3-img/Ugetsu.jpg'],
      ['Sansho the Bailiff', 'Kenji Mizoguchi', '1954', 'A family torn apart by social injustice and their enduring struggle for reunion — a powerful condemnation of oppression and an ode to resilience.', 'img/season-3-img/Sansho the Bailiff.jpg'],
      ['Seven Samurai', 'Akira Kurosawa', '1954', 'Regarded as one of the greatest films ever made — skilled samurai defending a village, showcasing masterful storytelling and dynamic action sequences.', 'img/season-3-img/Seven_Samurai_poster2.webp'],
      ['Ran', 'Akira Kurosawa', '1985', 'Shakespeare\'s "King Lear" set in feudal Japan — power, betrayal, and the destructive consequences of unchecked ambition in breathtaking cinematography.', 'img/season-3-img/ran.jpg'],
    ];
    s3Films.forEach((f, i) => insertFilm.run(s3.lastInsertRowid, f[0], f[1], f[2], f[3], f[4], i + 1));

    // Season 4 — Palestinian Cinema
    const s4 = insertSeason.run(
      'The Palestinian Case', 'Palestinian Cinema',
      'Films offering a diverse and compelling exploration of the Israeli-Palestinian conflict — delving into the personal, psychological, and societal complexities on both sides.',
      'regular', 4
    );
    const s4Films = [
      ['Paradise Now', 'Hany Abu-Assad', '2005', 'The lives of two Palestinian friends recruited as suicide bombers — a thought-provoking exploration of psychological and moral complexities of the conflict.', 'img/season-4-img/Paradise Now.jpg'],
      ['Waltz with Bashir', 'Ari Folman', '2008', 'Through innovative animation, the director journeys to recover repressed memories from the 1982 Lebanon War — confronting trauma, collective memory, and the search for truth.', 'img/season-4-img/Waltz with Bashir.jpg'],
      ['The Time That Remains', 'Elia Suleiman', '2009', 'Palestinian experiences from 1948 to the present — blending humor and melancholy in a poignant reflection on identity, dignity, and survival.', 'img/season-4-img/The Time That Remains.jpg'],
      ['Omar', 'Hany Abu-Assad', '2013', 'A young Palestinian baker entangled in a web of surveillance, betrayal, and resistance — the complexities of living under occupation.', 'img/season-4-img/Omar.jpg'],
      ['Foxtrot', 'Samuel Maoz', '2017', 'Three interconnected narratives exploring the impact of war and grief on an Israeli family — a searing critique of the human cost of war.', 'img/season-4-img/Foxtrot.jpg'],
      ['Lebanon', 'Samuel Maoz', '2009', 'Set entirely within an Israeli tank during the 1982 Lebanon War — a harrowing portrayal of the realities of war and the psychological toll of armed conflict.', 'img/season-4-img/lebanon.jpg'],
    ];
    s4Films.forEach((f, i) => insertFilm.run(s4.lastInsertRowid, f[0], f[1], f[2], f[3], f[4], i + 1));

    // Season 5 — Director's Retrospective
    const s5 = insertSeason.run(
      "Director's Retrospective", "Director's Retrospective",
      "Deep dives into the complete visions of cinema's greatest auteurs — each retrospective a journey through a filmmaker's world.",
      'director-retrospective', 5
    );

    const directorsData = [
      {
        name: 'Béla Tarr',
        bio: 'A mesmerizing retrospective of this visionary filmmaker whose long takes and philosophical depth redefined what cinema can be.',
        portrait: 'img/season-5-img/Bela Tarr.jpg',
        films: [
          ['Werckmeister Harmonies', '2000', 'A haunting journey through a Hungarian village — alienation, power, and the human condition.', 'img/season-5-img/Werckmeister Harmonies.jpg'],
          ['The Turin Horse', '2011', "A father and daughter facing the relentless hardship of existence — Tarr's atmospheric masterwork.", 'img/season-5-img/The Turin Horse.jpg'],
        ]
      },
      {
        name: 'Apichatpong Weerasethakul',
        bio: "The captivating world of Thailand's most visionary filmmaker — where memory, reincarnation, and the spiritual converge.",
        portrait: 'img/season-5-img/Apichatpong  Weerasethakul .png',
        films: [
          ['Uncle Boonmee', '2010', 'A transcendent cinematic experience exploring memory, reincarnation, and the mystical realms of existence.', 'img/season-5-img/ Uncle Boonmee Who Can Recall His Past Lives.jpg'],
        ]
      },
      {
        name: 'Cristian Mungiu',
        bio: "Romania's acclaimed filmmaker whose unflinching realism confronts moral complexity, institutional power, and the weight of history.",
        portrait: 'img/season-5-img/Cristian Mungiu.webp',
        films: [
          ['4 Months, 3 Weeks and 2 Days', '2007', 'A harrowing, intimate portrayal of two women navigating illegal abortion in communist Romania.', 'img/season-5-img/4 Months, 3 Weeks and 2 Days.png'],
          ['Beyond the Hills', '2012', 'Faith, friendship, and institutional power — a haunting exploration of a religious community.', 'img/season-5-img/Beyond the Hills.jpg'],
        ]
      },
      {
        name: 'Nuri Bilge Ceylan',
        bio: "Turkey's master of contemplative cinema — exquisite visuals, rich character development, and profound philosophical reflections.",
        portrait: 'img/season-5-img/Nuri Bilge Ceylan.webp',
        films: [
          ['Once Upon a Time in Anatolia', '2011', 'A mesmerizing exploration of a night-long investigation in the Turkish countryside — truth, identity, the human condition.', 'img/season-5-img/Once Upon a Time in Anatolia.jpg'],
          ['The Wild Pear Tree', '2018', 'A young writer confronts his ambitions, family dynamics, and the search for meaning in life.', 'img/season-5-img/The Wild Pear Tree.jpg'],
        ]
      },
      {
        name: 'Michael Haneke',
        bio: "Austria's most provocative filmmaker — meticulous craftsmanship and unflinching examinations of human nature that provoke deep introspection.",
        portrait: 'img/season-5-img/Michael Haneke.jpg',
        films: [
          ['The White Ribbon', '2009', 'A rural German village on the eve of WWI — power, repression, and the origins of evil.', 'img/season-5-img/The White Ribbon.png'],
          ['Amour', '2012', 'An elderly couple facing the challenges of aging and mortality — love, compassion, human fragility.', 'img/season-5-img/Amour.jpg'],
        ]
      },
      {
        name: 'Wong Kar-wai',
        bio: "Hong Kong's poet of longing — exquisite cinematography and exploration of memory, desire, and the complexities of human relationships.",
        portrait: 'img/season-5-img/wong.jpg',
        films: [
          ['In the Mood for Love', '2000', 'A visually stunning tale of unrequited love and longing, set in 1960s Hong Kong.', 'img/season-5-img/ In the Mood for Love.jpg'],
          ['Chungking Express', '1994', 'Two distinct love stories in the bustling streets of Hong Kong — urban loneliness and fleeting connections.', 'img/season-5-img/Chungking Express.jpg'],
        ]
      },
      {
        name: 'Werner Herzog',
        bio: "Germany's most audacious filmmaker — stunning visuals, exploration of human ambition, and existential themes that push cinema to its limits.",
        portrait: 'img/season-5-img/Werner Herzog.webp',
        films: [
          ['Aguirre, the Wrath of God', '1972', "Obsession and power as a conquistador's quest for El Dorado leads to madness in the Amazon.", 'img/season-5-img/Aguirre, the Wrath of God.jpg'],
          ['Fitzcarraldo', '1982', "A man's audacious mission to haul a steamship over a mountain in pursuit of his grand vision.", 'img/season-5-img/Fitzcarraldo.jpg'],
        ]
      },
    ];

    directorsData.forEach((d, i) => {
      const dirResult = insertDirector.run(s5.lastInsertRowid, d.name, d.bio, d.portrait, i + 1);
      d.films.forEach((f, j) => insertDirFilm.run(dirResult.lastInsertRowid, f[0], f[1], f[2], f[3], j + 1));
    });
  });

  seedAll();
}

module.exports = { getDb, initDb };
