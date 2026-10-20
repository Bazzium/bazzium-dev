import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BottomEdgeFadeDirective } from '../../directives/bottom-edge-fade.directive';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-game-portfolio-hero',
  imports: [RouterLink, ButtonComponent, BottomEdgeFadeDirective],
  templateUrl: './game-portfolio-hero.html',
  styleUrl: './game-portfolio-hero.scss',
})
export class GamePortfolioHeroComponent {}
