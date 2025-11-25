import { TestBed } from '@angular/core/testing';

import { GpsService } from './gps';

describe('Gps', () => {
  let service: GpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
