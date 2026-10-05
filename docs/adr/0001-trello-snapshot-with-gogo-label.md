# Trello is the only editor; Claude Code commits a Snapshot of Gogo-labelled cards

The travellers already plan the Trip on a Trello board, and the app must work with no internet on arrival in Japan. So the Plan Board stays the single place the Trip is edited. Claude Code reads it through its Trello MCP connection and writes the Published Cards into `src/data/snapshot.json`, which is committed and bundled into the static PWA. The coding agent (Opencode) and the build never touch Trello. Only cards labelled `Gogo` (any case) are published; every other card is a private note. That is how booking numbers, emails and payment amounts stay out of both the repo and a site that sits on an unlisted public URL.

## Considered Options

- **Live Trello API from the browser**: rejected; it would put a Trello token on the client and still needs an offline cache.
- **An `npm run sync` script with a Trello key/token in `.env`**: dropped; it would put Trello credentials on the coding side, while Claude Code already has authenticated access.
- **Moving the Trip into repo files**: rejected; it would make the travellers edit in two places, and one of them works in Trello.
- **A guard that fails on Sensitive Details** (emails, `¥` amounts, reservation numbers): deliberately not built into the app. Claude Code scans the Snapshot when it writes one.

## Consequences

- Nothing on the Plan Board reaches the phones until Claude Code refreshes the Snapshot, it is deployed, and each phone opens the app online.
- Adding the `Gogo` label publishes a card to anyone with the URL. Booking cards must stay unlabelled, or be split into a labelled card (name, address, dates) and an unlabelled one (reservation details).
