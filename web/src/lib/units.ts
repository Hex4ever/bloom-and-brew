import type { Units, TempUnit } from "../types";

export function gramsToOz(g: number): number {
  return Math.round((g / 28.3495) * 10) / 10;
}

export function celsiusToFahrenheit(c: number): number {
  return Math.round(c * 9 / 5 + 32);
}

export function formatWeight(grams: number, units: Units): string {
  if (units === "imperial") return `${gramsToOz(grams)} oz`;
  return `${grams} g`;
}

export function formatTemp(celsius: number, tempUnit: TempUnit): string {
  if (tempUnit === "F") return `${celsiusToFahrenheit(celsius)}°F`;
  return `${celsius}°C`;
}
