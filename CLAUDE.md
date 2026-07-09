# CLAUDE.md — Måendekoll Admin Frontend

Detta repo bygger **adminwebben** för Driftwinds Måendekoll: inloggning,
formulär för frågor/schema/eskalationskontakt, historikvy, statistik och en
avidentifierad presentationsvy för teammöten. Slutanvändare: Thomas och Lars
(admin-roll).

**Detta repo bygger INGEN backend-logik och rör aldrig databasen direkt.**
All data, all affärslogik och all lagring finns i ett separat repo/projekt
("bot+API-repot"). Den här appen är enbart ett gränssnitt ovanpå det API:et.
Om en uppgift verkar kräva Slack-hantering, databasändringar eller AI-anrop:
det hör till bot+API-repot, inte hit.

## Var backend-referensen finns

Bot+API-repot ligger lokalt på samma dator: **`/Users/huring/Github/maendekollen`**.
Källkoden där är alltid den mest aktuella sanningen om vad API:et faktiskt
gör — nyare än allt nedan om de skulle skilja sig åt. Särskilt relevanta filer
där (läs dem direkt om du är osäker på ett format eller beteende):

- `src/app.ts` — visar exakt vilka routrar som är monterade och på vilka paths.
- `src/routes/*.ts` — själva endpoint-handlerarna, inkl. validering och felsvar.
- `src/*Service.ts` (t.ex. `usersService.ts`, `questionsService.ts`) — exakta
  fält som returneras från databasen.
- `CLAUDE.md` i det repot — samma typ av kontextdokument som denna fil, men
  för backend-sidan.
- `CHANGELOG.md` i det repot — releasehistorik, användbart för att se när en
  endpoint faktiskt landade i produktion.

**API-dokumentation (`API.md`) är planerad i backend-repots Sprint 3 men inte
skriven ännu** — tills den finns, lita på källkoden ovan, inte bara den här
filen.

## Nuvarande API-yta (verifierad direkt mot backend-källkoden, 2026-07-07)

Bas-URL: backend-appens Railway-URL (sätts som miljövariabel här, se nedan).
Alla `/questions`, `/users` och `/responses`-endpoints kräver header
`Authorization: Bearer <ADMIN_API_KEY>` — samma nyckel som backend-repot
använder för sitt admin-API, se "Miljövariabler" nedan.

| Metod | Path | Beskrivning |
|---|---|---|
| GET | `/` | Health check (ingen auth) |
| GET | `/questions` | Lista alla frågor |
| POST | `/questions` | Skapa fråga. Body: `{ text, response_type? }` |
| POST | `/questions/send-now` | Skicka en ny fråga direkt till alla aktiva. Body: `{ text, response_type? }` → svar `{ question_id, sent_to }` |
| PATCH | `/questions/:id` | Uppdatera text/response_type/active |
| PATCH | `/questions/:id/schedule` | Uppdatera frequency/weekday/send_time/channel_type → svar inkluderar `last_sent_at` |
| GET | `/users?role=&active=` | Lista användare, valfria filter |
| PATCH | `/users/:id` | Body: `{ active: boolean }` — pausar/aktiverar utan att röra historik |
| PATCH | `/users/:id/escalation-contact` | Sätter denna som enda eskalationskontakt |
| GET | `/responses` | Alla svar för adminvyn: `{ createdAt, userName, emojiValue, freeText }[]` (camelCase, till skillnad från övriga endpoints som är snake_case) |

**Finns i service-lagret men INTE kopplat till en route ännu** (kommer i
Sprint 3, kolla `usersRoutes.ts` för aktuellt läge innan du bygger mot den):
- En anställds svarshistorik (`getUserResponses` i `usersService.ts`) — tänkt
  som `GET /users/:id/responses`, men routen är inte monterad än.

**Finns inte alls ännu** (kommer i senare, egna backend-sprintar — se
"Sprintnumrering" nedan, bygg inget här som förutsätter dem förrän de finns):
- `GET /stats/aggregate` — aggregerad trend (Sprint 3, backend, pågående)
- `GET /stats/themes` — avidentifierad temasammanfattning (Sprint 7, backend)
- AI-sammanfattning/flagga på svar (`ai_analysis`-fält, Sprint 5, backend)

## Vad vi har bestämt (relevant för frontend)

- **En adminroll, flera användare** (Thomas + Lars). Ingen nivåskillnad —
  bygg inget gränssnitt som förutsätter olika behörighetsnivåer bland admins.
- **Full identifiering, inte anonymt.** Admin ser alltid vem som svarat vad —
  ett medvetet avsteg från branschnormen (de flesta liknande verktyg är
  anonyma med en minsta-gruppstorlek). Historikvyn ska visa namn.
- **Presentationsvyn (teammöten) är däremot avidentifierad på gruppnivå** —
  visa aggregat och teman, aldrig namn eller möjlighet att klicka vidare till
  en individ, även om admin i andra vyer ser individer.
- **En (1) eskalationskontakt åt gången**, inte flera. UI:t för att välja
  kontakt ska göra det uppenbart att det bytes, inte läggs till.
- **Inloggning: Slack OAuth**, inte SSO (Microsoft 365/Entra ID) — det är
  medvetet nedprioriterat för den här skalan (2–3 admins). Efter Slack-login,
  slå upp personen mot `GET /users` och kontrollera `role === "admin"`.
- **AI-innehåll måste vara visuellt och strukturellt åtskilt från rådata**
  när det landar (Sprint 5–6/7–8) — aldrig ersätta originalsvaret, alltid
  tydligt märkt som AI-genererat.
- **Ingen radering i UI:t.** `PATCH /users/:id` med `active: false` pausar en
  anställd men rör inte historiken. Faktisk radering är ett manuellt,
  administrativt beslut utanför produkten (se backend-repots Sprint 9).

## Var backloggen finns

Gemensam Notion-backlogg för båda repona: **[Backlog – Måendekoll](https://app.notion.com/p/af69fd4f4d94436e9d9fbcd634ca402f)**.
Varje story har ett fält `Komponent` — filtrera på **`Komponent = UI`** för
att se exakt vad som hör till det här repot.

**Sprintnumrering** — varje sprint håller sig till ETT repo, aldrig blandat:

| Sprint | Repo | Fokus |
|---|---|---|
| 0–3 | backend | Grund, MVP, administration, rapport |
| **4** | **frontend (detta repo)** | Grund + samtliga vyer i bas-version |
| 5 | backend | AI-augmentering |
| **6** | **frontend (detta repo)** | Vidareutveckling: AI i historikvyn |
| 7 | backend | Temasammanfattning |
| **8** | **frontend (detta repo)** | Vidareutveckling: teman i presentationsvyn |
| 9 | backend | Härdning |

Innan du börjar på en ny sprint: läs sprintens eget
**"📋 LÄS FÖRST – Sprint N"**-kort i backloggen (finns för Sprint 4, 6 och 8
här) — det listar exakt vilka storys och vilket API som ska finnas på plats.

Övriga relevanta Notion-sidor (huvudplan, arkitektur, kritisk research) länkas
från "LÄS FÖRST – Kontext"-kortet i backloggen — den här filen upprepar inte
allt, utgå från backloggen för fullständig kontext per story.

## Implementationsplaner — spara i repot

Varje implementationsplan (för en sprint eller en enskild feature/story) ska
sparas som en markdown-fil i `.claude/plans/`, t.ex. `.claude/plans/sprint-4.md`
eller `.claude/plans/fragehantering-vy.md`. Detta gäller planer som tas fram
i Plan-läge eller annars efter att ha resonerat fram en plan utifrån
Notion-storys — inte tillfälliga att-göra-listor för en enskild konversation.
Planen ska finnas kvar i repot så den går att slå upp i en senare session,
även efter att konversationen där den skapades är borta. Samma konvention som
i backend-repot.

## Miljövariabler (frontend)

| Variabel | Syfte |
|---|---|
| `MAENDEKOLL_API_URL` | Bas-URL till backend-appen (Railway) |
| `ADMIN_API_KEY` | Samma delade nyckel som backend-repot — skickas som `Authorization: Bearer <nyckel>` på varje anrop |

Bygg en central, återanvändbar klientfunktion som lägger på auth-headern
automatiskt, istället för att upprepa det i varje vy. Håll en `.env.example`
i repot (tomma värden), committa aldrig riktiga nycklar.

## Teknikstack (beslutat)

- **Next.js**, hostat på **Vercel** (gratis på den här skalan, bra DX).
- Auto-deploy vid push till `main`, preview-deploys per PR.
- Konsumerar uteslutande API:et ovan — ingen egen Supabase-klient, ingen
  egen databaslogik.

## Konventioner från backend-repot som ska följa med hit

- **TypeScript**, undvik `any` där det går.
- **Tester co-located** med källfilen (`x.ts` + `x.test.ts` i samma mapp),
  Vitest som testramverk.
- **En branch per story**, namngiven efter storyn (t.ex.
  `feature/fragehantering-vy`). Små, fokuserade commits under arbetet —
  inte en enda stor commit i slutet. **Delegera själva git-exekveringen till
  `git-exec`-subagenten** (se "Subagents" nedan) — huvudsessionen avgör vad
  som ska committas och skriver texten, `git-exec` kör kommandona.
- **Merge till `main` först när storyns Definition of Done är uppfylld**
  (se storyn i Notion-backloggen). Om ett beroende inte är klart: lämna
  branchen öppen och flagga varför, merga inte ofärdigt.
- Uppdatera storyns `Status`-fält i Notion till `Pågår`/`Klar` löpande —
  **delegera detta och allt annat Notion-arbete till `notion-ops`-subagenten**
  (se "Subagents" nedan).
- **Release notes vid varje deploy till Vercel som faktiskt går till
  produktion**: lägg dem i en `CHANGELOG.md` i repo-roten (nyast överst),
  med samma struktur som backend-repots — Vad som är nytt / Vad som har
  ändrats / Buggar fixade / Annan relevant information (t.ex. nya
  miljövariabler, manuella steg). Kort, på svenska, riktat till Thomas och
  Lars, inte en teknisk commit-logg.
- Inga hemligheter hårdkodade — allt via miljövariabler.

## Subagents (kostnadseffektiv delegering)

Två fördefinierade subagents i `.claude/agents/`, identiska i båda
Måendekoll-repona (bot+API och admin-frontend). De körs på en billigare
modell (Haiku) i egen, isolerad kontext — huvudsessionen fortsätter på sin
vanliga modell och belastas inte av git-output eller Notion-svar.

- **`git-exec`** — kör ALL faktisk git-exekvering (branch, add, commit,
  push, merge). Fattar inga egna beslut om VAD som ska göras; huvudsessionen
  avgör om Definition of Done är uppfylld och formulerar commit-/release-
  texten, `git-exec` kör bara den redan beslutade sekvensen. Kör aldrig
  git-kommandon direkt i huvudsessionen — delegera hit.
- **`notion-ops`** — sköter allt arbete mot den gemensamma Notion-backloggen:
  skapa/uppdatera storys, ändra properties, flytta mellan sprintar, uppdatera
  "LÄS FÖRST"-kort. Använd den även när en uppgift kräver en plan eller ett
  beslut (t.ex. "gör en plan för sprint X"): låt `notion-ops` hämta och
  sammanställa den råa Notion-informationen, och gör själva
  resonemanget/planeringen i huvudkontexten utifrån det den lämnar tillbaka.
  Agenten ska aldrig själv resonera fram en plan eller ett beslut — bara
  hämta/skriva data.

Båda är konfigurerade för automatisk delegering (proaktiv `description` +
denna policy i CLAUDE.md) — du ska inte behöva be om delegeringen varje
gång, bara märka att Claude gör det. Om Claude ändå kör git- eller
Notion-anrop direkt i huvudsessionen: påminn om att det ska gå via
respektive subagent.

## Definition of Done — gäller generellt, utöver vad varje story specificerar

- Kod pushad till GitHub och deployad till Vercel.
- Manuellt verifierad i webbläsaren mot backend-API:et (inte bara mockad data).
- Om en vy förutsätter ett API-fält eller en endpoint som inte finns än:
  stanna upp och kontrollera backend-repots källkod/CLAUDE.md/CHANGELOG.md
  innan du bygger vidare — API-ytan ändras fortfarande i tidiga sprintar.
