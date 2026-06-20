import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import {
  OracleAnswerResponse,
  OracleQuestionRequest,
} from '../models/oracle.models';
import { Language } from '../models/language.models';

@Injectable({
  providedIn: 'root',
})
export class OracleApiService {
  private readonly http = inject(HttpClient);

  ask(question: string, language: Language) {
    const request: OracleQuestionRequest = { language, question };

    return this.http.post<OracleAnswerResponse>('/api/oracle', request);
  }
}
