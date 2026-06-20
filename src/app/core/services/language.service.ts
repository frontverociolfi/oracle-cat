import { computed, Injectable, signal } from '@angular/core';

import { Language } from '../models/language.models';

const translations = {
  en: {
    askAgain: 'ask again',
    askButton: 'ask',
    emptyQuestion: 'Ask the oracle cat something first.',
    errorFallback: 'The oracle cat stayed silent.',
    inputPlaceholder: 'whisper your question...',
    kicker: 'mystical nonsense division',
    languageToggleLabel: 'Change language',
    summoning: 'summoning...',
    title: 'ask the oracle cat',
  },
  pt: {
    askAgain: 'perguntar de novo',
    askButton: 'perguntar',
    emptyQuestion: 'Pergunte algo ao gato oráculo primeiro.',
    errorFallback: 'O gato oráculo ficou em silêncio.',
    inputPlaceholder: 'sussurre sua pergunta...',
    kicker: 'divisão mística dos gatos',
    languageToggleLabel: 'Mudar idioma',
    summoning: 'invocando...',
    title: 'pergunte ao gato oráculo',
  },
} as const;

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly currentLanguage = signal<Language>('en');

  readonly language = this.currentLanguage.asReadonly();
  readonly text = computed(() => translations[this.currentLanguage()]);

  setLanguage(language: Language): void {
    this.currentLanguage.set(language);
  }

  toggleLanguage(): void {
    this.currentLanguage.update((language) => (language === 'en' ? 'pt' : 'en'));
  }
}
