import { useEffect } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  staggerMs?: number;
}

export function useScrollReveal(dependencies: any[] = [], options: ScrollRevealOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px', staggerMs = 120 } = options;

  useEffect(() => {
    // If IntersectionObserver is not available, reveal immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-card').forEach((el) => {
        el.classList.add('revealed');
      });
      return;
    }

    const cards = Array.from(document.querySelectorAll<HTMLElement>('.reveal-card'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const explicitDelay = target.getAttribute('data-delay');
            const cardIndex = cards.indexOf(target);
            
            const delay = explicitDelay 
              ? parseInt(explicitDelay, 10) 
              : (cardIndex >= 0 ? (cardIndex % 3) * staggerMs : 0);

            setTimeout(() => {
              target.classList.add('revealed');
            }, delay);

            observer.unobserve(target);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    cards.forEach((card) => {
      // If already has revealed class from previous state, leave it; otherwise observe
      if (!card.classList.contains('revealed')) {
        observer.observe(card);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, dependencies);
}
