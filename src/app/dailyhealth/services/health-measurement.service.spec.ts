import { TestBed } from '@angular/core/testing';

import { HealthMeasurementService } from './health-measurement.service';

describe('HealthMeasurementService', () => {
  let service: HealthMeasurementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthMeasurementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
