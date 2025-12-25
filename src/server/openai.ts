import OpenAI from 'openai';
import { OPENAI_MODEL, SECRET_OPENAI } from 'astro:env/server';
import {
  PUBLIC_BRAND_NAME,
  PUBLIC_OWNER_NAME,
  PUBLIC_PROVIDER_MODE,
  PUBLIC_PROVIDER_PRONOUN,
  PUBLIC_REVIEW_STYLE,
} from 'astro:env/client';

// Singleton OpenAI client - only initialized on server
let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: SECRET_OPENAI });
  }
  return openaiClient;
}

export type Topic =
  | 'website'
  | 'beratung'
  | 'webapp'
  | 'optimierung'
  | 'entwicklung';

export const TOPIC_LABELS: Record<Topic, string> = {
  website: 'Website',
  beratung: 'Beratung',
  webapp: 'Web-App',
  optimierung: 'Website-Optimierung',
  entwicklung: 'Entwicklung'
};

interface GenerateReviewParams {
  topics: Topic[];
  hint?: string;
  style?: ReviewStyle;
}

export type ReviewStyle =
  | 'authentisch'
  | 'kurz'
  | 'sachlich'
  | 'begeistert'
  | 'locker';

// Benutzerfreundliche Fehlermeldungen für OpenAI-Fehler
function handleOpenAIError(error: unknown): never {
  if (error instanceof OpenAI.APIError) {
    // Log für Debugging (nur serverseitig sichtbar)
    console.error('[OpenAI Error]', error.status, error.message);

    switch (error.status) {
      case 401:
        throw new Error(
          'API-Konfigurationsfehler. Bitte kontaktiere den Administrator.'
        );
      case 429:
        // 429 = Quota exceeded ODER Rate limit
        if (
          error.message?.toLowerCase().includes('quota') ||
          error.message?.toLowerCase().includes('billing')
        ) {
          throw new Error(
            'OpenAI-Kontingent erschöpft. Bitte lade Guthaben auf oder prüfe dein Billing.'
          );
        }
        throw new Error(
          'Zu viele Anfragen. Bitte warte einen Moment und versuche es erneut.'
        );
      case 500:
      case 502:
      case 503:
        throw new Error(
          'Der KI-Service ist vorübergehend nicht verfügbar. Bitte versuche es später erneut.'
        );
      default:
        throw new Error(
          `Fehler bei der Textgenerierung. Bitte versuche es erneut. (${error.status})`
        );
    }
  }
  console.error('[OpenAI Error] Unknown:', error);
  throw new Error('Verbindungsfehler. Bitte prüfe deine Internetverbindung.');
}

export async function generateReviewText({
  topics,
  hint,
  style
}: GenerateReviewParams): Promise<string> {
  const client = getOpenAIClient();
  const model = OPENAI_MODEL;

  // Variation nonce to ensure unique outputs
  const variationNonce = crypto.randomUUID().slice(0, 8);

  const topicList = topics.map((t) => TOPIC_LABELS[t]).join(', ');
  const reviewStyle: ReviewStyle =
    style || ((PUBLIC_REVIEW_STYLE as ReviewStyle) ?? 'authentisch');
  const ownerName = PUBLIC_OWNER_NAME || 'Jan';
  const brandName = PUBLIC_BRAND_NAME || 'App bis Web';
  const providerMode = (PUBLIC_PROVIDER_MODE || 'solo').toLowerCase();
  const providerPronoun = (PUBLIC_PROVIDER_PRONOUN || 'er').toLowerCase();
  void providerMode;

  const systemPrompt = `Du bist ein Assistent, der authentische, individuelle Google-Bewertungen auf Deutsch schreibt.

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
- Nenne den Anbieter beim Namen: ${ownerName}. Du darfst auch ${brandName} erwähnen, aber immer als "${ownerName} von ${brandName}".
- Schreibe über den Anbieter in der 3. Person Singular: ${providerPronoun}/ihm/sein. Beispiel: "Man merkt, dass ${providerPronoun} weiß, was ${providerPronoun} tut."
- Schreibe aus Kundensicht ("ich").
- Variation-ID für diesen Text: ${variationNonce} (nutze diese zur internen Variation, erwähne sie nicht)`;

  const userPrompt = `Schreibe eine Google-Bewertung für ${ownerName}${brandName ? ` (${ownerName} von ${brandName})` : ''}.
Stil: ${reviewStyle}.
Themen: ${topicList}${hint ? `\n\nZusätzlicher Kontext vom Kunden: ${hint}` : ''}

Denk daran: max. 500 Zeichen, authentisch, variiert, Du-Ton.`;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 200,
      temperature: 0.9 // Higher for more variation
    });

    let reviewText = response.choices[0]?.message?.content?.trim() || '';

    // Safety check: if too long, request a shorter version
    if (reviewText.length > 500) {
      const retryResponse = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: reviewText },
          {
            role: 'user',
            content:
              'Der Text ist zu lang. Bitte kürze ihn auf maximal 450 Zeichen, ohne den Kern zu verlieren.'
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });
      reviewText =
        retryResponse.choices[0]?.message?.content?.trim() ||
        reviewText.slice(0, 500);
    }

    return reviewText;
  } catch (error) {
    handleOpenAIError(error);
  }
}
