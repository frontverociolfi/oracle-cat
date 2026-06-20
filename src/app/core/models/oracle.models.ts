import { Language } from './language.models';

export interface OracleQuestionRequest {
  language: Language;
  question: string;
}

export interface OracleAnswerResponse {
  answer: string;
}
