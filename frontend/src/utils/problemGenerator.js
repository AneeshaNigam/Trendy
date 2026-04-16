/**
 * Problem Generator — Converts trend titles into problem statements
 * 
 * Transforms trend names like "Synthetic Data Generation" into
 * actionable problem questions like "Why are companies struggling to 
 * generate high-quality synthetic data?"
 */

const categoryPrefixes = {
  'Technology': ['companies', 'developers', 'teams'],
  'Software Development': ['engineering teams', 'developers', 'dev teams'],
  'Data Engineering': ['data teams', 'organizations', 'enterprises'],
  'Business': ['businesses', 'startups', 'companies'],
  'Finance': ['financial institutions', 'investors', 'fintech companies'],
  'Healthcare': ['healthcare providers', 'medical teams', 'health organizations'],
  'Marketing': ['marketing teams', 'growth teams', 'brands'],
  'Design': ['design teams', 'product teams', 'UX researchers'],
};

const trendProblemTemplates = [
  (name, actor) => `Why are ${actor} struggling to adopt ${name} effectively at scale?`,
  (name, actor) => `Why do ${actor} find it challenging to implement ${name} in production?`,
  (name, actor) => `Why is ${name} still underutilized despite growing demand among ${actor}?`,
  (name, actor) => `Why are ${actor} facing barriers when integrating ${name} into existing workflows?`,
  (name, actor) => `Why haven't ${actor} fully capitalized on the potential of ${name}?`,
];

/**
 * Generate a problem statement from a trend name
 * @param {string} trendName - The name of the trend
 * @param {string} [category='Technology'] - The category of the trend
 * @returns {string} A "Why..." problem statement
 */
export function generateProblem(trendName, category = 'Technology') {
  if (!trendName) return '';
  
  const actors = categoryPrefixes[category] || categoryPrefixes['Technology'];
  const actor = actors[Math.abs(hashCode(trendName)) % actors.length];
  const template = trendProblemTemplates[Math.abs(hashCode(trendName)) % trendProblemTemplates.length];
  
  return template(trendName, actor);
}

/**
 * Simple deterministic hash for consistent problem generation
 */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

export default generateProblem;
