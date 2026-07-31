export interface AnalyzeInput {
  title: string;
  body: string;
  tags?: string[];
  frontmatter?: Record<string, any>;
}

export interface AnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  leadScore: number; // 0-100
  urgency: 'high' | 'medium' | 'low';
  reasons: string[];
  suggestedLeadMagnets: string[];
  hasCTA: boolean;
}

/**
 * Pure-JS/TS Sentiment and Content Analyzer for SFNP.
 * Analyzes copy to find lead generation and internal linking opportunities.
 */
export function analyzeContent(input: AnalyzeInput): AnalysisResult {
  const { title, body, tags = [], frontmatter = {} } = input;
  const lowerBody = body.toLowerCase();
  const lowerTitle = title.toLowerCase();
  const reasons: string[] = [];
  const suggestedLeadMagnets: string[] = [];

  // 1. CTA Detection
  const ctaKeywords = [
    'click', 'sign up', 'subscribe', 'download', 'join', 
    'newsletter', 'opt-in', 'optin', 'register', 'buy', 'order'
  ];
  const hasCTA = ctaKeywords.some(keyword => lowerBody.includes(keyword)); // simple check

  // 2. Sentiment/Urgency Analysis
  let positiveScore = 0;
  let negativeScore = 0;

  const positiveWords = ['ethical', 'generosity', 'symbiosis', 'value', 'trust', 'help', 'growth', 'succeed', 'nice'];
  const negativeWords = ['extractive', 'stagnant', 'broken', 'predatory', 'forced', 'trick', 'pressure', 'bottleneck'];

  positiveWords.forEach(word => {
    if (lowerBody.includes(word)) positiveScore++;
  });
  negativeWords.forEach(word => {
    if (lowerBody.includes(word)) negativeScore++;
  });

  const sentiment = positiveScore > negativeScore 
    ? 'positive' 
    : negativeScore > positiveScore 
      ? 'negative' 
      : 'neutral';

  // 3. Opportunity/Lead-Scoring Heuristics
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  let leadScore = 0;

  // Longer content has more depth, therefore higher lead magnet potential
  if (wordCount > 1000) {
    leadScore += 40;
    reasons.push(`High word count (${wordCount} words) is excellent for a deep-dive checklist.`);
  } else if (wordCount > 500) {
    leadScore += 25;
    reasons.push(`Moderate length (${wordCount} words) is suitable for a quick reference guide.`);
  } else {
    leadScore += 10;
    reasons.push('Short post. Consider expanding to capture leads.');
  }

  // If it lacks a clear call to action, it's a massive missed opportunity!
  if (!hasCTA) {
    leadScore += 35;
    reasons.push('No call-to-action (CTA) detected. Adding a lead magnet is high leverage here.');
  } else {
    reasons.push('Existing CTA found, but could be enhanced with a specialized download.');
  }

  // Check for brand/domain match
  if (tags.includes('sales') || lowerTitle.includes('sales') || lowerBody.includes('selling')) {
    leadScore += 15;
    suggestedLeadMagnets.push('Ethical Sales Checklist');
    reasons.push('Topic maps strongly to SFNP sales principles.');
  }
  if (tags.includes('copywriting') || lowerTitle.includes('copywriting') || lowerBody.includes('copy')) {
    leadScore += 15;
    suggestedLeadMagnets.push('Non-Manipulative Copywriting Template');
    reasons.push('Topic maps strongly to copywriting/conversion psychology.');
  }
  if (tags.includes('newsletter') || lowerTitle.includes('newsletter') || lowerBody.includes('email')) {
    leadScore += 15;
    suggestedLeadMagnets.push('Email List Growth Speedrun Guide');
    reasons.push('Focuses on audience reach and list-building bottlenecks.');
  }

  // Cap lead score at 100
  leadScore = Math.min(100, leadScore);

  const urgency = leadScore > 75 
    ? 'high' 
    : leadScore > 40 
      ? 'medium' 
      : 'low';

  return {
    sentiment,
    leadScore,
    urgency,
    reasons,
    suggestedLeadMagnets,
    hasCTA
  };
}
