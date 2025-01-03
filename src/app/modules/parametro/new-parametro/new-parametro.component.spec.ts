import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewParametroComponent } from './new-parametro.component';

describe('NewParametroComponent', () => {
  let component: NewParametroComponent;
  let fixture: ComponentFixture<NewParametroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewParametroComponent]
    });
    fixture = TestBed.createComponent(NewParametroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
