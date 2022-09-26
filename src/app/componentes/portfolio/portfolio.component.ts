import { Component, OnInit } from '@angular/core';
import { trigger, transition, state, style, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  animations: [
    trigger('logo', [transition(':enter', [style({}), animate('4s', keyframes([
      style({ opacity: 0, offset: 0 }),
      style({ transform: 'translate(100vw,0)', offset: 0.1 }),
      style({ transform: 'translate(-5vw,0)', opacity: 100, offset: 0.8 }),
      style({ transform: 'translate(0,0) rotate(-360deg)', offset: 0.99 })
    ]))])]),
    trigger('oculto', [transition(':enter', [style({}), animate('5s', keyframes([
      style({ opacity: 0, offset: 0 }),
      style({ opacity: 0, offset: 0.75 }),
      style({ opacity: 1, offset: 1 })
    ]))])])
  ]
})
export class PortfolioComponent implements OnInit {

  isUserLogin!: boolean;

  constructor() { }

  ngOnInit(): void {
    if (sessionStorage.getItem('token')) {
      this.isUserLogin = true;
    }
    else {
      this.isUserLogin = false;
    }
  }
}
