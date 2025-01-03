import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoBienComponent } from './tipobien.component';

describe('TipoBienComponent', () => {
  let component: TipoBienComponent;
  let fixture: ComponentFixture<TipoBienComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoBienComponent]
    });
    fixture = TestBed.createComponent(TipoBienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
