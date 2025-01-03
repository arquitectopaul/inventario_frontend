import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewResponsableComponent } from './new-responsable.component';

describe('NewResponsableComponent', () => {
  let component: NewResponsableComponent;
  let fixture: ComponentFixture<NewResponsableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewResponsableComponent]
    });
    fixture = TestBed.createComponent(NewResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
