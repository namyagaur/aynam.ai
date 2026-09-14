"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import {
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
  ThemeDefinition,
  ThemeId,
  themes,
} from "./themes";
import { applyThemeToElement } from "./utils";

interface ThemeContextValue {
  theme: ThemeId;
  themeDefinition: ThemeDefinition;
  setTheme: (themeId: ThemeId) => void;
  availableThemes: ThemeDefinition[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const THEME_CHANGE_EVENT = "aynam-theme-change";

function getStoredTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
    return stored && themes[stored] ? stored : DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

function subscribeToTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentTheme = useSyncExternalStore(
    subscribeToTheme,
    getStoredTheme,
    () => DEFAULT_THEME_ID,
  );

  // Synchronize the selected theme with the root element after hydration.
  useEffect(() => {
    applyThemeToElement(currentTheme);
  }, [currentTheme]);

  const handleSetTheme = useCallback((themeId: ThemeId) => {
    if (!themes[themeId]) return;
    applyThemeToElement(themeId);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    } catch {
      // ignore localStorage errors (e.g. private browsing quota)
    }
  }, []);

  const value: ThemeContextValue = {
    theme: currentTheme,
    themeDefinition: themes[currentTheme] ?? themes[DEFAULT_THEME_ID],
    setTheme: handleSetTheme,
    availableThemes: Object.values(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
