export type ParsedMessage = {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  dayKey: string;
};

export type ParsedChat = {
  participants: string[];
  messages: ParsedMessage[];
};

export type EmojiCount = {
  emoji: string;
  count: number;
};

export type ResponseTime = {
  user: string;
  avgMinutes: number;
};

export type Badge = {
  badge: string;
  user: string;
  description: string;
};

export type Metrics = {
  participants: string[];
  totalMessages: number;
  messagesByUser: Record<string, number>;
  dailyInitiators: Record<string, number>;
  loveCount: number;
  emojiTop: EmojiCount[];
  responseTimes: ResponseTime[];
  heatmap: number[][];
  timeline: { date: string; count: number }[];
  badges: Badge[];
  // New Metrics
  chatDryness: Record<string, number>; // words per message
  doubleTexting: Record<string, number>; // sequential messages
  laughMeter: Record<string, number>; // "jaja" count
  nightOwl: Record<string, number>; // night messages
  longestMonologue: Record<string, number>; // max sequential
  weekendWarrior: Record<string, number>; // sat/sun messages
  // Detailed Analysis
  wordCount: Record<string, number>;
  wordStock: Record<string, number>; // unique words
  maxMessageLength: Record<string, number>;
  emojisByUser: Record<string, EmojiCount[]>;
  loveCountByUser: Record<string, number>;
  // Viral / Roast Metrics
  audioCount: Record<string, number>; // Audio Terrorista
  yoyoCount: Record<string, number>; // El Yo-Yo
  killerCount: Record<string, number>; // Conversation Killer
  toxicCount: Record<string, number>; // Toxic-O-Meter
  pardonCount: Record<string, number>; // Perdón Counter
  primeTime: { hour: number; count: number }; // Prime Time
  // Deep Insights & Romance
  loveTimeline: { date: string; count: number }[];
  goodMorningStreak: Record<string, number>;
  nicknames: Record<string, Record<string, number>>;
  longestResponseTime: Record<string, number>; // minutes
  questionCount: Record<string, number>; // El Curioso
  // Phase 3: Multimedia, Linguistic & Content
  deletedCount: Record<string, number>;
  stickerCount: Record<string, number>;
  linkCount: Record<string, number>;
  laughStyles: Record<string, Record<string, number>>; // jaja, haha, lol, other
  badWords: Record<string, Record<string, number>>; // User -> Word -> Count
  politeness: Record<string, Record<string, number>>; // User -> Word -> Count
  topWords: Record<string, { word: string; count: number }[]>;
  topPhrases: Record<string, { phrase: string; count: number }[]>;
  // Phase 5: Expansion
  imageCount: Record<string, number>;
  gifCount: Record<string, number>;
  exclamationCount: Record<string, number>;
  ellipsisCount: Record<string, number>;
  fastResponseCount: Record<string, number>;
  longResponseCount: Record<string, number>;
  // Phase 8
  emojiDensity: Record<string, number>; // Emojis per 100 words
  sentimentScore: Record<string, number>; // Positive - Negative words
};

export type TeaserMetrics = {
  topInitiator: { user: string; count: number } | null;
  loveCount: number;
};
