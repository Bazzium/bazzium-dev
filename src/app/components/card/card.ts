import { Component, Input } from '@angular/core';

type CardTone = 'default' | 'muted';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class CardComponent {
  @Input() tone: CardTone = 'default';
  @Input() interactive = true;

  get classes(): string {
    const interactiveClass = this.interactive ? '' : ' card-static';

    return `card card-${this.tone}${interactiveClass}`;
  }
}
