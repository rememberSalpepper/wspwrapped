import type { Metrics } from "./types";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function buildAliasMap(participants: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  participants.forEach((participant, index) => {
    const letter = ALPHABET[index] ?? String(index + 1);
    map[participant] = `Persona ${letter}`;
  });
  return map;
}

export function applyAliases(metrics: Metrics, aliases: Record<string, string>): Metrics {
  const rename = (name: string) => aliases[name] ?? name;

  const messagesByUser: Record<string, number> = {};
  for (const [user, count] of Object.entries(metrics.messagesByUser)) {
    messagesByUser[rename(user)] = count;
  }

  const dailyInitiators: Record<string, number> = {};
  for (const [user, count] of Object.entries(metrics.dailyInitiators)) {
    dailyInitiators[rename(user)] = count;
  }

  const responseTimes = metrics.responseTimes.map((entry) => ({
    user: rename(entry.user),
    avgMinutes: entry.avgMinutes
  }));

  const participants = metrics.participants.map(rename);

  return {
    ...metrics,
    participants,
    messagesByUser,
    dailyInitiators,
    responseTimes
  };
}
