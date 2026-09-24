/**
 * Aji Bio-Pharma Website UAT — Google Sheets backend.
 *
 * Setup (once):
 *   1. Create a new Google Sheet. Extensions → Apps Script.
 *   2. Replace everything in Code.gs with this file. Save.
 *   3. Run `setup` once from the editor (authorize when prompted).
 *   4. Deploy → New deployment → type "Web app".
 *        Execute as: Me       Who has access: Anyone
 *   5. Copy the Web App URL into config.js → appsScriptUrl.
 *
 * After editing this script, use Deploy → Manage deployments → Edit →
 * Version: New version. The URL stays the same.
 */

var SHEETS = {
  results: ['Updated', 'Tester', 'Page ID', 'Page', 'Check', 'Status', 'Note'],
  dev:     ['Number', 'Page', 'Reporter', 'Description', 'Jira Link', 'Status', 'Notes', 'Created', 'Updated'],
  content: ['Number', 'Page', 'Reporter', 'Description', 'Type', 'Status', 'Notes', 'Created', 'Updated']
};
var NAMES = { results: 'Results', dev: 'Dev Updates', content: 'Content Updates' };

function setup() {
  var ss = SpreadsheetApp.getActive();
  Object.keys(SHEETS).forEach(function (k) {
    var sh = ss.getSheetByName(NAMES[k]) || ss.insertSheet(NAMES[k]);
    if (sh.getLastRow() === 0) {
      sh.appendRow(SHEETS[k]);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, SHEETS[k].length).setFontWeight('bold');
    }
  });
}

function sheet_(k) {
  var sh = SpreadsheetApp.getActive().getSheetByName(NAMES[k]);
  if (!sh) { setup(); sh = SpreadsheetApp.getActive().getSheetByName(NAMES[k]); }
  return sh;
}

function rows_(k) {
  var sh = sheet_(k), n = sh.getLastRow();
  if (n < 2) return [];
  var head = SHEETS[k];
  return sh.getRange(2, 1, n - 1, head.length).getValues().map(function (r) {
    var o = {}; head.forEach(function (h, i) { o[h] = r[i] instanceof Date ? r[i].toISOString() : r[i]; }); return o;
  });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ ok: true, results: rows_('results'), dev: rows_('dev'), content: rows_('content') });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var b = JSON.parse(e.postData.contents || '{}');
    var now = new Date();

    if (b.action === 'setResult') {
      // Upsert one cell: Tester + Page ID + Check is the key.
      var sh = sheet_('results'), n = sh.getLastRow(), row = -1;
      if (n > 1) {
        var keys = sh.getRange(2, 2, n - 1, 4).getValues();
        for (var i = 0; i < keys.length; i++) {
          if (keys[i][0] === b.tester && keys[i][1] === b.pageId && keys[i][3] === b.check) { row = i + 2; break; }
        }
      }
      var vals = [[now, b.tester, b.pageId, b.page, b.check, b.status || '', b.note || '']];
      if (!b.status && !b.note) { if (row > 0) sh.deleteRow(row); }
      else if (row > 0) sh.getRange(row, 1, 1, 7).setValues(vals);
      else sh.appendRow(vals[0]);
      return json_({ ok: true });
    }

    if (b.action === 'addIssue' || b.action === 'updateIssue') {
      var k = b.log === 'content' ? 'content' : 'dev';
      var sh2 = sheet_(k), head = SHEETS[k], n2 = sh2.getLastRow();
      if (b.action === 'addIssue') {
        var next = 1;
        if (n2 > 1) next = Math.max.apply(null, sh2.getRange(2, 1, n2 - 1, 1).getValues().map(function (r) { return +r[0] || 0; })) + 1;
        var rec = head.map(function (h) {
          if (h === 'Number') return next;
          if (h === 'Created' || h === 'Updated') return now;
          if (h === 'Status') return b.fields.Status || 'Reported';
          return b.fields[h] || '';
        });
        sh2.appendRow(rec);
        return json_({ ok: true, number: next });
      }
      var nums = n2 > 1 ? sh2.getRange(2, 1, n2 - 1, 1).getValues() : [];
      for (var j = 0; j < nums.length; j++) {
        if (+nums[j][0] === +b.number) {
          head.forEach(function (h, c) {
            if (h in b.fields && h !== 'Number' && h !== 'Created') sh2.getRange(j + 2, c + 1).setValue(b.fields[h]);
          });
          sh2.getRange(j + 2, head.indexOf('Updated') + 1).setValue(now);
          return json_({ ok: true });
        }
      }
      return json_({ ok: false, error: 'Issue not found' });
    }

    return json_({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
