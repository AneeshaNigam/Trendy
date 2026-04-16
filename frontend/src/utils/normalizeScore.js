/**
 * normalizeScore — Clamps any trend score to the 1.0–10.0 display range.
 * 
 * The backend stores raw scores that may be large integers from older
 * data collection runs. This function ensures every displayed score is
 * always between 1.0 and 10.0 with 1 decimal, regardless of what's in the DB.
 *
 * @param {number|string} score - Raw score from API
 * @returns {number} Clamped score (1.0–10.0, 1 decimal place)
 */
export function normalizeScore(score) {
  const raw = parseFloat(score);
  if (isNaN(raw) || raw <= 0) return 1.0;

  // If score is within range already, just normalize decimals
  if (raw <= 10) return parseFloat(Math.max(1.0, raw).toFixed(1));

  // If score is > 10, map it logarithmically to the 1–10 range
  // log10(10) = 1, log10(100,000) ≈ 5, log10(1,000,000) ≈ 6
  // We scale: log10(score) / log10(maxExpected) * 9 + 1
  const maxExpected = 1_000_000; // generous max
  const logVal = Math.log10(raw);
  const logMax = Math.log10(maxExpected);
  const normalized = 1 + (logVal / logMax) * 9;
  return parseFloat(Math.max(1.0, Math.min(10.0, normalized)).toFixed(1));
}

export default normalizeScore;
