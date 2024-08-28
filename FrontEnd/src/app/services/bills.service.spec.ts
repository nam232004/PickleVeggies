/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BillsService } from './bills.service';

describe('Service: Bills', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillsService]
    });
  });

  it('should ...', inject([BillsService], (service: BillsService) => {
    expect(service).toBeTruthy();
  }));
});
