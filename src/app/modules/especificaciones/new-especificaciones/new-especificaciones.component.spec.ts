import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewEspecificacionesComponent } from './new-especificaciones.component';

describe('NewEspecificacionesComponent', () => {
  let component: NewEspecificacionesComponent;
  let fixture: ComponentFixture<NewEspecificacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewEspecificacionesComponent]
    });
    fixture = TestBed.createComponent(NewEspecificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});