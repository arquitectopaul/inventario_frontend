import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewActivoComponent } from './new-activo.component';

describe('NewActivoComponent', () => {
  let component: NewActivoComponent;
  let fixture: ComponentFixture<NewActivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewActivoComponent]
    });
    fixture = TestBed.createComponent(NewActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
