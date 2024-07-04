import { TestBed } from '@angular/core/testing';

import { GenerativeaiService } from './generativeai.service';

describe('GenerativeaiService', () => {
  let service: GenerativeaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerativeaiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
