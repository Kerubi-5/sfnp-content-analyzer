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
 * Pure-JS/TS sentiment and content analyzer for SFNP.
 * Finds lead-generation and internal-linking opportunities from copy.
 */
declare function analyzeContent(input: AnalyzeInput): AnalysisResult;

export { type AnalysisResult, type AnalyzeInput, analyzeContent };
