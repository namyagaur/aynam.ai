export type ThemeId =
  | "cherry-matcha"
  | "lagoon"
  | "butter-plum"
  | "forest"
  | "arctic"
  | "lavender";

export interface ThemeTokens {
  background: string;
  surface: string;
  surfaceElevated: string;

  primary: string;
  primarySoft: string;

  accent: string;
  accentSoft: string;

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
  /* =========================================================
     01 — CHERRY MATCHA
     Rich cherry environment + restrained matcha accents
     ========================================================= */

  "cherry-matcha": {
    id: "cherry-matcha",
    name: "Cherry Matcha",
    description: "Rich cherry, warm ivory, and fresh matcha",
    tokens: {
      background: "#F1E2E5",
      surface: "#FFF8F5",
      surfaceElevated: "#FFFFFF",

      primary: "#670626",
      primarySoft: "#E7C4CE",

      accent: "#9FBF78",
      accentSoft: "#DDEBCB",

      text: "#3B1722",
      textMuted: "#765F67",
      border: "#DECBD0",
    },
  },

  /* =========================================================
     02 — LAGOON
     Deep ocean teal + airy aqua + warm coral
     ========================================================= */

  lagoon: {
    id: "lagoon",
    name: "Lagoon",
    description: "Deep ocean teal, seafoam, and warm coral",
    tokens: {
      background: "#E7F2F0",
      surface: "#F8FCFB",
      surfaceElevated: "#FFFFFF",

      primary: "#075E63",
      primarySoft: "#C8E4E1",

      accent: "#E58F7C",
      accentSoft: "#F5D7CF",

      text: "#123D40",
      textMuted: "#667A7C",
      border: "#D3E4E1",
    },
  },

  /* =========================================================
     03 — BUTTER PLUM
     Warm butter + sophisticated plum
     ========================================================= */

  "butter-plum": {
    id: "butter-plum",
    name: "Butter Plum",
    description: "Soft butter, rich plum, and dusty lilac",
    tokens: {
      background: "#F8F1D8",
      surface: "#FFFBEF",
      surfaceElevated: "#FFFFFF",

      primary: "#542650",
      primarySoft: "#E6D4E4",

      accent: "#D6A94A",
      accentSoft: "#F1E3B8",

      text: "#332033",
      textMuted: "#766A75",
      border: "#E5DCC7",
    },
  },

  /* =========================================================
     04 — FOREST
     Pine green + moss + peach
     ========================================================= */

  forest: {
    id: "forest",
    name: "Forest",
    description: "Deep pine, moss, and soft peach",
    tokens: {
      background: "#E8EEE4",
      surface: "#F8FAF5",
      surfaceElevated: "#FFFFFF",

      primary: "#164A38",
      primarySoft: "#C9DCCF",

      accent: "#D89A82",
      accentSoft: "#F0D8CF",

      text: "#18362B",
      textMuted: "#68776F",
      border: "#D6DFD2",
    },
  },

  /* =========================================================
     05 — ARCTIC
     Icy blue-grey + cobalt + cool lavender
     ========================================================= */

  arctic: {
    id: "arctic",
    name: "Arctic",
    description: "Icy blue, cool grey, and deep cobalt",
    tokens: {
      background: "#EAF1F6",
      surface: "#F8FBFD",
      surfaceElevated: "#FFFFFF",

      primary: "#2454A6",
      primarySoft: "#D2DFF3",

      accent: "#79AFC7",
      accentSoft: "#D8EAF1",

      text: "#172A45",
      textMuted: "#687587",
      border: "#D7E1EA",
    },
  },

  /* =========================================================
     06 — LAVENDER
     Original Aynam atmosphere
     ========================================================= */

  lavender: {
    id: "lavender",
    name: "Lavender",
    description: "Soft lavender, lilac, and violet",
    tokens: {
      background: "#F6F4FB",
      surface: "#FFFDF7",
      surfaceElevated: "#FFFFFF",

      primary: "#7C5CFC",
      primarySoft: "#EFE9FF",

      accent: "#8665FF",
      accentSoft: "#F3EFFF",

      text: "#19191F",
      textMuted: "#6F7280",
      border: "rgba(124, 92, 252, 0.08)",
    },
  },
};

/*
 * Cherry Matcha is now the final default Aynam theme.
 *
 * If an existing localStorage value exists,
 * the ThemeProvider should continue respecting it.
 */
export const DEFAULT_THEME_ID: ThemeId = "cherry-matcha";

export const THEME_STORAGE_KEY = "aynam-theme";