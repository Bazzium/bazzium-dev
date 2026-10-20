import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ButtonComponent } from './button';

@Component({
  imports: [ButtonComponent],
  template: `
    <app-button href="/contact">Request Demo</app-button>
    <app-button>Submit</app-button>
  `
})
class ButtonHostComponent {}

describe('ButtonComponent content projection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonHostComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should render visible text for routerLink, href, and button variants', () => {
    const fixture = TestBed.createComponent(ButtonHostComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    const links = root.querySelectorAll('a.btn');
    expect(links.length).toBe(2);
    expect(links[0].textContent?.trim()).toBe('View Docs');
    expect(links[1].textContent?.trim()).toBe('Request Demo');

    const button = root.querySelector('button.btn');
    expect(button?.textContent?.trim()).toBe('Submit');
  });
});
