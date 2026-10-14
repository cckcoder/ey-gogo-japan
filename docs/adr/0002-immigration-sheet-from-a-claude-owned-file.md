# The Immigration Sheet reads Stays and flights from a Claude-owned file, not from Published Cards

On arrival an Immigration Officer may ask where the travellers will stay and when they leave. The answers sit on unpublished booking Plan Cards, next to reservation numbers and payment amounts, so ADR 0001 keeps them out of the app. Rather than asking the travellers to split every booking card on the Plan Board, Claude Code reads those cards through its Trello MCP connection and writes only the public part (hotel name, address, phone, check-in and check-out dates, flight times) into `src/data/immigration.json`. It also writes a one-line English and Japanese summary of each Day there. Addresses and phone numbers come from each hotel's official site, because the booking cards do not hold them.

This is the one exception to "only Published Cards reach the app". The rule that keeps Sensitive Details out of the repo and the bundle still holds.

## Considered Options

- **Split each booking into a labelled Stay card and an unlabelled booking card** (the path ADR 0001 names): rejected for now. It is more editing on the Plan Board for data that changes rarely.
- **Generate a PDF file at build time**: rejected; the app has no build step beyond Vite, and the travellers' browser can already print the page to PDF offline.
- **Put the travellers' names or passport numbers on the sheet**: rejected; the officer is holding the passport, and the URL is public.

## Consequences

- When a booking changes in Trello, nothing updates on its own. Ask Claude Code to refresh `immigration.json` along with the Snapshot.
- Claude Code scans `immigration.json` for Sensitive Details whenever it writes it, just as it scans the Snapshot.
- The per-Day summaries are written by hand, so they can drift from the Published Cards. A test checks that there is exactly one summary for each Day of the Snapshot.
