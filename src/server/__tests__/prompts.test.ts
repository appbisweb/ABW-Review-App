import { describe, it, expect } from 'vitest';
import { buildSystemPrompt, buildUserPrompt, buildRetryPrompt } from '../llm/prompts';

describe('Prompt Generation', () => {
  describe('buildSystemPrompt', () => {
    it('should include owner and brand name from env', () => {
      const prompt = buildSystemPrompt('test-nonce');
      // Uses env vars or defaults (Jan, App bis Web)
      expect(prompt).toMatch(/Jan|Max|Owner/);
      expect(prompt).toMatch(/App bis Web|Test Brand|Brand/);
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
      expect(prompt).toContain('EINZELUNTERNEHMEN');
      expect(prompt).toContain('ich/meine');
    });

    it('should use company perspective when specified', () => {
      const prompt = buildSystemPrompt('test-nonce', 'company');
      expect(prompt).toContain('FIRMA/UNTERNEHMEN');
      expect(prompt).toContain('wir/unsere');
    });

    it('should mention the pronoun rules', () => {
      const prompt = buildSystemPrompt('test-nonce');
      expect(prompt).toContain('ihm/sein');
    });

    it('should prohibit quotation marks', () => {
      const prompt = buildSystemPrompt('test-nonce');
      expect(prompt).toContain('KEINE Anführungszeichen');
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

    it('should include owner name', () => {
      const prompt = buildUserPrompt({
        topics: ['website'],
      });
      // Should contain owner name (default: Jan or from env)
      expect(prompt).toMatch(/Jan|Max|Owner/);
    });

    it('should remind about character limit', () => {
      const prompt = buildUserPrompt({
        topics: ['website'],
      });
      expect(prompt).toContain('max. 500 Zeichen');
    });
  });

  describe('buildRetryPrompt', () => {
    it('should request shorter text', () => {
      const prompt = buildRetryPrompt();
      expect(prompt).toContain('kürze');
      expect(prompt).toContain('450');
    });
  });
});



