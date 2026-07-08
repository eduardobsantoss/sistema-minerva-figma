
  # Sistema Minerva V2

  This is a code bundle for Sistema Minerva V2. The original project is available at https://www.figma.com/design/4GBmnlLmfRCSmNdMaDhaZn/Sistema-Minerva-V2.

  The app is built with **Vue 3** (`<script setup>` + Composition API) and **Vite**. **Vuetify 3** is installed and available application-wide for future use, but the existing screens intentionally keep their original custom CSS/inline styles rather than Vuetify's default component styling, to preserve the current visual design pixel-for-pixel.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Other scripts

  - `npm run build` — production build.
  - `npm run type-check` — type-checks `.vue`/`.ts` files with `vue-tsc`.
  - `npm run visual-diff` — compares screenshots between two running instances of the app (e.g. before/after a change) view by view and writes pixel diffs to `scripts/visual-diff-output/`. See `scripts/visual-diff.mjs` for usage.
  