import type { Badge, Metrics, ParsedMessage, TeaserMetrics } from "./types";

// More precise love regex - require exact matches to avoid false positives
const LOVE_REGEX = /\b(te amo|te quiero|te adoro)\b/gi;
const AFFECTION_REGEX = /\b(beso|besos|cariño|amor|mi vida|hermosa|hermoso|guapo|guapa|linda|lindo|mi cielo|mi rey|mi reina)\b/gi;

const POSITIVE_WORDS = new Set(["bien", "bueno", "genial", "excelente", "feliz", "contento", "gracias", "si", "ok", "jaja", "haha", "amor", "lindo", "perfecto", "increíble", "maravilloso"]);
const NEGATIVE_WORDS = new Set(["mal", "malo", "triste", "no", "odio", "feo", "horrible", "terrible", "mierda", "puta", "estupido"]);

const EMOJI_REGEX = /\p{Extended_Pictographic}/gu;
const LAUGH_REGEX = /\b(jaja|haha|jeje|lol|ksks)\b/gi;

function initHeatmap(): number[][] {
  return Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
}

function computeBadges(metrics: Metrics): Badge[] {
  const badges: Badge[] = [];
  const participants = metrics.participants;

  // 1. Iniciador Crónico
  const totalInitiations = Object.values(metrics.dailyInitiators).reduce((sum, v) => sum + v, 0);
  const [topInitiator, initCount] = Object.entries(metrics.dailyInitiators).sort((a, b) => b[1] - a[1])[0] || ["", 0];
  if (topInitiator && totalInitiations > 0 && initCount / totalInitiations > 0.6) {
    badges.push({ badge: "Iniciador Crónico", user: topInitiator, description: "Siempre da el primer paso" });
  }

  // 2. El Bromista (Laugh Meter)
  const [topLaugher, laughCount] = Object.entries(metrics.laughMeter).sort((a, b) => b[1] - a[1])[0] || ["", 0];
  if (topLaugher && laughCount > 10) {
    badges.push({ badge: "El Bromista", user: topLaugher, description: "Se ríe de todo" });
  }

  // 3. El Monólogo (Longest Monologue)
  const [monologuer, monoCount] = Object.entries(metrics.longestMonologue).sort((a, b) => b[1] - a[1])[0] || ["", 0];
  if (monologuer && monoCount > 5) {
    badges.push({ badge: "El Monólogo", user: monologuer, description: "Escribe biblias" });
  }

  // 4. Búho Nocturno (Night Owl)
  const [nightOwl, nightCount] = Object.entries(metrics.nightOwl).sort((a, b) => b[1] - a[1])[0] || ["", 0];
  const totalNight = Object.values(metrics.nightOwl).reduce((sum, v) => sum + v, 0);
  if (nightOwl && totalNight > 20 && nightCount / totalNight > 0.6) {
    badges.push({ badge: "Búho Nocturno", user: nightOwl, description: "Vive de noche" });
  }

  // 5. El Seco (Chat Dryness - lowest words per msg)
  const [dryUser, dryAvg] = Object.entries(metrics.chatDryness).sort((a, b) => a[1] - b[1])[0] || ["", 0];
  if (dryUser && dryAvg < 4) {
    badges.push({ badge: "El Seco", user: dryUser, description: "Respuestas cortas" });
  }

  // 6. Ghosting Alert (Slowest Responder)
  const slowResponder = metrics.responseTimes.find((entry) => entry.avgMinutes > 180);
  if (slowResponder) {
    badges.push({ badge: "Ghosting Alert", user: slowResponder.user, description: "Tarda años en responder" });
  }

  // 7. Te Amo Warrior
  if (metrics.loveCount >= 5) {
    badges.push({ badge: "Te Amo Warrior", user: "Ambos", description: "Mucho amor en el chat" });
  }

  // 8. Weekend Warrior
  const [weekendUser, weekendCount] = Object.entries(metrics.weekendWarrior).sort((a, b) => b[1] - a[1])[0] || ["", 0];
  const totalWeekend = Object.values(metrics.weekendWarrior).reduce((sum, v) => sum + v, 0);
  if (weekendUser && totalWeekend > 20 && weekendCount / totalWeekend > 0.6) {
    badges.push({ badge: "Weekend Warrior", user: weekendUser, description: "Vive el fin de semana" });
  }

  return badges;
}

const GM_REGEX = /\b(buenos dias|buen dia|bd|buenos días|buen día)\b/i;
const NICKNAMES_LIST = ["amor", "bebe", "bebé", "vida", "cielo", "gordi", "gordo", "gorda", "chanchi", "rey", "reina", "linda", "lindo"];

const AUDIO_REGEX = /(audio|PTT) (omitted|omitido)/i;
const YOYO_REGEX = /\b(yo|mi|me|mío)\b/gi;
const PARDON_REGEX = /\b(perdon|perdón|lo siento|disculpa|mala mia)\b/gi;
const KILLER_WORDS = new Set(["ok", "k", "jaja", "haha", "lol", "👍", "bueno"]);

// Phase 3 Regex
const DELETED_REGEX = /(message.*deleted|mensaje.*eliminado)/i;
const STICKER_REGEX = /(sticker.*omitted|sticker.*omitido)/i;
const LINK_REGEX = /https?:\/\//i;
const BAD_WORDS_LIST = [
  "mierda", "carajo", "puta", "puto", "verga", "pendejo", "estupido", "idiota", "imbecil", "cabron", "joder", "coño",
  // Chilean Slang
  "wea", "weon", "wn", "ctm", "conchetumare", "culiao", "ql", "pico", "chucha", "aweonao"
];
const POLITENESS_REGEX = /\b(gracias|por favor|agradecido|agradecida|plis)\b/i;
const STOP_WORDS = new Set(["de", "la", "que", "el", "en", "y", "a", "los", "se", "del", "las", "un", "por", "con", "no", "una", "su", "para", "es", "al", "lo", "como", "mas", "pero", "sus", "le", "ya", "o", "fue", "este", "ha", "si", "porque", "esta", "son", "entre", "cuando", "muy", "sin", "sobre", "ser", "tiene", "tambien", "me", "hasta", "hay", "donde", "quien", "desde", "todo", "nos", "durante", "todos", "uno", "les", "ni", "contra", "otros", "ese", "eso", "ante", "ellos", "e", "esto", "mi", "antes", "algunos", "que", "unos", "yo", "otro", "otras", "otra", "el", "ella", "te", "ti", "tu", "pm", "am", "omitted", "audio", "image", "video", "sticker", "null", "undefined"]);

// Phase 5 Regex
const IMAGE_REGEX = /(image|video|media) (omitted|omitido)|<media omitted>/i;
const GIF_REGEX = /(gif) (omitted|omitido)/i;
const EXCLAMATION_REGEX = /!/g;
const ELLIPSIS_REGEX = /\.{2,}/g;

export function computeMetrics(messages: ParsedMessage[]): Metrics {
  const participants = new Set<string>();
  const messagesByUser: Record<string, number> = {};
  const dailyFirstSender = new Map<string, ParsedMessage>();
  const dailyInitiators: Record<string, number> = {};
  const emojiCounts: Record<string, number> = {};
  const responseTotals: Record<string, { totalMinutes: number; count: number }> = {};
  const timelineCounts: Record<string, number> = {};
  const heatmap = initHeatmap();

  // New Metrics Data
  const wordCounts: Record<string, number> = {};
  const wordStockSets: Record<string, Set<string>> = {};
  const maxMsgLen: Record<string, number> = {};
  const userEmojiCounts: Record<string, Record<string, number>> = {};
  const userLoveCounts: Record<string, number> = {};

  const doubleTextCounts: Record<string, number> = {};
  const laughCounts: Record<string, number> = {};
  const nightMsgCounts: Record<string, number> = {};
  const maxMonologue: Record<string, number> = {};
  const weekendCounts: Record<string, number> = {};

  // Viral Metrics Data
  const audioCounts: Record<string, number> = {};
  const yoyoCounts: Record<string, number> = {};
  const killerCounts: Record<string, number> = {};
  const toxicCounts: Record<string, number> = {};
  const pardonCounts: Record<string, number> = {};

  // Deep Insights Data
  const loveTimelineMap: Record<string, number> = {};
  const userNicknames: Record<string, Record<string, number>> = {};
  const gmDates: Record<string, Set<string>> = {}; // User -> Set of dates "YYYY-MM-DD"
  const longestResponse: Record<string, number> = {};
  const questionCounts: Record<string, number> = {};

  // Phase 3 Data
  const deletedCounts: Record<string, number> = {};
  const stickerCounts: Record<string, number> = {};
  const linkCounts: Record<string, number> = {};
  const laughStyles: Record<string, Record<string, number>> = {};
  const badWordCounts: Record<string, Record<string, number>> = {};
  const politenessCounts: Record<string, Record<string, number>> = {};
  const userWords: Record<string, Record<string, number>> = {};
  const userPhrases: Record<string, Record<string, number>> = {};

  // Phase 5 Data
  const imageCounts: Record<string, number> = {};
  const gifCounts: Record<string, number> = {};
  const exclamationCounts: Record<string, number> = {};
  const ellipsisCounts: Record<string, number> = {};
  const fastResponseCounts: Record<string, number> = {};
  const longResponseCounts: Record<string, number> = {};

  // Phase 8 Data
  const totalEmojis: Record<string, number> = {};
  const sentimentScores: Record<string, number> = {};

  let currentMonologueUser = "";
  let currentMonologueCount = 0;

  let loveCount = 0;
  let affectionCount = 0;

  for (const message of messages) {
    const sender = message.sender;
    const text = message.text;
    participants.add(sender);
    messagesByUser[sender] = (messagesByUser[sender] ?? 0) + 1;

    // Improved Sentiment Analysis (Phase 8)
    const lowerText = text.toLowerCase();
    const wordsList = lowerText.split(/\s+/);

    // Context-aware sentiment: check for negations
    for (let i = 0; i < wordsList.length; i++) {
      const w = wordsList[i];
      const prevWord = i > 0 ? wordsList[i - 1] : "";

      // Check if previous word is a negation
      const isNegated = prevWord === "no" || prevWord === "nunca" || prevWord === "ni";

      if (POSITIVE_WORDS.has(w)) {
        // If negated, it's actually negative
        sentimentScores[sender] = (sentimentScores[sender] ?? 0) + (isNegated ? -1 : 1);
      }
      if (NEGATIVE_WORDS.has(w)) {
        // If negated ("no mal" = "bien"), it's positive
        sentimentScores[sender] = (sentimentScores[sender] ?? 0) + (isNegated ? 1 : -1);
      }
    }

    // Daily Initiator
    if (!dailyFirstSender.has(message.dayKey)) {
      dailyFirstSender.set(message.dayKey, message);
    }

    // Love Count & Timeline (more precise)
    const matchLove = text.match(LOVE_REGEX);
    if (matchLove) {
      const count = matchLove.length;
      loveCount += count;
      userLoveCounts[sender] = (userLoveCounts[sender] ?? 0) + count;

      // Timeline (Month-Year)
      const date = new Date(message.timestamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      loveTimelineMap[monthKey] = (loveTimelineMap[monthKey] ?? 0) + count;
    }

    // Affection words (separate from direct love)
    const matchAffection = text.match(AFFECTION_REGEX);
    if (matchAffection) {
      affectionCount += matchAffection.length;
    }

    // Nicknames
    // const lowerText = text.toLowerCase(); // Already defined above
    for (const nick of NICKNAMES_LIST) {
      if (lowerText.includes(nick)) {
        if (!userNicknames[sender]) userNicknames[sender] = {};
        userNicknames[sender][nick] = (userNicknames[sender][nick] ?? 0) + 1;
      }
    }

    // Good Morning Streak (Collect dates)
    if (GM_REGEX.test(text)) {
      if (!gmDates[sender]) gmDates[sender] = new Set();
      gmDates[sender].add(message.dayKey);
    }

    // El Curioso (Question Marks)
    const questions = text.match(/\?/g);
    if (questions) {
      questionCounts[sender] = (questionCounts[sender] ?? 0) + questions.length;
    }

    // Emojis
    const emojis = text.match(EMOJI_REGEX);
    if (emojis) {
      totalEmojis[sender] = (totalEmojis[sender] ?? 0) + emojis.length; // Phase 8
      for (const emoji of emojis) {
        emojiCounts[emoji] = (emojiCounts[emoji] ?? 0) + 1;

        // Per user emojis
        if (!userEmojiCounts[sender]) userEmojiCounts[sender] = {};
        userEmojiCounts[sender][emoji] = (userEmojiCounts[sender][emoji] ?? 0) + 1;
      }
    }

    // Heatmap & Night Owl & Weekend Warrior
    const date = new Date(message.timestamp);
    const day = date.getDay();
    const hour = date.getHours();
    heatmap[day][hour] += 1;

    if (hour >= 0 && hour < 6) {
      nightMsgCounts[sender] = (nightMsgCounts[sender] ?? 0) + 1;
    }

    if (day === 0 || day === 6) {
      weekendCounts[sender] = (weekendCounts[sender] ?? 0) + 1;
    }

    // Timeline
    timelineCounts[message.dayKey] = (timelineCounts[message.dayKey] ?? 0) + 1;

    // Chat Dryness (Words) & Detailed Analysis
    const wordsArray = text.trim().split(/\s+/);
    const words = wordsArray.length;
    wordCounts[sender] = (wordCounts[sender] ?? 0) + words;

    // Max Message Length
    maxMsgLen[sender] = Math.max(maxMsgLen[sender] ?? 0, words);

    // Word Stock (Unique Words) & Content Analysis
    if (!wordStockSets[sender]) wordStockSets[sender] = new Set();
    if (!userWords[sender]) userWords[sender] = {};
    if (!userPhrases[sender]) userPhrases[sender] = {};

    const cleanWords: string[] = [];
    wordsArray.forEach(w => {
      // Filter out timestamps/dates like [10:20, 12/12/2024] or 02-01-26
      if (/^\[?\d{1,2}[:/]\d{1,2}/.test(w)) return;
      if (/\d{2}-\d{2}-\d{2}/.test(w)) return;

      // Strip invisible chars and punctuation
      // \u200e is LTR mark, \u200f is RTL mark
      let clean = w.replace(/[\u200e\u200f]/g, "").toLowerCase().replace(/[.,!?;:()\[\]"]/g, "");

      // Strict filter for system words
      if (STOP_WORDS.has(clean)) return;
      if (clean === "audio" || clean === "omitted" || clean === "image" || clean === "video" || clean === "gif") return;

      if (clean.length > 2 && !/^\d+$/.test(clean)) { // Ignore numbers
        wordStockSets[sender].add(clean);
        userWords[sender][clean] = (userWords[sender][clean] ?? 0) + 1;
        cleanWords.push(clean);
      }
    });

    // Phrases (Bigrams/Trigrams)
    for (let i = 0; i < cleanWords.length - 1; i++) {
      const phrase2 = `${cleanWords[i]} ${cleanWords[i + 1]}`;
      userPhrases[sender][phrase2] = (userPhrases[sender][phrase2] ?? 0) + 1;
      if (i < cleanWords.length - 2) {
        const phrase3 = `${cleanWords[i]} ${cleanWords[i + 1]} ${cleanWords[i + 2]}`;
        userPhrases[sender][phrase3] = (userPhrases[sender][phrase3] ?? 0) + 1;
      }
    }

    // Laugh Meter & Styles
    // Enhanced regex to capture keysmashes (e.g., asdjasd, ksksks)
    const laughs = text.match(/(jaja|haha|lol|jeje|jiji|ksks|asdj|jsjs)/gi);
    if (laughs) {
      laughCounts[sender] = (laughCounts[sender] ?? 0) + laughs.length;
      if (!laughStyles[sender]) laughStyles[sender] = { jaja: 0, haha: 0, lol: 0, other: 0 };

      laughs.forEach(l => {
        const lower = l.toLowerCase();
        if (lower.includes("jaja") || lower.includes("jeje") || lower.includes("jiji")) laughStyles[sender].jaja++;
        else if (lower.includes("haha")) laughStyles[sender].haha++;
        else if (lower.includes("lol")) laughStyles[sender].lol++;
        else laughStyles[sender].other++; // Keysmash falls here or we can add a specific category
      });
    } else {
      // Check for keysmash if no standard laugh found
      // Heuristic: long words with no vowels or random sequence of a,s,d,j,k,l
      if (/\b[asdfjklñ]{4,}\b/i.test(text)) {
        laughCounts[sender] = (laughCounts[sender] ?? 0) + 1;
        if (!laughStyles[sender]) laughStyles[sender] = { jaja: 0, haha: 0, lol: 0, other: 0 };
        laughStyles[sender].other++;
      }
    }

    // Monologue & Double Texting
    // Exclude media messages from monologue streak (images, videos, stickers)
    const isMedia =
      IMAGE_REGEX.test(text) ||
      GIF_REGEX.test(text) ||
      STICKER_REGEX.test(text) ||
      text.includes("<media omitted>") ||
      text.includes("media omitted");

    if (!isMedia) {
      if (sender === currentMonologueUser) {
        currentMonologueCount++;
        doubleTextCounts[sender] = (doubleTextCounts[sender] ?? 0) + 1;
      } else {
        if (currentMonologueUser) {
          maxMonologue[currentMonologueUser] = Math.max(maxMonologue[currentMonologueUser] ?? 0, currentMonologueCount);
        }
        currentMonologueUser = sender;
        currentMonologueCount = 1;
      }
    }

    // --- VIRAL METRICS ---

    // Audio Terrorista
    if (AUDIO_REGEX.test(text)) {
      audioCounts[sender] = (audioCounts[sender] ?? 0) + 1;
    }

    // El Yo-Yo
    const yoyoMatches = text.match(YOYO_REGEX);
    if (yoyoMatches) {
      yoyoCounts[sender] = (yoyoCounts[sender] ?? 0) + yoyoMatches.length;
    }

    // Conversation Killer
    if (words === 1 && KILLER_WORDS.has(text.toLowerCase().trim())) {
      killerCounts[sender] = (killerCounts[sender] ?? 0) + 1;
    }

    // Toxic-O-Meter
    const isScreaming = text.length > 5 && text === text.toUpperCase() && /[A-Z]/.test(text);
    const isExplosive = text.includes("!!!") || text.includes("??");
    if (isScreaming || isExplosive) {
      toxicCounts[sender] = (toxicCounts[sender] ?? 0) + 1;
    }

    // Perdón Counter
    const pardonMatches = text.match(PARDON_REGEX);
    if (pardonMatches) {
      pardonCounts[sender] = (pardonCounts[sender] ?? 0) + pardonMatches.length;
    }

    // --- PHASE 3 METRICS ---

    // Deleted Messages
    if (DELETED_REGEX.test(text)) {
      deletedCounts[sender] = (deletedCounts[sender] ?? 0) + 1;
    }

    // Sticker Maniac
    if (STICKER_REGEX.test(text)) {
      stickerCounts[sender] = (stickerCounts[sender] ?? 0) + 1;
    }

    // Link Lord
    if (LINK_REGEX.test(text)) {
      linkCounts[sender] = (linkCounts[sender] ?? 0) + 1;
    }

    // Bad Words
    for (const bad of BAD_WORDS_LIST) {
      if (lowerText.includes(bad)) {
        if (!badWordCounts[sender]) badWordCounts[sender] = {};
        badWordCounts[sender][bad] = (badWordCounts[sender][bad] ?? 0) + 1;
      }
    }

    // Politeness
    const politeMatch = lowerText.match(POLITENESS_REGEX);
    if (politeMatch) {
      if (!politenessCounts[sender]) politenessCounts[sender] = {};
      const word = politeMatch[0];
      politenessCounts[sender][word] = (politenessCounts[sender][word] ?? 0) + 1;
    }

    // --- PHASE 5 METRICS ---

    // El Fotógrafo
    if (IMAGE_REGEX.test(text)) {
      imageCounts[sender] = (imageCounts[sender] ?? 0) + 1;
    }

    // GIF Master
    if (GIF_REGEX.test(text)) {
      gifCounts[sender] = (gifCounts[sender] ?? 0) + 1;
    }

    // El Expresivo
    const exclamations = text.match(EXCLAMATION_REGEX);
    if (exclamations) {
      exclamationCounts[sender] = (exclamationCounts[sender] ?? 0) + exclamations.length;
    }

    // El Indeciso (Ellipsis + Uncertainty Phrases)
    const ellipsis = text.match(ELLIPSIS_REGEX);
    let uncertaintyScore = 0;
    if (ellipsis) {
      uncertaintyScore += ellipsis.length;
    }

    // Uncertainty phrases
    const uncertaintyPhrases = ["no se", "no sé", "creo", "tal vez", "quizas", "quizás", "depende", "no estoy seguro", "no estoy segura", "nose"];
    for (const phrase of uncertaintyPhrases) {
      if (lowerText.includes(phrase)) {
        uncertaintyScore++;
      }
    }

    if (uncertaintyScore > 0) {
      ellipsisCounts[sender] = (ellipsisCounts[sender] ?? 0) + uncertaintyScore;
    }
  }

  // Finalize Monologue for last message
  if (currentMonologueUser) {
    maxMonologue[currentMonologueUser] = Math.max(maxMonologue[currentMonologueUser] ?? 0, currentMonologueCount);
  }

  // Calculate Averages / Final Metrics
  const chatDryness: Record<string, number> = {};
  const wordStock: Record<string, number> = {};
  const emojisByUser: Record<string, { emoji: string; count: number }[]> = {};
  const topWords: Record<string, { word: string; count: number }[]> = {};
  const topPhrases: Record<string, { phrase: string; count: number }[]> = {};
  const emojiDensity: Record<string, number> = {}; // Phase 8

  for (const user of Array.from(participants)) {
    const msgs = messagesByUser[user] || 1;
    chatDryness[user] = Math.round((wordCounts[user] || 0) / msgs);
    wordStock[user] = wordStockSets[user]?.size || 0;

    // Emoji Density
    const words = wordCounts[user] || 1;
    const emojis = totalEmojis[user] || 0;
    emojiDensity[user] = Math.round((emojis / words) * 100);

    // Top 3 Emojis per user
    const userEmojis = userEmojiCounts[user] || {};
    emojisByUser[user] = Object.entries(userEmojis)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emoji, count]) => ({ emoji, count }));

    // Top Words
    topWords[user] = Object.entries(userWords[user] || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    // Top Phrases
    topPhrases[user] = Object.entries(userPhrases[user] || {})
      .filter(([_, count]) => count > 2) // Minimum threshold
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([phrase, count]) => ({ phrase, count }));

    // Fix Toxic-O-Meter: Add bad words count to toxic count
    const badWordsTotal = Object.values(badWordCounts[user] || {}).reduce((sum, v) => sum + v, 0);
    toxicCounts[user] = (toxicCounts[user] ?? 0) + badWordsTotal;
  }

  // Response Times & Ghosting (Improved)
  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);
  // Tracking response times // Track all response times for better statistics

  for (let index = 1; index < sortedMessages.length; index += 1) {
    const prev = sortedMessages[index - 1];
    const current = sortedMessages[index];

    if (prev.sender !== current.sender) {
      const diffMinutes = (current.timestamp - prev.timestamp) / (1000 * 60);

      // Longest Response (Ghosting) - allow up to 7 days (10080 mins) to be counted as "ghosting" record
      // If > 7 days, it's probably a break in chat, not ghosting.
      if (diffMinutes < 10080) {
        longestResponse[current.sender] = Math.max(longestResponse[current.sender] ?? 0, diffMinutes);
      }

      // El Ansioso (Fast Response < 1 min)
      if (diffMinutes < 1) {
        fastResponseCounts[current.sender] = (fastResponseCounts[current.sender] ?? 0) + 1;
      }

      // El Desaparecido (Long Response > 6 hours / 360 mins)
      if (diffMinutes > 360 && diffMinutes < 10080) {
        longResponseCounts[current.sender] = (longResponseCounts[current.sender] ?? 0) + 1;
      }

      // Better filtering: exclude extreme outliers (>48h) AND very short (<10s)
      // Only count reasonable conversation responses
      if (diffMinutes > 0.16 && diffMinutes < 48 * 60) { // 10s to 48h
        const bucket = responseTotals[current.sender] ?? { totalMinutes: 0, count: 0 };
        bucket.totalMinutes += diffMinutes;
        bucket.count += 1;
        responseTotals[current.sender] = bucket;
      }
    }
  }

  // Good Morning Streak Calculation
  const goodMorningStreak: Record<string, number> = {};
  for (const user of Array.from(participants)) {
    const dates = Array.from(gmDates[user] || []).sort();
    let maxStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    for (const dateStr of dates) {
      const d = new Date(dateStr);
      if (!lastDate) {
        currentStreak = 1;
      } else {
        const diffTime = Math.abs(d.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, currentStreak);
      lastDate = d;
    }
    goodMorningStreak[user] = maxStreak;
  }

  // Love Timeline Array (Filled)
  const loveTimelineRaw = Object.entries(loveTimelineMap)
    .sort((a, b) => a[0].localeCompare(b[0]));

  const loveTimeline: { date: string; count: number }[] = [];

  if (loveTimelineRaw.length > 0) {
    // Fill gaps for monthly timeline
    const startStr = loveTimelineRaw[0][0]; // YYYY-MM
    const endStr = loveTimelineRaw[loveTimelineRaw.length - 1][0];

    // Use safely constructed dates (1st of month)
    const [startYear, startMonth] = startStr.split('-').map(Number);
    const [endYear, endMonth] = endStr.split('-').map(Number);

    let currentYear = startYear;
    let currentMonth = startMonth;

    const dataMap = new Map(loveTimelineRaw);

    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
      const key = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
      loveTimeline.push({ date: key, count: dataMap.get(key) || 0 });

      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }
  } else {
    // Empty case
  }

  for (const message of dailyFirstSender.values()) {
    dailyInitiators[message.sender] = (dailyInitiators[message.sender] ?? 0) + 1;
  }

  const emojiTop = Object.entries(emojiCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([emoji, count]) => ({ emoji, count }));

  const responseTimes = Object.entries(responseTotals)
    .map(([user, value]) => ({
      user,
      avgMinutes: value.count ? Math.round(value.totalMinutes / value.count) : 0
    }))
    .sort((a, b) => a.avgMinutes - b.avgMinutes);

  const timelineRaw = Object.entries(timelineCounts)
    .sort((a, b) => a[0].localeCompare(b[0]));

  const timeline: { date: string; count: number }[] = [];

  if (timelineRaw.length > 0) {
    const startStr = timelineRaw[0][0];
    const endStr = timelineRaw[timelineRaw.length - 1][0];

    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    // Validate dates
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const dataMap = new Map(timelineRaw);
      const curr = new Date(startDate);

      while (curr <= endDate) {
        const key = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}-${String(curr.getDate()).padStart(2, '0')}`;
        timeline.push({ date: key, count: dataMap.get(key) || 0 });
        curr.setDate(curr.getDate() + 1);
      }
    } else {
      // Fallback if dates are invalid
      timeline.push(...timelineRaw.map(([date, count]) => ({ date, count })));
    }
  }

  // Prime Time Calculation
  let maxHour = 0;
  let maxHourCount = 0;
  // heatmap is number[7][24]
  const hourTotals = new Array(24).fill(0);
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      hourTotals[h] += heatmap[d][h];
    }
  }
  for (let h = 0; h < 24; h++) {
    if (hourTotals[h] > maxHourCount) {
      maxHourCount = hourTotals[h];
      maxHour = h;
    }
  }

  const metrics: Metrics = {
    participants: Array.from(participants),
    totalMessages: messages.length,
    messagesByUser,
    dailyInitiators,
    loveCount,
    emojiTop,
    responseTimes,
    heatmap,
    timeline,
    badges: [],
    // New Metrics
    chatDryness,
    doubleTexting: doubleTextCounts,
    laughMeter: laughCounts,
    nightOwl: nightMsgCounts,
    longestMonologue: maxMonologue,
    weekendWarrior: weekendCounts,
    // Detailed Analysis
    wordCount: wordCounts,
    wordStock,
    maxMessageLength: maxMsgLen,
    emojisByUser,
    loveCountByUser: userLoveCounts,
    // Viral Metrics
    audioCount: audioCounts,
    yoyoCount: yoyoCounts,
    killerCount: killerCounts,
    toxicCount: toxicCounts,
    pardonCount: pardonCounts,
    primeTime: { hour: maxHour, count: maxHourCount },
    // Deep Insights
    loveTimeline,
    goodMorningStreak,
    nicknames: userNicknames,
    longestResponseTime: longestResponse,
    questionCount: questionCounts,
    // Phase 3
    deletedCount: deletedCounts,
    stickerCount: stickerCounts,
    linkCount: linkCounts,
    laughStyles,
    badWords: badWordCounts,
    politeness: politenessCounts,
    topWords,
    topPhrases,
    // Phase 5
    imageCount: imageCounts,
    gifCount: gifCounts,
    exclamationCount: exclamationCounts,
    ellipsisCount: ellipsisCounts,
    fastResponseCount: fastResponseCounts,
    longResponseCount: longResponseCounts,
    // Phase 8
    emojiDensity,
    sentimentScore: sentimentScores
  };

  metrics.badges = computeBadges(metrics);

  // Validation: log warnings if metrics seem off
  validateMetrics(metrics, messages.length);

  return metrics;
}

export function buildTeaser(metrics: Metrics): TeaserMetrics {
  const topInitiator = Object.entries(metrics.dailyInitiators).reduce(
    (best, entry) => (entry[1] > best[1] ? entry : best),
    ["", 0] as [string, number]
  );

  return {
    topInitiator: topInitiator[0]
      ? { user: topInitiator[0], count: topInitiator[1] }
      : null,
    loveCount: metrics.loveCount
  };
}

function validateMetrics(metrics: Metrics, totalMessages: number): void {
  console.log("[Metrics Validation]");

  if (metrics.totalMessages === 0) {
    console.warn("No messages parsed! Check export format.");
  }

  if (metrics.participants.length === 0) {
    console.warn("No participants found!");
  }

  if (metrics.participants.length > 10) {
    console.warn(metrics.participants.length + " participants detected - might be a group chat");
  }

  const totalMsgCount = Object.values(metrics.messagesByUser).reduce((sum, v) => sum + v, 0);
  if (totalMsgCount !== totalMessages) {
    console.warn("Message count mismatch: " + totalMsgCount + " counted vs " + totalMessages + " total");
  }

  for (const [user, count] of Object.entries(metrics.messagesByUser)) {
    if (count > totalMessages) {
      console.error("User " + user + " has more messages (" + count + ") than total (" + totalMessages + ")");
    }
  }

  console.log("Validated " + metrics.totalMessages + " messages from " + metrics.participants.length + " participants");
  console.log("Love count: " + metrics.loveCount + ", Top emoji: " + (metrics.emojiTop[0]?.emoji || 'none'));
}

