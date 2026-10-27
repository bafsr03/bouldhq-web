/**
 * BOULD Scroll Animations — GSAP + ScrollTrigger
 *
 * Ported from the Shopify theme. GSAP now comes from npm instead of a cdnjs
 * <script> tag, so the "CDN failed" branch below can no longer fire on a network
 * error — it is kept because it is also the reduced-capability escape hatch.
 *
 * This module owns SCROLL-TRIGGERED animation only. The hero entrance used to
 * live here as a timeline, which meant the largest text on the homepage stayed
 * at opacity:0 until this chunk downloaded and the main thread was free enough
 * to run it — 18.1s on mobile, 4.7s on a fast desktop. It is now pure CSS in
 * app/bould.css and cannot be delayed by anything that happens in here. Do not
 * add hero selectors back to this file: a GSAP tween on an element that CSS is
 * also animating writes conflicting inline styles, and inline wins.
 *
 * Returns a cleanup function: client-side navigation would otherwise stack a new
 * set of ScrollTriggers on every route change.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initAnimations() {

  /* Every .bould-reveal starts at opacity:0 and relies on the ScrollTriggers
     below to become visible. If GSAP is unavailable, this script would otherwise
     just bail and leave that content invisible forever. Flag the document
     instead so CSS can force the final state. (The hero is no longer in this
     set — it is CSS-animated and readable regardless.) */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.documentElement.classList.add('bould-anim-fallback');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── Cursor ── */
  const dot  = document.querySelector('.bould-cursor__dot');
  const ring = document.querySelector('.bould-cursor__ring');

  if (dot && ring) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX, y: mouseY });
    });

    gsap.ticker.add(() => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
    });

    document.querySelectorAll('a, button, .bould-service-item, .bould-work-card').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.querySelector('.bould-cursor')?.classList.add('bould-cursor--hover');
      });
      el.addEventListener('mouseleave', () => {
        document.querySelector('.bould-cursor')?.classList.remove('bould-cursor--hover');
      });
    });
  }

  /* The hero entrance lived here as a gsap.timeline({ delay: 0.3 }). It is now
     CSS — see the HERO ENTRANCE block in app/bould.css and the note at the top
     of this file. Three of its six tweens were doing nothing even before that:
     `.bould-hero__headline .line-inner` animated from translateY(0) to 0, and
     `.bould-hero__scroll` has CSS but no markup anywhere in the app. */

  /* ── Generic scroll reveals ── */
  gsap.utils.toArray('.bould-reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  });

  gsap.utils.toArray('.bould-reveal-left').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  gsap.utils.toArray('.bould-reveal-right').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  gsap.utils.toArray('.bould-reveal-scale').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* Line-by-line reveals */
  gsap.utils.toArray('.bould-line-reveal-inner').forEach((el, i) => {
    const parent = el.closest('.bould-line-reveal') || el.parentElement;
    gsap.to(el, {
      y: 0, duration: 1, ease: 'power4.out',
      scrollTrigger: { trigger: parent, start: 'top 88%', once: true },
      delay: i * 0.08,
    });
  });

  /* Staggered children */
  document.querySelectorAll('[data-bould-stagger]').forEach((parent) => {
    const children = parent.children;
    gsap.to(children, {
      opacity: 1, y: 0,
      duration: 0.7, ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: parent, start: 'top 85%', once: true },
    });
  });

  /* ── Stats counting animation ── */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;

    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
          },
          onComplete: () => {
            el.textContent = prefix + target.toFixed(decimals) + suffix;
          },
        });
      },
    });
  });

  /* ── Work cards stagger ── */
  gsap.utils.toArray('.bould-work-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 12 },
      {
        opacity: 1, y: 0,
        duration: 0.6, ease: 'power2.out',
        delay: (i % 3) * 0.12,
        scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      }
    );
  });

  /* ── Services list reveal ── */
  gsap.utils.toArray('.bould-service-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0,
        duration: 0.7, ease: 'power3.out',
        delay: i * 0.07,
        scrollTrigger: { trigger: '.bould-services__list', start: 'top 85%', once: true },
      }
    );
  });

  /* ── Tech pills stagger ── */
  gsap.utils.toArray('.bould-tech-pill').forEach((pill, i) => {
    gsap.fromTo(pill,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.5, ease: 'power3.out',
        delay: i * 0.06,
        scrollTrigger: { trigger: '.bould-capabilities__tech', start: 'top 85%', once: true },
      }
    );
  });

  /* ── CTA title split animation ── */
  const ctaTitle = document.querySelector('.bould-cta__title');
  if (ctaTitle) {
    const spans = ctaTitle.querySelectorAll('span');
    gsap.fromTo(spans,
      { y: '100%', opacity: 0 },
      {
        y: '0%', opacity: 1,
        duration: 1, ease: 'power4.out',
        stagger: 0.15,
        scrollTrigger: { trigger: ctaTitle, start: 'top 80%', once: true },
      }
    );
  }

  /* ── Stats headline ── */
  const statsHeadline = document.querySelector('.bould-stats__headline');
  if (statsHeadline) {
    gsap.fromTo(statsHeadline,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: statsHeadline, start: 'top 85%', once: true },
      }
    );
  }

  /* ── Sticky header: add .scrolled when page scrolls past ~60px ── */
  const headerWrapper = document.querySelector('.header-wrapper');
  if (headerWrapper) {
    const onScroll = () => {
      headerWrapper.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // apply on load in case page is already scrolled
  }


  return () => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.globalTimeline.clear();
  };
}
