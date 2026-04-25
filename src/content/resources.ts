import type { ResourceType, TrackId } from "./types";

export type ResourceEntry = {
  id: string;
  title: string;
  description: string;
  trackIds: TrackId[];
  type: ResourceType;
  status: "planned" | "available";
};

export const resourceEntries: ResourceEntry[] = [
  {
    id: "ielts-readiness-test",
    title: "IELTS Readiness Test",
    description: "A future diagnostic for IELTS speaking, writing, vocabulary, and study readiness.",
    trackIds: ["ielts"],
    type: "placement-test",
    status: "planned",
  },
  {
    id: "business-meeting-phrases",
    title: "Meetings and Presentation Tool",
    description: "A future workplace English tool for meeting language, presentation structure, and follow-up phrases.",
    trackIds: ["business"],
    type: "tool",
    status: "planned",
  },
  {
    id: "general-grammar-quiz",
    title: "Grammar Confidence Quiz",
    description: "A future quiz for learners who need clearer grammar while speaking.",
    trackIds: ["general"],
    type: "quiz",
    status: "planned",
  },
  {
    id: "speaking-confidence-video",
    title: "Speaking Confidence Video",
    description: "A future video lesson on speaking with less hesitation and more control.",
    trackIds: ["general", "business"],
    type: "video",
    status: "planned",
  },
  {
    id: "ielts-speaking-article",
    title: "IELTS Speaking Answer Structure",
    description: "A future article explaining how to organize answers without sounding memorized.",
    trackIds: ["ielts"],
    type: "article",
    status: "planned",
  },
  {
    id: "teacher-reflection-template",
    title: "Teacher Reflection Template",
    description: "A future downloadable tool for teachers reviewing lessons and feedback choices.",
    trackIds: ["teacher-training"],
    type: "tool",
    status: "planned",
  },
  {
    id: "teacher-development-webinar",
    title: "Teacher Development Webinar",
    description: "A future live webinar for ESL teachers who want practical methodology.",
    trackIds: ["teacher-training"],
    type: "webinar",
    status: "planned",
  },
  {
    id: "business-free-webinar",
    title: "Free Business English Webinar",
    description: "A future webinar for professionals who want clearer meetings and interviews.",
    trackIds: ["business"],
    type: "webinar",
    status: "planned",
  },
];

export const contentTypes: ResourceType[] = [
  "article",
  "video",
  "quiz",
  "placement-test",
  "tool",
  "webinar",
];
