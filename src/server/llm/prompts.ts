import {
  PUBLIC_BRAND_NAME,
  PUBLIC_OWNER_NAME,
  PUBLIC_PROVIDER_MODE,
  PUBLIC_PROVIDER_PRONOUN,
  PUBLIC_REVIEW_STYLE,
} from 'astro:env/client';
import type { GenerateReviewParams, ReviewStyle } from './types';
import { TOPIC_LABELS } from './types';

/**
 * Build the system prompt for review generation
 */
export function buildSystemPrompt(variationNonce: string): string {
  const ownerName = PUBLIC_OWNER_NAME || 'Jan';
  const brandName = PUBLIC_BRAND_NAME || 'App bis Web';
  const providerMode = (PUBLIC_PROVIDER_MODE || 'solo').toLowerCase();
  const providerPronoun = (PUBLIC_PROVIDER_PRONOUN || 'er').toLowerCase();
  void providerMode; // Currently unused but available for future team mode

  return `Du bist ein Assistent, der authentische, individuelle Google-Bewertungen auf Deutsch schreibt.

WICHTIGE REGELN:
- Schreibe im lockeren Du-Ton, als wäre der Kunde ein zufriedener Nutzer
- MAXIMAL 500 Zeichen (inkl. Leerzeichen) - das ist kritisch!
- 1-3 natürliche Sätze
- KEINE Emojis
- KEINE generischen Floskeln wie "sehr zu empfehlen" oder "top Service"
- KEINE erfundenen harten Fakten (keine konkreten Preise, Zeiten, Namen)
- Variiere Satzstruktur und Perspektive stark
- Die genannten Themen müssen erkennbar einfließen
- Klingt wie eine echte Person, nicht wie Marketing-Copy
- Der Anbieter ist eine EINZELPERSON (kein Team, keine Firma). Vermeide Wörter wie "Team", "Firma" sowie Pronomen im Plural ("wir" als Anbieter) und das Anbieter-Pronomen "sie".
- Nenne den Anbieter beim Namen: ${ownerName}. Du darfst auch ${brandName} erwähnen, oder in Kombination "${ownerName} von ${brandName}".
- Schreibe über den Anbieter in der 3. Person Singular: ${providerPronoun}/ihm/sein.
- Schreibe aus Kundensicht ("ich").
- Variation-ID für diesen Text: ${variationNonce} (nutze diese zur internen Variation, erwähne sie nicht)`;
}

/**
 * Build the user prompt for review generation
 */
export function buildUserPrompt(params: GenerateReviewParams): string {
  const ownerName = PUBLIC_OWNER_NAME || 'Jan';
  const brandName = PUBLIC_BRAND_NAME || 'App bis Web';
  const reviewStyle: ReviewStyle =
    params.style || ((PUBLIC_REVIEW_STYLE as ReviewStyle) ?? 'authentisch');
  const topicList = params.topics.map((t) => TOPIC_LABELS[t]).join(', ');

  return `Schreibe eine Google-Bewertung für ${ownerName}${brandName ? ` (${ownerName} von ${brandName})` : ''}.
Stil: ${reviewStyle}.
Themen: ${topicList}${params.hint ? `\n\nZusätzlicher Kontext vom Kunden: ${params.hint}` : ''}

Denk daran: max. 500 Zeichen, authentisch, variiert, Du-Ton.`;
}

/**
 * Build the retry prompt when text is too long
 */
export function buildRetryPrompt(): string {
  return 'Der Text ist zu lang. Bitte kürze ihn auf maximal 450 Zeichen, ohne den Kern zu verlieren.';
}

