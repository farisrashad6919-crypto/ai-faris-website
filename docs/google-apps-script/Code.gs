/**
 * Faris Rashad English Trainer lead capture endpoint.
 *
 * Supports:
 * - Existing contact/inquiry leads.
 * - English placement-test completions with full diagnostic storage.
 * - English Tense Mastery Test completions with tense diagnostics.
 *
 * Frontend env variables:
 * - GOOGLE_APPS_SCRIPT_LEADS_ENDPOINT: deployed Apps Script Web App URL
 * - LEAD_FORM_SHARED_SECRET: optional shared secret, stored here as Script Property
 *
 * Apps Script properties to set:
 * - LEADS_SHEET_ID: Google Sheet ID owned by Farisrashad6919@gmail.com
 * - LEAD_FORM_SHARED_SECRET: optional shared secret matching the frontend env value
 */

const NOTIFICATION_EMAIL = "Farisrashad6919@gmail.com";

const CONTACT_LEADS_COLUMNS = [
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

const ALL_LEADS_COLUMNS = [
  "timestamp",
  "full_name",
  "whatsapp",
  "telegram",
  "email",
  "interested_track",
  "offer_type",
  "short_goal_result_summary",
  "source_page",
  "locale",
  "lead_id",
];

const PLACEMENT_TEST_COLUMNS = [
  "timestamp",
  "test_session_id",
  "full_name",
  "age",
  "nationality",
  "whatsapp",
  "telegram",
  "email",
  "preferred_language",
  "consent",
  "locale",
  "source_page",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "estimated_cefr_level",
  "confidence_label",
  "overall_score",
  "vocabulary_score",
  "grammar_score",
  "vocabulary_level_estimate",
  "grammar_level_estimate",
  "strongest_area",
  "weakest_area",
  "borderline_note",
  "recommended_track",
  "recommended_next_step",
  "recommendation_summary",
  "recommended_first_lessons_json",
  "top_grammar_gaps_json",
  "top_vocabulary_gaps_json",
  "completion_time_seconds",
  "completed_at",
  "retake_count",
  "total_questions_answered",
  "correct_answers_count",
  "question_ids_seen",
  "answer_summary_json",
  "skill_breakdown_json",
  "teacher_diagnostic_json",
  "recommendation_tags",
  "lead_id",
];

const TENSE_TEST_COLUMNS = [
  "timestamp",
  "test_session_id",
  "full_name",
  "age",
  "nationality",
  "whatsapp",
  "telegram",
  "email",
  "preferred_language",
  "consent",
  "locale",
  "source_page",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "mastery_label",
  "confidence_label",
  "overall_tense_score",
  "present_score",
  "past_score",
  "perfect_score",
  "future_score",
  "tense_contrast_score",
  "narrative_sequencing_score",
  "stative_dynamic_score",
  "professional_academic_score",
  "advanced_precision_score",
  "strongest_area",
  "weakest_area",
  "weak_tense_areas_json",
  "tense_contrasts_to_study_json",
  "recommended_first_lessons_json",
  "top_tense_weaknesses_json",
  "recommended_track",
  "recommended_next_step",
  "recommendation_summary",
  "completion_time_seconds",
  "completed_at",
  "retake_count",
  "total_questions_answered",
  "correct_answers_count",
  "question_ids_seen",
  "answer_summary_json",
  "area_breakdown_json",
  "teacher_diagnostic_json",
  "recommendation_tags",
  "lead_id",
];

const TRACK_LEAD_TABS = {
  ielts: "IELTS Leads",
  business: "Business English Leads",
  general: "General English Leads",
  "teacher-training": "Teacher Training Leads",
};

function jsonResponse(payload, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet_() {
  const properties = PropertiesService.getScriptProperties();
  const sheetId = properties.getProperty("LEADS_SHEET_ID");

  if (!sheetId) {
    throw new Error("Missing LEADS_SHEET_ID script property.");
  }

  return SpreadsheetApp.openById(sheetId);
}

function getSheetByName_(name, columns) {
  const spreadsheet = getSpreadsheet_();
  const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  const firstRow = sheet.getRange(1, 1, 1, columns.length).getValues()[0];
  const hasHeaders = firstRow.some(Boolean);
  const headersMatch = firstRow.join("\u0001") === columns.join("\u0001");

  if (!hasHeaders || !headersMatch) {
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function appendRow_(sheetName, columns, values) {
  const sheet = getSheetByName_(sheetName, columns);
  sheet.appendRow(columns.map(function (column) {
    return values[column] === undefined || values[column] === null ? "" : values[column];
  }));
}

function verifySecret_(payload) {
  const expected = PropertiesService.getScriptProperties().getProperty("LEAD_FORM_SHARED_SECRET");

  if (expected && payload.secret !== expected) {
    throw new Error("Invalid shared secret.");
  }
}

function requireFields_(payload, fields) {
  fields.forEach(function (field) {
    if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === "") {
      throw new Error("Missing required field: " + field);
    }
  });
}

function validateContactPayload_(payload) {
  requireFields_(payload, [
    "fullName",
    "age",
    "nationality",
    "track",
    "offerType",
    "preferredLanguage",
  ]);

  if (!payload.whatsapp && !payload.telegram) {
    throw new Error("WhatsApp or Telegram is required.");
  }

  if (payload.website) {
    throw new Error("Spam rejected.");
  }
}

function validatePlacementPayload_(payload) {
  requireFields_(payload, [
    "testSessionId",
    "fullName",
    "age",
    "nationality",
    "preferredLanguage",
    "estimatedCefrLevel",
    "confidenceLabel",
    "overallScore",
    "vocabularyScore",
    "grammarScore",
    "recommendedTrack",
    "recommendedNextStep",
    "recommendationSummary",
    "recommendedFirstLessonsJson",
    "topGrammarGapsJson",
    "topVocabularyGapsJson",
    "completedAt",
    "totalQuestionsAnswered",
    "correctAnswersCount",
    "answerSummaryJson",
    "skillBreakdownJson",
  ]);

  if (!payload.whatsapp && !payload.telegram) {
    throw new Error("WhatsApp or Telegram is required.");
  }

  if (!payload.consent) {
    throw new Error("Consent is required.");
  }
}

function validateTensePayload_(payload) {
  requireFields_(payload, [
    "testSessionId",
    "fullName",
    "age",
    "nationality",
    "preferredLanguage",
    "masteryLabel",
    "confidenceLabel",
    "overallTenseScore",
    "presentScore",
    "pastScore",
    "perfectScore",
    "futureScore",
    "recommendedTrack",
    "recommendedNextStep",
    "recommendationSummary",
    "recommendedFirstLessonsJson",
    "topTenseWeaknessesJson",
    "completedAt",
    "totalQuestionsAnswered",
    "correctAnswersCount",
    "answerSummaryJson",
    "areaBreakdownJson",
  ]);

  if (!payload.whatsapp && !payload.telegram) {
    throw new Error("WhatsApp or Telegram is required.");
  }

  if (!payload.consent) {
    throw new Error("Consent is required.");
  }
}

function appendContactLead_(payload) {
  const leadId = Utilities.getUuid();

  appendRow_("Leads", CONTACT_LEADS_COLUMNS, {
    timestamp: payload.timestamp || new Date().toISOString(),
    source_page: payload.sourcePage || "",
    track: payload.track || "",
    offer_type: payload.offerType || "",
    full_name: payload.fullName || "",
    age: payload.age || "",
    nationality: payload.nationality || "",
    whatsapp: payload.whatsapp || "",
    telegram: payload.telegram || "",
    email: payload.email || "",
    preferred_language: payload.preferredLanguage || "",
    current_level: payload.currentLevel || "",
    short_goal: payload.goal || "",
    utm_source: payload.utmSource || "",
    utm_medium: payload.utmMedium || "",
    utm_campaign: payload.utmCampaign || "",
    referrer: payload.referrer || "",
    consent: "yes",
    locale: payload.locale || "",
    lead_id: leadId,
  });

  return leadId;
}

function leadSummary_(payload) {
  const goal = payload.goal ? " Goal: " + payload.goal : "";
  return [
    "Placement result: " + payload.confidenceLabel,
    "Estimated CEFR: " + payload.estimatedCefrLevel,
    "Recommended track: " + payload.recommendedTrack,
    goal,
  ].join(". ");
}

function appendPlacementLeadRows_(payload) {
  const leadId = Utilities.getUuid();
  const timestamp = payload.timestamp || new Date().toISOString();
  const summary = leadSummary_(payload);

  appendRow_("Placement Tests", PLACEMENT_TEST_COLUMNS, {
    timestamp: timestamp,
    test_session_id: payload.testSessionId || "",
    full_name: payload.fullName || "",
    age: payload.age || "",
    nationality: payload.nationality || "",
    whatsapp: payload.whatsapp || "",
    telegram: payload.telegram || "",
    email: payload.email || "",
    preferred_language: payload.preferredLanguage || "",
    consent: payload.consent ? "yes" : "",
    locale: payload.locale || "",
    source_page: payload.sourcePage || "",
    referrer: payload.referrer || "",
    utm_source: payload.utmSource || "",
    utm_medium: payload.utmMedium || "",
    utm_campaign: payload.utmCampaign || "",
    estimated_cefr_level: payload.estimatedCefrLevel || "",
    confidence_label: payload.confidenceLabel || "",
    overall_score: payload.overallScore || "",
    vocabulary_score: payload.vocabularyScore || "",
    grammar_score: payload.grammarScore || "",
    vocabulary_level_estimate: payload.vocabularyLevelEstimate || "",
    grammar_level_estimate: payload.grammarLevelEstimate || "",
    strongest_area: payload.strongestArea || "",
    weakest_area: payload.weakestArea || "",
    borderline_note: payload.borderlineNote || "",
    recommended_track: payload.recommendedTrack || "",
    recommended_next_step: payload.recommendedNextStep || "",
    recommendation_summary: payload.recommendationSummary || "",
    recommended_first_lessons_json: payload.recommendedFirstLessonsJson || "",
    top_grammar_gaps_json: payload.topGrammarGapsJson || "",
    top_vocabulary_gaps_json: payload.topVocabularyGapsJson || "",
    completion_time_seconds: payload.completionTimeSeconds || "",
    completed_at: payload.completedAt || "",
    retake_count: payload.retakeCount || "",
    total_questions_answered: payload.totalQuestionsAnswered || "",
    correct_answers_count: payload.correctAnswersCount || "",
    question_ids_seen: payload.questionIdsSeen || "",
    answer_summary_json: payload.answerSummaryJson || "",
    skill_breakdown_json: payload.skillBreakdownJson || "",
    teacher_diagnostic_json: payload.teacherDiagnosticJson || "",
    recommendation_tags: payload.recommendationTags || "",
    lead_id: leadId,
  });

  const simplifiedLead = {
    timestamp: timestamp,
    full_name: payload.fullName || "",
    whatsapp: payload.whatsapp || "",
    telegram: payload.telegram || "",
    email: payload.email || "",
    interested_track: payload.interestedTrack || payload.recommendedTrack || "",
    offer_type: "placement-test",
    short_goal_result_summary: summary,
    source_page: payload.sourcePage || "",
    locale: payload.locale || "",
    lead_id: leadId,
  };

  appendRow_("All Leads", ALL_LEADS_COLUMNS, simplifiedLead);

  const trackTab = TRACK_LEAD_TABS[payload.recommendedTrack];
  if (trackTab) {
    appendRow_(trackTab, ALL_LEADS_COLUMNS, simplifiedLead);
  }

  return leadId;
}

function tenseLeadSummary_(payload) {
  const goal = payload.goal ? " Goal: " + payload.goal : "";
  return [
    "Tense mastery: " + payload.masteryLabel,
    "Overall tense score: " + payload.overallTenseScore,
    "Weaknesses: " + payload.topTenseWeaknessesJson,
    "Recommended track: " + payload.recommendedTrack,
    goal,
  ].join(". ");
}

function appendTenseLeadRows_(payload) {
  const leadId = Utilities.getUuid();
  const timestamp = payload.timestamp || new Date().toISOString();
  const summary = tenseLeadSummary_(payload);

  appendRow_("Tense Test Results", TENSE_TEST_COLUMNS, {
    timestamp: timestamp,
    test_session_id: payload.testSessionId || "",
    full_name: payload.fullName || "",
    age: payload.age || "",
    nationality: payload.nationality || "",
    whatsapp: payload.whatsapp || "",
    telegram: payload.telegram || "",
    email: payload.email || "",
    preferred_language: payload.preferredLanguage || "",
    consent: payload.consent ? "yes" : "",
    locale: payload.locale || "",
    source_page: payload.sourcePage || "",
    referrer: payload.referrer || "",
    utm_source: payload.utmSource || "",
    utm_medium: payload.utmMedium || "",
    utm_campaign: payload.utmCampaign || "",
    mastery_label: payload.masteryLabel || "",
    confidence_label: payload.confidenceLabel || "",
    overall_tense_score: payload.overallTenseScore || "",
    present_score: payload.presentScore || "",
    past_score: payload.pastScore || "",
    perfect_score: payload.perfectScore || "",
    future_score: payload.futureScore || "",
    tense_contrast_score: payload.tenseContrastScore || "",
    narrative_sequencing_score: payload.narrativeSequencingScore || "",
    stative_dynamic_score: payload.stativeDynamicScore || "",
    professional_academic_score: payload.professionalAcademicScore || "",
    advanced_precision_score: payload.advancedPrecisionScore || "",
    strongest_area: payload.strongestArea || "",
    weakest_area: payload.weakestArea || "",
    weak_tense_areas_json: payload.weakTenseAreasJson || "",
    tense_contrasts_to_study_json: payload.tenseContrastsToStudyJson || "",
    recommended_first_lessons_json: payload.recommendedFirstLessonsJson || "",
    top_tense_weaknesses_json: payload.topTenseWeaknessesJson || "",
    recommended_track: payload.recommendedTrack || "",
    recommended_next_step: payload.recommendedNextStep || "",
    recommendation_summary: payload.recommendationSummary || "",
    completion_time_seconds: payload.completionTimeSeconds || "",
    completed_at: payload.completedAt || "",
    retake_count: payload.retakeCount || "",
    total_questions_answered: payload.totalQuestionsAnswered || "",
    correct_answers_count: payload.correctAnswersCount || "",
    question_ids_seen: payload.questionIdsSeen || "",
    answer_summary_json: payload.answerSummaryJson || "",
    area_breakdown_json: payload.areaBreakdownJson || "",
    teacher_diagnostic_json: payload.teacherDiagnosticJson || "",
    recommendation_tags: payload.recommendationTags || "",
    lead_id: leadId,
  });

  const simplifiedLead = {
    timestamp: timestamp,
    full_name: payload.fullName || "",
    whatsapp: payload.whatsapp || "",
    telegram: payload.telegram || "",
    email: payload.email || "",
    interested_track: payload.interestedTrack || payload.recommendedTrack || "",
    offer_type: "tense-test",
    short_goal_result_summary: summary,
    source_page: payload.sourcePage || "",
    locale: payload.locale || "",
    lead_id: leadId,
  };

  appendRow_("All Leads", ALL_LEADS_COLUMNS, simplifiedLead);

  const trackTab = TRACK_LEAD_TABS[payload.recommendedTrack];
  if (trackTab) {
    appendRow_(trackTab, ALL_LEADS_COLUMNS, simplifiedLead);
  }

  return leadId;
}

function sendContactNotification_(payload, leadId) {
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

function sendPlacementNotification_(payload, leadId) {
  const subject =
    "New placement test completed: " +
    (payload.fullName || "Student") +
    " - " +
    (payload.estimatedCefrLevel || "level pending");
  const body = [
    "A new placement test was completed.",
    "",
    "Lead ID: " + leadId,
    "Name: " + (payload.fullName || ""),
    "Age: " + (payload.age || ""),
    "Nationality: " + (payload.nationality || ""),
    "WhatsApp: " + (payload.whatsapp || ""),
    "Telegram: " + (payload.telegram || ""),
    "Email: " + (payload.email || ""),
    "",
    "Estimated CEFR level: " + (payload.estimatedCefrLevel || ""),
    "Confidence label: " + (payload.confidenceLabel || ""),
    "Grammar level: " + (payload.grammarLevelEstimate || ""),
    "Vocabulary level: " + (payload.vocabularyLevelEstimate || ""),
    "Vocabulary score: " + (payload.vocabularyScore || ""),
    "Grammar score: " + (payload.grammarScore || ""),
    "Strongest area: " + (payload.strongestArea || ""),
    "Weakest area: " + (payload.weakestArea || ""),
    "Top grammar gaps: " + (payload.topGrammarGapsJson || ""),
    "Top vocabulary gaps: " + (payload.topVocabularyGapsJson || ""),
    "Recommended track: " + (payload.recommendedTrack || ""),
    "Recommended next step: " + (payload.recommendedNextStep || ""),
    "Recommended first 3 lessons: " + (payload.recommendedFirstLessonsJson || ""),
    "Source page: " + (payload.sourcePage || ""),
  ].join("\n");

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
}

function sendTenseNotification_(payload, leadId) {
  const subject =
    "New tense mastery test completed: " +
    (payload.fullName || "Student") +
    " - " +
    (payload.masteryLabel || "result pending");
  const body = [
    "A new English Tense Mastery Test was completed.",
    "",
    "Lead ID: " + leadId,
    "Name: " + (payload.fullName || ""),
    "Age: " + (payload.age || ""),
    "Nationality: " + (payload.nationality || ""),
    "WhatsApp: " + (payload.whatsapp || ""),
    "Telegram: " + (payload.telegram || ""),
    "Email: " + (payload.email || ""),
    "",
    "Mastery label: " + (payload.masteryLabel || ""),
    "Confidence: " + (payload.confidenceLabel || ""),
    "Overall tense score: " + (payload.overallTenseScore || ""),
    "Present score: " + (payload.presentScore || ""),
    "Past score: " + (payload.pastScore || ""),
    "Perfect score: " + (payload.perfectScore || ""),
    "Future score: " + (payload.futureScore || ""),
    "Tense contrast score: " + (payload.tenseContrastScore || ""),
    "Narrative sequencing score: " + (payload.narrativeSequencingScore || ""),
    "Strongest area: " + (payload.strongestArea || ""),
    "Weakest area: " + (payload.weakestArea || ""),
    "Top tense weaknesses: " + (payload.topTenseWeaknessesJson || ""),
    "Recommended track: " + (payload.recommendedTrack || ""),
    "Recommended next step: " + (payload.recommendedNextStep || ""),
    "Recommended first 3 lessons: " + (payload.recommendedFirstLessonsJson || ""),
    "Source page: " + (payload.sourcePage || ""),
  ].join("\n");

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
}

function handlePlacementSubmission_(payload) {
  validatePlacementPayload_(payload);
  const leadId = appendPlacementLeadRows_(payload);
  sendPlacementNotification_(payload, leadId);
  return leadId;
}

function handleTenseSubmission_(payload) {
  validateTensePayload_(payload);
  const leadId = appendTenseLeadRows_(payload);
  sendTenseNotification_(payload, leadId);
  return leadId;
}

function handleContactSubmission_(payload) {
  validateContactPayload_(payload);
  const leadId = appendContactLead_(payload);
  sendContactNotification_(payload, leadId);
  return leadId;
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");

    verifySecret_(payload);

    let leadId;
    if (payload.submissionType === "tense-test") {
      leadId = handleTenseSubmission_(payload);
    } else if (payload.submissionType === "placement-test") {
      leadId = handlePlacementSubmission_(payload);
    } else {
      leadId = handleContactSubmission_(payload);
    }

    return jsonResponse({ ok: true, leadId: leadId }, 200);
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error.message || error) }, 400);
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: "Faris lead capture" }, 200);
}
