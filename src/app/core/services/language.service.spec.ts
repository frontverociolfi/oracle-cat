import { TestBed } from '@angular/core/testing';

import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LanguageService],
    });

    service = TestBed.inject(LanguageService);
  });

  it('should default to English copy', () => {
    expect(service.language()).toBe('en');
    expect(service.text().title).toBe('ask the oracle cat');
  });

  it('should switch to Portuguese copy', () => {
    service.setLanguage('pt');

    expect(service.language()).toBe('pt');
    expect(service.text().title).toBe('pergunte ao gato oráculo');
  });

  it('should toggle languages', () => {
    service.toggleLanguage();

    expect(service.language()).toBe('pt');

    service.toggleLanguage();

    expect(service.language()).toBe('en');
  });
});
