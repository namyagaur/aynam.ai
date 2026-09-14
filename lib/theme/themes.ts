export type ThemeId =
  | "merlot"
  | "espresso"
  | "citron"
  | "lotus"
  | "raspberry-ice"
  | "lavender";

export interface ThemeTokens {
  background: string;
  surface: string;
  surfaceElevated: string;
  primary: string;
  primarySoft: string;
  accent: string;
  text: string;
  textMuted: string;
  border: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  tokens: ThemeTokens;
}

export const themes: Record<ThemeId, ThemeDefinition> = {
  merlot: {
    id: "merlot",
    name: "Merlot",
    description: "Deep merlot, butter yellow, and dusty pink",
    tokens: {
      background: "#F4E7C1",
      surface: "#FFF8E8",
      surfaceElevated: "#FFFFFF",
      primary: "#63262D",
      primarySoft: "#E8C7A8",
      accent: "#D5A85A",
      text: "#32191C",
      textMuted: "#806B6D",
      border: "#E3D2C0",
    },
  },
  espresso: {
    id: "espresso",
    name: "Espresso",
    description: "Espresso brown and soft peony pink",
    tokens: {
      background: "#F7E8ED",
      surface: "#FFF7F8",
      surfaceElevated: "#FFFFFF",
      primary: "#3E2723",
      primarySoft: "#F4C9D6",
      accent: "#C98FA2",
      text: "#2C1B1A",
      textMuted: "#786868",
      border: "#E5D4D7",
    },
  },
  citron: {
    id: "citron",
    name: "Citron",
    description: "Soft citron/chartreuse and rich Tyrian purple",
    tokens: {
      background: "#CAD183",
      surface: "#F3F1D5",
      surfaceElevated: "#FFFDF2",
      primary: "#66023C",
      primarySoft: "#E4E6B4",
      accent: "#8A315F",
      text: "#32142A",
      textMuted: "#70655F",
      border: "#D8D9B2",
    },
  },
  lotus: {
    id: "lotus",
    name: "Lotus",
    description: "Dark green, moss green, beige, and rosy brown",
    tokens: {
      background: "#F7F4D5",
      surface: "#FFFDF2",
      surfaceElevated: "#FFFFFF",
      primary: "#0A3323",
      primarySoft: "#839958",
      accent: "#D3968C",
      text: "#17352B",
      textMuted: "#687268",
      border: "#D9D8C1",
    },
  },
  "raspberry-ice": {
    id: "raspberry-ice",
    name: "Raspberry Ice",
    description: "Raspberry wine, icy blue, and soft grey/pink",
    tokens: {
      background: "#E8EEF0",
      surface: "#F7F5F4",
      surfaceElevated: "#FFFFFF",
      primary: "#7B3F4A",
      primarySoft: "#C7D9DC",
      accent: "#B96C82",
      text: "#30272A",
      textMuted: "#6F696B",
      border: "#D7DADC",
    },
  },
  lavender: {
    id: "lavender",
    name: "Lavender",
    description: "Existing Aynam theme with soft lavender, lilac, and purple accents",
    tokens: {
      background: "#F6F4FB",
      surface: "#FFFDF7",
      surfaceElevated: "#FFFFFF",
      primary: "#7C5CFC",
      primarySoft: "#EFE9FF",
      accent: "#8665FF",
      text: "#19191F",
      textMuted: "#6F7280",
      border: "rgba(124, 92, 252, 0.08)",
    },
  },
};

/**
 * Default theme during development as requested.
 * Production / final default can be switched to 'merlot'.
 */
export const DEFAULT_THEME_ID: ThemeId = "lavender";

export const THEME_STORAGE_KEY = "aynam-theme";

