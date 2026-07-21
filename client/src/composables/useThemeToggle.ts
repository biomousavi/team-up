import { useTheme } from 'vuetify';
import { themePreference } from '@/plugins/vuetify';

export function useThemeToggle() {
  const theme = useTheme();

  function toggleTheme() {
    const next = theme.global.name.value === 'dark' ? 'light' : 'dark';
    theme.global.name.value = next;
    themePreference.value = next;
  }

  function isDark() {
    return theme.global.current.value.dark;
  }

  return { toggleTheme, isDark };
}
