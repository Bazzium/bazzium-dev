# Bazzium | Dev

Angular 20 projekat preuzet iz `C:\Users\Nikola\source\repos\Bazzium` i prilagođen uslugama izrade sajtova. Originalni logo, stilovi, komponente, navigacija i statički prerender čine osnovu.

## Pokretanje

- `npm install`
- `npm start` — lokalni Angular server
- `npm run build` — prerender u `dist/bazzium/browser`
- `npm run preview` — lokalni Cloudflare Worker sa statičkim fajlovima
- `npm run deploy` — build i objava na prijavljeni Cloudflare nalog

## Stranice

`/`, `/usluge`, `/portfolio`, `/saradnja`, `/kontakt` su zasebne Angular rute sa statičkim HTML izlazom, naslovima i canonical URL-ovima za dev.bazzium.com.

Kontakt forma i Worker `/api/contact` su implementirani. Resend secrets i verifikacija domena još treba da se podese. Custom domain i javni deployment nisu podešeni ovim izmenama.

Prethodna Next.js verzija sačuvana je u susednom folderu `bazzium-dev-next-backup` i više nije aktivni projekat.

## Kontakt forma i Resend
Forma sadrži email, uslugu (uključujući Drugo) i opis. Worker endpoint /api/contact šalje upite na dev@bazzium.com. Konfiguriši RESEND_API_KEY i RESEND_FROM_EMAIL pomoću wrangler secret put. Pošiljalac mora koristiti domen verifikovan u Resend-u. Bez konfiguracije endpoint vraća 503; poruka se ne prijavljuje kao poslata. Lokalno koristi npm run preview (Angular dev server sam ne izvršava Worker).
Provera bez stvarnog slanja: node worker/contact.test.mjs.


