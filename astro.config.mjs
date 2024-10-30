import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

export default defineConfig({
  integrations: [tailwind(), react()],
  vite: {
    ssr: {
      noExternal: ['react-dropzone'],
    },
  },
  // plugins: [animations],
});