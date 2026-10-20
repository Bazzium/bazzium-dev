import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'lg';

@Component({
  selector: 'app-button',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() block = false;
  @Input() disabled = false;
  @Input() routerLink: string | any[] | null = null;
  @Input() href: string | null = null;
  @Input() target: '_self' | '_blank' | null = null;
  @Input() ariaLabel: string | null = null;

  get classes(): string {
    return `btn btn-${this.variant} btn-${this.size}${this.block ? ' btn-block' : ''}`;
  }
}
