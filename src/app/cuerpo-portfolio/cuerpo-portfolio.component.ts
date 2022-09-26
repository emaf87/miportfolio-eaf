import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cuerpo-portfolio',
  templateUrl: './cuerpo-portfolio.component.html',
  styleUrls: ['./cuerpo-portfolio.component.css']
})
export class CuerpoPortfolioComponent implements OnInit {

  constructor() { }
  @Input() isUserLogin!: boolean;
  

  ngOnInit(): void {
  }

}
