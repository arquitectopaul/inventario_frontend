import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAtributoComponent } from './new-atributo.component';

describe('NewAtributoComponent', () => {
  let component: NewAtributoComponent;
  let fixture: ComponentFixture<NewAtributoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewAtributoComponent]
    });
    fixture = TestBed.createComponent(NewAtributoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
