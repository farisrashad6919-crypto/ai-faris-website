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
    caption: "A real one-to-one professional English session with a clean Zoom-style meeting frame.",
    privacyNote:
      "Students remain visible with consent; the meeting chrome is edited for a cleaner public presentation.",
  },
  {
    id: "teacher-training-gallery",
    trackIds: ["teacher-training"],
    src: "/images/landing/classes/class-esl-teacher-training-01.JPG",
    alt: "ESL teacher training group screenshot",
    caption: "A teacher development group session with participants visible.",
    privacyNote:
      "Students and teachers remain visible with consent; the image is used as real class proof.",
  },
  {
    id: "teacher-training-cohort",
    trackIds: ["teacher-training"],
    src: "/images/landing/classes/class-esl-teacher-training-02.JPG",
    alt: "Teacher training cohort screenshot",
    caption: "Live teacher training proof from an online cohort session.",
    privacyNote:
      "Participants remain visible with consent; the screenshot is selected for a credible public proof section.",
  },
  {
    id: "general-speaking-class",
    trackIds: ["general"],
    src: "/images/landing/classes/class-general-english-adults-teens-02.png",
    alt: "General English video lesson screenshot",
    caption: "Real General English speaking practice with the student visible.",
    privacyNote:
      "Students remain visible with consent; this is the main General English class image.",
  },
  {
    id: "ielts-speaking-class",
    trackIds: ["ielts"],
    src: "/images/landing/classes/class-ielts-test-prep-01-zoom.png",
    alt: "IELTS preparation session screenshot with Zoom-style meeting interface",
    caption: "IELTS speaking preparation proof with a clean Zoom-style meeting frame.",
    privacyNote:
      "Students remain visible with consent; the public derivative replaces the original interface styling.",
  },
  {
    id: "ielts-shared-screen",
    trackIds: ["ielts"],
    src: "/images/landing/classes/class-ielts-test-prep-02.png",
    alt: "IELTS test prep shared screen screenshot",
    caption: "An IELTS preparation screen-share session with the class context visible.",
    privacyNote:
      "Students remain visible with consent; the screenshot supports IELTS lesson proof.",
  },
];

export function getMediaForTrack(trackId: ProofMediaItem["trackIds"][number]) {
  return proofMedia.filter((item) => item.trackIds.includes(trackId));
}
