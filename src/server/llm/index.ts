/**
 * LLM Provider Abstraction
 *
 * This module provides a unified interface for AI text generation,
 * supporting both OpenAI and Anthropic providers.
 *
 * Provider selection is controlled via the AI_PROVIDER environment variable.
 */

import { AI_PROVIDER } from 'astro:env/server';
import { generateWithOpenAI } from './openai';
import { generateWithAnthropic } from './anthropic';
import type { GenerateReviewParams, Topic, ReviewStyle, AIProvider } from './types';

// Re-export types for convenience
export type { Topic, ReviewStyle, GenerateReviewParams, AIProvider };
export { TOPIC_LABELS } from './types';

/**
 * Get the currently configured AI provider
 */
export function getAIProvider(): AIProvider {
  const provider = (AI_PROVIDER || 'openai').toLowerCase();
  if (provider !== 'openai' && provider !== 'anthropic') {
    console.warn(
      `[LLM] Unknown AI_PROVIDER "${provider}", falling back to openai`
    );
    return 'openai';
  }
  return provider as AIProvider;
}

/**
 * Generate review text using the configured AI provider
 *
 * @param params - Review generation parameters
 * @returns Generated review text (max 500 characters)
 * @throws Error with user-friendly message on API failures
 */
export async function generateReviewText(
  params: GenerateReviewParams
): Promise<string> {
  const provider = getAIProvider();

  console.log(`[LLM] Using provider: ${provider}`);

  switch (provider) {
    case 'anthropic':
      return generateWithAnthropic(params);
    case 'openai':
    default:
      return generateWithOpenAI(params);
  }
}

