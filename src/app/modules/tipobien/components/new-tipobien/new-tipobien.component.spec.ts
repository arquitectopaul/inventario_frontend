import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTipoBienComponent } from './new-tipobien.component';

describe('NewTipoBienComponent', () => {
  let component: NewTipoBienComponent;
  let fixture: ComponentFixture<NewTipoBienComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewTipoBienComponent]
    });
    fixture = TestBed.createComponent(NewTipoBienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
