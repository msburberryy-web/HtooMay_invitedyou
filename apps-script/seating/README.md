# Seating feed (for `seat/`)

Lets the public seat page read Table No / Seat No from the private
"finalize guest list" sheet. Only name, table and seat are sent — nothing else.

## One-time setup (≈3 min)
1. Go to <https://script.google.com> → **New project**, name it "Htoo & May seating".
2. Replace everything in `Code.gs` with this folder's `Code.gs`. Save.
3. **Deploy → New deployment** → type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Approve the permission prompt (it needs to read your spreadsheet).
5. Copy the **Web app URL** (ends in `/exec`) and paste it into
   `seat/guests.json` → `"seatingEndpoint"`. Upload `guests.json` again.

Open the `/exec` URL in a browser to check: you should see `{"ok":true,...,"guests":[...]}`.

## Notes
- Header row must contain **Table No** (column G) and **Seat No** (column H), plus a name
  column (`Name`, `Full Name` or `Guest Name`).
- Guests with an empty Table No are skipped (not seated yet).
- If there's an `Attendance` column, only `attend` / `yes` / blank rows are shown.
- Seating edits in the sheet appear on the page immediately — no redeploy needed.
  Only redeploy (Manage deployments → Edit → New version) if you change this code.
