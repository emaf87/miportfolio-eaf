import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, state, style, animate, keyframes } from '@angular/animations';


@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css'],
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

export class EncabezadoComponent implements OnInit {


  @Input() isUserLogin!: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onLogOut() {
    sessionStorage.clear();
    window.location.reload();
  }
}
