# ABW Review App

A modern landing page that helps customers write **Google reviews** using AI-generated text suggestions. Built with Astro, React, and Tailwind CSS.

## Features

- **Multi-topic selection**: Website, Consulting, Web App, Website Optimization, Development
- **Customizable tone**: authentic, casual, factual, enthusiastic, brief
- **Solo entrepreneur mode**: Reviews reference the owner by name (3rd person singular)
- **Character limit**: Server-enforced ≤500 characters
- **Dual AI providers**: Choose between OpenAI and Anthropic
- **Rate limiting**: Basic protection (5 generations/hour/IP)
- **Privacy-first**: No external font requests – JetBrains Mono served locally via Astro's experimental Fonts API
- **Server Actions**: No separate API routes needed

## Tech Stack

- [Astro](https://astro.build) 5.x with SSR
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) v4 + [shadcn/ui](https://ui.shadcn.com)
- [Vercel](https://vercel.com) for deployment
- OpenAI / Anthropic for AI text generation

## Prerequisites

- Node.js 18+ 
- npm or pnpm
- OpenAI API key **or** Anthropic API key
- A Google Business Profile with a review link

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/janluther/abw-review-app.git
cd abw-review-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# 4. Start development server
npm run dev
```

The app runs at `http://localhost:4321`.

## Environment Variables

Copy `.env.example` to `.env` and configure:

### Required

| Variable | Description |
|----------|-------------|
| `PUBLIC_GOOGLE_PROFILE` | Your Google Business review link |
| `SECRET_OPENAI` | OpenAI API key (if using OpenAI) |
| `SECRET_ANTHROPIC` | Anthropic API key (if using Anthropic) |

### AI Provider Selection

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_PROVIDER` | `openai` | `openai` or `anthropic` |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model to use |
| `ANTHROPIC_MODEL` | `claude-3-haiku-20240307` | Anthropic model to use |

### Brand Customization (Optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `PUBLIC_BRAND_NAME` | `App bis Web` | Brand name shown in UI |
| `PUBLIC_OWNER_NAME` | `Jan` | Owner name for personalized reviews |
| `PUBLIC_PROVIDER_MODE` | `solo` | `solo` or `team` |
| `PUBLIC_PROVIDER_PRONOUN` | `er` | German pronoun (er/sie) |
| `PUBLIC_REVIEW_STYLE` | `authentisch` | Default review style |

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run test       # Run unit tests (Vitest)
npm run test:e2e   # Run E2E tests (Playwright)
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

The app uses `@astrojs/vercel` adapter and is configured for SSR.

## Project Structure

```
src/
├── actions/       # Astro Server Actions
├── components/    # React components
│   └── ui/        # shadcn/ui components
├── lib/           # Utilities (cn helper)
├── pages/         # Astro pages
├── server/        # Server-only code
│   └── llm/       # AI provider abstraction
└── styles/        # Global CSS
```

## Switching AI Providers

Set `AI_PROVIDER` in your `.env`:

```env
# For OpenAI
AI_PROVIDER=openai
SECRET_OPENAI=sk-...
OPENAI_MODEL=gpt-4o-mini

# For Anthropic
AI_PROVIDER=anthropic
SECRET_ANTHROPIC=sk-ant-...
ANTHROPIC_MODEL=claude-3-haiku-20240307
```

Only the API key for the selected provider is required.

## Troubleshooting

### OpenAI 429 "quota exceeded"

This usually means your OpenAI account needs billing setup or credit balance:
1. Go to [OpenAI Billing](https://platform.openai.com/account/billing)
2. Add payment method or purchase credits
3. Even with a card on file, you may need prepaid credits

### Fonts not loading

The app uses Astro's experimental Fonts API. Ensure you're on `astro@5.7.0+`.

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Made with ♥ by [App bis Web](https://appbisweb.de)
