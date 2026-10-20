import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild('siteShell') private readonly siteShell?: ElementRef<HTMLElement>;
  @ViewChild('primaryNav') private readonly primaryNav?: ElementRef<HTMLElement>;
  @ViewChild('forOperatorsMenu') private readonly forOperatorsMenu?: ElementRef<HTMLElement>;

  protected readonly menuOpen = signal(false);
  protected readonly forOperatorsMenuOpen = signal(false);
  protected readonly activePath = signal('/');
  protected readonly navIndicator = signal({
    opacity: 0,
    transform: 'translate3d(0, 0, 0)',
    width: '0px',
  });
  protected readonly forOperatorsIndicator = signal({
    opacity: 0,
    transform: 'translate3d(0, 0, 0)',
    height: '0px',
  });
  protected readonly navIndicatorTransitionsDisabled = signal(false);
  private readonly isBrowser: boolean;
  private removePrimaryNavListener?: () => void;
  private removeResizeListener?: () => void;
  private navResizeObserver?: ResizeObserver;
  private removeFontListener?: () => void;
  private navLayoutFrame = 0;
  private destroyed = false;
  private routerEventsSubscription?: Subscription;
  private readonly submenuSelectTransitionMs = 220;
  private readonly loadedByBrowserRefresh: boolean;
  private primaryNavigationInProgress = false;
  private pendingPrimaryNavigation?: {
    path: string;
    targetPath: string;
  };

  constructor(
    private readonly router: Router,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadedByBrowserRefresh = this.wasLoadedByBrowserRefresh();
    this.activePath.set(this.normalizePath(this.router.url));
    this.navIndicatorTransitionsDisabled.set(this.loadedByBrowserRefresh);
    this.configureBrowserScrollRestoration();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.siteShell) {
      return;
    }

    this.resetScrollPositionAfterRefresh();

    const shell = this.siteShell.nativeElement;
    const onClick = (event: MouseEvent) => {
      void this.onAppNavigationClick(event);
    };
    const onResize = () => this.scheduleNavLayoutUpdate();

    shell.addEventListener('click', onClick, { capture: true });
    this.removePrimaryNavListener = () => shell.removeEventListener('click', onClick, { capture: true });
    window.addEventListener('resize', onResize);
    this.removeResizeListener = () => window.removeEventListener('resize', onResize);
    // Font swaps change individual link widths even without a window resize.
    if (this.primaryNav) {
      this.navResizeObserver = new ResizeObserver(onResize);
      this.navResizeObserver.observe(this.primaryNav.nativeElement);
      this.primaryNav.nativeElement.querySelectorAll<HTMLElement>('a').forEach(link => {
        this.navResizeObserver!.observe(link);
      });
    }
    document.fonts.addEventListener('loadingdone', onResize);
    this.removeFontListener = () => document.fonts.removeEventListener('loadingdone', onResize);
    void document.fonts.ready.then(() => this.scheduleNavLayoutUpdate());
    this.routerEventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activePath.set(this.normalizePath(event.urlAfterRedirects));
        window.requestAnimationFrame(() => {
          this.updateNavIndicator();
          this.updateForOperatorsIndicator();
        });
      }
    });
    window.requestAnimationFrame(() => {
      this.updateNavIndicator();
      this.updateForOperatorsIndicator();
      this.restoreNavIndicatorTransitions();
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.navResizeObserver?.disconnect();
    this.removeFontListener?.();
    if (this.isBrowser) window.cancelAnimationFrame(this.navLayoutFrame);
    this.removePrimaryNavListener?.();
    this.removeResizeListener?.();
    this.routerEventsSubscription?.unsubscribe();
  }

  private scheduleNavLayoutUpdate(): void {
    if (this.destroyed || !this.isBrowser || this.navLayoutFrame) return;
    this.navLayoutFrame = window.requestAnimationFrame(() => {
      this.navLayoutFrame = 0;
      if (this.destroyed) return;
      this.updateNavIndicator();
      this.updateForOperatorsIndicator();
    });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((value) => !value);

    if (this.isBrowser) {
      window.requestAnimationFrame(() => this.updateNavIndicator());
    }
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.forOperatorsMenuOpen.set(false);
  }

  protected toggleForOperatorsMenu(): void {
    this.forOperatorsMenuOpen.update((value) => !value);
    this.scheduleForOperatorsIndicatorUpdate();
  }

  protected openForOperatorsMenu(): void {
    this.forOperatorsMenuOpen.set(true);
    this.scheduleForOperatorsIndicatorUpdate();
  }

  protected closeForOperatorsMenu(): void {
    this.forOperatorsMenuOpen.set(false);
  }

  protected isForOperatorsActive(): boolean {
    return [
      '/for-operators',
      '/for-operators/platform',
      '/for-operators/wallet-integration',
      '/for-operators/security',
      '/for-operators/docs',
      '/for-operators/comparison',
    ].some((path) => this.isActive(path));
  }

  protected isActive(path: string): boolean {
    const currentPath = this.activePath();
    const targetPath = this.normalizePath(path);

    if (targetPath === '/') {
      return currentPath === targetPath;
    }

    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  }

  private async onAppNavigationClick(event: MouseEvent): Promise<void> {
    const link = this.findAppNavigationLink(event.target);

    if (
      !link ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    const path = this.getInternalLinkPath(link);

    if (!path) {
      return;
    }

    const targetPath = this.normalizePath(path);
    const isForOperatorsLink = link.hasAttribute('data-for-operators-nav-link');

    this.pendingPrimaryNavigation = { path, targetPath };

    if (this.primaryNavigationInProgress) {
      return;
    }

    this.primaryNavigationInProgress = true;

    try {
      if (isForOperatorsLink) {
        this.updateForOperatorsIndicator(link);
        await this.wait(this.submenuSelectTransitionMs);
      }

      this.closeMenu();

      while (this.pendingPrimaryNavigation) {
        const nextNavigation = this.pendingPrimaryNavigation;
        this.pendingPrimaryNavigation = undefined;
        const currentPath = this.activePath();

        this.updateNavIndicator(this.findPrimaryNavLinkByPath(nextNavigation.targetPath));

        if (currentPath !== nextNavigation.targetPath) {
          this.resetScrollPosition();
          let navigationSucceeded = false;

          try {
            navigationSucceeded = await this.router.navigateByUrl(nextNavigation.path);
          } catch (error) {
            console.error('App navigation failed', error);
          }

          if (!navigationSucceeded) {
            this.updateNavIndicator();
            this.updateForOperatorsIndicator();
            continue;
          }

          this.resetScrollPosition();
          this.activePath.set(nextNavigation.targetPath);
          this.updateNavIndicator();
          this.updateForOperatorsIndicator();
        }
      }
    } finally {
      this.primaryNavigationInProgress = false;
    }
  }

  private findAppNavigationLink(target: EventTarget | null): HTMLAnchorElement | null {
    if (!(target instanceof Element)) {
      return null;
    }

    const link = target.closest<HTMLAnchorElement>('a[href]');

    if (!link || !this.isInternalNavigationLink(link)) {
      return null;
    }

    return link;
  }

  private isInternalNavigationLink(link: HTMLAnchorElement): boolean {
    if (
      link.hasAttribute('download') ||
      link.target === '_blank' ||
      link.target === '_parent' ||
      link.target === '_top' ||
      link.getAttribute('href')?.startsWith('#')
    ) {
      return false;
    }

    const url = new URL(link.href, window.location.href);

    return url.origin === window.location.origin && url.pathname !== window.location.pathname;
  }

  private getInternalLinkPath(link: HTMLAnchorElement): string | null {
    try {
      const url = new URL(link.href, window.location.href);

      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return null;
    }
  }

  private normalizePath(path: string): string {
    const cleanPath = path.split(/[?#]/)[0];

    if (cleanPath === '/') {
      return cleanPath;
    }

    return cleanPath.replace(/\/$/, '');
  }

  private resetScrollPosition(): void {
    if (!this.isBrowser) {
      return;
    }

    this.setScrollTop(0);
  }

  private wasLoadedByBrowserRefresh(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    const [navigationEntry] = performance.getEntriesByType(
      'navigation',
    ) as PerformanceNavigationTiming[];

    return navigationEntry?.type === 'reload';
  }

  private configureBrowserScrollRestoration(): void {
    if (!this.isBrowser || !('scrollRestoration' in history)) {
      return;
    }

    history.scrollRestoration = 'manual';
  }

  private resetScrollPositionAfterRefresh(): void {
    if (!this.loadedByBrowserRefresh) {
      return;
    }

    this.resetScrollPosition();

    window.requestAnimationFrame(() => {
      this.resetScrollPosition();

      window.requestAnimationFrame(() => this.resetScrollPosition());
    });
  }

  private restoreNavIndicatorTransitions(): void {
    if (!this.navIndicatorTransitionsDisabled()) {
      return;
    }

    window.requestAnimationFrame(() => {
      this.navIndicatorTransitionsDisabled.set(false);
    });
  }

  private wait(durationMs: number): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(resolve, durationMs);
    });
  }

  private setScrollTop(value: number): void {
    const top = Math.max(0, value);

    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = top;
    }

    document.documentElement.scrollTop = top;
    document.body.scrollTop = top;
    window.scrollTo({ top, left: 0, behavior: 'auto' });
  }

  private updateNavIndicator(targetLink?: HTMLElement): void {
    if (!this.isBrowser || !this.primaryNav) {
      return;
    }

    const nav = this.primaryNav.nativeElement;
    const link = targetLink ?? this.findActiveNavLink(nav);

    if (!link) {
      this.navIndicator.set({
        opacity: 0,
        transform: 'translate3d(0, 0, 0)',
        width: '0px',
      });
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    this.navIndicator.set({
      opacity: 1,
      transform: `translate3d(${(linkRect.left - navRect.left).toFixed(2)}px, ${(linkRect.top - navRect.top).toFixed(2)}px, 0)`,
      width: `${linkRect.width.toFixed(2)}px`,
    });
  }

  private scheduleForOperatorsIndicatorUpdate(): void {
    if (!this.isBrowser) {
      return;
    }

    window.requestAnimationFrame(() => this.updateForOperatorsIndicator());
  }

  private updateForOperatorsIndicator(targetLink?: HTMLElement): void {
    if (!this.isBrowser || !this.forOperatorsMenu) {
      return;
    }

    const menu = this.forOperatorsMenu.nativeElement;
    const link = targetLink ?? this.findActiveForOperatorsLink(menu);

    if (!link) {
      this.forOperatorsIndicator.set({
        opacity: 0,
        transform: 'translate3d(0, 0, 0)',
        height: '0px',
      });
      return;
    }

    const menuRect = menu.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    this.forOperatorsIndicator.set({
      opacity: 1,
      transform: `translate3d(0, ${(linkRect.top - menuRect.top).toFixed(2)}px, 0)`,
      height: `${linkRect.height.toFixed(2)}px`,
    });
  }

  private findActiveForOperatorsLink(menu: HTMLElement): HTMLElement | undefined {
    return Array.from(menu.querySelectorAll<HTMLElement>('a[data-for-operators-nav-link]')).find((link) =>
      this.isActive(link.getAttribute('href') ?? '/'),
    );
  }

  private findActiveNavLink(nav: HTMLElement): HTMLElement | undefined {
    const links = Array.from(
      nav.querySelectorAll<HTMLElement>(
        ':scope > a[data-primary-nav-link], :scope > .nav-dropdown > [data-primary-nav-button]',
      ),
    );

    return links.find(
      (link) => link.classList.contains('active') || this.isActive(link.getAttribute('href') ?? '/'),
    );
  }

  private findPrimaryNavLinkByPath(path: string): HTMLElement | undefined {
    if (!this.isBrowser || !this.primaryNav) {
      return undefined;
    }

    const targetPath = this.normalizePath(path);
    const links = Array.from(
      this.primaryNav.nativeElement.querySelectorAll<HTMLElement>(
        ':scope > a[data-primary-nav-link], :scope > .nav-dropdown > [data-primary-nav-button]',
      ),
    );

    return (
      links.find((link) => this.normalizePath(link.getAttribute('href') ?? '/') === targetPath) ??
      links.find((link) => link.hasAttribute('data-primary-nav-button'))
    );
  }
}
