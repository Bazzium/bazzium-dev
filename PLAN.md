# Bazzium Dev — plan sajta i Instagram profila

Datum: 20. oktobar 2026.

## Cilj

Napraviti sajt za reklamiranje usluge izrade sajtova i Instagram poslovni profil za promociju putem Meta oglasa.

## Dogovorene odluke

- Sajt će biti na poddomenu **dev.bazzium.com**.
- Glavni sajt **bazzium.com** već je hostovan na Cloudflare-u.
- Novi sajt koristiće isti Cloudflare nalog, uz zaseban Worker i povezivanje poddomena. Postojeći glavni sajt ostaje neizmenjen.
- Tehnologija: **Angular**, sa statičkim izvozom stranica (Angular prerender, `outputMode: 'static'`).
- **Cloudflare Worker sa Static Assets** poslužiće izvezene stranice i obrađivati kontakt formu.
- Kontakt adresa: **dev@bazzium.com**.
- Telefon se za sada neće prikazivati.
- Email provajder uz domen je **Dynadot**; korisnik je potvrdio da je mailbox `dev@bazzium.com` kreiran u Dynadot Webmail-u.
- Kontakt forma koristiće **Resend**.

## Struktura i sadržaj sajta

Radni naziv: **Bazzium Dev**.

Template je postojeći projekat `C:\Users\Nikola\source\repos\Bazzium`. Preuzeti su originalni SVG logo iz zaglavlja, favicon, sivo-plava paleta, Manrope/Sora fontovi i osnovni raspored. Originalni Angular projekat prekopiran je i prilagođen dev sajtu.

Predložena glavna poruka: „Sajt koji jasno predstavlja tvoj posao.“

Predložene sekcije:

1. Uvod sa jasnom ponudom izrade sajtova i pozivom za slanje upita.
2. Usluge, sa obimom koji treba precizirati pre objave.
3. Portfolio sa linkovima ka postojećim radovima.
4. Kratak opis procesa saradnje.
5. Kontakt forma.

Sajt će biti na srpskom, prilagođen mobilnim uređajima i pripremljen za osnovni SEO. Cene, rokove, rezultate i preporuke klijenata ne objavljivati bez potvrđenih podataka.

### Portfolio koji je korisnik dostavio

- [Naplati Sudar](https://naplatisudar.rs/) — sajt za uslugu naplate štete posle saobraćajne nezgode.
- [Fitness Flow](http://fitnessflow.rs/) — sajt za online fitness mentorstvo.
- [Bazzium](https://bazzium.com/) — sajt za predstavljanje iGaming tehnologije.

## Tehnička arhitektura

```text
Posetilac → dev.bazzium.com → Cloudflare Worker
                              ├─ Static Assets: Angular statički izvoz
                              └─ POST /api/contact → Resend → dev@bazzium.com
```

- Angular Router služi za izradu statičkih stranica.
- Angular build generiše statički izlaz u `dist/bazzium/browser/`.
- Serverska obrada forme nalazi se u Cloudflare Worker-u, odvojeno od Angular statičkog izvoza.
- `/api/contact` mora biti usmeren na Worker, a ne na statičke fajlove.
- Resend API ključ čuva se kao Cloudflare Worker secret, nikada u klijentskom kodu ili repozitorijumu.
- Primalac je fiksno podešen na `dev@bazzium.com`.
- Pošiljalac mora biti adresa na domenu verifikovanom u Resend-u; adresa posetioca koristi se kao `reply_to`.
- Forma treba da ima serversku validaciju, ograničenje dužine poruke, zaštitu od zloupotrebe i jasne poruke o uspehu i grešci.
- Uspešno slanje prikazati samo kada Resend prihvati zahtev.

## Podešavanja pre javnog puštanja

1. Završeno: kreirano je sanduče `dev@bazzium.com` u Dynadot Webmail-u (potvrda korisnika). Prijem i slanje pošte još treba proveriti.
2. Verifikovati domen za slanje u Resend-u dodavanjem propisanih DNS zapisa.
3. Sačuvati postojeće Dynadot MX zapise; uskladiti DNS za slanje bez prekidanja prijema pošte.
4. Podesiti Resend API ključ kao Worker secret i potvrditi adresu pošiljaoca.
5. Deploy-ovati Worker i statičke fajlove na postojeći Cloudflare nalog.
6. Povezati `dev.bazzium.com` kao Worker custom domain i proveriti HTTPS.
7. Proveriti mobilni prikaz, portfolio linkove, validaciju forme, stvarni prijem upita i odgovaranje pošiljaocu.

## Instagram i Meta oglasi

Nakon pripreme sajta:

- Kreirati ili prilagoditi Instagram poslovni profil za Bazzium Dev.
- Proveriti dostupnost korisničkog imena; radni predlog je `bazzium.dev`.
- Pripremiti profilnu sliku, opis profila i link ka sajtu.
- Pripremiti početne objave koje predstavljaju uslugu, portfolio i proces saradnje.
- Povezati potrebne Meta poslovne resurse za oglašavanje.
- Dogovoriti publiku, budžet, kreativu i cilj kampanje pre pokretanja oglasa.

Još nije potvrđeno da li postoji Instagram nalog koji će se koristiti. Instagram profil i oglasi nisu kreirani. Nije dogovoreno pokretanje kampanje niti trošenje budžeta.

## Trenutno stanje

- Plan i tehnološki izbor su dogovoreni.
- Lokalni radni podfolder je `bazzium-dev/`.
- Pre konačnog izbora tehnologije registrovan je privatni, neobjavljeni Sites projekat; njegov identitet sačuvan je u `bazzium-dev-next-backup/.openai/hosting.json`.
- Taj Sites projekat nije produkcioni hosting iz ovog plana. Dogovoreni cilj je korisnikov postojeći Cloudflare nalog.
- Prva verzija Angular statičkog sajta implementirana je u `bazzium-dev/`, sa uslugama, portfoliom, procesom saradnje i email kontaktom.
- Cloudflare Workers Static Assets konfiguracija je pripremljena. Angular build i Wrangler deployment dry-run uspešno su prošli; lokalni sajt vraća HTTP 200. Vizuelna provera u browseru još nije završena.
- Resend forma, API Worker logika i Instagram profil još nisu implementirani. Kontakt trenutno koristi `mailto:dev@bazzium.com`.
- Mailbox `dev@bazzium.com` kreiran je u Dynadot Webmail-u prema potvrdi korisnika; prijem i slanje pošte nisu provereni u okviru ovog rada.
- Poddomen i Resend podešavanja još nisu završeni u okviru ovog rada.

## Sledeći koraci

1. Završeno: postavljen Angular projekat i Cloudflare Static Assets konfiguracija.
2. Prva verzija dizajna i sadržaja je napravljena na osnovu Bazzium template-a; pregledati i doraditi.
3. Implementirati kontakt formu i Worker endpoint.
4. Statički build i deployment dry-run prolaze; proveriti izgled na desktopu i telefonu, a zatim ponašanje API Worker-a kada bude implementiran.
5. Proveriti prijem i slanje pošte za kreirani mailbox, podesiti Resend i Cloudflare deployment.
6. Pripremiti Instagram profil i početni sadržaj.

## Izmena plana: Angular i zasebne stranice

- Na zahtev korisnika koristi se kopija Angular projekta Bazzium, umesto Next.js implementacije.
- Brend u zaglavlju: **Bazzium | Dev**.
- Zasebne stranice: Početna (/), Usluge (/usluge), Portfolio (/portfolio), Saradnja (/saradnja) i Kontakt (/kontakt).
- Navbar menja stranice; nema skrol navigacije između sekcija.
- Prethodna Next.js verzija je sačuvana u bazzium-dev-next-backup/.


### Provera Angular verzije

- Produkcioni build uspešno prerenderuje svih pet stranica.
- Svih pet URL-ova vraća HTTP 200 preko lokalnog Cloudflare servera, sa odgovarajućim naslovima.
- Wrangler deployment dry-run prolazi. Nije izvršen javni deployment.
- Posle kompatibilnog npm audit fix ažuriranja preostaju 22 prijavljene ranjivosti zavisnosti (1 low, 4 moderate, 16 high, 1 critical); rešiti pre objave.


## Proširena ponuda

- Glavna poruka: Od sajta do sistema koji pokreće tvoj posao.
- Četiri usluge: Sajtovi i landing stranice; Online prodavnice; Web aplikacije i poslovni sistemi; Integracije i unapređenja.
- Obuhvat: baze podataka, korisnički nalozi, prava pristupa, administracija, online plaćanje, izveštaji, API i CRM/ERP integracije. Redizajn je deo unapređenja.
- Usklađeni početna, Usluge, kontakt dropdown, Worker kategorije i SEO. Portfolio bez nepotvrđenih funkcionalnosti.
- Build, 14 provera kontakt endpointa i Cloudflare dry-run prolaze. Resend secrets i verifikacija domena ostaju preduslov stvarnog slanja.

