import { randomUUID } from "crypto";
import type { ParsedChat, ParsedMessage } from "./types";

const LINE_PATTERNS = [
  // Standard [dd/mm/yy, hh:mm:ss] Sender: Message
  /^\[(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?)(?:[\s\u202F]?([AP]M))?\]\s([^:]+):\s([\s\S]*)$/,
  // Standard dd/mm/yy, hh:mm - Sender: Message
  /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?)(?:[\s\u202F]?([AP]M))?\s-\s([^:]+):\s([\s\S]*)$/,
  // No comma: dd/mm/yy hh:mm - Sender: Message
  /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\s+(\d{1,2}:\d{2}(?::\d{2})?)(?:[\s\u202F]?([AP]M))?\s-\s([^:]+):\s([\s\S]*)$/
];

const SYSTEM_MESSAGE = /^(?:\d{1,2}[./-]\d{1,2}[./-]\d{2,4}).* - /;
const SYSTEM_MESSAGE_BRACKET = /^\[\d{1,2}[./-]\d{1,2}[./-]\d{2,4}, \d{1,2}:\d{2}.*\]/;

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

  if (partA > 12 && partB <= 12) {
    day = partA;
    month = partB;
  } else if (partB > 12 && partA <= 12) {
    day = partB;
    month = partA;
  } else {
    // Prefer day-first when ambiguous.
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
  return date;
}

function parseLine(line: string): {
  sender: string;
  text: string;
  timestamp: number;
  dayKey: string;
} | null {
  for (const pattern of LINE_PATTERNS) {
    const match = line.match(pattern);
    if (!match) continue;

    const [datePart, timePart, ampm, sender, text] = match.slice(1);
    const date = normalizeDate(datePart, timePart, ampm);
    if (!date) return null;

    const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return {
      sender: sender.trim(),
      text: text.trim(),
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

  for (const line of lines) {
    const parsed = parseLine(line);

    if (parsed) {
      if (current) {
        messages.push(current);
      }

      const { sender, text, timestamp, dayKey } = parsed;
      participants.add(sender);

      current = {
        id: randomUUID(),
        sender,
        text,
        timestamp,
        dayKey
      };
      continue;
    }

    if (SYSTEM_MESSAGE.test(line) || SYSTEM_MESSAGE_BRACKET.test(line)) {
      continue;
    }

    if (current) {
      current.text = `${current.text}\n${line}`.trim();
    }
  }

  if (current) {
    messages.push(current);
  }

  return {
    participants: Array.from(participants),
    messages
  };
}
