import express from 'express';
import { AddressInfo } from 'node:net';
import { Server } from 'node:http';

import { OpenAiClientError } from '../openai/openai-client';
import { createOracleRouter } from './oracle.routes';

describe('oracleRouter', () => {
  const originalApiKey = process.env['OPENAI_API_KEY'];
  const originalModel = process.env['OPENAI_MODEL'];
  let server: Server;
  let baseUrl: string;

  afterEach(async () => {
    process.env['OPENAI_API_KEY'] = originalApiKey;
    process.env['OPENAI_MODEL'] = originalModel;

    if (server?.listening) {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });

  it('should reject requests when OPENAI_API_KEY is missing', async () => {
    delete process.env['OPENAI_API_KEY'];
    await startTestServer();

    const response = await postOracle({ question: 'Hello?' });
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      error: 'OPENAI_API_KEY is not configured on the server.',
    });
  });

  it('should ask the oracle answer provider with a trimmed question', async () => {
    process.env['OPENAI_API_KEY'] = 'test-key';
    process.env['OPENAI_MODEL'] = 'test-model';
    const ask = vi.fn().mockResolvedValue('The cushion has spoken.');
    const createOracleAnswerProvider = vi.fn().mockReturnValue({ ask });
    await startTestServer(createOracleAnswerProvider);

    const response = await postOracle({
      language: 'pt',
      question: '  Where is the cushion?  ',
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(createOracleAnswerProvider).toHaveBeenCalledWith(
      'test-key',
      'test-model',
    );
    expect(ask).toHaveBeenCalledWith('Where is the cushion?', 'pt');
    expect(body).toEqual({ answer: 'The cushion has spoken.' });
  });

  it('should use the default model and question when omitted', async () => {
    process.env['OPENAI_API_KEY'] = 'test-key';
    delete process.env['OPENAI_MODEL'];
    const ask = vi.fn().mockResolvedValue('Default prophecy.');
    await startTestServer(() => ({ ask }));

    await postOracle({});

    expect(ask).toHaveBeenCalledWith(
      'Give me one short, absurd, mystical prophecy from an oracle cat.',
      'en',
    );
  });

  it('should forward OpenAI client errors', async () => {
    process.env['OPENAI_API_KEY'] = 'test-key';
    const ask = vi
      .fn()
      .mockRejectedValue(new OpenAiClientError(429, 'Too many moonbeams.'));
    await startTestServer(() => ({ ask }));

    const response = await postOracle({ question: 'Again?' });
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body).toEqual({ error: 'Too many moonbeams.' });
  });

  it('should return a gateway error for unknown failures', async () => {
    process.env['OPENAI_API_KEY'] = 'test-key';
    const ask = vi.fn().mockRejectedValue(new Error('Nope.'));
    await startTestServer(() => ({ ask }));

    const response = await postOracle({ question: 'Again?' });
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).toEqual({
      error: 'The oracle portal is unreachable right now.',
    });
  });

  async function startTestServer(
    createOracleAnswerProvider = () => ({
      ask: vi.fn().mockResolvedValue('A test prophecy.'),
    }),
  ): Promise<void> {
    const app = express();
    app.use(express.json());
    app.use('/api', createOracleRouter(createOracleAnswerProvider));

    server = await new Promise<Server>((resolve) => {
      const listener = app.listen(0, () => resolve(listener));
    });
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  }

  function postOracle(body: object): Promise<Response> {
    return fetch(`${baseUrl}/api/oracle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
});
