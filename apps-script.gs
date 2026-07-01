// Panther · Bang for the Buck — Apps Script web app
// Receives vote POSTs from index.html and appends a row to the bound Google Sheet.
//
// SETUP:
// 1. Create a new Google Sheet. Name the first tab "Votes".
// 2. In that sheet: Extensions → Apps Script.
// 3. Paste this entire file into Code.gs and Save.
// 4. Deploy → New deployment → Type: Web app
//      - Execute as: Me
//      - Who has access: Anyone
//    Click Deploy, copy the Web App URL.
// 5. Paste that URL into index.html as the ENDPOINT constant.

const SHEET_NAME = "Votes";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

    // Write header row once.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "submitted_at",
        "voter",
        "team",
        "spent",
        "num_bets",
        "total_units",
        "pick_ids",
        "pick_names",
        "note",
      ]);
    }

    const pickIds = (data.picks || []).map(p => p.count > 1 ? `${p.id}×${p.count}` : p.id).join(", ");
    const pickNames = (data.picks || []).map(p => {
      const c = p.count || 1;
      const sub = p.subtotal || p.price * c;
      const cLabel = c > 1 ? ` ×${c}` : "";
      return `${p.id}${cLabel} ${p.name} ($${sub})`;
    }).join(" | ");
    const totalUnits = (data.picks || []).reduce((s, p) => s + (p.count || 1), 0);

    sheet.appendRow([
      data.submitted_at || new Date().toISOString(),
      data.voter || "",
      data.team || "",
      data.spent || 0,
      (data.picks || []).length,
      totalUnits,
      pickIds,
      pickNames,
      data.note || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Panther vote endpoint is live.");
}
