import { ContactForm } from './components/contact-form';
import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SectionArt } from './components/section-art';
import { DevArt } from './components/dev-art';
import { ParallaxDirective } from './directives/parallax.directive';
import { RevealDirective } from './directives/reveal.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-dev-page',
  imports: [ContactForm, RouterLink, DevArt, SectionArt, ParallaxDirective, RevealDirective],
  template: `
    <div class="page-topline"><span>NEZAVISNI WEB STUDIO / BAZZIUM</span>@if (page.kind !== 'not-found') { <button type="button" class="motion-toggle" (click)="toggleMotion()" [attr.aria-pressed]="motionPaused">{{ motionPaused ? 'Pokreni animacije' : 'Pauziraj animacije' }}</button> }</div><div class="intro-layout" [class.home-intro]="page.kind === 'home'" [class.inner-intro]="page.kind !== 'home'" [attr.data-page]="page.kind"><section class="intro">
      <p class="eyebrow">{{ page.eyebrow }}</p>
      <h1>{{ page.heading }}</h1>
      <p class="lead">{{ page.description }}</p>
    </section>
    @switch (page.kind) {
      @case ('home') { <div class="intro-art" appParallax><app-dev-art /></div> }
      @case ('services') {
        <div class="page-motif service-motif" aria-hidden="true"><span>JEDAN SAJT / SVAKI EKRAN</span><app-section-art class="responsive-devices" variant="responsive" /></div>
      }
      @case ('portfolio') {
        <div class="page-motif portfolio-motif"><strong>03<span>/ ODABRANA PROJEKTA</span></strong><p>Tri različita posla.<br>Tri digitalna potpisa.</p></div>
      }
      @case ('process') {
        <div class="page-motif process-motif" aria-label="Četiri koraka saradnje"><span>OD PRVOG RAZGOVORA DO OBJAVE</span><div><b>01</b><i></i><b>02</b><i></i><b>03</b><i></i><b>04</b></div></div>
      }
      @case ('contact') {
        <div class="page-motif contact-motif" aria-hidden="true"><svg viewBox="0 0 240 170" fill="none"><rect x="20" y="30" width="200" height="120" rx="10" stroke="currentColor" stroke-width="2"/><path d="m20 40 100 66 100-66M20 148l66-56m134 56-66-56" stroke="currentColor" stroke-width="2"/><circle cx="211" cy="30" r="20" fill="#101c2e" stroke="#9e8fff" stroke-width="2"/><path d="M202 30h18m-9-9v18" stroke="#9e8fff" stroke-width="2"/></svg><span>HAJDE DA SE UPOZNAMO.</span></div>
      }
    }
    </div>
    @if (page.kind === 'home') {
      <div class="hero-content">
        <div><h2>Od prve stranice do poslovnog sistema.</h2><p>Predstavi ponudu, prodaj online ili pojednostavi svakodnevni rad. Razvijamo interfejs, bazu podataka i poslovnu logiku kao povezanu celinu.</p><div class="actions"><a class="btn" routerLink="/kontakt">Razgovarajmo o tvom projektu ↗</a><a class="btn secondary" routerLink="/portfolio">Pogledaj radove</a></div></div>
        <aside class="studio-note"><span class="eyebrow">01 / OD IDEJE DO OBJAVE</span><h2>Dobro rešenje počinje<br>dobrim razumevanjem.</h2><p>Tvoj posao je polazna tačka. Dizajn i tehnologija daju mu prostor da se predstavi.</p><a routerLink="/saradnja">Upoznaj proces ↗</a></aside>
      </div>
      <section class="section motion-section" appParallax><app-section-art class="section-background" variant="orbit" /><h2>Šta je potrebno tvom poslu?</h2><div class="grid services-grid">
        @for (service of services; track service.title; let i = $index) {
          <article class="service-card" appReveal [style.--reveal-delay]="i * 170 + 'ms'">
            <header class="service-card-heading"><span aria-hidden="true">0{{ i + 1 }}</span><h3>{{ service.title }}</h3></header>
            <p>{{ service.text }}</p>
            <app-section-art class="card-art" [variant]="service.art" />
            <a routerLink="/usluge">Istraži usluge ↗</a>
          </article>
        }
      </div></section>
    }
    @if (page.kind === 'services') {
      <div class="service-list">
        @for (service of services; track service.title; let i = $index) {
          <article class="illustrated-row motion-section" appParallax><span class="eyebrow">0{{ i + 1 }}</span><div><h2>{{ service.title }}</h2><p>{{ service.text }}</p><p>{{ service.details }}</p></div><app-section-art class="row-art" [variant]="service.art" /></article>
        }
      </div>
      <aside class="note"><h2>Obim koji ima smisla za tebe.</h2><p>Stranice, funkcionalnosti, podaci i integracije zavise od tvog cilja. Na osnovu toga pripremamo ponudu i rok izrade.</p></aside>
    }
    @if (page.kind === 'portfolio') {
      <div class="grid projects">
        @for (project of projects; track project.url; let i = $index) {
          <article><app-section-art class="card-art" variant="layers" [gradientId]="'portfolio-axis-' + i" /><p class="eyebrow">{{ project.type }}</p><h2>{{ project.title }}</h2><p>{{ project.text }}</p><a [href]="project.url" target="_blank" rel="noopener noreferrer">Poseti {{ project.domain }} ↗<span class="sr-only"> (novi tab)</span></a></article>
        }
      </div>
      <p class="portfolio-note">Svaki projekat počinje drugačijim poslom, publikom i ciljem. Pogledaj objavljene sajtove da upoznaš dosadašnji rad.</p>
    }
    @if (page.kind === 'process') {
      <div class="service-list">
        @for (step of steps; track step.title; let i = $index) {
          <article class="motion-section process-step" appParallax><app-section-art class="process-art" variant="path" /><span class="eyebrow">0{{ i + 1 }}</span><div><h2>{{ step.title }}</h2><p>{{ step.text }}</p></div></article>
        }
      </div>
      <aside class="note"><h2>Šta je korisno da pripremiš?</h2><p>Kratak opis posla, logo ako ga imaš, sadržaj koji želiš da predstaviš i primere sajtova koji ti se dopadaju. Ako tek razrađuješ ideju, možemo da krenemo od razgovora.</p></aside>
    }
    @if (page.kind === 'contact') {
      <div class="hero-content contact-layout"><div><h2>Ispričaj nam svoju ideju.</h2><p>Napiši čime se baviš, kakav sajt ili aplikaciju želiš i koje procese ili sisteme treba povezati. Ako imaš okviran rok ili budžet, možeš i to da navedeš.</p><app-contact-form /></div><aside class="motion-section" appParallax><app-section-art class="card-art" variant="path" /><p class="eyebrow">Piši nam</p><h2 class="email"><a href="mailto:dev@bazzium.com">dev&#64;bazzium.com</a></h2><p>Od prve ideje do konkretnog dogovora.</p></aside></div>
    }
    @if (page.kind === 'not-found') { <a class="btn" routerLink="/">Vrati se na početnu</a> }
    @if (page.kind !== 'contact' && page.kind !== 'not-found') {
      <section class="cta motion-section" appParallax><app-section-art class="section-background" variant="orbit" /><div><p class="eyebrow">Sledeći korak</p><h2>Hajde da razvijemo tvoju ideju.</h2></div><a class="btn" routerLink="/kontakt">Pošalji upit ↗</a></section>
    }
  `,
  styleUrl: './dev-page.scss',
})
export class DevPage {
  private readonly document = inject(DOCUMENT);
  protected motionPaused = this.document.documentElement.classList.contains('motion-paused');
  protected toggleMotion() { this.motionPaused = !this.motionPaused; this.document.documentElement.classList.toggle('motion-paused', this.motionPaused); }
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  protected page = this.route.snapshot.data as { kind: string; title: string; path: string; eyebrow: string; heading: string; description: string };
  protected readonly services = [
    { title: 'Sajtovi i landing stranice', art: 'presentation', text: 'Predstavi firmu, usluge ili kampanju kroz jasan i pregledan sajt.', details: 'Prezentacioni sajtovi i landing stranice prilagođeni tvojoj publici, sa sadržajem, kontakt formama i prikazom za sve veličine ekrana.' },
    { title: 'Online prodavnice', art: 'commerce', text: 'Od kataloga proizvoda do porudžbine i online plaćanja.', details: 'Katalog, pretraga, korpa, povezivanje sa servisima za plaćanje i administracija proizvoda i porudžbina. Obim i potrebne integracije dogovaramo prema načinu na koji posluješ.' },
    { title: 'Web aplikacije i poslovni sistemi', art: 'dashboard', text: 'Poslovna logika, podaci i izveštaji na jednom mestu.', details: 'Korisnički nalozi i prava pristupa, baze podataka, administracija, evidencije, dashboard-i i izveštaji. Razvoj prema procesima tvog poslovanja, od interfejsa do serverske logike.' },
    { title: 'Integracije i unapređenja', art: 'integrations', text: 'Poveži alate koje koristiš i unapredi postojeće rešenje.', details: 'API integracije, povezivanje sa CRM/ERP sistemima i automatizacija razmene podataka. Nadogradnja funkcionalnosti i redizajn postojećih sajtova i aplikacija.' },
  ];
  protected readonly projects = [
    { title: 'Naplati Sudar', type: 'Uslužna delatnost', text: 'Sajt za predstavljanje usluge naplate štete posle saobraćajne nezgode.', domain: 'naplatisudar.rs', url: 'https://naplatisudar.rs/' },
    { title: 'Fitness Flow', type: 'Fitness i mentorstvo', text: 'Prezentacija online mentorstva, treninga i podrške.', domain: 'fitnessflow.rs', url: 'http://fitnessflow.rs/' },
    { title: 'Bazzium', type: 'Tehnologija', text: 'Prezentacija iGaming tehnologije, proizvoda i mogućnosti integracije.', domain: 'bazzium.com', url: 'https://bazzium.com/' },
  ];
  protected readonly steps = [
    { title: 'Razgovor i dogovor', text: 'Upoznajemo tvoj posao i publiku. Dogovaramo cilj projekta, funkcionalnosti, obim, rok i cenu pre početka izrade.' },
    { title: 'Sadržaj i dizajn', text: 'Organizujemo informacije i oblikujemo izgled u skladu sa tvojim identitetom. Zajedno pregledamo predlog.' },
    { title: 'Razvoj i provera', text: 'Razvijamo interfejs i poslovnu logiku. Proveravamo funkcionalnosti, prava pristupa, tokove podataka i dogovorene integracije.' },
    { title: 'Puštanje u rad', text: 'Podešavamo hosting i domen, a zatim proveravamo rešenje u produkciji. Dalje izmene i održavanje dogovaramo prema potrebama.' },
  ];
  constructor() {
    this.route.data.pipe(takeUntilDestroyed()).subscribe(data => {
      this.page = data as { kind: string; title: string; path: string; eyebrow: string; heading: string; description: string };
      this.seo.setPageMetadata({ title: this.page['title'], description: this.page['description'], path: this.page['path'], robots: this.page['kind'] === 'not-found' ? 'noindex, follow' : undefined });
    });
  }
}










