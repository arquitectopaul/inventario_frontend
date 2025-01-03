import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtributosComponent } from './atributos.component';

describe('AtributosComponent', () => {
  let component: AtributosComponent;
  let fixture: ComponentFixture<AtributosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtributosComponent]
    });
    fixture = TestBed.createComponent(AtributosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
