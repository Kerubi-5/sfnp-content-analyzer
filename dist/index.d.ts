interface AnalyzeInput {
    title: string;
    body: string;
    tags?: string[];
    frontmatter?: Record<string, any>;
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
