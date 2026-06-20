import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Language } from '../../../core/models/language.models';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageToggleComponent } from './language-toggle.component';

describe('LanguageToggleComponent', () => {
  let fixture: ComponentFixture<LanguageToggleComponent>;
  let languageService: LanguageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageToggleComponent);
    languageService = TestBed.inject(LanguageService);
    fixture.detectChanges();
  });

  it('should render language buttons with the current label', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[aria-label="Change language"]')).toBeTruthy();
    expect(compiled.textContent).toContain('EN');
    expect(compiled.textContent).toContain('PT');
  });

  it('should mark English as active by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const englishButton = compiled.querySelector(
      '[data-testid="language-en"]',
    ) as HTMLButtonElement;
    const portugueseButton = compiled.querySelector(
      '[data-testid="language-pt"]',
    ) as HTMLButtonElement;

    expect(englishButton.getAttribute('aria-pressed')).toBe('true');
    expect(portugueseButton.getAttribute('aria-pressed')).toBe('false');
  });

  it('should switch to Portuguese and emit the selected language', () => {
    const changedLanguages: Language[] = [];
    fixture.componentInstance.languageChanged.subscribe((language) => {
      changedLanguages.push(language);
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const portugueseButton = compiled.querySelector(
      '[data-testid="language-pt"]',
    ) as HTMLButtonElement;

    portugueseButton.click();
    fixture.detectChanges();

    expect(languageService.language()).toBe('pt');
    expect(changedLanguages).toEqual(['pt']);
    expect(portugueseButton.getAttribute('aria-pressed')).toBe('true');
    expect(compiled.querySelector('[aria-label="Mudar idioma"]')).toBeTruthy();
  });
});
