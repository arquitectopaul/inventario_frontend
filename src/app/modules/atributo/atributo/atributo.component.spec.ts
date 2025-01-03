import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtributoComponent } from './atributo.component';

describe('AtributoComponent', () => {
  let component: AtributoComponent;
  let fixture: ComponentFixture<AtributoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtributoComponent]
    });
    fixture = TestBed.createComponent(AtributoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
