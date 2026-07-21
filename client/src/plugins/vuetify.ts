import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { useLocalStorage } from '@vueuse/core';

// Shared with useThemeToggle() — module scope so it can be read here
// (before Pinia is installed in main.ts) and reused by the toggle later.
export const themePreference = useLocalStorage<'light' | 'dark'>('store/user/theme', 'dark');

const vuetify = createVuetify({
  ssr: false,
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  theme: {
    defaultTheme: themePreference.value,
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#EDEEEC',
          surface: '#F7F6F3',
          'surface-variant': '#E4E1DA',
          primary: '#2F6690',
          'on-primary': '#FFFFFF',
          secondary: '#C8874B',
          'on-secondary': '#17151A',
          success: '#4CAF6D',
          'on-success': '#0E2016',
          error: '#E8503A',
          'on-error': '#FFFFFF',
          'on-background': '#1B191E',
          'on-surface': '#1B191E',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#17151A',
          surface: '#211E24',
          'surface-variant': '#332F38',
          primary: '#2F6690',
          'on-primary': '#FFFFFF',
          secondary: '#C8874B',
          'on-secondary': '#17151A',
          success: '#4CAF6D',
          'on-success': '#0E2016',
          error: '#E8503A',
          'on-error': '#FFFFFF',
          'on-background': '#EFEDE8',
          'on-surface': '#EFEDE8',
        },
      },
    },
  },
});

export default vuetify;
