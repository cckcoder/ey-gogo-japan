# EY Gogo Japan

An offline-capable trip viewer for a 9-day Japan trip (24 Nov – 2 Dec 2026), shared by the two travellers and shown to an immigration officer on arrival.

## Language

**Trip**:
The whole journey, Day 0 (Tue 24/11/2026) through Day 8 (Wed 2/12/2026).
_Avoid_: Plan, tour

**Day**:
One calendar date of the Trip, numbered from 0. A Day corresponds to one list on the Trello board.
_Avoid_: List, Day 1-based numbering

**Destination**:
The place name a Day is centred on, written after the date in the Day's list name (e.g. `Day 1 - Wednesday 25/11 - Fuji Kawaguchiko`). A Day may have no Destination.
_Avoid_: City, area, location

**Plan Board**:
The Trello board where the travellers write and edit the Trip. It is the only place the Trip is edited.
_Avoid_: Source, backend

**Plan Card**:
A Trello card on the Plan Board describing something that happens on a Day.
_Avoid_: Activity, item, event

**Published Card**:
A Plan Card carrying the `Gogo` label (any letter case). Only Published Cards appear in the app; every other Plan Card is a private note.
_Avoid_: Public card, visible card

**Snapshot**:
A frozen copy of the Plan Board's Published Cards, committed to the repo and bundled into the app. What travellers see offline is always a Snapshot, never the live board.
_Avoid_: Cache, sync data

**Translation**:
The English version of a Published Card, written by Claude Code. It is valid only while it matches the card's current Thai text; otherwise the card shows in Thai.
_Avoid_: i18n string, locale file

**Sensitive Detail**:
Email addresses, payment amounts and reservation numbers. They belong only on unpublished Plan Cards; keeping them off Published Cards is the author's responsibility.
_Avoid_: Private data, secrets

**Immigration Officer**:
The officer at Narita arrival who may ask where the travellers will go and stay. They view the same page as the travellers.
_Avoid_: ต.ม., customs
