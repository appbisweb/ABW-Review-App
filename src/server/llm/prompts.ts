import type { CustomerType, GenerateReviewParams, ReviewStyle } from './types';
import { TOPIC_LABELS } from './types';

// Access public env vars directly via import.meta.env (works on both client and server)
const PUBLIC_BRAND_NAME = import.meta.env.PUBLIC_BRAND_NAME || 'App bis Web';
const PUBLIC_OWNER_NAME = import.meta.env.PUBLIC_OWNER_NAME || 'Jan';
const PUBLIC_PROVIDER_MODE = import.meta.env.PUBLIC_PROVIDER_MODE || 'solo';
const PUBLIC_PROVIDER_PRONOUN = import.meta.env.PUBLIC_PROVIDER_PRONOUN || 'er';
const PUBLIC_REVIEW_STYLE = import.meta.env.PUBLIC_REVIEW_STYLE || 'authentisch';

/**
 * Build the system prompt for review generation
 * @param variationNonce - Unique ID for variation
 * @param customerType - 'individual' (ich/meine) or 'company' (wir/unsere)
 */
export function buildSystemPrompt(
  variationNonce: string,
  customerType: CustomerType = 'individual'
): string {
  const ownerName = PUBLIC_OWNER_NAME || 'Jan';
  const brandName = PUBLIC_BRAND_NAME || 'App bis Web';
  const providerMode = (PUBLIC_PROVIDER_MODE || 'solo').toLowerCase();
  const providerPronoun = (PUBLIC_PROVIDER_PRONOUN || 'er').toLowerCase();
  void providerMode; // Currently unused but available for future team mode

  // Customer perspective based on type (Einzelunternehmen vs Firma/Unternehmen)
  const customerPerspective =
    customerType === 'company'
      ? 'Der Kunde ist eine FIRMA/UNTERNEHMEN mit mehreren Mitarbeitern. Schreibe aus Firmensicht (wir/unsere/uns). Beispiel: "Jan hat unsere Website umgesetzt" oder "Wir haben Jan beauftragt".'
      : 'Der Kunde ist ein EINZELUNTERNEHMEN (eine Person). Schreibe aus Einzelunternehmer-Sicht (ich/meine/mir). Beispiel: "Jan hat meine Website erstellt" oder "Ich habe Jan kontaktiert".';

  return `Du bist ein Assistent, der authentische, individuelle Google-Bewertungen auf Deutsch schreibt.

WICHTIGE REGELN:
- KEINE Anführungszeichen um den Text! Gib nur den reinen Bewertungstext aus.
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
- ${customerPerspective}
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

