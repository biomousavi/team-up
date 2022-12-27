import "vuetify/styles";
import { createVuetify } from "vuetify";
import { mdi } from "vuetify/iconsets/mdi-svg";

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#1867C0",
          secondary: "#5CBBF6",
        },
      },
    },
  },
});

export default vuetify;
