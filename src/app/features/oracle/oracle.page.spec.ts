import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { OracleApiService } from '../../core/services/oracle-api.service';
import { OraclePage } from './oracle.page';

describe('OraclePage', () => {
  let fixture: ComponentFixture<OraclePage>;
  let oracleApiService: { ask: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    oracleApiService = {
      ask: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [OraclePage],
      providers: [
        {
          provide: OracleApiService,
          useValue: oracleApiService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OraclePage);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should render the oracle prompt', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain(
      'ask the oracle cat',
    );
    expect(compiled.querySelector('input')).toBeTruthy();
  });

  it('should ask the oracle with the typed question', async () => {
    oracleApiService.ask.mockReturnValue(
      of({ answer: 'Nap where the box points.' }),
    );

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;
    const form = compiled.querySelector('form') as HTMLFormElement;

    input.value = 'What should I do?';
    input.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(oracleApiService.ask).toHaveBeenCalledWith('What should I do?', 'en');
    expect(compiled.textContent).toContain('Nap where the box points.');
    expect(compiled.textContent).toContain('ask again');
  });

  it('should switch the UI language', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const portugueseButton = compiled.querySelector(
      '[data-testid="language-pt"]',
    ) as HTMLButtonElement;

    portugueseButton.click();
    fixture.detectChanges();

    expect(compiled.querySelector('h1')?.textContent).toContain(
      'pergunte ao gato oráculo',
    );
    expect(compiled.querySelector('input')?.getAttribute('placeholder')).toBe(
      'sussurre sua pergunta...',
    );
  });

  it('should show a validation error for an empty question', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const form = compiled.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(oracleApiService.ask).not.toHaveBeenCalled();
    expect(compiled.textContent).toContain('Ask the oracle cat something first.');
  });

  it('should show API errors', async () => {
    oracleApiService.ask.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: { error: 'The moon bowl is offline.' },
            status: 502,
          }),
      ),
    );

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;
    const form = compiled.querySelector('form') as HTMLFormElement;

    input.value = 'Will this pass?';
    input.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('The moon bowl is offline.');
  });
});
