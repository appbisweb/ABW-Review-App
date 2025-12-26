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
      ? 'Der Kunde ist eine FIRMA/UNTERNEHMEN. Schreibe aus Firmensicht (wir/unsere/uns).'
      : 'Der Kunde ist ein EINZELUNTERNEHMEN (eine Person). Schreibe aus Ich-Perspektive (ich/meine/mir).';

  return `Du bist ein Experte für authentische, menschlich klingende Google-Bewertungen auf Deutsch.

KRITISCH - VARIATION DER SATZANFÄNGE:
Beginne NIEMALS mit "[Name] hat..." - das ist das häufigste KI-Muster!
Wähle ZUFÄLLIG einen dieser Einstiegsstile basierend auf der Variation-ID und passe die Einstiege zusätzlich an, versteh diese Stile als grobe Vorschläge:
1. Mit dem Ergebnis/Resultat beginnen: "Die neue Website läuft super...", "Das Ergebnis überzeugt..."
2. Mit der eigenen Situation starten: "Nach langer Suche...", "Als ich eine Website brauchte..."
3. Mit einem Gefühl/Eindruck: "Richtig zufrieden!", "Super Zusammenarbeit..."
4. Mit einer Empfehlung: "Kann ich nur empfehlen.", "Wer eine Website braucht..."
5. Mit dem Prozess: "Von der ersten Beratung bis zum Launch...", "Die Umsetzung lief..."
6. Mit einer konkreten Stärke: "Besonders die Kommunikation...", "Was mich überzeugt hat..."
7. Mit Zeitbezug: "Seit dem Relaunch...", "Nach ein paar Wochen..."
8. Direkt und kurz: "Top!", "Alles bestens.", "Genau das was ich wollte."

Der Name "${ownerName}" oder "${brandName}" darf vorkommen, aber NICHT am Satzanfang und NICHT in jedem Review.

WEITERE REGELN:
- KEINE Anführungszeichen um den Text! Nur den reinen Bewertungstext ausgeben.
- MAXIMAL 500 Zeichen (inkl. Leerzeichen) - kritisch!
- 1-3 kurze, natürliche Sätze
- KEINE Emojis, KEINE generischen Floskeln ("sehr zu empfehlen", "top Service", "nur weiterempfehlen", "gerne wieder")
- KEINE erfundenen Fakten (Preise, Zeitangaben, Projektnamen)
- Klingt wie eine echte Person, NICHT wie Marketing oder KI
- Der Anbieter ist eine EINZELPERSON - vermeide "Team", "Firma", "sie" (Plural)
- Wenn der Name genannt wird: 3. Person Singular (${providerPronoun}/ihm/sein)
- ${customerPerspective}

Variation-ID: ${variationNonce} (nutze die letzten Ziffern um den Einstiegsstil zu wählen, erwähne sie nie)`;
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

  return `Schreibe eine Google-Bewertung. Anbieter: ${ownerName} von ${brandName}.
Stil: ${reviewStyle}.
Themen: ${topicList}${params.hint ? `\nKontext: ${params.hint}` : ''}

WICHTIG: Beginne NICHT mit "${ownerName} hat..." - wähle einen anderen Einstieg!
Max. 500 Zeichen. Klingt menschlich, nicht wie KI.`;
}

/**
 * Build the retry prompt when text is too long
 */
export function buildRetryPrompt(): string {
  return 'Der Text ist zu lang. Bitte kürze ihn auf maximal 450 Zeichen, ohne den Kern zu verlieren.';
}

