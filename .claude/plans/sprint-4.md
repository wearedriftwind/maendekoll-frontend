# Sprint 4 — Adminwebbens grund + samtliga vyer (bas-version)

## Status (senast uppdaterad 2026-07-09, pausat efter Story 5)

- **Story 1-5: Klara.** Grunden (Next.js/Vercel, Slack OAuth via Auth.js,
  `apiClient.ts`), frågehantering (`/settings/questions`) och
  schemainställningar (`/settings/questions/[id]/schedule`) är byggda,
  mergade till `main` och verifierade i produktion
  (https://maendekoll-frontend.vercel.app/).
- **Nästa upp: Story 6 — Skicka en fråga direkt.** Se "Nästa steg" nedan för
  konkreta detaljer inför nästa session.
- **Story 7 och framåt:** oförändrat väntande, se Byggordning nedan.

### Nästa steg — Story 6: Skicka en fråga direkt

- **Branch:** `feature/skicka-fraga-direkt` (samma namnkonvention som
  `feature/fragehantering-vy`, `feature/schemainstallningar`).
- **Endpoint:** `POST /questions/send-now` — body `{ text, response_type? }`,
  svar `{ question_id, sent_to }`. Skapar EN NY fråga och skickar den direkt
  till alla aktiva — separat från befintliga frågor i listan, inte en åtgärd
  på en redan skapad fråga.
- **Plats i UI:** enligt sektionstabellen nedan blir det en åtgärd i
  frågelistan (`/settings/questions`), inte en egen sida. Enklast: ett eget
  litet formulär (textfält + valfri response_type + knapp "Skicka nu") längst
  upp eller ner på `/settings/questions/page.tsx`, bredvid "Ny fråga"-
  formuläret men som en tydligt separat åtgärd (skiljer sig från
  "Skapa fråga" genom att den skickar direkt).
- **Efter lyckat anrop:** visa en bekräftelse med `sent_to`-antalet
  (t.ex. "Skickades till 12 anställda") — kräver att server action
  returnerar ett resultat till klienten istället för att bara `redirect`/
  `revalidatePath` som de tidigare formulären gör. Enklast: en klient-
  komponent runt formuläret som visar resultatet efter `useActionState`,
  eller en enkel `?sent=N`-query-param efter redirect. Välj det som känns
  minst krångligt givet hur `createQuestion`/`updateQuestion` redan är byggda
  i `src/app/(admin)/settings/questions/actions.ts` — följ samma mönster om
  möjligt istället för att introducera ett nytt.
- **DoD (från backloggen):** Admin kan skriva och skicka en fråga direkt från
  adminwebben, med bekräftelse på hur många som fick den.

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
| 7. Bygg vy för att välja eskalationskontakt | Inställningar | `/settings/escalation-contact` | Ingen. |
| 8a. *(ny story)* Bygg vy för att hantera anställda | Inställningar | `/settings/employees` | Ny: lista anställda, pausa/aktivera. Länk till 8b för full historik. |
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
    escalation-contact/page.tsx    # Story 7
    employees/page.tsx             # Story 8a
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
3. **Story 6 — Skicka direkt (åtgärd i frågelistan)** ← nästa
4. Story 7 — Eskalationskontakt
5. **Story 8a** (ny) — Anställda: lista + pausa/aktivera
6. **Story 10** — Trendgraf, bygger `/report`-skalet
7. Story 9 — Svarslogg
8. Story 11 — Periodjämförelse
9. **Story 8b** (omskriven) — Individuell historikvy (Rapport), länkad från 8a
10. Story 12 — Presentationsvy

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
