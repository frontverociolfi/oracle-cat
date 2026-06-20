import { OpenAiClient } from './openai-client';
import { OracleAnswerService } from './oracle-answer.service';

describe('OracleAnswerService', () => {
  it('should return output_text when available', async () => {
    const openAiClient = {
      createResponse: vi.fn().mockResolvedValue({
        output_text: 'The saucer knows.',
      }),
    } as unknown as OpenAiClient;
    const service = new OracleAnswerService(openAiClient);

    await expect(service.ask('What now?', 'en')).resolves.toBe(
      'The saucer knows.',
    );
  });

  it('should return nested output content text', async () => {
    const openAiClient = {
      createResponse: vi.fn().mockResolvedValue({
        output: [
          {
            content: [
              {
                type: 'output_text',
                text: 'Follow the sunbeam under the chair.',
              },
            ],
          },
        ],
      }),
    } as unknown as OpenAiClient;
    const service = new OracleAnswerService(openAiClient);

    await expect(service.ask('Where?', 'en')).resolves.toBe(
      'Follow the sunbeam under the chair.',
    );
  });

  it('should return a fallback when no text is available', async () => {
    const openAiClient = {
      createResponse: vi.fn().mockResolvedValue({ output: [] }),
    } as unknown as OpenAiClient;
    const service = new OracleAnswerService(openAiClient);

    await expect(service.ask('Why?', 'en')).resolves.toBe(
      'The oracle cat blinked, but refused to elaborate.',
    );
  });

  it('should send oracle instructions with the question', async () => {
    const openAiClient = {
      createResponse: vi.fn().mockResolvedValue({ output_text: 'Meow.' }),
    } as unknown as OpenAiClient;
    const service = new OracleAnswerService(openAiClient);

    await service.ask('Will treats arrive?', 'pt');

    expect(openAiClient.createResponse).toHaveBeenCalledWith(
      'Will treats arrive?',
      expect.stringContaining('Oracle Cat'),
    );
    expect(openAiClient.createResponse).toHaveBeenCalledWith(
      'Will treats arrive?',
      expect.stringContaining('Portuguese'),
    );
  });
});
