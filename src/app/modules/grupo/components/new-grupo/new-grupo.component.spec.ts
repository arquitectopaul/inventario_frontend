import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGrupoComponent } from './new-grupo.component';

describe('NewGrupoComponent', () => {
  let component: NewGrupoComponent;
  let fixture: ComponentFixture<NewGrupoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewGrupoComponent]
    });
    fixture = TestBed.createComponent(NewGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
