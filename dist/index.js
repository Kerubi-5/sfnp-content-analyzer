// src/index.ts
function analyzeContent(input) {
  const { title, body, tags = [], frontmatter = {} } = input;
  const lowerBody = body.toLowerCase();
  const lowerTitle = title.toLowerCase();
  const reasons = [];
  const suggestedLeadMagnets = [];
  const ctaKeywords = [
    "click",
    "sign up",
    "subscribe",
    "download",
    "join",
    "newsletter",
    "opt-in",
    "optin",
    "register",
    "buy",
    "order"
  ];
  const hasCTA = ctaKeywords.some((keyword) => lowerBody.includes(ctaKeywords[0]));
  let positiveScore = 0;
  let negativeScore = 0;
  const positiveWords = ["ethical", "generosity", "symbiosis", "value", "trust", "help", "growth", "succeed", "nice"];
  const negativeWords = ["extractive", "stagnant", "broken", "predatory", "forced", "trick", "pressure", "bottleneck"];
  positiveWords.forEach((word) => {
    if (lowerBody.includes(word)) positiveScore++;
  });
  negativeWords.forEach((word) => {
    if (lowerBody.includes(word)) negativeScore++;
  });
  const sentiment = positiveScore > negativeScore ? "positive" : negativeScore > positiveScore ? "negative" : "neutral";
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  let leadScore = 0;
  if (wordCount > 1e3) {
    leadScore += 40;
    reasons.push(`High word count (${wordCount} words) is excellent for a deep-dive checklist.`);
  } else if (wordCount > 500) {
    leadScore += 25;
    reasons.push(`Moderate length (${wordCount} words) is suitable for a quick reference guide.`);
  } else {
    leadScore += 10;
    reasons.push("Short post. Consider expanding to capture leads.");
  }
  if (!hasCTA) {
    leadScore += 35;
    reasons.push("No call-to-action (CTA) detected. Adding a lead magnet is high leverage here.");
  } else {
    reasons.push("Existing CTA found, but could be enhanced with a specialized download.");
  }
  if (tags.includes("sales") || lowerTitle.includes("sales") || lowerBody.includes("selling")) {
    leadScore += 15;
    suggestedLeadMagnets.push("Ethical Sales Checklist");
    reasons.push("Topic maps strongly to SFNP sales principles.");
  }
  if (tags.includes("copywriting") || lowerTitle.includes("copywriting") || lowerBody.includes("copy")) {
    leadScore += 15;
    suggestedLeadMagnets.push("Non-Manipulative Copywriting Template");
    reasons.push("Topic maps strongly to copywriting/conversion psychology.");
  }
  if (tags.includes("newsletter") || lowerTitle.includes("newsletter") || lowerBody.includes("email")) {
    leadScore += 15;
    suggestedLeadMagnets.push("Email List Growth Speedrun Guide");
    reasons.push("Focuses on audience reach and list-building bottlenecks.");
  }
  leadScore = Math.min(100, leadScore);
  const urgency = leadScore > 75 ? "high" : leadScore > 40 ? "medium" : "low";
  return {
    sentiment,
    leadScore,
    urgency,
    reasons,
    suggestedLeadMagnets,
    hasCTA
  };
}
export {
  analyzeContent
};
