import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_MODEL, SECRET_ANTHROPIC } from 'astro:env/server';
import type { GenerateReviewParams } from './types';
import { buildSystemPrompt, buildUserPrompt, buildRetryPrompt } from './prompts';

// Singleton Anthropic client
let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (!anthropicClient) {
    if (!SECRET_ANTHROPIC) {
      throw new Error(
        'Anthropic API key not configured. Set SECRET_ANTHROPIC in your environment.'
      );
    }
    anthropicClient = new Anthropic({ apiKey: SECRET_ANTHROPIC });
  }
  return anthropicClient;
}

/**
 * Handle Anthropic API errors with user-friendly messages
 */
function handleError(error: unknown): never {
  if (error instanceof Anthropic.APIError) {
    console.error('[Anthropic Error]', error.status, error.message);

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
            'Anthropic-Kontingent erschöpft. Bitte prüfe dein Billing.'
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
  console.error('[Anthropic Error] Unknown:', error);
  throw new Error('Verbindungsfehler. Bitte prüfe deine Internetverbindung.');
}

/**
 * Generate review text using Anthropic Claude
 */
export async function generateWithAnthropic(
  params: GenerateReviewParams
): Promise<string> {
  const client = getClient();
  const model = ANTHROPIC_MODEL;
  const variationNonce = crypto.randomUUID().slice(0, 8);

  const systemPrompt = buildSystemPrompt(variationNonce);
  const userPrompt = buildUserPrompt(params);

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    // Extract text from response
    const textBlock = response.content.find((block) => block.type === 'text');
    let reviewText = textBlock?.type === 'text' ? textBlock.text.trim() : '';

    // Retry if text exceeds character limit
    if (reviewText.length > 500) {
      const retryResponse = await client.messages.create({
        model,
        max_tokens: 150,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: reviewText },
          { role: 'user', content: buildRetryPrompt() }
        ]
      });

      const retryTextBlock = retryResponse.content.find(
        (block) => block.type === 'text'
      );
      reviewText =
        (retryTextBlock?.type === 'text' ? retryTextBlock.text.trim() : '') ||
        reviewText.slice(0, 500);
    }

    return reviewText;
  } catch (error) {
    handleError(error);
  }
}

