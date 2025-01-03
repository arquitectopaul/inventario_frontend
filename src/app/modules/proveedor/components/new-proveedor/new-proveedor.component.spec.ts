import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProveedorComponent } from './new-proveedor.component';

describe('NewProveedorComponent', () => {
  let component: NewProveedorComponent;
  let fixture: ComponentFixture<NewProveedorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewProveedorComponent]
    });
    fixture = TestBed.createComponent(NewProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
