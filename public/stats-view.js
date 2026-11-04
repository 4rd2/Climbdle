const $ = selector => document.querySelector(selector);

export function statsLoading() {
  $('#stats-content').hidden = true;
  $('#stats-empty').hidden = true;
  $('#stats-retry').hidden = true;
  $('#stats-status').textContent = 'Loading your stats…';
  $('#stats-screen').setAttribute('aria-busy', 'true');
}

export function statsError() {
  $('#stats-content').hidden = true;
  $('#stats-empty').hidden = true;
  $('#stats-status').textContent = 'Your stats are unavailable right now. Please try again.';
  $('#stats-retry').hidden = false;
  $('#stats-screen').setAttribute('aria-busy', 'false');
}

export function renderStats(stats) {
  $('#stats-screen').setAttribute('aria-busy', 'false');
  $('#stats-status').textContent = '';
  $('#stats-retry').hidden = true;
  $('#stats-content').hidden = false;
  $('#stats-solved').textContent = String(stats.solved);
  $('#stats-average').textContent = stats.average === null ? '—' : stats.average.toFixed(2);
  $('#stats-empty').hidden = stats.solved > 0;
  $('#stats-chart').hidden = stats.solved === 0;
  const rows = $('#stats-bars');
  rows.replaceChildren();
  const max = Math.max(1, ...stats.buckets.map(bucket => bucket.count));
  for (const bucket of stats.buckets) {
    const row = document.createElement('li');
    row.className = 'histogram-row';
    row.setAttribute('aria-label', `${bucket.label} ${bucket.label === '1' ? 'attempt' : 'attempts'}: ${bucket.count} ${bucket.count === 1 ? 'puzzle' : 'puzzles'}`);
    const label = document.createElement('span');
    label.className = 'histogram-label';
    label.textContent = bucket.label;
    const track = document.createElement('span');
    track.className = 'histogram-track';
    const bar = document.createElement('span');
    bar.className = 'histogram-bar';
    bar.style.width = `${bucket.count / max * 100}%`;
    track.append(bar);
    const count = document.createElement('span');
    count.className = 'histogram-count';
    count.textContent = String(bucket.count);
    for (const element of [label, track, count]) element.setAttribute('aria-hidden', 'true');
    row.append(label, track, count);
    rows.append(row);
  }
}
