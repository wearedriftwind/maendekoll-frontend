# Sprint 4 — Adminwebbens grund + samtliga vyer (bas-version)

## Context

Sprint 3 i backend-repot (`maendekollen`) landade i produktion igår
(v0.4.0, 2026-07-09) och lade till precis de endpoints Sprint 4 väntar på:
`GET /stats/aggregate` och `GET /users/:id/responses`. Enligt Notion-
backloggens "LÄS FÖRST – Sprint 4"-kort är alla tekniska beroenden därmed
uppfyllda och frontend-arbetet kan starta fullt ut.

Det här repot (`maendekoll-frontend`) innehåller idag bara `CLAUDE.md` och
en tom `README.md` — inget Next.js-projekt finns ännu. Sprint 4 är alltså
ett greenfield-bygge: 13 UI-storys (Komponent = UI) i Notion, där mål-läget
enligt DoD är att en admin kan logga in via Slack och nå samtliga vyer mot
det riktiga API:et.

**Notis, inte en del av kodarbetet:** det här repots `CLAUDE.md` beskriver
API-ytan som den var 2026-07-07 och säger att `/stats/aggregate` och
`/users/:id/responses` "kommer i Sprint 3" / "inte kopplad än". Det stämmer
inte längre — båda är nu shippade och monterade (bekräftat direkt i
`maendekollen/src/app.ts` och `API.md`). Tabellen i `CLAUDE.md` bör
uppdateras som en separat, liten commit innan/när frontend-arbetet börjar,
så framtida sessioner inte utgår från den gamla listan.

## Tekniska beslut för detta bygge

Utöver det som redan är låst i `CLAUDE.md` (Next.js, Vercel, Slack OAuth,
en adminroll, ingen radering i UI):

- **Auth:** Auth.js (NextAuth) med en Slack OAuth-provider. Efter inloggning
  slås Slack-profilen upp mot `GET /users`, och `role === "admin"` avgör
  åtkomst.
- **Styling:** Tailwind CSS.
- **Diagram:** Recharts, för trendgrafen och periodjämförelsen.

## Bekräftad API-yta (från `maendekollen/API.md`, verifierad mot källkoden)

Alla endpoints kräver `Authorization: Bearer <ADMIN_API_KEY>` utom health
check. Viktigt att komma ihåg i klientlagret: `/questions` och `/users`
returnerar `snake_case`, medan `/responses` och `/stats/aggregate`
returnerar `camelCase` — bygg typerna separat per endpoint, anta inget
gemensamt format.

| Endpoint | Används av story |
|---|---|
| `GET/POST /questions`, `PATCH /questions/:id` | Frågehantering (4) |
| `PATCH /questions/:id/schedule` | Schemainställningar (5) |
| `POST /questions/send-now` | Skicka direkt (6) |
| `GET /users?role=&active=`, `PATCH /users/:id/escalation-contact` | Eskalationskontakt (7) |
| `GET /users`, `GET /users/:id/responses`, `PATCH /users/:id` | Historikvy (8) |
| `GET /responses` | Svarslogg (9) |
| `GET /stats/aggregate?from=&to=` | Trendgraf (10), periodjämförelse (11), presentationsvy (12) |

## Projektstruktur (Next.js App Router)

```
src/
  app/
    login/page.tsx                 # "Sign in with Slack"
    api/auth/[...nextauth]/route.ts
    (admin)/
      layout.tsx                   # kollar session + role=admin, nav
      questions/page.tsx           # Story 4: lista + skapa/redigera
      questions/[id]/schedule/page.tsx  # Story 5
      send-now/page.tsx            # Story 6
      escalation-contact/page.tsx  # Story 7
      employees/page.tsx           # Story 8: sök/lista anställda
      employees/[id]/page.tsx      # Story 8: individuell historik
      responses/page.tsx           # Story 9: svarslogg
      stats/page.tsx               # Story 10 + 11: trendgraf + jämförelse
    present/page.tsx                # Story 12: fullskärm, EGET layout (ingen admin-nav)
  lib/
    apiClient.ts                    # central fetch-wrapper, se nedan
    auth.ts                         # NextAuth-config, Slack provider, admin-koll
  middleware.ts                      # skyddar (admin)-gruppen, redirect → /login
  types/
    questions.ts / users.ts / responses.ts / stats.ts   # per endpoints fältformat
```

`src/lib/apiClient.ts` är den enda platsen som känner till `MAENDEKOLL_API_URL`
och `ADMIN_API_KEY` — alla vyer anropar t.ex. `apiClient.get("/questions")`
och får auth-header, bas-URL och centraliserad felhantering (401 → till
inloggning, 500 → generiskt felmeddelande) på köpet, precis som Story 3
kräver.

`present/page.tsx` ligger utanför `(admin)`-gruppen med sitt eget minimala
layout (stor text, ingen navigation, inga länkar till individer) — det är en
medveten separation, inte en glömd nav-länk.

## Byggordning

**Grund (i denna ordning, blockerar allt annat):**
1. **Story 1** — Next.js-projekt, GitHub-repo (redan det här repot), Vercel-
   koppling, `.env.example`. DoD: minimal startsida deployad och nåbar.
2. **Story 2** — Slack OAuth-inloggning via Auth.js, admin-koll mot
   `GET /users`, session-cookie. DoD: admin loggar in, icke-admin nekas.
   *Manuellt steg utanför koden:* Slack-appen (samma app som boten) behöver
   OAuth-redirect-URL:en konfigurerad för denna Vercel-domän — flagga detta,
   men det är ett Slack-appinställning, inte en kodändring här.
3. **Story 3** — `apiClient.ts` + felhantering. DoD: ett testanrop mot
   `/questions` fungerar från adminwebben.

**Första vyn att bygga (för att "komma igång" — validerar hela kedjan
login → apiClient → riktig vy → riktigt API end-to-end):**
4. **Story 4 — Frågehantering.** Väljs som första vy eftersom `/questions`
   är den mest väletablerade endpointen (från Sprint 2) och övningen är en
   fullständig CRUD-loop (lista, skapa, redigera) — bra att verifiera
   grunden mot innan resten byggs på.

**Resterande vyer (valfri ordning enligt backloggen, föreslagen praktisk
ordning nedan eftersom några delar mönster/kod):**
5. Story 5 — Schemainställningar (bygger vidare på frågelistan från 4)
6. Story 6 — Skicka direkt (send-now)
7. Story 7 — Eskalationskontakt
8. Story 8 — Individuell historikvy (sök + pausa/aktivera)
9. Story 9 — Svarslogg (enkel tabell)
10. Story 10 — Trendgraf (Recharts, `/stats/aggregate`)
11. Story 11 — Periodjämförelse (bygger vidare på 10)
12. Story 12 — Presentationsvy (avidentifierad, separat layout)

**Beslut, inte kod:**
13. Story 13 — Utvärdera SSO. Med 2–3 admins: dokumentera beslutet att
    Slack OAuth räcker, ingen SSO-story skapas. Görs som en kort anteckning
    i Notion, inget kodarbete.

## Miljövariabler att lägga till

Utöver `MAENDEKOLL_API_URL` och `ADMIN_API_KEY` (redan i `CLAUDE.md`):
`NEXTAUTH_SECRET`, `NEXTAUTH_URL`, samt Slack-appens OAuth-uppgifter
(client id/secret) för Auth.js-providern. Alla i `.env.example` med tomma
värden, riktiga värden bara i Vercel.

## Process (redan bestämt i `CLAUDE.md`, upprepas inte i detalj)

- En branch per story, små commits, `git-exec`-subagenten kör all git-
  exekvering.
- Notion-status (`Pågår`/`Klar`) och SSO-beslutet uppdateras via
  `notion-ops`-subagenten.
- `CHANGELOG.md` skapas i repo-roten vid första produktionsdeployen (samma
  struktur som backend-repots).

## Verifiering

- Efter Story 1–3: manuellt logga in i webbläsaren via Slack och göra ett
  anrop mot `/questions` — inte bara `next build`.
- Efter varje vy: manuell verifiering mot det riktiga backend-API:et
  (Railway), inte mockad data — enligt Definition of Done i `CLAUDE.md`.
- `pnpm test`/Vitest för `apiClient.ts` och eventuell fältmappning
  (snake_case/camelCase), co-located per fil.
