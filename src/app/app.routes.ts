import { Routes } from '@angular/router';
import { DevPage } from './dev-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: DevPage, data: { kind: 'home', path: '/', title: 'Sajtovi i web aplikacije | Bazzium | Dev', eyebrow: 'Bazzium | Dev', heading: 'Od sajta do sistema koji pokreće tvoj posao.', description: 'Razvijamo sajtove, online prodavnice i web aplikacije po meri — od korisničkog interfejsa do baza podataka, izveštaja i integracija.' } },
  { path: 'usluge', component: DevPage, data: { kind: 'services', path: '/usluge', title: 'Usluge | Bazzium | Dev', eyebrow: 'Šta radimo', heading: 'Web rešenja po meri tvog posla.', description: 'Sajtovi, online prodavnice, poslovne aplikacije i integracije. Krećemo od onoga što je tvom poslu potrebno.' } },
  { path: 'portfolio', component: DevPage, data: { kind: 'portfolio', path: '/portfolio', title: 'Portfolio | Bazzium | Dev', eyebrow: 'Odabrani radovi', heading: 'Različiti poslovi. Ista pažnja prema detaljima.', description: 'Istraži tri objavljena projekta iz našeg portfolija.' } },
  { path: 'saradnja', component: DevPage, data: { kind: 'process', path: '/saradnja', title: 'Saradnja | Bazzium | Dev', eyebrow: 'Kako radimo', heading: 'Od ideje do rešenja koje koristiš.', description: 'Jasni koraci i dogovor od početka saradnje.' } },
  { path: 'kontakt', component: DevPage, data: { kind: 'contact', path: '/kontakt', title: 'Kontakt | Bazzium | Dev', eyebrow: 'Razgovarajmo', heading: 'Tvoj novi projekat počinje razgovorom.', description: 'Pošalji ideju ili upit za izradu sajta ili web aplikacije na dev@bazzium.com.' } },
  { path: '**', component: DevPage, data: { kind: 'not-found', path: '/404', title: 'Stranica nije pronađena | Bazzium | Dev', eyebrow: '404', heading: 'Ova stranica ne postoji.', description: 'Vrati se na početnu i pronađi ono što te zanima.' } },
];

