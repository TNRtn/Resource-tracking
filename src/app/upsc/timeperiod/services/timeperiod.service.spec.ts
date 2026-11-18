import { TestBed } from '@angular/core/testing';

import { TimeperiodService } from './timeperiod.service';

describe('TimeperiodService', () => {
  let service: TimeperiodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeperiodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
