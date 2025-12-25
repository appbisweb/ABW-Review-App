// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
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
  experimental: {
    // Astro Experimental Fonts API: Fonts werden lokal gecached/ausgeliefert (Privacy + Performance)
    // Docs: https://docs.astro.build/en/reference/experimental-flags/fonts/
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: 'JetBrains Mono',
        cssVariable: '--font-jetbrains-mono',
      },
    ],
  },
  env: {
    schema: {
      // Server-only: OpenAI API Key (Pflicht)
      SECRET_OPENAI: envField.string({
        context: 'server',
        access: 'secret',
      }),
      // Optional: Modell für OpenAI (Default ist günstig/schnell)
      OPENAI_MODEL: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
        default: 'gpt-4o-mini',
      }),
      // Client-sichtbar: Google Profil URL (Pflicht)
      PUBLIC_GOOGLE_PROFILE: envField.string({
        context: 'client',
        access: 'public',
      }),
      // Public Konfiguration: Brand/Name & Sprachstil
      PUBLIC_BRAND_NAME: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: 'App bis Web',
      }),
      PUBLIC_OWNER_NAME: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: 'Jan',
      }),
      PUBLIC_PROVIDER_MODE: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: 'solo',
      }),
      PUBLIC_PROVIDER_PRONOUN: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: 'er',
      }),
      PUBLIC_REVIEW_STYLE: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: 'authentisch',
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
