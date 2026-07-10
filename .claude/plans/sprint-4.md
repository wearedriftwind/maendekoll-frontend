# Sprint 4 — Adminwebbens grund + samtliga vyer (bas-version)

## Status (senast uppdaterad 2026-07-10, pausat efter Story 6)

- **Story 1-6: Klara.** Grunden (Next.js/Vercel, Slack OAuth via Auth.js,
  `apiClient.ts`), frågehantering (`/settings/questions`),
  schemainställningar (`/settings/questions/[id]/schedule`) och skicka-
  direkt (nytt formulär i `/settings/questions`, PR
  https://github.com/wearedriftwind/maendekoll-frontend/pull/6) är byggda,
  mergade till `main` och verifierade i produktion
  (https://maendekoll-frontend.vercel.app/).
- **Nästa upp: Story 7 + 8a — Anställda och eskalationskontakt, i samma vy.**
  Se "Nästa steg" nedan.
- **Story 9 och framåt:** oförändrat väntande, se Byggordning nedan.

### Nästa steg — Story 7 + 8a: Hantera anställda (slagits ihop)

**Beslut (2026-07-10, Lars):** Story 7 (eskalationskontakt) och Story 8a
(hantera anställda) byggs som **en gemensam vy** istället för två separata
sidor — samma tabell över användare används för båda syftena. Ändrar
sektionstabellen nedan: Story 7:s path blir samma som 8a:s
(`/settings/employees`), ingen egen `/settings/escalation-contact`-sida.

- **Branch:** `feature/hantera-anstallda`.
- **Plats i UI:** `/settings/employees` — en tabell med alla användare
  (`GET /users`). Kolumner: namn, roll, **Aktiv** (kryssruta, pausar/
  aktiverar via `PATCH /users/:id` med `{ active }`) och
  **Eskalationskontakt** (kryssruta, sätter via
  `PATCH /users/:id/escalation-contact`).
- **Enda-kontakt-regeln:** exakt en användare kan vara eskalationskontakt.
  Eskalationskryssrutan är semantiskt en radioknapp — att kryssa en ny rad
  ersätter automatiskt den föregående (backend-servicen `setEscalationContact`
  rensar övriga innan den sätter den nya), inte lägger till ytterligare en.
  Formuläret måste göra det uppenbart att det är ett byte, inte ett
  tillägg (se "Vad vi har bestämt" i CLAUDE.md).
- **UX-mönster:** varje kryssruta i tabellen är sin egen mini-form (dold
  `id`-fält + kryssruta) som skickas automatiskt vid ändring (`onChange` →
  `requestSubmit()`), istället för en explicit "Spara"-knapp per rad — snabbare
  för en tabell med flera rader och kryssrutor.
- **DoD (från backloggen, båda storys):**
  - Story 8a: Admin kan se alla anställda och pausa/aktivera dem utan att
    röra historik.
  - Story 7: Admin kan se och byta eskalationskontakt, med tydlig
    indikation om vem som är aktuell kontakt just nu.

## Context

Sprint 3 i backend-repot (`maendekollen`) landade i produktion 2026-07-09
(v0.4.0) och lade till de endpoints Sprint 4 väntar på: `GET /stats/aggregate`
och `GET /users/:id/responses`. Alla tekniska beroenden för Sprint 4 är
uppfyllda.

Efter att grunden var klar förtydligade Lars adminwebbens struktur: istället
för nio fristående vyer på samma nivå ska adminwebben ha två huvudsektioner:

- **Rapport** — läsa/analysera mående: trendgraf, svarslogg, periodjämförelse,
  individuell historik, presentationsvy. Olika "dimensioner" av samma
  underliggande data.
- **Inställningar** — administrera systemet: frågehantering,
  schemainställningar, användarhantering (anställda + eskalationskontakt).

## Tekniska beslut (grunden, redan byggd)

- **Auth:** Auth.js (NextAuth v5) med en Slack OAuth-provider (OIDC). Efter
  inloggning slås Slack-profilen upp mot `GET /users`, och `role === "admin"`
  + `active === true` avgör åtkomst. Se `src/lib/auth.ts`.
- **Styling:** Tailwind CSS.
- **Diagram:** Recharts (planerad för trendgrafen och periodjämförelsen,
  ännu inte installerad).
- **apiClient:** `src/lib/apiClient.ts`, server-only, enda platsen som känner
  till `MAENDEKOLL_API_URL`/`ADMIN_API_KEY`. Fel hanteras centralt via
  `src/app/(admin)/error.tsx` (delad felboundary, visar ett vänligt
  meddelande istället för att krascha — se anteckning nedan om varför inte
  "401 → till inloggning" som ursprungligen skrevs i backloggen).

**Notis om 401-hantering:** ADMIN_API_KEY är en delad hemlighet mellan
frontend och backend, helt oberoende av vilken admin som är inloggad via
Slack. Ett 401 från bot+API:et betyder att nyckeln är felkonfigurerad, inte
att en användares session gått ut — att redirecta till `/login` i det läget
vore missvisande. `error.tsx` visar därför ett generellt felmeddelande för
alla apiClient-fel, oavsett statuskod.

## Bekräftad API-yta (från `maendekollen/API.md`, verifierad mot källkoden)

Alla endpoints kräver `Authorization: Bearer <ADMIN_API_KEY>` utom health
check. `/questions` och `/users` returnerar `snake_case`, `/responses` och
`/stats/aggregate` returnerar `camelCase` — bygg typerna separat per endpoint.

| Endpoint | Används av |
|---|---|
| `GET/POST /questions`, `PATCH /questions/:id` | Frågehantering (Story 4) |
| `PATCH /questions/:id/schedule` | Schemainställningar (Story 5) |
| `POST /questions/send-now` | Skicka direkt (Story 6) |
| `GET /users?role=&active=`, `PATCH /users/:id/escalation-contact` | Eskalationskontakt (Story 7) |
| `GET /users`, `PATCH /users/:id` | Anställda: lista + pausa/aktivera (Story 8a) |
| `GET /users/:id/responses` | Individuell historikvy (Story 8b) |
| `GET /responses` | Svarslogg (Story 9) |
| `GET /stats/aggregate?from=&to=` | Trendgraf (10), periodjämförelse (11), presentationsvy (12) |

## Sektionsindelning — var varje story hamnar

| Story (Notion-titel) | Sektion | Path | Ändring mot ursprunglig plan |
|---|---|---|---|
| 4. Bygg vy för att hantera frågor | Inställningar | `/settings/questions` | Ny path. Bygger även Inställningar-skalet (nav) och gör om `(admin)/page.tsx` till en hub-sida. |
| 5. Bygg vy för schemainställningar | Inställningar | `/settings/questions/[id]/schedule` | Ingen. |
| 6. Bygg vy för att skicka en fråga direkt | Inställningar | `/settings/questions` (åtgärd i listan) | Blir en åtgärd i frågelistan, inte egen sida. |
| 7. Bygg vy för att välja eskalationskontakt | Inställningar | `/settings/employees` | **Ändrad 2026-07-10:** ingen egen sida längre — byggs som en kolumn i samma tabell som Story 8a, se "Nästa steg" ovan. |
| 8a. *(ny story)* Bygg vy för att hantera anställda | Inställningar | `/settings/employees` | Ny: lista anställda, pausa/aktivera + eskalationskontakt (Story 7) i samma tabell. Länk till 8b för full historik. |
| 8b. *(omskriven, var "8. Bygg individuell historikvy")* | Rapport | `/report/employees/[id]` | Bara läsvyn kvar (svar kronologiskt) — pausa/aktivera flyttas till 8a. |
| 9. Bygg vy för svarslogg | Rapport | `/report/responses` | Ingen. |
| 10. Bygg trendgraf | Rapport | `/report` (default-fliken) | Bygger Rapport-skalet (nav). |
| 11. Möjlighet att jämföra perioder | Rapport | `/report/compare` | Ingen. |
| 12. Bygg avidentifierad presentationsvy | Rapport (länkad, egen sida) | `/present` (oförändrad, utanför `(admin)`) | Listas som en "dimension" i Rapport-navet men förblir ett eget fullskärmsläge utan admin-nav. |
| 13. Utvärdera SSO | — (beslut, inte UI) | — | Opåverkad. |

**Beslut:** Inga separata "skal"-storys för navigationen. Precis som Story 1
byggde `(admin)/layout.tsx`, bygger första storyn i varje sektion sektionens
delade layout/nav: **Story 4** bygger `/settings`-skalet, **Story 10** bygger
`/report`-skalet. Nettoförändring i Sprint 4: +1 story (gamla Story 8 delas
i 8a + 8b).

## Projektstruktur (uppdaterad)

```
src/app/(admin)/
  layout.tsx                       # oförändrad: session-koll
  page.tsx                         # görs om: enkel hub med två länkar
                                    #   (Rapport / Inställningar) + logga ut,
                                    #   istället för dagens testtext
  error.tsx                        # redan byggd (Story 3)
  settings/
    layout.tsx                     # NY: delad nav mellan Inställningar-flikarna
    questions/page.tsx             # Story 4
    questions/[id]/schedule/page.tsx  # Story 5
    employees/page.tsx             # Story 7 + 8a, samma vy/tabell
  report/
    layout.tsx                     # NY: delad nav mellan Rapport-flikarna
    page.tsx                       # Story 10, trendgraf (default-flik)
    responses/page.tsx             # Story 9
    compare/page.tsx               # Story 11
    employees/[id]/page.tsx        # Story 8b
present/page.tsx                   # Story 12, oförändrad (utanför (admin))
lib/
  apiClient.ts                     # redan byggd (Story 2-3)
  auth.ts                          # redan byggd (Story 2)
types/
  questions.ts, users.ts           # redan byggda
  responses.ts, stats.ts           # tillkommer i Story 9-12
```

## Byggordning

1. ~~**Story 4** — Frågehantering + bygger `/settings`-skalet och gör om
   `(admin)/page.tsx` till en hub-sida.~~ **Klar**
2. ~~Story 5 — Schemainställningar~~ **Klar**
3. ~~Story 6 — Skicka direkt (åtgärd i frågelistan)~~ **Klar**
4. **Story 7 + 8a — Anställda + eskalationskontakt, samma vy** ← nästa
5. **Story 10** — Trendgraf, bygger `/report`-skalet
6. Story 9 — Svarslogg
7. Story 11 — Periodjämförelse
8. **Story 8b** (omskriven) — Individuell historikvy (Rapport), länkad från 8a
9. Story 12 — Presentationsvy

## Ändringar i Notion (görs av `notion-ops` efter denna plan)

- Uppdatera beskrivning/path för storys 4, 5, 6, 7, 9, 10, 11, 12 med ny
  sektion (Rapport/Inställningar) och ny path enligt tabellen ovan.
- Skriv om "Bygg individuell historikvy": bara läsvyn (Rapport) kvar.
- Ny story: "Bygg vy för att hantera anställda (lista, pausa/aktivera)",
  Sprint 4, Komponent = UI.

## Miljövariabler (grunden, redan satta i Vercel)

`MAENDEKOLL_API_URL`, `ADMIN_API_KEY`, `AUTH_SECRET`, `AUTH_SLACK_ID`,
`AUTH_SLACK_SECRET` — satta för både Production och Preview.

## Verifiering

Manuell inloggning + verifiering mot riktiga API:et efter varje story, inte
mockad data. Build + lint lokalt innan varje commit.
