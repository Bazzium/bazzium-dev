import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BottomEdgeFadeDirective } from '../../directives/bottom-edge-fade.directive';
import { ButtonComponent } from '../button/button';
import { CardComponent } from '../card/card';

@Component({
  selector: 'app-operator-delivery-hero',
  imports: [RouterLink, ButtonComponent, CardComponent, BottomEdgeFadeDirective],
  templateUrl: './operator-delivery-hero.html',
  styleUrl: './operator-delivery-hero.scss',
})
export class OperatorDeliveryHeroComponent {
  readonly showExploreGames = input(true);
}
