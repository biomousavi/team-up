import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

const vuetify = createVuetify({
  ssr: false,
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1a73e8',
          secondary: '#5f6368',
        },
      },
    },
  },
});

export default vuetify;
