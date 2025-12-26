import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the environment variables
vi.mock('astro:env/client', () => ({
  PUBLIC_BRAND_NAME: 'Test Brand',
  PUBLIC_OWNER_NAME: 'Max',
  PUBLIC_PROVIDER_MODE: 'solo',
  PUBLIC_PROVIDER_PRONOUN: 'er',
  PUBLIC_REVIEW_STYLE: 'authentisch',
}));

// Import after mocking
import { buildSystemPrompt, buildUserPrompt } from '../llm/prompts';

describe('Prompt Generation', () => {
  describe('buildSystemPrompt', () => {
    it('should include owner name from env', () => {
      const prompt = buildSystemPrompt('test-nonce');
      expect(prompt).toContain('Max');
    });

    it('should include brand name from env', () => {
      const prompt = buildSystemPrompt('test-nonce');
      expect(prompt).toContain('Test Brand');
    });

    it('should include variation nonce', () => {
      const nonce = 'abc12345';
      const prompt = buildSystemPrompt(nonce);
      expect(prompt).toContain(nonce);
    });

    it('should include character limit rule', () => {
      const prompt = buildSystemPrompt('test-nonce');
      expect(prompt).toContain('500');
      expect(prompt).toContain('MAXIMAL');
    });

    it('should use individual perspective by default', () => {
      const prompt = buildSystemPrompt('test-nonce');
      expect(prompt).toContain('Einzelkunden-Sicht');
      expect(prompt).toContain('ich/meine');
    });

    it('should use company perspective when specified', () => {
      const prompt = buildSystemPrompt('test-nonce', 'company');
      expect(prompt).toContain('Firmensicht');
      expect(prompt).toContain('wir/unsere');
    });

    it('should mention the pronoun', () => {
      const prompt = buildSystemPrompt('test-nonce');
      expect(prompt).toContain('er/ihm/sein');
    });
  });

  describe('buildUserPrompt', () => {
    it('should include all selected topics', () => {
      const prompt = buildUserPrompt({
        topics: ['website', 'beratung'],
      });
      expect(prompt).toContain('Website');
      expect(prompt).toContain('Beratung');
    });

    it('should include hint when provided', () => {
      const prompt = buildUserPrompt({
        topics: ['website'],
        hint: 'schnelle Umsetzung',
      });
      expect(prompt).toContain('schnelle Umsetzung');
    });

    it('should not include hint section when not provided', () => {
      const prompt = buildUserPrompt({
        topics: ['website'],
      });
      expect(prompt).not.toContain('Zusätzlicher Kontext');
    });

    it('should include style when provided', () => {
      const prompt = buildUserPrompt({
        topics: ['website'],
        style: 'begeistert',
      });
      expect(prompt).toContain('begeistert');
    });

    it('should include owner and brand name', () => {
      const prompt = buildUserPrompt({
        topics: ['website'],
      });
      expect(prompt).toContain('Max');
      expect(prompt).toContain('Test Brand');
    });

    it('should remind about character limit', () => {
      const prompt = buildUserPrompt({
        topics: ['website'],
      });
      expect(prompt).toContain('max. 500 Zeichen');
    });
  });
});



