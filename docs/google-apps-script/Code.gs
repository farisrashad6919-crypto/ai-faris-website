/**
 * Faris Rashad English Trainer lead capture endpoint.
 *
 * Frontend env variables:
 * - GOOGLE_APPS_SCRIPT_LEADS_ENDPOINT: deployed Apps Script Web App URL
 * - LEAD_FORM_SHARED_SECRET: optional shared secret, stored here as Script Property
 *
 * Apps Script properties to set:
 * - LEADS_SHEET_ID: Google Sheet ID owned by Farisrashad6919@gmail.com
 * - LEAD_FORM_SHARED_SECRET: optional shared secret matching the frontend env value
 *
 * Expected JSON request payload:
 * {
 *   "secret": "optional-shared-secret",
 *   "timestamp": "2026-04-24T12:00:00.000Z",
 *   "locale": "en",
 *   "sourcePage": "/programs/ielts-test-prep",
 *   "fullName": "Student Name",
 *   "age": 28,
 *   "nationality": "Egyptian",
 *   "whatsapp": "+201234567890",
 *   "telegram": "@username",
 *   "email": "student@example.com",
 *   "track": "ielts",
 *   "offerType": "course",
 *   "preferredLanguage": "en",
 *   "currentLevel": "Intermediate",
 *   "goal": "I need IELTS speaking support.",
 *   "utmSource": "",
 *   "utmMedium": "",
 *   "utmCampaign": "",
 *   "referrer": "",
 *   "website": ""
 * }
 *
 * JSON response format:
 * Success: { "ok": true, "leadId": "uuid" }
 * Error:   { "ok": false, "error": "message" }
 *
 * Google Sheet column mapping:
 * timestamp, source_page, track, offer_type, full_name, age, nationality,
 * whatsapp, telegram, email, preferred_language, current_level, short_goal,
 * utm_source, utm_medium, utm_campaign, referrer, consent, locale, lead_id
 */

const NOTIFICATION_EMAIL = "Farisrashad6919@gmail.com";

const SHEET_COLUMNS = [
  "timestamp",
  "source_page",
  "track",
  "offer_type",
  "full_name",
  "age",
  "nationality",
  "whatsapp",
  "telegram",
  "email",
  "preferred_language",
  "current_level",
  "short_goal",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "referrer",
  "consent",
  "locale",
  "lead_id",
];

function jsonResponse(payload, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const properties = PropertiesService.getScriptProperties();
  const sheetId = properties.getProperty("LEADS_SHEET_ID");

  if (!sheetId) {
    throw new Error("Missing LEADS_SHEET_ID script property.");
  }

  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadsheet.getSheetByName("Leads") || spreadsheet.insertSheet("Leads");
  const firstRow = sheet.getRange(1, 1, 1, SHEET_COLUMNS.length).getValues()[0];
  const hasHeaders = firstRow.some(Boolean);

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, SHEET_COLUMNS.length).setValues([SHEET_COLUMNS]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function validatePayload_(payload) {
  const required = [
    "fullName",
    "age",
    "nationality",
    "track",
    "offerType",
    "preferredLanguage",
  ];

  required.forEach(function (field) {
    if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === "") {
      throw new Error("Missing required field: " + field);
    }
  });

  if (!payload.whatsapp && !payload.telegram) {
    throw new Error("WhatsApp or Telegram is required.");
  }

  if (payload.website) {
    throw new Error("Spam rejected.");
  }

  return true;
}

function verifySecret_(payload) {
  const expected = PropertiesService.getScriptProperties().getProperty("LEAD_FORM_SHARED_SECRET");

  if (expected && payload.secret !== expected) {
    throw new Error("Invalid shared secret.");
  }
}

function appendLead_(payload) {
  const leadId = Utilities.getUuid();
  const sheet = getSheet_();
  const row = [
    payload.timestamp || new Date().toISOString(),
    payload.sourcePage || "",
    payload.track || "",
    payload.offerType || "",
    payload.fullName || "",
    payload.age || "",
    payload.nationality || "",
    payload.whatsapp || "",
    payload.telegram || "",
    payload.email || "",
    payload.preferredLanguage || "",
    payload.currentLevel || "",
    payload.goal || "",
    payload.utmSource || "",
    payload.utmMedium || "",
    payload.utmCampaign || "",
    payload.referrer || "",
    "yes",
    payload.locale || "",
    leadId,
  ];

  sheet.appendRow(row);
  return leadId;
}

function sendNotification_(payload, leadId) {
  const subject = "New website lead: " + (payload.track || "unknown track");
  const body = [
    "A new website lead was submitted.",
    "",
    "Lead ID: " + leadId,
    "Source page: " + (payload.sourcePage || ""),
    "Track: " + (payload.track || ""),
    "Offer type: " + (payload.offerType || ""),
    "Name: " + (payload.fullName || ""),
    "Age: " + (payload.age || ""),
    "Nationality: " + (payload.nationality || ""),
    "WhatsApp: " + (payload.whatsapp || ""),
    "Telegram: " + (payload.telegram || ""),
    "Email: " + (payload.email || ""),
    "Preferred language: " + (payload.preferredLanguage || ""),
    "Current level: " + (payload.currentLevel || ""),
    "Goal: " + (payload.goal || ""),
    "",
    "UTM source: " + (payload.utmSource || ""),
    "UTM medium: " + (payload.utmMedium || ""),
    "UTM campaign: " + (payload.utmCampaign || ""),
    "Referrer: " + (payload.referrer || ""),
  ].join("\n");

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");

    verifySecret_(payload);
    validatePayload_(payload);

    const leadId = appendLead_(payload);
    sendNotification_(payload, leadId);

    return jsonResponse({ ok: true, leadId: leadId }, 200);
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error.message || error) }, 400);
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: "Faris lead capture" }, 200);
}
