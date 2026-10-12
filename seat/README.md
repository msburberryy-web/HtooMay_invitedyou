# Find Your Seat — May & Htoo

Live at: `https://msburberryy-web.github.io/HtooAndMay_invitedyou/seat/`

Guests type their name and see their table number. EN / 日本語 / မြန်မာ.
Uses the invitation's monogram and background from `../assets/photos/`.

Handy links:
- `seat/?lang=ja` or `seat/?lang=my` — open in Japanese / Burmese
- `seat/?name=Aung` — pre-fill a name (e.g. for a QR code on a place card)

## Where the guest list comes from

Edit `guests.json`:

```json
{
  "googleSheet": "",
  "sheetTab": "",
  "guests": [ { "name": "Aung Aung", "table": 3 } ]
}
```

### Option 0 — Private "finalize guest list" sheet (what we use)
Reads **Table No** (col G) and **Seat No** (col H) through a small Apps Script, so the sheet
stays private and only name / table / seat are exposed. Set it up with
`apps-script/seating/README.md`, then paste the `/exec` URL into `"seatingEndpoint"`.

### Option A — Public Google Sheet (updates live)
1. Sheet columns (first row): `Name` (or `Full Name`) and `Table` (or `Table Number` / `Seat`).
   Optional: `Attendance` (only rows with `attend` are shown) and `Guest Info`
   (extra names in the same party, separated by commas or `&` — they get the same table).
2. Share → **Anyone with the link → Viewer**.
3. Paste the sheet URL (or its ID) into `"googleSheet"`. If the seating is not on the first
   tab, put the tab name in `"sheetTab"`.

Changes in the sheet show up as soon as a guest reloads the page — no re-upload needed.
If the sheet can't be read, the page falls back to the `guests` list in this file.

### Option B — JSON only
Leave `"googleSheet"` empty and list everyone in `"guests"`. Re-upload `guests.json` to change seating.
