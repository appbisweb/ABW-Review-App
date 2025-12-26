import OpenAI from 'openai';
import { OPENAI_MODEL, SECRET_OPENAI } from 'astro:env/server';
import type { GenerateReviewParams } from './types';
import { buildSystemPrompt, buildUserPrompt, buildRetryPrompt } from './prompts';

// Singleton OpenAI client
let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openaiClient) {
    if (!SECRET_OPENAI) {
      throw new Error(
        'OpenAI API key not configured. Set SECRET_OPENAI in your environment.'
      );
    }
    openaiClient = new OpenAI({ apiKey: SECRET_OPENAI });
  }
  return openaiClient;
}

/**
 * Handle OpenAI API errors with user-friendly messages
 */
function handleError(error: unknown): never {
  if (error instanceof OpenAI.APIError) {
    console.error('[OpenAI Error]', error.status, error.message);

    switch (error.status) {
      case 401:
        throw new Error(
          'API-Konfigurationsfehler. Bitte kontaktiere den Administrator.'
        );
      case 429:
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

/**
 * Generate review text using OpenAI
 */
export async function generateWithOpenAI(
  params: GenerateReviewParams
): Promise<string> {
  const client = getClient();
  const model = OPENAI_MODEL;
  const variationNonce = crypto.randomUUID().slice(0, 8);

  const systemPrompt = buildSystemPrompt(variationNonce);
  const userPrompt = buildUserPrompt(params);

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 200,
      temperature: 0.9
    });

    let reviewText = response.choices[0]?.message?.content?.trim() || '';

    // Retry if text exceeds character limit
    if (reviewText.length > 500) {
      const retryResponse = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: reviewText },
          { role: 'user', content: buildRetryPrompt() }
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
    handleError(error);
  }
}

