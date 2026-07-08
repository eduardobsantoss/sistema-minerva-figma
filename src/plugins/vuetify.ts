import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Vuetify is registered globally so its components/composables are available
// wherever they add real value (e.g. v-dialog/v-menu behavior for overlays),
// but the app intentionally does NOT wrap its root in <v-app> and does not
// rely on Vuetify's default Material theme/spacing. All current screens keep
// their original custom CSS (variables in src/styles/theme.css + inline
// styles), so introducing Vuetify does not change a single pixel of the
// existing UI. Vuetify's default component/theme colors are kept minimal on
// purpose - any Vuetify component used going forward must have its visuals
// explicitly overridden to match the existing design tokens.
export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
});
