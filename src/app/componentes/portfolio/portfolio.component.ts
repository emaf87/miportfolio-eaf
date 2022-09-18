import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
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
