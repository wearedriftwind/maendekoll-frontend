# Changelog

Alla releaser till produktion (Vercel) dokumenteras här, nyast överst.
Se Notion-backloggen för fullständig kontext per story.

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
