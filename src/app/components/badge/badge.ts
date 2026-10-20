import { Component, Input } from '@angular/core';

type BadgeTone = 'default' | 'engineering' | 'release' | 'security';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.scss'
})
export class BadgeComponent {
  @Input() tone: BadgeTone = 'default';

  get classes(): string {
    return `badge badge-${this.tone}`;
  }
}
