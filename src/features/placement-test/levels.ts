import type { CefrLevel } from "./types";

export const cefrValues: Record<CefrLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

export function levelFromValue(value: number): CefrLevel {
  if (value < 1.55) return "A1";
  if (value < 2.45) return "A2";
  if (value < 3.45) return "B1";
  if (value < 4.45) return "B2";
  if (value < 5.45) return "C1";
  return "C2";
}

export function valueForLevel(level: CefrLevel) {
  return cefrValues[level];
}

export function adjacentLevels(level: CefrLevel): CefrLevel[] {
  const order = Object.keys(cefrValues) as CefrLevel[];
  const index = order.indexOf(level);
  return [
    order[Math.max(0, index - 1)],
    order[index],
    order[Math.min(order.length - 1, index + 1)],
  ].filter((item, itemIndex, items) => items.indexOf(item) === itemIndex);
}

export function formatScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
