import type { MaterialType } from "../core/types";

interface ExtractedStyle {
  borderRadius: number;
  color: [number, number, number, number];
  zIndex: number;
  material: MaterialType;
}

const FALLBACK_COLOR: [number, number, number, number] = [0.5, 0.6, 1.0, 0.65];

export function extractStyle(el: HTMLElement): ExtractedStyle {
  const style = getComputedStyle(el);
  const opacity = safeNumber(style.opacity, 1);
  const parsedColor = parseColor(style.backgroundColor) ?? FALLBACK_COLOR;
  const color: [number, number, number, number] = [
    parsedColor[0],
    parsedColor[1],
    parsedColor[2],
    clamp01(parsedColor[3] * opacity),
  ];
  const radius = safeNumber(style.borderTopLeftRadius, 0);
  const zIndex = parseInt(style.zIndex, 10);
  const variableMaterial = style
    .getPropertyValue("--expressive-material")
    .trim()
    .toLowerCase();
  const datasetMaterial = (el.dataset.material ?? "").trim().toLowerCase();
  const material = normalizeMaterial(datasetMaterial || variableMaterial);

  return {
    borderRadius: radius,
    color,
    zIndex: Number.isFinite(zIndex) ? zIndex : 0,
    material,
  };
}

function normalizeMaterial(value: string): MaterialType {
  if (value === "ripple") return "ripple";
  if (value === "hover" || value === "glass" || value === "overlay") return "hover";
  return "none";
}

function safeNumber(value: string, fallback: number): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function parseColor(input: string): [number, number, number, number] | null {
  const value = input.trim().toLowerCase();
  if (value.startsWith("rgb(")) {
    const parts = value
      .slice(4, -1)
      .split(",")
      .map((part) => Number.parseFloat(part.trim()));
    if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return null;
    return [parts[0] / 255, parts[1] / 255, parts[2] / 255, 1];
  }

  if (value.startsWith("rgba(")) {
    const parts = value
      .slice(5, -1)
      .split(",")
      .map((part) => Number.parseFloat(part.trim()));
    if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) return null;
    return [parts[0] / 255, parts[1] / 255, parts[2] / 255, clamp01(parts[3])];
  }

  return null;
}
