# Exam Scare Me – starter (Next.js + Supabase)

Included: email auth (verify + reset), profiles/roles/suspension, communities, posts, comments, votes, bookmarks,
materials table + private storage bucket, reports, moderation log, rate-limited server-side AI route, strict Row Level Security.
Not built yet: voting/comment/library/chat/quiz/admin UI, notifications, CAPTCHA, malware scanning (enable Supabase CAPTCHA + a scanner).

## Deploy
1. supabase.com > New project. SQL Editor > paste supabase/schema.sql > Run.
2. Auth > Providers > Email: enable "Confirm email". Auth > URL config: add your site URL. Turn on CAPTCHA (Auth > Attack protection).
3. Copy .env.example to .env.local and fill the values (Project Settings > API; Anthropic key from console.anthropic.com).
4. `npm install && npm run dev` to test at http://localhost:3000
5. Push to GitHub > vercel.com > Import > add the same 3 env vars > Deploy. Add your domain in Vercel > Domains.
6. Sign up, then in SQL Editor: update profiles set role='admin' where username='YOUR_USERNAME';
