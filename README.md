# Appunti di Pediatria

Webapp personale Next.js per appunti, risorse e strumenti clinici pediatrici, a cura di **Dr Nicolò Tesio**.

## Installazione

```bash
npm install
```

## Avvio

```bash
npm run dev
```

Aprire `http://localhost:3000`.

## Test

```bash
npm test
```

I test unitari del calcolatore WETFLAG sono in `tests/wetflag.test.ts`.

## Aggiungere appunti

Gli appunti demo sono in `data/notes.ts`. Ogni appunto include:

- `title`
- `category`
- `tags`
- `updatedAt`
- `sources`
- `content` in Markdown semplice

Per contenuti MDX piu ricchi, il progetto e configurato con `@next/mdx`; si possono aggiungere pagine `.mdx` dentro `app` o integrare un loader dedicato in `lib/content`.

## Aggiungere un nuovo calcolatore

1. Creare la logica clinica pura in `lib/calculators`.
2. Aggiungere metadati: fonte, data aggiornamento, range di validita e unita di misura.
3. Validare tutti gli input e restituire warning espliciti per valori fuori range.
4. Creare il componente UI in `components/calculators`.
5. Aggiungere test unitari in `tests`.
6. Collegare il calcolatore in `app/calcolatori/page.tsx` o nella sezione appropriata.

## Validazione clinica e fonti

Questa app non sostituisce linee guida, protocolli locali o giudizio clinico. Non inserire dataset, curve di crescita, dosaggi o algoritmi senza fonte validata e data di aggiornamento. Dove i dati non sono disponibili, usare la dicitura **dataset non ancora configurato** o **non configurato**.

Il calcolatore WETFLAG e implementato come stima iniziale per eta 1-10 anni e richiede conferma con peso reale, condizioni cliniche, concentrazioni disponibili e protocolli locali.

## PWA/offline

E incluso un service worker semplice in `public/sw.js`, registrato in produzione. La cache e volutamente minima e va rivalidata prima di un uso clinico offline esteso.
