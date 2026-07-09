# Changelog

Alla releaser till produktion (Vercel) dokumenteras här, nyast överst.
Se Notion-backloggen för fullständig kontext per story.

## v0.2.0 – 2026-07-09

Admin kan nu logga in i adminwebben med sitt Slack-konto.

### Vad som är nytt

- Inloggning via "Logga in med Slack" (Auth.js/next-auth v5, OIDC).
- Efter inloggning slås personen upp mot `GET /users` i bot+API:et - bara
  aktiva användare med `role: admin` kommer in, övriga nekas med ett
  tydligt meddelande på inloggningssidan.
- Adminwebbens sidor (allt utom `/login`) kräver nu en giltig session.

### Vad som har ändrats

- Startsidan (`/`) visar nu "Inloggad som ..." och en utloggningsknapp,
  istället för Story 1:s statiska placeholder.

### Buggar fixade

- Inga i denna sprint.

### Annan relevant information

- Manuellt steg (gjort): Slack-appens OAuth-inställningar (samma app som
  boten) har fått en "Sign In with Slack"-konfiguration med scopen
  `openid`, `email`, `profile` och en redirect-URL mot produktions-domänen.
- Nya miljövariabler krävs i Vercel: `AUTH_SECRET`, `AUTH_SLACK_ID`,
  `AUTH_SLACK_SECRET` (utöver `MAENDEKOLL_API_URL`/`ADMIN_API_KEY` från
  förra releasen).
- Omfattar Story 2 i Notion-backloggen: "Bygg inloggning i adminwebben
  (Slack OAuth)".

## v0.1.0 – 2026-07-09

Sprint 4 är påbörjad: adminwebbens grundprojekt finns nu och är deployat.

### Vad som är nytt

- Next.js-projekt (App Router, TypeScript, Tailwind CSS) skapat och kopplat
  till Vercel för auto-deploy vid push till `main`, med preview-deploys per PR.
- Minimal startsida för att bekräfta att grunden fungerar end-to-end.

### Vad som har ändrats

- Inget ännu, första releasen.

### Buggar fixade

- Inga i denna sprint.

### Annan relevant information

- GitHub-repot (`wearedriftwind/maendekoll-frontend`) är publikt, inte
  privat — en medveten avvägning för att slippa uppgradera Vercel/GitHub-
  kontot. Inga hemligheter får någonsin committas hit.
- Inga miljövariabler krävs ännu för den här minimala startsidan. De
  tillkommer i nästa story (Slack-inloggning respektive API-koppling).
- Omfattar Story 1 i Notion-backloggen: "Sätta upp admin-frontend-projekt
  (Next.js, Vercel, GitHub)".
