# Google Apps Script Lead Storage

This folder contains the starter Apps Script endpoint for the website lead form.

## Frontend Environment Variables

```env
GOOGLE_APPS_SCRIPT_LEADS_ENDPOINT=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
LEAD_FORM_SHARED_SECRET=optional-shared-secret
```

`GOOGLE_APPS_SCRIPT_LEADS_ENDPOINT` is required for live submissions. If it is
missing, the server action logs the validated lead and returns success during
local development. `LEAD_FORM_SHARED_SECRET` is optional but recommended.

## Apps Script Setup

1. Create a Google Sheet in the Google Drive account for `Farisrashad6919@gmail.com`.
2. Copy the Sheet ID from the URL.
3. Create a new Apps Script project and paste `Code.gs`.
4. In Apps Script, open Project Settings and add Script Properties:
   - `LEADS_SHEET_ID`: the Google Sheet ID.
   - `LEAD_FORM_SHARED_SECRET`: the same value used by the frontend, if enabled.
5. Deploy as a Web App.
6. Set execute access to the owner account and web access according to the deployment policy you choose.
7. Copy the Web App URL into `GOOGLE_APPS_SCRIPT_LEADS_ENDPOINT`.

## Request Payload

The website posts JSON with fields such as:

```json
{
  "secret": "optional-shared-secret",
  "timestamp": "2026-04-24T12:00:00.000Z",
  "locale": "en",
  "sourcePage": "/programs/business-english",
  "fullName": "Student Name",
  "age": 28,
  "nationality": "Egyptian",
  "whatsapp": "+201234567890",
  "telegram": "@username",
  "email": "student@example.com",
  "track": "business",
  "offerType": "webinar",
  "preferredLanguage": "en",
  "currentLevel": "Intermediate",
  "goal": "I want better meeting confidence.",
  "utmSource": "",
  "utmMedium": "",
  "utmCampaign": "",
  "referrer": "",
  "website": ""
}
```

## Response Format

```json
{ "ok": true, "leadId": "uuid" }
```

```json
{ "ok": false, "error": "message" }
```

## Sheet Columns

`timestamp`, `source_page`, `track`, `offer_type`, `full_name`, `age`,
`nationality`, `whatsapp`, `telegram`, `email`, `preferred_language`,
`current_level`, `short_goal`, `utm_source`, `utm_medium`, `utm_campaign`,
`referrer`, `consent`, `locale`, `lead_id`.
