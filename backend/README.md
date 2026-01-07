<<<<<<< HEAD
# Backend for FixMaster Pro

## Features
- Express.js API
- JWT authentication (with bcrypt)
- LangGraph agentic logic
- Gemini 2.5 Flash & iFixit integration
- PostgreSQL/SQLite support
- Production-ready structure

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set your secrets.
3. Run the server:
   ```bash
   npm run dev
   ```

## Structure
- src/
  - agent/         # LangGraph agent logic
  - auth/          # Auth controllers & middleware
  - db/            # Database setup
  - middleware/    # Error & auth middleware
  - routes/        # API endpoints
  - tools/         # Gemini/iFixit logic
  - index.ts       # Entry point

---
=======
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
>>>>>>> 82efb7bb7ad3888cc1e97f0a2946c6d9dbbde071
