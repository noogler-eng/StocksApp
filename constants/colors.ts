// src/constants/colors.ts

const LightColors = {
  background: "#FFFFFF",
  surface: "#F3F4F6",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  card: "#FFFFFF",
  accent: "#F97316",
  success: "#22C55E",
  danger: "#EF4444",
  warning: "#F59E0B",
  muted: "#9CA3AF",

  // Gradients & Others
  gradientStart: "#E5E7EB",
  gradientEnd: "#EA580C",
  marker: "#FB923C",

  // Avtaar colors
  avtaarPalette: ["#FEE2E2", "#FEF9C3", "#DCFCE7", "#E0E7FF", "#F3E8FF"],
};

const DarkColors = {
  background: "#000000",
  surface: "#111111",
  textPrimary: "#E5E7EB",
  textSecondary: "#9CA3AF",
  border: "#2D2D2D",
  card: "#171717",
  accent: "#F97316",
  success: "#22C55E",
  danger: "#F87171",
  warning: "#FBBF24",
  muted: "#6B7280",

  // Gradients & Others
  gradientStart: "#3F3F46",
  gradientEnd: "#EA580C",
  marker: "#FB923C",

  // Avtaar colors
  avtaarPalette: ["#FEE2E2", "#FEF9C3", "#DCFCE7", "#E0E7FF", "#F3E8FF"],
};

export const Colors = { light: LightColors, dark: DarkColors };
export type ColorScheme = keyof typeof Colors;
