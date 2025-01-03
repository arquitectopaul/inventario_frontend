import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAtributosComponent } from './new-atributos.component';

describe('NewAtributosComponent', () => {
  let component: NewAtributosComponent;
  let fixture: ComponentFixture<NewAtributosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewAtributosComponent]
    });
    fixture = TestBed.createComponent(NewAtributosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
