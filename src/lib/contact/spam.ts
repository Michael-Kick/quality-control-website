/** People need longer than this to fill in the form; bots usually submit instantly. */
export const MIN_FILL_TIME_MS = 3000;

type SpamSignals = {
  /** Value of the hidden honeypot field. */
  honeypot: string;
  /** Client timestamp (ms) set when the form became interactive. */
  startedAt: string;
  /** Client timestamp (ms) set on submit. */
  submittedAt: string;
};

/**
 * Cheap bot checks: honeypot filled, or submitted faster than `MIN_FILL_TIME_MS`.
 * Both timestamps come from the visitor's clock, so clock skew between browser
 * and server does not matter. When neither timestamp is present the form was
 * submitted without JavaScript; only the honeypot applies then, so a real
 * enquiry is never dropped silently. Garbled or partial timestamps count as spam.
 */
export function isLikelySpam({ honeypot, startedAt, submittedAt }: SpamSignals): boolean {
  if (honeypot.trim() !== "") return true;
  if (!startedAt && !submittedAt) return false;

  const started = Number(startedAt);
  const submitted = Number(submittedAt);
  if (!startedAt || !submittedAt || !Number.isFinite(started) || !Number.isFinite(submitted)) {
    return true;
  }

  return submitted - started < MIN_FILL_TIME_MS;
}
