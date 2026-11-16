import { TestBed } from '@angular/core/testing';

import { ResourecesService } from './resoureces.service';

describe('ResourecesService', () => {
  let service: ResourecesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourecesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
