import { TestBed } from '@angular/core/testing';

import { WebSqlService } from './web-sql.service';

describe('WebSqlService', () => {
  let service: WebSqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
