import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { generateReviewText, type ReviewStyle, type Topic } from '@/server/openai';
import { checkRateLimit } from '@/server/rate-limit';

const topicEnum = z.enum([
  'website',
  'beratung',
  'webapp',
  'optimierung',
  'entwicklung'
]);

const styleEnum = z.enum(['authentisch', 'kurz', 'sachlich', 'begeistert', 'locker']);

export const server = {
  generateReview: defineAction({
    input: z.object({
      topics: z
        .array(topicEnum)
        .min(1, 'Bitte wähle mindestens ein Thema aus'),
      hint: z
        .string()
        .max(80, 'Das Stichwort darf maximal 80 Zeichen haben')
        .optional(),
      style: styleEnum.optional()
    }),
    handler: async (input, context) => {
      // Rate Limiting: IP-Adresse aus Request Headers
      const clientIP =
        context.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        context.request.headers.get('x-real-ip') ||
        'unknown';

      const rateLimit = checkRateLimit(clientIP);

      if (!rateLimit.allowed) {
        const minutesLeft = Math.ceil(
          (rateLimit.resetAt.getTime() - Date.now()) / 60000
        );
        throw new ActionError({
          code: 'TOO_MANY_REQUESTS',
          message: `Du hast das Limit erreicht. Bitte warte noch ${minutesLeft} Minuten.`
        });
      }

      const reviewText = await generateReviewText({
        topics: input.topics as Topic[],
        hint: input.hint,
        style: input.style as ReviewStyle | undefined
      });

      return {
        reviewText,
        remaining: rateLimit.remaining
      };
    }
  })
};
