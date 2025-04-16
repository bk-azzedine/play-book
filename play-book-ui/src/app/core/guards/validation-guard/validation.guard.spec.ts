import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { validationGuard } from './validation.guard';

describe('validationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => validationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
