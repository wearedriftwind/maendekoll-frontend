# Changelog

Alla releaser till produktion (Vercel) dokumenteras här, nyast överst.
Se Notion-backloggen för fullständig kontext per story.

## v0.4.0 – 2026-07-09

Adminwebben har fått sin första riktiga vy: frågehantering, under en ny
sektionsindelad struktur.

### Vad som är nytt

- Startsidan är nu en hub med länkar till två sektioner: **Rapport** och
  **Inställningar** (Rapport-sidorna byggs i kommande storys).
- Inställningar → Frågor: lista, skapa och redigera frågor (text,
  svarstyp, aktiv/inaktiv) direkt mot bot+API:et.

### Vad som har ändrats

- Inloggad-som/logga ut flyttat från startsidan till en delad header som
  syns på alla adminsidor.

### Buggar fixade

- `/settings` gav 404 direkt efter första deployen (saknad index-sida) -
  fixat med en redirect till frågevyn.

### Annan relevant information

- Omfattar Story 4 i Notion-backloggen: "Bygg vy för att hantera frågor".
- Nya frågor skapas som aktiva som standard, men utan schema (frekvens/tid)
  skickas de inte automatiskt - det läggs till i nästa story
  (schemainställningar).

## v0.3.0 – 2026-07-09

Adminwebbens grund är klar: den kan nu prata med bot+API:et på ett
återanvändbart sätt, med ett gemensamt sätt att visa fel.

### Vad som är nytt

- Delad felvy för hela adminytan om ett anrop mot bot+API:et misslyckas,
  istället för att sidan kraschar.
- Startsidan gör nu ett riktigt anrop mot `GET /questions` och visar antalet
  registrerade frågor, som bevis på att kopplingen fungerar i produktion.

### Vad som har ändrats

- Inget i användarflödet, bara grundarbete inför frågehanteringsvyn.

### Buggar fixade

- Inga i denna sprint.

### Annan relevant information

- Grunden i Sprint 4 (Story 1-3) är nu klar. Nästa story är
  frågehanteringsvyn (Story 4), den första riktiga adminvyn.
- Omfattar Story 3 i Notion-backloggen: "Koppla adminwebben mot
  bot+API:et".

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
