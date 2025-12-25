// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react()],
  env: {
    schema: {
      // Server-only: OpenAI API Key (Pflicht)
      SECRET_OPENAI: envField.string({
        context: 'server',
        access: 'secret',
      }),
      // Client-sichtbar: Google Profil URL (Pflicht)
      PUBLIC_GOOGLE_PROFILE: envField.string({
        context: 'client',
        access: 'public',
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
});
