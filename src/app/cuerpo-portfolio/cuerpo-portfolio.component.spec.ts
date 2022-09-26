import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuerpoPortfolioComponent } from './cuerpo-portfolio.component';

describe('CuerpoPortfolioComponent', () => {
  let component: CuerpoPortfolioComponent;
  let fixture: ComponentFixture<CuerpoPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuerpoPortfolioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuerpoPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
