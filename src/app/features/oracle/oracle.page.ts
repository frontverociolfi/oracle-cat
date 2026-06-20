import { NgClass, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LanguageService } from '../../core/services/language.service';
import { OracleApiService } from '../../core/services/oracle-api.service';
import { LanguageToggleComponent } from '../../shared/components/language-toggle/language-toggle.component';

const catImages = [
  'oracle-cat-01.png',
  'oracle-cat-02.png',
  'oracle-cat-03.png',
  'oracle-cat-04.png',
  'oracle-cat-05.png',
  'oracle-cat-06.png',
  'oracle-cat-07.png',
  'oracle-cat-08.png',
  'oracle-cat-09.png',
  'oracle-cat-10.png',
  'oracle-cat-11.png',
  'oracle-cat-12.png',
  'oracle-cat-13.png',
  'oracle-cat-14.png',
  'oracle-cat-15.png',
  'oracle-cat-16.png',
];

@Component({
  selector: 'oc-oracle-page',
  imports: [FormsModule, NgClass, LanguageToggleComponent],
  templateUrl: './oracle.page.html',
})
export class OraclePage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);
  private readonly oracleApiService = inject(OracleApiService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly currentCatIndex = signal(0);

  protected readonly answer = signal('');
  protected readonly catBackground = computed(
    () => `url("/cats/${catImages[this.currentCatIndex()]}")`,
  );
  protected readonly error = signal('');
  protected readonly isAsking = signal(false);
  protected readonly language = this.languageService.language;
  protected readonly revealAnswer = signal(false);
  protected readonly text = this.languageService.text;
  protected question = '';

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const oracleTimer = window.setInterval(() => {
      this.currentCatIndex.update((index) => (index + 1) % catImages.length);
    }, 7000);

    this.destroyRef.onDestroy(() => window.clearInterval(oracleTimer));
  }

  protected askOracle(): void {
    const question = this.question.trim();

    if (!question) {
      this.answer.set('');
      this.revealAnswer.set(false);
      this.error.set(this.text().emptyQuestion);
      return;
    }

    this.answer.set('');
    this.revealAnswer.set(false);
    this.error.set('');
    this.isAsking.set(true);

    this.oracleApiService.ask(question, this.language()).subscribe({
      next: (data) => {
        this.answer.set(data.answer);
        this.isAsking.set(false);
        this.revealOracleAnswer();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(
          error.error?.error || error.message || this.text().errorFallback,
        );
        this.isAsking.set(false);
      },
    });
  }

  protected askAgain(): void {
    this.answer.set('');
    this.revealAnswer.set(false);
    this.error.set('');
    this.question = '';
  }

  protected clearError(): void {
    this.error.set('');
  }

  private revealOracleAnswer(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.revealAnswer.set(true);
      return;
    }

    window.requestAnimationFrame(() => this.revealAnswer.set(true));
  }
}
