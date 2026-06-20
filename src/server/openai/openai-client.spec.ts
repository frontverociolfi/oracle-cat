import { OpenAiClient, OpenAiClientError } from './openai-client';

describe('OpenAiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should call the Responses API with auth and payload', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ output_text: 'A prophecy.' }), {
        status: 200,
      }),
    );
    const client = new OpenAiClient('secret-key', 'gpt-4o');

    await expect(
      client.createResponse('Question?', 'Oracle instructions.'),
    ).resolves.toEqual({ output_text: 'A prophecy.' });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/responses',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer secret-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          instructions: 'Oracle instructions.',
          input: 'Question?',
          max_output_tokens: 120,
        }),
      }),
    );
  });

  it('should throw OpenAiClientError for API errors', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            message: 'Invalid model.',
          },
        }),
        { status: 400 },
      ),
    );
    const client = new OpenAiClient('secret-key', 'bad-model');

    await expect(client.createResponse('Question?', 'Instructions.')).rejects.toEqual(
      new OpenAiClientError(400, 'Invalid model.'),
    );
  });
});
