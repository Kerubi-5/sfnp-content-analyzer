# sfnp-content-analyzer

A high-integrity, platform-independent content and sentiment analyzer for **Sales For Nice People (SFNP)**.

It provides the core business logic used to scan content assets (e.g., in Obsidian vaults or WordPress) for backlinking suggestions, sentiment markers, and high-leverage lead magnet opportunities.

## Key Heuristics
- **CTA Detection:** Inspects text for existing call-to-action indicators.
- **Sentiment & Vibe Matching:** Analyzes if the tone fits SFNP's "symbiosis" and "strategic generosity" core philosophies.
- **Lead Opportunity Scoring (0-100):** Calculates a priority score based on text depth, topic mapping, and missing CTAs.

## Installation

```bash
npm install sfnp-content-analyzer
```

## Usage

```typescript
import { analyzeContent } from 'sfnp-content-analyzer';

const result = analyzeContent({
  title: "The Ethical Sales Guide",
  body: "Selling doesn't have to be extractive. In fact...",
  tags: ["sales"]
});

console.log(result);
/*
Output:
{
  sentiment: 'positive',
  leadScore: 90,
  urgency: 'high',
  reasons: [ ... ],
  suggestedLeadMagnets: [ 'Ethical Sales Checklist' ],
  hasCTA: false
}
*/
```

## Development

```bash
pnpm install
pnpm test        # vitest suite for analyzeContent
pnpm run build
pnpm run typecheck
```

Heuristic changes for SFNP opportunity scoring belong in this package — consumers (Obsidian plugin, WordPress, etc.) should depend on it rather than copying `analyzeContent`.
