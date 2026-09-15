import { ThemeId, themes } from "./themes";

/**
 * Generates an object of CSS variable name -> value for a given theme ID.
 */
export function getThemeCssVariables(themeId: ThemeId): Record<string, string> {
  const theme = themes[themeId] ?? themes.lavender;
  const { tokens } = theme;

  return {
    "--theme-background": tokens.background,
    "--theme-surface": tokens.surface,
    "--theme-surface-elevated": tokens.surfaceElevated,
    "--theme-primary": tokens.primary,
    "--theme-primary-soft": tokens.primarySoft,
    "--theme-accent": tokens.accent,
    "--theme-accent-soft": tokens.accentSoft,
    "--theme-text": tokens.text,
    "--theme-text-muted": tokens.textMuted,
    "--theme-border": tokens.border,
  };
}

/**
 * Applies theme CSS variables and data-theme attribute directly to a DOM element (defaults to document.documentElement).
 */
export function applyThemeToElement(themeId: ThemeId, element?: HTMLElement) {
  if (typeof document === "undefined") return;
  const target = element ?? document.documentElement;
  const vars = getThemeCssVariables(themeId);

  target.setAttribute("data-theme", themeId);
  for (const [key, value] of Object.entries(vars)) {
    target.style.setProperty(key, value);
  }
}

