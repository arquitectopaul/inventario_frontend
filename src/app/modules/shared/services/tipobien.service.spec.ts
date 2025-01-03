import { TestBed } from '@angular/core/testing';

import { TipoBienService } from './tipobien.service';

describe('TipoBienService', () => {
  let service: TipoBienService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoBienService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
