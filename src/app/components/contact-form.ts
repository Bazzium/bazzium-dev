import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate [attr.aria-busy]="sending()">
      <div class="fields">
        <label for="contact-email">Tvoj email
          <input id="contact-email" type="email" autocomplete="email" formControlName="email" placeholder="ime@primer.rs" maxlength="254" required [attr.aria-invalid]="invalid('email')" aria-describedby="email-error">
          <small id="email-error">@if (invalid('email')) { Unesi ispravnu email adresu. }</small>
        </label>
        <label for="contact-service">Šta ti je potrebno?
          <select id="contact-service" formControlName="service" required [attr.aria-invalid]="invalid('service')" aria-describedby="service-error">
            <option value="" disabled>Izaberi uslugu</option>
            <option value="presentation">Sajtovi i landing stranice</option>
            <option value="commerce">Online prodavnice</option>
            <option value="applications">Web aplikacije i poslovni sistemi</option><option value="integrations">Integracije i unapređenja</option>
            <option value="other">Drugo</option>
          </select>
          <small id="service-error">@if (invalid('service')) { Izaberi uslugu. }</small>
        </label>
      </div>
      <label for="contact-description">Opis projekta (opciono)
        <textarea id="contact-description" formControlName="description" rows="6" maxlength="5000" placeholder="Opiši svoju ideju, posao i šta želiš da postigneš projektom…" [attr.aria-invalid]="invalid('description')" aria-describedby="description-error"></textarea>
        <small id="description-error">@if (invalid('description')) { Opis može imati najviše 5.000 karaktera. }</small>
      </label>
      <div class="trap" aria-hidden="true"><label>Website<input formControlName="website" tabindex="-1" autocomplete="off"></label></div>
      <p class="privacy-note">Email koristimo da odgovorimo na tvoj upit.</p>
      <button type="submit" [disabled]="sending()">{{ sending() ? 'Slanje…' : 'Pošalji upit ↗' }}</button>
      @if (success()) { <p class="success" role="status">Upit je poslat. Hvala što si nam predstavio svoju ideju!</p> }
      @if (error()) { <p class="error" role="alert">{{ error() }} Možeš nam pisati na <a href="mailto:dev@bazzium.com">dev&#64;bazzium.com</a>.</p> }
    </form>`,
  styles: [`
    :host{display:block;margin-top:1.8rem}.fields{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    label{display:flex;flex-direction:column;gap:.6rem;color:var(--heading-text);font-size:.85rem;font-weight:600}
    input,select,textarea{width:100%;box-sizing:border-box;background:#0b1423;border:1px solid #354660;border-radius:6px;color:#e9f0fa;padding:.85rem;font:400 .9rem var(--font-body);color-scheme:dark}
    textarea{resize:vertical;min-height:140px}input::placeholder,textarea::placeholder{color:#8b9cb4}
    input:focus,select:focus,textarea:focus{outline:2px solid #63f5d2;outline-offset:2px}
    [aria-invalid=true]{border-color:#ff9caa}small{min-height:1.2rem;color:#ff9caa;font-weight:400}
    button{border:0;border-radius:6px;background:#63f5d2;color:#081a20;font:700 .9rem var(--font-body);padding:1rem 1.4rem;cursor:pointer}
    button:disabled{opacity:.6;cursor:wait}button:focus-visible{outline:2px solid #9e8fff;outline-offset:4px}
    .privacy-note{font-size:.75rem;color:var(--text-muted);margin:.5rem 0 1.2rem}.success{color:#63f5d2}.error{color:#ffb0ba}
    .trap{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
    @media(max-width:600px){.fields{grid-template-columns:1fr}}
  `],
})
export class ContactForm {
  private readonly fb = inject(FormBuilder);
  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    service: ['', Validators.required],
    description: ['', [Validators.maxLength(5000)]],
    website: [''],
  });
  protected readonly sending = signal(false);
  protected readonly success = signal(false);
  protected readonly error = signal('');
  protected readonly submitted = signal(false);
  protected invalid(name: 'email' | 'service' | 'description') {
    return this.submitted() && this.form.controls[name].invalid;
  }
  protected async submit() {
    if (this.sending()) return;
    this.success.set(false);
    this.error.set('');
    this.form.patchValue({
      email: this.form.controls.email.value.trim(),
      description: this.form.controls.description.value.trim(),
    });
    this.submitted.set(true);
    if (this.form.invalid) return;
    this.sending.set(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form.getRawValue()), signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error('Send failed');
      this.success.set(true);
      this.form.reset();
      this.submitted.set(false);
    } catch {
      this.error.set('Slanje trenutno nije uspelo. Pokušaj ponovo kasnije.');
    } finally {
      this.sending.set(false);
    }
  }
}


