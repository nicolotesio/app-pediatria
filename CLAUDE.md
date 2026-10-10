# Appunti di Pediatria

Webapp Next.js 14 (App Router, TypeScript, Tailwind) con appunti e calcolatori clinici pediatrici. Lingua dell'interfaccia e dei commit: italiano.

## Avviare l'app

- L'app gira sul PC Windows dell'autore, nella cartella `Desktop\NICOLO\Appunti di Pediatria`.
- Avvio: doppio clic su `run-local.cmd` (richiama `start-local.ps1`: controlla Node.js, installa le dipendenze se mancano, lancia `next dev` sulla porta 3000). Se l'app e gia attiva lo script esce subito.
- Indirizzo: `http://localhost:3000`.
- Dopo un push fatto da un ambiente esterno, la cartella sul PC si riallinea con doppio clic su `aggiorna-da-github.cmd` (chiede conferma, poi `git reset --hard origin/main`).
- Commit direttamente su `main`, senza rami separati.
- Negli ambienti cloud senza accesso al registro npm l'app non si puo installare: provarla sul PC dell'autore e, per la sola logica, eseguire i test.

## Comandi

- `npm test` (vitest): test unitari in `tests/`, uno per calcolatore.
- `npm run lint`, `npm run build`.

## Struttura

- `lib/calculators/`: logica clinica pura, senza React. Ogni modifica richiede un test.
- `lib/sources/clinicalSources.ts`: fonti bibliografiche; `EMERGENCY_DRUG_LIMITS` in `lib/calculators/emergencyDrugs.ts`: massimali.
- `components/calculators/`: interfaccia dei calcolatori. `data/`: dataset (curve di crescita, appunti).
- `lib/format.ts`: i numeri mostrati usano sempre la virgola decimale (`formatDecimal`).

## Regole cliniche

- Nessun dosaggio, massimale o dataset senza fonte citata e data di aggiornamento.
- Non introdurre massimali a memoria: se la fonte non li riporta, lasciare la dose non limitata e dichiararlo nella nota della fonte.
