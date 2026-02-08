import { useCallback, useEffect, useState } from 'react';
import { themeManager } from '../theme/ThemeManager';
import type { Theme } from '../theme/types';

export function useTheme() {
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await themeManager.init();
      if (!mounted) return;

      setActiveTheme(themeManager.getActiveTheme());
      setThemes(themeManager.getThemes());
      setInitialized(true);
    };

    init();

    const unsubscribe = themeManager.onChange((theme) => {
      if (!mounted) return;
      setActiveTheme(theme);
      setThemes(themeManager.getThemes());
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const setTheme = useCallback(async (id: string) => {
    await themeManager.setTheme(id);
  }, []);

  const importTheme = useCallback(async (jsonString: string) => {
    const theme = await themeManager.importTheme(jsonString);
    setThemes(themeManager.getThemes());
    return theme;
  }, []);

  const deleteTheme = useCallback(async (id: string) => {
    await themeManager.deleteTheme(id);
    setThemes(themeManager.getThemes());
  }, []);

  return {
    activeTheme,
    themes,
    initialized,
    setTheme,
    importTheme,
    deleteTheme,
  };
}
