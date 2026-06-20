import { Router } from 'express';

import { OracleAnswerService } from '../openai/oracle-answer.service';
import { OpenAiClient, OpenAiClientError } from '../openai/openai-client';

interface OracleAnswerProvider {
  ask(question: string, language: OracleLanguage): Promise<string>;
}

type OracleAnswerProviderFactory = (
  apiKey: string,
  model: string,
) => OracleAnswerProvider;
type OracleLanguage = 'en' | 'pt';

const defaultOracleAnswerProviderFactory: OracleAnswerProviderFactory = (
  apiKey,
  model,
) =>
  new OracleAnswerService(new OpenAiClient(apiKey, model));

export const oracleRouter = createOracleRouter();

export function createOracleRouter(
  createOracleAnswerProvider = defaultOracleAnswerProviderFactory,
) {
  const router = Router();

  router.post('/oracle', async (req, res) => {
    const apiKey = process.env['OPENAI_API_KEY'];

    if (!apiKey) {
      res.status(500).json({
        error: 'OPENAI_API_KEY is not configured on the server.',
      });
      return;
    }

    const question = getQuestion(req.body);
    const language = getLanguage(req.body);
    const model = process.env['OPENAI_MODEL'] || 'gpt-4o';
    const oracleAnswerProvider = createOracleAnswerProvider(apiKey, model);

    try {
      const answer = await oracleAnswerProvider.ask(question, language);

      res.json({ answer });
    } catch (error) {
      if (error instanceof OpenAiClientError) {
        res.status(error.status).json({ error: error.message });
        return;
      }

      res.status(502).json({
        error: 'The oracle portal is unreachable right now.',
      });
    }
  });

  return router;
}

function getQuestion(body: unknown): string {
  if (
    body &&
    typeof body === 'object' &&
    'question' in body &&
    typeof body.question === 'string' &&
    body.question.trim()
  ) {
    return body.question.trim();
  }

  return 'Give me one short, absurd, mystical prophecy from an oracle cat.';
}

function getLanguage(body: unknown): OracleLanguage {
  if (
    body &&
    typeof body === 'object' &&
    'language' in body &&
    (body.language === 'en' || body.language === 'pt')
  ) {
    return body.language;
  }

  return 'en';
}
