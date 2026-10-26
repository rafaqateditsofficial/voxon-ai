# VOXON AI

Correctly structured Next.js project for Vercel.

## Deploy
1. Upload the contents of this ZIP to the root of your GitHub repository, preserving the `app/` folder.
2. Import the repository in Vercel. Framework: Next.js; Root Directory: `./`.
3. Add `GEMINI_API_KEY` under Project Settings → Environment Variables.
4. Deploy/redeploy.

AI Chat uses Gemini via a server-side API route. Image Studio and Video Studio are UI previews and need generation-provider integrations. Never commit API keys to GitHub. GitHub Pages cannot run the API routes; use Vercel.
