import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

@Directive({ selector: '[appParallax]' })
export class ParallaxDirective {
  private readonly element = inject(ElementRef<HTMLElement>);
  constructor() {
    afterNextRender({ write: () => {
      const element = this.element.nativeElement;
      const isHeroArt = element.classList.contains('intro-art');
      const isServiceRow = element.classList.contains('illustrated-row');
      const isProcessStep = element.classList.contains('process-step');
      const header = document.querySelector<HTMLElement>('.site-header');
      const preference = window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 800px)');
      let frame = 0;
      const update = () => {
        frame = 0;
        const paused = document.documentElement.classList.contains('motion-paused');
        // Measure an unmoving parent so the transform cannot feed back into its own position.
        const anchor = isHeroArt ? element.parentElement! : element;
        const rect = anchor.getBoundingClientRect();
        const disabled = preference.matches || paused;
        const displacement = (window.innerHeight / 2 - rect.top - rect.height / 2) * .22;
        // Start only when this section reaches the bottom of the sticky header.
        // Adjacent sections retain separate, consecutive scroll intervals.
        const rowStart = header?.getBoundingClientRect().bottom ?? 0;
        const rowProgress = Math.max(0, Math.min(1, (rowStart - rect.top) / Math.max(1, rect.height)));
        const offset = disabled ? 0 : isServiceRow ? rowProgress * rect.height * .8 : isHeroArt ? displacement : Math.max(-85, Math.min(85, displacement));
        const progress = disabled ? .5 : Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        // Delay process-line drawing until the section reaches 75% of the viewport.
        const drawProgress = isProcessStep && !disabled
          ? Math.max(0, Math.min(1, (window.innerHeight * .75 - rect.top) / (window.innerHeight * .75 + rect.height)))
          : progress;
        element.style.setProperty('--parallax-y', `${offset}px`);
        element.style.setProperty('--scroll-turn', `${(progress - .5) * 55}deg`);
        element.style.setProperty('--scroll-dash', `${(1 - drawProgress) * 650}`);
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      preference.addEventListener('change', schedule);
      const observer = new MutationObserver(schedule);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      schedule();
      this.cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        preference.removeEventListener('change', schedule);
        observer.disconnect();
      };
    } });
  }
  private cleanup?: () => void;
  ngOnDestroy() { this.cleanup?.(); }
}
