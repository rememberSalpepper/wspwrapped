import { randomUUID } from "crypto";
import type { ParsedChat, ParsedMessage } from "./types";

// Enhanced patterns for different WhatsApp export formats
const LINE_PATTERNS = [
  // Standard [dd/mm/yy, hh:mm:ss] Sender: Message
  /^\[(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?)(?:[\s\u202F]?([AP]M))?\]\s([^:]+):\s([\s\S]*)$/,
  // Standard dd/mm/yy, hh:mm - Sender: Message
  /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?)(?:[\s\u202F]?([AP]M))?\s-\s([^:]+):\s([\s\S]*)$/,
  // No comma: dd/mm/yy hh:mm - Sender: Message
  /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\s+(\d{1,2}:\d{2}(?::\d{2})?)(?:[\s\u202F]?([AP]M))?\s-\s([^:]+):\s([\s\S]*)$/,
  // US Format: mm/dd/yy, hh:mm - Sender: Message
  /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?)(?:[\s\u202F]?([AP]M))?\s-\s([^:]+):\s([\s\S]*)$/,
];

// Comprehensive system message patterns (Spanish, English, Portuguese)
const SYSTEM_PATTERNS = [
  // Deleted messages
  /eliminó este mensaje/i,
  /deleted this message/i,
  /apagou esta mensagem/i,
  /message deleted/i,
  /mensaje eliminado/i,

  // Group changes
  /cambió la descripción/i,
  /changed the (group )?description/i,
  /alterou a descrição/i,
  /cambió el ícono/i,
  /changed the (group )?icon/i,
  /alterou o ícone/i,
  /cambió el nombre/i,
  /changed the subject/i,
  /alterou o assunto/i,

  // Participant changes
  /se unió usando el enlace/i,
  /joined using this group'?s invite link/i,
  /entrou usando o link/i,
  /\badded\b/i,
  /\bagregó\b/i,
  /\badicionou\b/i,
  /\bleft\b$/i,
  /\bsalió\b$/i,
  /\bsaiu\b$/i,
  /\bremoved\b/i,
  /\beliminó\b/i,
  /\bremoveu\b/i,

  // Security/encryption
  /cifrado de extremo a extremo/i,
  /end-to-end encryption/i,
  /criptografia de ponta a ponta/i,
  /los mensajes y las llamadas/i,
  /messages and calls are/i,

  // Group creation
  /creó el grupo/i,
  /created group/i,
  /criou o grupo/i,

  // Call notifications
  /\bllamada perdida\b/i,
  /\bmissed (video )?call\b/i,
  /\bchamada perdida\b/i,
  /\bllamada de\b/i,
  /\bcall from\b/i,

  // Business/automated messages
  /este mensaje fue enviado automáticamente/i,
  /this message was sent automatically/i,
  /esta mensagem foi enviada automaticamente/i,
];

// Date separator line (not a message)
const DATE_SEPARATOR = /^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/;
const SYSTEM_MESSAGE_BRACKET = /^\[\d{1,2}[./-]\d{1,2}[./-]\d{2,4}, \d{1,2}:\d{2}.*\]$/;

function isSystemMessage(text: string): boolean {
  // Check if it matches any system pattern
  return SYSTEM_PATTERNS.some(pattern => pattern.test(text));
}

function normalizeDate(datePart: string, timePart: string, ampm?: string): Date | null {
  // Support /, ., and - as separators
  const [partA, partB, partC] = datePart.split(/[./-]/).map((value) => parseInt(value, 10));
  if (!partA || !partB || !partC) return null;

  let day = partA;
  let month = partB;
  let year = partC;

  if (year < 100) {
    year += 2000;
  }

  // Smart date detection
  // If one part is clearly > 12, it must be the day
  if (partA > 12 && partB <= 12) {
    day = partA;
    month = partB;
  } else if (partB > 12 && partA <= 12) {
    day = partB;
    month = partA;
  } else if (partA > 31 || partB > 31) {
    // Invalid date
    return null;
  } else {
    // Ambiguous case (both <= 12)
    // Prefer day-month format (EU/LATAM) by default
    // Could be enhanced with locale detection
    day = partA;
    month = partB;
  }

  const [rawHour, rawMinute] = timePart.split(":").map((value) => parseInt(value, 10));
  if (rawHour === undefined || rawMinute === undefined) return null;

  let hour = rawHour;
  if (ampm) {
    const marker = ampm.toUpperCase();
    if (marker === "PM" && hour !== 12) hour += 12;
    if (marker === "AM" && hour === 12) hour = 0;
  }

  const date = new Date(year, month - 1, day, hour, rawMinute, 0, 0);
  if (Number.isNaN(date.getTime())) return null;

  // Validate date is reasonable (not in future, not before WhatsApp existed)
  const now = Date.now();
  const whatsappLaunch = new Date(2009, 0, 1).getTime(); // WhatsApp launched in 2009

  if (date.getTime() > now || date.getTime() < whatsappLaunch) {
    return null;
  }

  return date;
}

function parseLine(line: string): {
  sender: string;
  text: string;
  timestamp: number;
  dayKey: string;
} | null {
  // Skip empty lines
  if (!line.trim()) return null;

  // Skip date separator lines
  if (DATE_SEPARATOR.test(line.trim())) return null;

  for (const pattern of LINE_PATTERNS) {
    const match = line.match(pattern);
    if (!match) continue;

    const [, datePart, timePart, ampm, sender, text] = match;

    // Skip if sender looks like a system message
    if (!sender || sender.trim().length === 0) continue;

    // Clean sender name (remove phone numbers, special chars)
    const cleanSender = sender.trim()
      .replace(/^\+?\d+$/, '') // Remove if it's just a phone number
      .replace(/[\u200e\u200f\u200b]/g, ''); // Remove invisible chars

    if (!cleanSender) continue;

    const date = normalizeDate(datePart, timePart, ampm);
    if (!date) continue;

    const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    // Clean text
    const cleanText = text.trim()
      .replace(/[\u200e\u200f\u200b]/g, ''); // Remove invisible chars

    return {
      sender: cleanSender,
      text: cleanText,
      timestamp: date.getTime(),
      dayKey
    };
  }

  return null;
}

export function parseWhatsAppExport(rawText: string): ParsedChat {
  const messages: ParsedMessage[] = [];
  const participants = new Set<string>();
  const lines = rawText.split(/\r?\n/);

  let current: ParsedMessage | null = null;
  let unparsedLines = 0;
  let systemMessagesFiltered = 0;

  for (const line of lines) {
    if (!line.trim()) continue;

    const parsed = parseLine(line);

    if (parsed) {
      // Save previous message if exists
      if (current) {
        // Final validation: skip if it's a system message
        if (!isSystemMessage(current.text)) {
          messages.push(current);
          participants.add(current.sender);
        } else {
          systemMessagesFiltered++;
        }
      }

      const { sender, text, timestamp, dayKey } = parsed;

      current = {
        id: randomUUID(),
        sender,
        text,
        timestamp,
        dayKey
      };
      continue;
    }

    // Check if it's a system message line
    if (SYSTEM_MESSAGE_BRACKET.test(line) || isSystemMessage(line)) {
      systemMessagesFiltered++;
      continue;
    }

    // Multi-line message continuation
    if (current && line.trim()) {
      // Don't add lines that look like timestamps or system messages
      if (!/^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}/.test(line)) {
        current.text = `${current.text}\n${line.trim()}`;
      }
    } else {
      unparsedLines++;
    }
  }

  // Save last message
  if (current && !isSystemMessage(current.text)) {
    messages.push(current);
    participants.add(current.sender);
  }

  // Log parse results for debugging
  console.log(`[Parser] Total lines: ${lines.length}`);
  console.log(`[Parser] Messages parsed: ${messages.length}`);
  console.log(`[Parser] Participants: ${participants.size}`);
  console.log(`[Parser] System messages filtered: ${systemMessagesFiltered}`);
  console.log(`[Parser] Unparsed lines: ${unparsedLines}`);

  return {
    participants: Array.from(participants),
    messages
  };
}
