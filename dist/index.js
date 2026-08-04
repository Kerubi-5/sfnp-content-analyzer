// src/index.ts
var CTA_KEYWORDS = [
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
var POSITIVE_WORDS = [
  "ethical",
  "generosity",
  "symbiosis",
  "value",
  "trust",
  "help",
  "growth",
  "succeed",
  "nice"
];
var NEGATIVE_WORDS = [
  "extractive",
  "stagnant",
  "broken",
  "predatory",
  "forced",
  "trick",
  "pressure",
  "bottleneck"
];
var TOPIC_RULES = [
  {
    tag: "sales",
    titleNeedle: "sales",
    bodyNeedle: "selling",
    magnet: "Ethical Sales Checklist",
    reason: "Topic maps strongly to SFNP sales principles."
  },
  {
    tag: "copywriting",
    titleNeedle: "copywriting",
    bodyNeedle: "copy",
    magnet: "Non-Manipulative Copywriting Template",
    reason: "Topic maps strongly to copywriting/conversion psychology."
  },
  {
    tag: "newsletter",
    titleNeedle: "newsletter",
    bodyNeedle: "email",
    magnet: "Email List Growth Speedrun Guide",
    reason: "Focuses on audience reach and list-building bottlenecks."
  }
];
function countMatches(text, words) {
  return words.reduce((count, word) => text.includes(word) ? count + 1 : count, 0);
}
function analyzeContent(input) {
  const { title, body, tags = [] } = input;
  const lowerBody = body.toLowerCase();
  const lowerTitle = title.toLowerCase();
  const reasons = [];
  const suggestedLeadMagnets = [];
  const hasCTA = CTA_KEYWORDS.some((keyword) => lowerBody.includes(keyword));
  const positiveScore = countMatches(lowerBody, POSITIVE_WORDS);
  const negativeScore = countMatches(lowerBody, NEGATIVE_WORDS);
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
  for (const rule of TOPIC_RULES) {
    if (tags.includes(rule.tag) || lowerTitle.includes(rule.titleNeedle) || lowerBody.includes(rule.bodyNeedle)) {
      leadScore += 15;
      suggestedLeadMagnets.push(rule.magnet);
      reasons.push(rule.reason);
    }
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
