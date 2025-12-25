import OpenAI from 'openai';
import { SECRET_OPENAI } from 'astro:env/server';

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
}

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
        if (error.message?.includes('quota')) {
          throw new Error(
            'Der Service ist vorübergehend nicht verfügbar. Bitte später erneut versuchen.'
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
  hint
}: GenerateReviewParams): Promise<string> {
  const client = getOpenAIClient();
  // gpt-4o-mini ist schnell und günstig, Fallback auf gpt-3.5-turbo
  const model = import.meta.env.OPENAI_MODEL || 'gpt-3.5-turbo';

  // Variation nonce to ensure unique outputs
  const variationNonce = crypto.randomUUID().slice(0, 8);

  const topicList = topics.map((t) => TOPIC_LABELS[t]).join(', ');

  const systemPrompt = `Du bist ein Assistent, der authentische, individuelle Google-Bewertungen für "App bis Web" (ein Webentwicklungs-Unternehmen) auf Deutsch schreibt.

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
- Variation-ID für diesen Text: ${variationNonce} (nutze diese zur internen Variation, erwähne sie nicht)`;

  const userPrompt = `Schreibe eine Google-Bewertung für "App bis Web" zu folgenden Themen: ${topicList}${hint ? `\n\nZusätzlicher Kontext vom Kunden: ${hint}` : ''}

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
