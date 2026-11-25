let stopCelebration = () => {};

// Decorative only: no focus changes, sound, or changes to saved progress.
export function celebrateSolve() {
  stopCelebration();
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || document.hidden) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.className = 'climbing-confetti';
  canvas.setAttribute('aria-hidden', 'true');
  const width = window.innerWidth;
  const height = window.innerHeight;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.scale(scale, scale);

  const styles = getComputedStyle(document.documentElement);
  const colors = ['--green', '--orange', '--muted'].map(name => styles.getPropertyValue(name).trim());
  const holds = [
    new Path2D('M-6 2C-8-2-3-6 2-5C7-5 8-1 5 3C2 6-4 6-6 2Z'),
    new Path2D('M-6 3L-3-4Q-1-7 2-4L7 1Q8 4 3 5L-3 5Q-7 5-6 3Z'),
    new Path2D('M-7 0Q-6-4 0-3L5-2Q8 0 5 3L-3 4Q-7 4-7 0Z'),
  ];
  const particles = [-1, 1].flatMap(side => Array.from({length: 16}, (_, i) => ({
    side,
    chalk: i % 4 === 0,
    color: colors[i % colors.length],
    shape: holds[i % holds.length],
    size: 0.65 + Math.random() * 0.45,
    startX: side === -1 ? width * 0.035 : width * 0.965,
    // Keep the spray in the outer edges so the solved result stays readable.
    distance: width * (0.035 + Math.random() * 0.19),
    rise: Math.min(height * 0.53, 390) * (0.55 + Math.random() * 0.45),
    delay: Math.random() * 90,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 7,
  })));

  let frame;
  let stopped = false;
  function stop() {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(frame);
    canvas.remove();
    window.removeEventListener('resize', stop);
    window.removeEventListener('pagehide', stop);
    window.removeEventListener('hashchange', stop);
    document.removeEventListener('visibilitychange', stop);
    motion.removeEventListener('change', stop);
    stopCelebration = () => {};
  }
  stopCelebration = stop;
  window.addEventListener('resize', stop);
  window.addEventListener('pagehide', stop);
  window.addEventListener('hashchange', stop);
  document.addEventListener('visibilitychange', stop);
  motion.addEventListener('change', stop);
  document.body.append(canvas);

  const start = performance.now();
  function draw(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, width, height);
    for (const particle of particles) {
      const t = Math.max(0, (elapsed - particle.delay) / 1450);
      if (elapsed < particle.delay || t >= 1) continue;
      const travel = 1 - (1 - t) ** 2;
      const x = particle.startX - particle.side * particle.distance * travel;
      const y = height + 10 - particle.rise * 4 * t * (1 - t);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(particle.rotation + particle.spin * t);
      ctx.scale(particle.size, particle.size);
      ctx.globalAlpha = Math.min(1, t * 16) * Math.min(1, (1 - t) * 3);
      if (particle.chalk) {
        ctx.fillStyle = '#fffdf7';
        ctx.beginPath();
        ctx.ellipse(0, 0, 2, 3, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = particle.color;
        ctx.fill(particle.shape);
        // A tiny bolt hole makes each fleck read as a climbing hold.
        ctx.fillStyle = 'rgba(255, 253, 247, 0.75)';
        ctx.beginPath();
        ctx.arc(0, 0, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    if (elapsed < 1600) frame = requestAnimationFrame(draw);
    else stop();
  }
  frame = requestAnimationFrame(draw);
}
