export class OpenAiClientError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'OpenAiClientError';
  }
}

export class OpenAiClient {
  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async createResponse(input: string, instructions: string): Promise<unknown> {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        instructions,
        input,
        max_output_tokens: 120,
      }),
    });

    const data: unknown = await response.json();

    if (!response.ok) {
      throw new OpenAiClientError(response.status, getErrorMessage(data));
    }

    return data;
  }
}

function getErrorMessage(response: unknown): string {
  if (
    response &&
    typeof response === 'object' &&
    'error' in response &&
    response.error &&
    typeof response.error === 'object' &&
    'message' in response.error &&
    typeof response.error.message === 'string'
  ) {
    return response.error.message;
  }

  return 'The oracle portal rejected the request.';
}
