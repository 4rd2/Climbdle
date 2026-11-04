// Keep the average exact even when larger attempt counts share the 11+ bin.
export function summarizeDistribution(distribution) {
  const buckets = Array.from({length: 11}, (_, index) => ({label: index === 10 ? '11+' : String(index + 1), count: 0}));
  let solved = 0, totalAttempts = 0;
  for (const row of distribution) {
    const attempts = Number(row.attempts), count = Number(row.count);
    if (!Number.isSafeInteger(attempts) || attempts < 1 || !Number.isSafeInteger(count) || count < 1) continue;
    solved += count;
    totalAttempts += attempts * count;
    buckets[Math.min(attempts, 11) - 1].count += count;
  }
  return {solved, average: solved ? totalAttempts / solved : null, buckets};
}

export function guestDistribution(storage) {
  const counts = new Map();
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    // Preserve guest history saved under the game's original storage prefix.
    if (!/^crux:\d{4}-\d{2}-\d{2}$/.test(key || '')) continue;
    let run;
    try { run = JSON.parse(storage.getItem(key)); } catch { continue; }
    if (run?.solved !== true || !Array.isArray(run.guesses) || !run.guesses.length || !run.guesses.every(guess => typeof guess === 'string')) continue;
    counts.set(run.guesses.length, (counts.get(run.guesses.length) || 0) + 1);
  }
  return [...counts].map(([attempts, count]) => ({attempts, count}));
}
