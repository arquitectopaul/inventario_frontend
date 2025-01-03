import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewArticuloComponent } from './new-articulo.component';

describe('NewArticuloComponent', () => {
  let component: NewArticuloComponent;
  let fixture: ComponentFixture<NewArticuloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewArticuloComponent]
    });
    fixture = TestBed.createComponent(NewArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
