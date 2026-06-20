import { NgClass } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { flagBr, flagUs } from '@ng-icons/flag-icons';

import { Language } from '../../../core/models/language.models';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'oc-language-toggle',
  imports: [NgClass, NgIcon],
  providers: [provideIcons({ flagBr, flagUs })],
  templateUrl: './language-toggle.component.html',
})
export class LanguageToggleComponent {
  private readonly languageService = inject(LanguageService);

  readonly languageChanged = output<Language>();

  protected readonly language = this.languageService.language;
  protected readonly text = this.languageService.text;

  protected setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
    this.languageChanged.emit(language);
  }
}
