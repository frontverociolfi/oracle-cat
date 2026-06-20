import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OracleApiService } from './oracle-api.service';

describe('OracleApiService', () => {
  let httpTesting: HttpTestingController;
  let service: OracleApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OracleApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(OracleApiService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should send questions to the oracle endpoint', () => {
    let answer = '';

    service.ask('Where is the warmest sunbeam?', 'en').subscribe((response) => {
      answer = response.answer;
    });

    const request = httpTesting.expectOne('/api/oracle');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      language: 'en',
      question: 'Where is the warmest sunbeam?',
    });

    request.flush({ answer: 'Behind the velvet curtain.' });

    expect(answer).toBe('Behind the velvet curtain.');
  });
});
