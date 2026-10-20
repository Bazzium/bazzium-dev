import {
  Directive,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appBottomEdgeFade]',
})
export class BottomEdgeFadeDirective implements OnInit, OnDestroy {
  private animationFrame = 0;
  private isPrepared = false;
  private isInitialPageState = true;
  private readonly isBrowser: boolean;
  private readonly prefersReducedMotion: boolean;
  private readonly topOfPageThreshold = 24;
  private readonly fadeStartViewportRatio = 0.80;
  private readonly topFadeEndViewportRatio = 0.12;
  private removeScrollListener?: () => void;
  private removeResizeListener?: () => void;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.prefersReducedMotion =
      this.isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  ngOnInit(): void {
    if (!this.isBrowser || this.prefersReducedMotion) {
      return;
    }

    this.updateStyles();

    this.ngZone.runOutsideAngular(() => {
      this.removeScrollListener = this.renderer.listen('window', 'scroll', () => {
        this.isInitialPageState = false;
        this.queueUpdate();
      });
      this.removeResizeListener = this.renderer.listen('window', 'resize', () => this.queueUpdate());
    });
  }

  ngOnDestroy(): void {
    this.removeScrollListener?.();
    this.removeResizeListener?.();

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private prepareElement(): void {
    if (this.isPrepared) {
      return;
    }

    const element = this.elementRef.nativeElement;

    this.renderer.addClass(element, 'bottom-edge-fade-ready');
    this.renderer.setStyle(element, 'opacity', '0');
    this.renderer.setStyle(element, 'transform', 'translateY(1.25rem) scale(0.985)');
    this.renderer.setStyle(element, 'transform-origin', 'center top');
    this.renderer.setStyle(element, 'will-change', 'opacity, transform');
    this.isPrepared = true;
  }

  private clearElementStyles(): void {
    const element = this.elementRef.nativeElement;

    this.renderer.removeClass(element, 'bottom-edge-fade-ready');
    this.renderer.removeStyle(element, 'opacity');
    this.renderer.removeStyle(element, 'transform');
    this.renderer.removeStyle(element, 'transform-origin');
    this.renderer.removeStyle(element, 'will-change');
    this.isPrepared = false;
  }

  private queueUpdate(): void {
    if (this.animationFrame) {
      return;
    }

    this.animationFrame = requestAnimationFrame(() => {
      this.animationFrame = 0;
      this.updateStyles();
    });
  }

  private updateStyles(): void {
    if (this.isInitialPageState || window.scrollY <= this.topOfPageThreshold) {
      this.clearElementStyles();
      return;
    }

    this.prepareElement();

    const element = this.elementRef.nativeElement;
    const viewportHeight = window.innerHeight;
    const rect = element.getBoundingClientRect();
    const fadeDistance = Math.min(180, Math.max(100, viewportHeight * 0.16));
    const bottomFadeStart = viewportHeight * this.fadeStartViewportRatio;
    const topFadeEnd = viewportHeight * this.topFadeEndViewportRatio;
    const bottomOpacity = this.clamp((bottomFadeStart - rect.top) / fadeDistance);
    const topOpacity = this.clamp((rect.bottom - topFadeEnd) / fadeDistance);
    const opacity = Math.min(bottomOpacity, topOpacity);
    const isEntering = bottomOpacity < topOpacity;
    const hiddenProgress = 1 - opacity;
    const translateY = isEntering ? hiddenProgress * 20 : hiddenProgress * -24;
    const scale = 1 - hiddenProgress * 0.025;

    this.renderer.setStyle(element, 'opacity', opacity.toFixed(3));
    this.renderer.setStyle(
      element,
      'transform',
      `translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(4)})`,
    );
  }

  private clamp(value: number): number {
    return Math.min(1, Math.max(0, value));
  }
}
