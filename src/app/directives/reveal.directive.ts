import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  private readonly element = inject(ElementRef<HTMLElement>);
  private cleanup?: () => void;

  constructor() {
    afterNextRender(() => {
      const element = this.element.nativeElement;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const disabled = () => reduced.matches || document.documentElement.classList.contains('motion-paused');
      let visible = false;
      const sync = () => {
        element.classList.toggle('reveal-pending', !visible && !disabled() && !element.contains(document.activeElement));
      };
      sync();
      const reveal = () => {
        element.classList.remove('reveal-pending');
      };
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          // Reveal at 12%; reset only once fully outside to avoid edge flickering.
          if (entry.isIntersecting && entry.intersectionRatio >= .12) visible = true;
          else if (!entry.isIntersecting) visible = false;
        }
        sync();
      }, { threshold: [0, .12] });
      observer.observe(element);
      const preferenceChanged = () => {
        sync();
      };
      const pauseObserver = new MutationObserver(preferenceChanged);
      pauseObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      reduced.addEventListener('change', preferenceChanged);
      // Keyboard users must never land on an invisible link.
      element.addEventListener('focusin', reveal);
      this.cleanup = () => {
        observer.disconnect();
        pauseObserver.disconnect();
        reduced.removeEventListener('change', preferenceChanged);
        element.removeEventListener('focusin', reveal);
      };
    });
  }
  ngOnDestroy() { this.cleanup?.(); }
}
