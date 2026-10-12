/**
 * Seating feed for May & Htoo's "Find Your Seat" page (seat/index.html).
 *
 * Reads the "finalize guest list" tab and returns ONLY name + table + seat,
 * so the sheet itself can stay private. See README.md in this folder.
 */

const SPREADSHEET_ID = "11SA4KyupcO7ElvLnXRSngOxbMIb6G035OtWJqGE_tdM";
const SHEET_GID = 494842668;            // the tab from the sheet URL (#gid=...)

const TABLE_HEADERS = ["table no", "table no.", "table", "table number"];
const SEAT_HEADERS  = ["seat no", "seat no.", "seat", "seat number"];
const NAME_HEADERS  = ["full name", "name", "guest name", "guest"];

function doGet() {
  const out = { ok: true, updated: new Date().toISOString(), guests: [] };
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()
      .filter(s => s.getSheetId() === SHEET_GID)[0];
    if (!sheet) throw new Error("Tab with gid " + SHEET_GID + " not found");

    const values = sheet.getDataRange().getDisplayValues();

    // Header row = first row that has a "Table No" column.
    let h = -1, head = [];
    for (let r = 0; r < Math.min(values.length, 10); r++) {
      const row = values[r].map(v => String(v).trim().toLowerCase());
      if (row.some(v => TABLE_HEADERS.indexOf(v) > -1)) { h = r; head = row; break; }
    }
    if (h < 0) throw new Error("No 'Table No' header found");

    const find = names => { for (const n of names) { const i = head.indexOf(n); if (i > -1) return i; } return -1; };
    const cTable = find(TABLE_HEADERS);
    const cSeat  = find(SEAT_HEADERS);
    let cName = find(NAME_HEADERS);
    if (cName < 0) cName = head.findIndex(v => v.indexOf("name") > -1);
    if (cName < 0) throw new Error("No name column found");
    const cAtt  = head.indexOf("attendance");

    for (let r = h + 1; r < values.length; r++) {
      const row = values[r];
      const name = String(row[cName] || "").trim();
      if (!name) continue;
      if (cAtt > -1) {
        const a = String(row[cAtt] || "").trim().toLowerCase();
        if (a && a !== "attend" && a !== "yes") continue;
      }
      const table = String(row[cTable] || "").trim();
      if (!table) continue;                 // not seated yet → don't publish
      if (TABLE_HEADERS.indexOf(table.toLowerCase()) > -1) continue;  // repeated header row
      out.guests.push({
        name: name,
        table: table,
        seat: cSeat > -1 ? String(row[cSeat] || "").trim() : ""
      });
    }
  } catch (err) {
    out.ok = false;
    out.error = String(err);
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}
