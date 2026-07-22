import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { useLocalStorage } from '@vueuse/core';

// ─── Design system: Patch Bay / "Electric Signal" ──────────────────────────
// Usage law (full version in client/DESIGN.md):
//   surfaces  background → surface → surface-variant   elevation ladder
//   content   on-surface (+ text-medium-emphasis)      text/icons, opacity tiers
//   primary   the ONE interactive color                buttons, links, active, focus
//   accent    exactly one live moment per screen        live-tile ring only
//   status    success / error                           state only, never decor
//   secondary neutral, reserved                          never referenced directly
// ────────────────────────────────────────────────────────────────────────────

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
          background: '#ECEDEA',
          surface: '#F7F6F3',
          'surface-variant': '#E3E0D9',
          'on-surface-variant': '#3A363C',
          primary: '#2F5FE0',
          'on-primary': '#FFFFFF',
          accent: '#B47E27',
          'on-accent': '#FFFFFF',
          secondary: '#C9C3B8',
          'on-secondary': '#1A181C',
          success: '#2E8F55',
          'on-success': '#FFFFFF',
          error: '#C6412C',
          'on-error': '#FFFFFF',
          'on-background': '#1A181C',
          'on-surface': '#1A181C',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#141216',
          surface: '#1E1B21',
          'surface-variant': '#2A262F',
          'on-surface-variant': '#D8D3CB',
          primary: '#3D7EFF',
          'on-primary': '#FFFFFF',
          accent: '#E0A94A',
          'on-accent': '#141216',
          secondary: '#423D48',
          'on-secondary': '#EDEAE4',
          success: '#3FA96A',
          'on-success': '#0E2016',
          error: '#E0523B',
          'on-error': '#FFFFFF',
          'on-background': '#EDEAE4',
          'on-surface': '#EDEAE4',
        },
      },
    },
  },
});

export default vuetify;
