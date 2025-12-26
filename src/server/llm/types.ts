// Shared types for AI provider abstraction

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

export type ReviewStyle =
  | 'authentisch'
  | 'kurz'
  | 'sachlich'
  | 'begeistert'
  | 'locker';

export interface GenerateReviewParams {
  topics: Topic[];
  hint?: string;
  style?: ReviewStyle;
}

export type AIProvider = 'openai' | 'anthropic';

