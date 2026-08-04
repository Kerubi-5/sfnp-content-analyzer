import { describe, expect, it } from 'vitest';
import { analyzeContent } from './index.js';

/** Build a body of approximately `wordCount` words for score-band tests. */
function words(wordCount: number, seed = 'content'): string {
  return Array.from({ length: wordCount }, () => seed).join(' ');
}

describe('analyzeContent', () => {
  it('marks hasCTA false and boosts score when no CTA keywords are present', () => {
    const result = analyzeContent({
      title: 'Quiet note',
      body: words(50, 'reflection'),
    });
    expect(result.hasCTA).toBe(false);
    expect(result.reasons.some((r) => r.includes('No call-to-action'))).toBe(true);
    expect(result.leadScore).toBeGreaterThanOrEqual(45); // 10 short + 35 no CTA
  });

  it('marks hasCTA true when subscribe language is present', () => {
    const result = analyzeContent({
      title: 'Offer',
      body: `${words(50, 'post')} Please subscribe to the newsletter.`,
    });
    expect(result.hasCTA).toBe(true);
    expect(result.reasons.some((r) => r.includes('Existing CTA'))).toBe(true);
  });

  it('classifies positive sentiment from SFNP-aligned keywords', () => {
    const result = analyzeContent({
      title: 'Trust',
      body: 'We build ethical trust and help people grow with generosity.',
    });
    expect(result.sentiment).toBe('positive');
  });

  it('classifies negative sentiment from extractive keywords', () => {
    const result = analyzeContent({
      title: 'Warning',
      body: 'This extractive predatory funnel feels forced and broken.',
    });
    expect(result.sentiment).toBe('negative');
  });

  it('scores short vs long word-count bands', () => {
    const short = analyzeContent({ title: 'S', body: words(40) });
    const medium = analyzeContent({ title: 'M', body: words(600) });
    const long = analyzeContent({ title: 'L', body: words(1100) });
    expect(short.reasons.some((r) => r.includes('Short post'))).toBe(true);
    expect(medium.reasons.some((r) => r.includes('Moderate length'))).toBe(true);
    expect(long.reasons.some((r) => r.includes('High word count'))).toBe(true);
    expect(long.leadScore).toBeGreaterThan(medium.leadScore);
    expect(medium.leadScore).toBeGreaterThan(short.leadScore);
  });

  it('suggests Ethical Sales Checklist for sales-tagged content', () => {
    const result = analyzeContent({
      title: 'Pipeline notes',
      body: words(80, 'deal'),
      tags: ['sales'],
    });
    expect(result.suggestedLeadMagnets).toContain('Ethical Sales Checklist');
  });

  it('accepts frontmatter without using it yet', () => {
    const result = analyzeContent({
      title: 'Newsletter notes',
      body: 'Thoughts on email list growth.',
      frontmatter: { status: 'draft', audience: 'founders' },
    });
    expect(result.suggestedLeadMagnets).toContain('Email List Growth Speedrun Guide');
  });

  it('handles empty body without throwing', () => {
    const result = analyzeContent({ title: 'Empty', body: '' });
    expect(result.leadScore).toBeGreaterThanOrEqual(0);
    expect(result.leadScore).toBeLessThanOrEqual(100);
    expect(result.hasCTA).toBe(false);
  });

  it('caps leadScore at 100', () => {
    const result = analyzeContent({
      title: 'Sales newsletter copywriting',
      body: `${words(1100, 'selling')} email copy`,
      tags: ['sales', 'copywriting', 'newsletter'],
    });
    expect(result.leadScore).toBe(100);
  });
});
