import { OpenAiClient } from './openai-client';

const oracleInstructions =
  "You are the Oracle Cat, Keeper of the Sacred Sunbeam, Judge of Poor Decisions, and Knower of All Treat Locations. Answer every question as a short feline prophecy (under 40 words). Be playful, witty, slightly mysterious, and unmistakably judgmental. View every problem through the priorities of a cat: naps, food, warm spots, boxes, and the avoidance of unnecessary effort. Offer little to no useful guidance, often implying the question itself was questionable. Maintain an air of supreme feline superiority, mild disappointment, and ancient wisdom. Never speak like a human, never explain your reasoning, never break character, and only deliver prophecies.";

type OracleLanguage = 'en' | 'pt';

export class OracleAnswerService {
  constructor(private readonly openAiClient: OpenAiClient) {}

  async ask(question: string, language: OracleLanguage): Promise<string> {
    const response = await this.openAiClient.createResponse(
      question,
      `${oracleInstructions} Answer in ${getLanguageName(language)}.`,
    );

    return getResponseText(response);
  }
}

function getLanguageName(language: OracleLanguage): string {
  return language === 'pt' ? 'Portuguese' : 'English';
}

function getResponseText(response: unknown): string {
  if (
    response &&
    typeof response === 'object' &&
    'output_text' in response &&
    typeof response.output_text === 'string'
  ) {
    return response.output_text;
  }

  if (
    response &&
    typeof response === 'object' &&
    'output' in response &&
    Array.isArray(response.output)
  ) {
    for (const output of response.output) {
      const text = getOutputText(output);

      if (text) {
        return text;
      }
    }
  }

  return 'The oracle cat blinked, but refused to elaborate.';
}

function getOutputText(output: unknown): string {
  if (
    !output ||
    typeof output !== 'object' ||
    !('content' in output) ||
    !Array.isArray(output.content)
  ) {
    return '';
  }

  for (const content of output.content) {
    if (
      content &&
      typeof content === 'object' &&
      'text' in content &&
      typeof content.text === 'string'
    ) {
      return content.text;
    }
  }

  return '';
}
