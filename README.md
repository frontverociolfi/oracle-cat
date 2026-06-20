# Oracle Cat

Ask the oracle cat. Receive a tiny feline prophecy. Reconsider everything.

Oracle Cat is a playful Angular SSR app where a user whispers a question, a rotating council of cats stares from the background, and a server-side OpenAI gateway answers as a mystical, judgmental feline.

## What It Does

- Shows a cinematic hero screen with rotating cat images from `public/cats`.
- Lets the user ask the oracle a question.
- Supports English and Portuguese with a reusable language toggle.
- Sends questions to an internal Express endpoint at `POST /api/oracle`.
- Keeps the OpenAI API key on the server.
- Reveals the oracle answer with a Tailwind-powered fade/blur transition.
- Runs unit tests across the Angular UI, services, Express route, OpenAI client, and answer parser.
- Builds as an Angular SSR app ready to run with Node.

## Tech Stack

- Angular 21
- Angular SSR with Express
- Tailwind CSS 4
- Vitest unit tests
- OpenAI Responses API
- `dotenv` for local environment variables
- GitHub Actions for test/build artifacts

## Setup

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Then add your OpenAI config:

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o
```

The `.env` file is ignored by Git. The cat may be chaotic, but the key stays private.

## Run Locally

Start the Angular dev server:

```bash
npm run dev
```

Open:

```txt
http://localhost:4200/
```

Ask something urgent, such as:

```txt
Should I refactor under the moon?
```

## Scripts

Run unit tests:

```bash
npm test -- --watch=false
```

Build the production SSR bundle:

```bash
npm run build
```

Run the built SSR server:

```bash
npm run build
npm start
```

By default, the built SSR server listens on:

```txt
http://localhost:4000/
```

## Deploy On Heroku

This app is server-rendered and needs a Node runtime, so Heroku is a better fit than GitHub Pages.

Create the app:

```bash
heroku login
heroku create oracle-cat
```

Configure the OpenAI environment variables:

```bash
heroku config:set OPENAI_API_KEY=sk-your-key-here
heroku config:set OPENAI_MODEL=gpt-4o
```

Deploy from Git:

```bash
git add .
git commit -m "Prepare Heroku deploy"
git push heroku main
```

Open the app:

```bash
heroku open
```

Heroku runs `npm run build` during deployment and starts the web dyno with the `Procfile`:

```txt
web: npm start
```

## Project Shape

```txt
public/
  cats/
    oracle-cat-01.png ... oracle-cat-16.png
  oracle-cat.svg

src/
  app/
    core/
      models/
        language.models.ts
        oracle.models.ts
      services/
        language.service.ts
        oracle-api.service.ts
    features/
      oracle/
        oracle.page.ts
        oracle.page.html
    shared/
      components/
        language-toggle/
          language-toggle.component.ts
          language-toggle.component.html
    app.ts
    app.html

  server/
    openai/
      openai-client.ts
      oracle-answer.service.ts
    routes/
      oracle.routes.ts

  server.ts
```

## How The Oracle Works

The Angular page owns the screen state: question, loading, answer, errors, rotating cat background, and reveal animation.

`OracleApiService` sends the question to:

```txt
POST /api/oracle
```

The Express route checks `OPENAI_API_KEY`, picks `OPENAI_MODEL`, creates an OpenAI client, and asks `OracleAnswerService` for the prophecy.

`OracleAnswerService` owns the oracle persona and extracts the final text from the OpenAI response. The frontend never sees the OpenAI API key.

## Styling

The app uses Tailwind classes directly in templates. Component CSS files were removed on purpose.

The only global stylesheet is:

```txt
src/styles.css
```

It imports Tailwind:

```css
@import 'tailwindcss';
```

## Tests

The test suite covers:

- Root app render
- Oracle page behavior
- Language toggle component
- Language service
- Angular oracle API service
- OpenAI client request/error handling
- Oracle answer parsing
- Express oracle route behavior

Run:

```bash
npm test -- --watch=false
```

Current expected result:

```txt
8 test files, 25 tests passing
```

## GitHub Actions

The workflow lives at:

```txt
.github/workflows/deploy.yml
```

It runs on pushes and pull requests to `main`, plus manual dispatch. The workflow installs dependencies, runs unit tests, builds the SSR app, and uploads `dist/oracle-cat` as the `oracle-cat-ssr` artifact.

Because this app has an SSR backend and needs `OPENAI_API_KEY` at runtime, the workflow prepares a deploy artifact instead of deploying to GitHub Pages.

## Cat Images

The rotating background images live in:

```txt
public/cats
```

If you add or rename images, update the `catImages` list in:

```txt
src/app/features/oracle/oracle.page.ts
```

The oracle appreciates variety, dramatic lighting, and strong judgmental eye contact.
