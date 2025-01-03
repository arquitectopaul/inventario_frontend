import { TestBed } from '@angular/core/testing';

import { EspecificacionesService } from './especificaciones.service';

describe('EspecificacionesService', () => {
  let service: EspecificacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspecificacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
