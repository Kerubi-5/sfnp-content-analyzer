interface AnalyzeInput {
    title: string;
    body: string;
    tags?: string[];
    /** Optional note metadata; reserved for future heuristic signals. */
    frontmatter?: Record<string, unknown>;
}
interface AnalysisResult {
    sentiment: 'positive' | 'neutral' | 'negative';
    leadScore: number;
    urgency: 'high' | 'medium' | 'low';
    reasons: string[];
    suggestedLeadMagnets: string[];
    hasCTA: boolean;
}
/**
 * Pure-JS/TS Sentiment and Content Analyzer for SFNP.
 * Analyzes copy to find lead generation and internal linking opportunities.
 */
declare function analyzeContent(input: AnalyzeInput): AnalysisResult;

export { type AnalysisResult, type AnalyzeInput, analyzeContent };
