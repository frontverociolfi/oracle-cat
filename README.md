# Oracle Cat

Ask the oracle cat. Receive a tiny feline prophecy. Question your choices.

Oracle Cat is a nonsense-but-polished Angular app where the user whispers a question, a rotating gallery of cats watches from the background, and a server-side OpenAI gateway returns a short mystical answer from the point of view of a very dramatic cat.

## What It Does

- Shows a cinematic hero screen with rotating cat photos from `public/cats`.
- Lets the user type a question for the oracle.
- Sends the question to an internal Express endpoint.
- Keeps the OpenAI API key safely on the server.
- Reveals the answer with a fade/blur transition.
- Includes unit tests for the Angular UI, Angular service, Express route, OpenAI client, and oracle response parser.

## Tech Stack

- Angular 21
- Angular SSR with Express
- Vitest for unit tests
- OpenAI Responses API
- `dotenv` for local environment variables

## Setup

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Then add your OpenAI API key to `.env`:

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o
```

The `.env` file is ignored by Git. The oracle keeps secrets. Mostly.

## Run Locally

Start the dev server:

```bash
npm start
```

Open:

```txt
http://localhost:4200/
```

Ask something important, such as:

```txt
Should I refactor under the moon?
```

## Scripts

Run tests:

```bash
npm test -- --watch=false
```

Build:

```bash
npm run build
```

Run the built SSR server:

```bash
npm run build
npm run serve:ssr:oracle-cat
```

By default, the SSR server listens on `http://localhost:4000/`.

## Project Shape

```txt
src/
  app/
    core/
      models/
        oracle.models.ts
      services/
        oracle.service.ts
    features/
      oracle/
        oracle.page.ts
        oracle.page.html
        oracle.page.css
    app.ts
    app.html
    app.css

  server/
    openai/
      openai-client.ts
      oracle.service.ts
    routes/
      oracle.routes.ts

  server.ts
```

## How The Oracle Works

The Angular feature component handles the screen state: question, loading, answer, errors, and reveal animation.

`OracleService` sends the question to:

```txt
POST /api/oracle
```

The Express route validates server configuration, creates an OpenAI client, and asks the backend oracle service for a prophecy.

The backend oracle service owns the prompt/persona:

```txt
Oracle Cat, Keeper of the Sacred Sunbeam and Knower of All Treat Locations.
```

The frontend never sees the OpenAI API key.

## Tests

The test suite covers:

- Root app render
- Oracle page behavior
- Angular API service
- OpenAI client request/error handling
- Oracle answer parsing
- Express oracle route behavior

Run:

```bash
npm test -- --watch=false
```

Current expected result:

```txt
6 test files, 18 tests passing
```

## Notes

This project uses an OpenAI API key through the server-side Responses API. It does not use browser-side API calls or old ChatGPT web session token packages.

The cat photos live in:

```txt
public/cats
```

Add more images there and update the list in:

```txt
src/app/features/oracle/oracle.page.ts
```

The oracle appreciates variety, especially if the photo contains judgmental eye contact.
