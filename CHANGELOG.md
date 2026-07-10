# Changelog

Alla releaser till produktion (Vercel) dokumenteras här, nyast överst.
Se Notion-backloggen för fullständig kontext per story.

## v0.8.0 – 2026-07-10

Admin kan nu se en logg över samtliga svar, inte bara aggregerad statistik.

### Vad som är nytt

- Ny sida i Rapport → Svarslogg (`/report/responses`): tabell över samtliga
  svar, nyast först — datum, namn, mående (som emoji) och fritext.
- Ny delad Rapport-sektion med nav mellan flikarna (samma mönster som
  Inställningar sedan tidigare).

### Vad som har ändrats

- Inget i övriga vyer.

### Buggar fixade

- Inga i denna sprint.

### Annan relevant information

- Omfattar Story 9 i Notion-backloggen: "Bygg vy för svarslogg".
- Story 10 (Trendgraf) är fortfarande under arbete på en egen branch, inte
  släppt än — väntar på testdata för att kunna verifieras ordentligt.

## v0.7.0 – 2026-07-10

Admin kan nu se och hantera alla anställda, inklusive vem som är
eskalationskontakt.

### Vad som är nytt

- Ny sida i Inställningar → Anställda (`/settings/employees`): tabell över
  alla användare med namn och roll.
- Kryssruta per rad för att pausa/aktivera en anställd, utan att röra
  historik.
- Kryssruta per rad för att välja eskalationskontakt. Endast en person kan
  vara kontakt åt gången — att kryssa en ny ersätter automatiskt den
  föregående.
- Båda kryssrutorna sparar direkt vid klick, ingen separat "Spara"-knapp.

### Vad som har ändrats

- Inget i övriga vyer.

### Buggar fixade

- Inga i denna sprint.

### Annan relevant information

- Omfattar Story 7 ("Bygg vy för att välja eskalationskontakt") och Story 8a
  ("Bygg vy för att hantera anställda") i Notion-backloggen — byggda som en
  gemensam vy istället för två separata sidor, ett beslut Lars tog under
  arbetet med storyn.

## v0.6.0 – 2026-07-10

Admin kan nu skicka en fråga direkt till alla aktiva, utan att vänta på schema.

### Vad som är nytt

- Nytt formulär i Inställningar → Frågor: "Skicka en fråga direkt" (textfält
  + valfri svarstyp + knappen "Skicka nu").
- Efter skickat visas en bekräftelse med hur många anställda som fick frågan.

### Vad som har ändrats

- Inget i övriga vyer.

### Buggar fixade

- Inga i denna sprint.

### Annan relevant information

- Omfattar Story 6 i Notion-backloggen: "Bygg vy för att skicka en fråga
  direkt".

## v0.5.0 – 2026-07-09

Frågor kan nu schemaläggas i adminwebben.

### Vad som är nytt

- Ny "Schema"-länk per fråga i Inställningar → Frågor.
- Schemasida där frekvens (veckovis/varannan vecka/månadsvis), veckodag,
  tid och kanaltyp (DM eller gemensam kanal) sätts per fråga.
- Visar senast skickad-tidpunkt om frågan redan gått ut minst en gång.

### Vad som har ändrats

- Inget i övriga vyer.

### Buggar fixade

- Inga i denna sprint.

### Annan relevant information

- Omfattar Story 5 i Notion-backloggen: "Bygg vy för schemainställningar".

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
