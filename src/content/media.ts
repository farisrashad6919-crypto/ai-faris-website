import type { ProofMediaItem } from "./types";

export const portraitAssets = {
  hero: "/images/landing/portraits/hero-faris-main.jpg",
  officeHeadset: "/images/landing/portraits/portrait-faris-01.png",
  formalHeadshot: "/images/landing/portraits/portrait-faris-02.png",
  wideWorkspace: "/images/landing/portraits/portrait-faris-03.png",
  deskPortrait: "/images/landing/portraits/portrait-faris-04.png",
  teachingHoodie: "/images/landing/portraits/portrait-faris-05.JPG",
  teacherTrainer: "/images/landing/portraits/portrait-faris-07.jpg",
  profileClassic: "/images/landing/portraits/portrait-faris-06.JPG",
} as const;

export const proofMedia: ProofMediaItem[] = [
  {
    id: "business-class",
    trackIds: ["business"],
    src: "/images/landing/classes/class-business-english-01-zoom.png",
    alt: "Business English online class screenshot with Zoom-style meeting interface",
    caption: "Business English lesson",
  },
  {
    id: "teacher-training-gallery",
    trackIds: ["teacher-training"],
    src: "/images/landing/classes/class-esl-teacher-training-01.JPG",
    alt: "ESL teacher training group screenshot",
    caption: "Teacher training workshop",
  },
  {
    id: "teacher-training-cohort",
    trackIds: ["teacher-training"],
    src: "/images/landing/classes/class-esl-teacher-training-02.JPG",
    alt: "Teacher training cohort screenshot",
    caption: "Live class moment",
  },
  {
    id: "general-speaking-class",
    trackIds: ["general"],
    src: "/images/landing/classes/class-general-english-adults-teens-02.png",
    alt: "General English video lesson screenshot",
    caption: "General English class",
  },
  {
    id: "ielts-speaking-class",
    trackIds: ["ielts"],
    src: "/images/landing/classes/class-ielts-test-prep-01-zoom.png",
    alt: "IELTS preparation session screenshot with Zoom-style meeting interface",
    caption: "IELTS speaking session",
  },
  {
    id: "ielts-shared-screen",
    trackIds: ["ielts"],
    src: "/images/landing/classes/class-ielts-test-prep-02.png",
    alt: "IELTS test prep shared screen screenshot",
    caption: "IELTS speaking session",
  },
];

export function getMediaForTrack(trackId: ProofMediaItem["trackIds"][number]) {
  return proofMedia.filter((item) => item.trackIds.includes(trackId));
}
