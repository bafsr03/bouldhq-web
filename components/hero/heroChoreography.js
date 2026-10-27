/**
 * BOULD Hero — load hand-off
 *
 * The hero copy renders in its final, left-aligned place straight from CSS (it
 * used to start centred and FLIP across, which read as showy). All that is left
 * to do here is cross-fade the canvas in and tell the scene it may start.
 */
export function runHeroChoreography() {
  var content = document.querySelector('.bould-hero__content');
  var canvas  = document.querySelector('.bould-hero__canvas');
  var hero    = document.querySelector('.bould-hero');

  if (!content || !hero) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Start canvas hidden so it can cross-fade in.
  if (canvas && !reducedMotion) {
    canvas.classList.add('is-hidden');
  }

  if (reducedMotion) {
    revealCanvas();
    return;
  }

  setTimeout(revealCanvas, 300);

  function revealCanvas() {
    if (revealCanvas.done) return;
    revealCanvas.done = true;

    if (canvas) canvas.classList.remove('is-hidden');

    /* Hand off to the Three.js scene.
       This script runs before bould-scene.js has executed, so window.__bouldScene
       is normally still undefined here — the latch below is what the scene reads
       when it boots. The event covers the reverse order, and the direct call is a
       third path for when the scene is already live (e.g. a re-run). */
    window.__bouldHeroRevealed = true;
    document.dispatchEvent(new CustomEvent('bould:hero-revealed'));

    if (window.__bouldScene && typeof window.__bouldScene.reveal === 'function') {
      window.__bouldScene.reveal();
    }
  }
}
