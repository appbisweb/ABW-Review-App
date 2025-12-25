# ABW Review App

Eine kleine, schnelle Landingpage, die Kund:innen hilft, **Google-Bewertungen** für **Jan (App bis Web)** zu schreiben.  
Kernidee: Themen auswählen → Review-Text (≤ 500 Zeichen) generieren → Text anpassen → bei Google posten.

## Features

- **Mehrfachauswahl** der Themen: Website, Beratung, Web-App, Website-Optimierung, Entwicklung
- **Sprachstil wählbar** (UI): authentisch / locker / sachlich / begeistert / kurz
- **Einzelunternehmer-Logik**: Der Text spricht über **Jan** in **3. Person Singular** (er/ihm/sein), **kein „Team“**, keine Firma
- **≤ 500 Zeichen** serverseitig abgesichert
- **Astro Server Actions** statt API-Routen
- **Rate Limit** (Basis-Schutz): 5 Generierungen / Stunde / IP
- **EU-konform**: Keine Google Fonts Requests – JetBrains Mono wird via **Astro Experimental Fonts API** lokal gecached/ausgeliefert

## Setup

### 1) Install

```bash
npm install
```

### 2) Environment Variables (Pflicht)

Diese Variablen sind in `astro.config.mjs` als Pflicht/Defaults hinterlegt:

```env
# Pflicht
SECRET_OPENAI=sk-...
PUBLIC_GOOGLE_PROFILE=https://... (dein Google-Profil/Review-Link)

# Optional (Defaults greifen, wenn nicht gesetzt)
OPENAI_MODEL=gpt-4o-mini
PUBLIC_BRAND_NAME=App bis Web
PUBLIC_OWNER_NAME=Jan
PUBLIC_PROVIDER_MODE=solo
PUBLIC_PROVIDER_PRONOUN=er
PUBLIC_REVIEW_STYLE=authentisch
```

**Wichtig:** `SECRET_OPENAI` ist server-only. Niemals `PUBLIC_` davor setzen.

### 3) Dev / Build

```bash
npm run dev
```

Dev läuft auf `http://localhost:4321`.

```bash
npm run build
```

## OpenAI Billing / 429 “quota”

Wenn du Fehler wie „You exceeded your current quota“ siehst, liegt das oft an **Billing/Guthaben**, nicht am Modellpreis.  
Auch mit hinterlegter Karte kann `credit balance` noch `0.00` sein. Dann musst du Guthaben hinzufügen (Prepaid) oder dein Billing aktivieren.

## Fonts (EU / Privacy)

Wir verwenden Astros **Experimental Fonts API** (ab `astro@5.7.0`), damit JetBrains Mono lokal ausgeliefert wird statt über Google.  
Siehe Astro-Doku: `https://docs.astro.build/en/reference/experimental-flags/fonts/`

## shadcn/ui: Warum `create --preset ... --template vite` bei Astro nicht passt

Der Befehl `shadcn create --template vite` ist für **neue** Projekte (Vite-Template) gedacht. In einem bestehenden **Astro**-Projekt solltest du:

- `npx shadcn@latest init` (Projekt initialisieren)
- `npx shadcn@latest add ...` (Komponenten hinzufügen)

Der Preset-Builder unter `https://ui.shadcn.com/create?...` ist super zum Zusammenklicken, aber **`--template vite`** kollidiert mit Astro.  
Wenn du exakt diesen Look willst, setzen wir die relevanten Werte in `components.json` + Theme/CSS um (Style: Maia, Base: Gray, Theme: Pink).
