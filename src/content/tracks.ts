import { text } from "./locale-copy";
import type { TrackContent, TrackId, TrackSlug } from "./types";

export const trackSlugs: Record<TrackId, TrackSlug> = {
  ielts: "ielts-test-prep",
  business: "business-english",
  general: "general-english",
  "teacher-training": "esl-teacher-training",
};

export const tracks: TrackContent[] = [
  {
    id: "ielts",
    slug: "ielts-test-prep",
    title: text("IELTS Test Prep", {
      ar: "تحضير الآيلتس",
      tr: "IELTS Hazirligi",
      es: "Preparacion IELTS",
      it: "Preparazione IELTS",
      de: "IELTS Vorbereitung",
      fr: "Preparation IELTS",
      uk: "IELTS Test Prep",
    }),
    shortTitle: text("IELTS"),
    eyebrow: text("Focused and exam-ready"),
    description: text(
      "Structured IELTS preparation for candidates who need stronger speaking, writing, vocabulary, grammar control, and calm performance under pressure.",
      {
        ar: "تحضير منظم للآيلتس لمن يحتاج إلى تحدث وكتابة ومفردات وتحكم لغوي أقوى تحت ضغط الاختبار.",
        tr: "Baski altinda daha guclu speaking, writing, kelime, gramer ve sakin performans isteyen adaylar icin yapili IELTS hazirligi.",
        es: "Preparacion IELTS estructurada para mejorar speaking, writing, vocabulario, gramatica y rendimiento bajo presion.",
        it: "Preparazione IELTS strutturata per speaking, writing, vocabolario, grammatica e gestione della pressione.",
        de: "Strukturierte IELTS Vorbereitung fur Speaking, Writing, Wortschatz, Grammatik und ruhige Leistung unter Druck.",
        fr: "Preparation IELTS structuree pour renforcer l'oral, l'ecrit, le vocabulaire, la grammaire et la performance sous pression.",
        uk: "Structured IELTS preparation for stronger speaking, writing, vocabulary, grammar, and calm test performance.",
      },
    ),
    audience: [
      "IELTS candidates preparing for academic or migration goals",
      "University applicants and professionals who need a reliable band outcome",
      "Serious teenagers who are ready for structured exam training",
    ],
    painPoints: [
      "Low speaking confidence",
      "Weak writing structure",
      "Grammar mistakes under pressure",
      "Limited vocabulary range",
      "Fear of the test",
      "Lack of structured feedback",
    ],
    whyItMatters:
      "IELTS rewards clarity, control, timing, and consistency. A strong candidate needs more than practice questions; they need feedback that changes performance.",
    howIHelp: [
      "Diagnose current band blockers and build a practical preparation route",
      "Train speaking answers, idea development, fluency, grammar, and vocabulary range",
      "Give targeted correction and repeatable strategies for test-day pressure",
    ],
    curriculum: [
      "Speaking Part 1, 2, and 3 answer structure",
      "Writing Task 1 and Task 2 organization",
      "Band-aware vocabulary and grammar correction",
      "Mock speaking practice and readiness feedback",
      "Reading and listening strategy when useful",
    ],
    notFor: [
      "Learners who want shortcuts instead of practice",
      "Candidates who do not want feedback on mistakes",
      "People looking for a guaranteed score without consistent work",
    ],
    primaryCta: text("Book Your IELTS Trial on Preply"),
    secondaryCta: text("Join the Free IELTS Webinar"),
    tertiaryCta: text("Take the IELTS Readiness Test"),
    future: [
      { title: "IELTS Placement Tests", description: "Readiness diagnostics by skill.", type: "placement-test" },
      { title: "IELTS Mini Quizzes", description: "Fast practice for grammar, vocabulary, and strategy.", type: "quiz" },
      { title: "IELTS Videos", description: "Speaking and writing breakdowns.", type: "video" },
      { title: "IELTS Articles", description: "Practical study guidance and band strategy.", type: "article" },
      { title: "IELTS Writing Feedback", description: "Focused writing review and improvement support.", type: "tool" },
      { title: "IELTS Speaking Intensive", description: "Focused webinar and training options.", type: "webinar" },
    ],
    faq: [
      { question: "Can we focus mainly on speaking?", answer: "Yes. Speaking confidence, answer structure, and fluency can be the main focus when that is your biggest band blocker." },
      { question: "Do you help with writing?", answer: "Yes. Writing can be trained through structure, idea development, grammar correction, and task-specific feedback." },
      { question: "Is this suitable for serious teen candidates?", answer: "Yes, if the learner is ready for consistent practice and clear feedback." },
    ],
    ogImage: "/images/landing/og/og-ielts-test-prep.jpg",
    seo: {
      title: text("IELTS Test Prep with Faris Rashad | Speaking, Writing, Band Strategy"),
      description: text("Premium IELTS preparation with structured feedback for speaking, writing, vocabulary, grammar, and confident exam performance."),
      keywords: ["IELTS preparation", "IELTS speaking", "IELTS writing feedback", "IELTS tutor"],
    },
  },
  {
    id: "business",
    slug: "business-english",
    title: text("Business English for Working Professionals", {
      ar: "الإنجليزية المهنية للمحترفين",
      tr: "Calisan Profesyoneller icin Business English",
      es: "Ingles de negocios para profesionales",
      it: "Business English per professionisti",
      de: "Business English fur Berufstatige",
      fr: "Anglais professionnel pour actifs",
      uk: "Business English for Working Professionals",
    }),
    shortTitle: text("Business English"),
    eyebrow: text("Professional and refined"),
    description: text(
      "Professional English training for meetings, interviews, presentations, emails, workplace fluency, and clearer international communication.",
      {
        ar: "تدريب إنجليزي مهني للاجتماعات والمقابلات والعروض والبريد والتواصل الدولي الواضح.",
        tr: "Toplantilar, mulakatlar, sunumlar, e-postalar ve uluslararasi is iletisimi icin profesyonel Ingilizce.",
        es: "Ingles profesional para reuniones, entrevistas, presentaciones, correos y comunicacion internacional.",
        it: "Inglese professionale per riunioni, colloqui, presentazioni, email e comunicazione internazionale.",
        de: "Professionelles Englisch fur Meetings, Interviews, Prasentationen, E-Mails und internationale Kommunikation.",
        fr: "Anglais professionnel pour reunions, entretiens, presentations, emails et communication internationale.",
        uk: "Professional English for meetings, interviews, presentations, emails, and international communication.",
      },
    ),
    audience: [
      "Professionals in international teams",
      "Managers, job seekers, and employees who need more confident workplace English",
      "Learners preparing for interviews, meetings, presentations, or email communication",
    ],
    painPoints: [
      "Fear of speaking in meetings",
      "Weak interview confidence",
      "Unclear professional expression",
      "Email and presentation stress",
      "Limited workplace fluency",
      "Difficulty sounding natural and professional",
    ],
    whyItMatters:
      "Professional English affects credibility. The goal is not only correct English, but language that sounds calm, clear, and useful in real workplace moments.",
    howIHelp: [
      "Build practical workplace phrases and stronger sentence control",
      "Practice meetings, interviews, presentations, and high-stakes conversations",
      "Correct pronunciation, grammar, vocabulary, and tone with practical examples",
    ],
    curriculum: [
      "Meeting participation and follow-up language",
      "Interview answers and career storytelling",
      "Presentation structure and confident delivery",
      "Professional email and message clarity",
      "Workplace vocabulary and natural phrasing",
    ],
    notFor: [
      "Learners who only want casual conversation with no correction",
      "Professionals unwilling to practice realistic workplace situations",
      "People expecting polished communication without repeated rehearsal",
    ],
    primaryCta: text("Book a Business English Trial on Preply"),
    secondaryCta: text("Join the Free Business English Webinar"),
    tertiaryCta: text("Register Your Interest"),
    future: [
      { title: "Business Placement Tests", description: "Workplace communication diagnostics.", type: "placement-test" },
      { title: "Communication Quizzes", description: "Meeting, interview, and email practice.", type: "quiz" },
      { title: "Workplace English Videos", description: "Short lessons for real professional situations.", type: "video" },
      { title: "Interview Articles", description: "Guides for answer structure and language.", type: "article" },
      { title: "Meetings and Presentation Tools", description: "Templates and speaking frameworks.", type: "tool" },
      { title: "Corporate Packages", description: "Team and company training options.", type: "webinar" },
    ],
    faq: [
      { question: "Can lessons focus on my job?", answer: "Yes. The track can be adapted to your role, meetings, interviews, presentations, and daily communication needs." },
      { question: "Can we practice interviews?", answer: "Yes. Interview structure, examples, vocabulary, and delivery can be trained directly." },
      { question: "Will I receive correction?", answer: "Yes. Correction is targeted and practical so improvement becomes visible from week to week." },
    ],
    ogImage: "/images/landing/og/og-business-english.jpg",
    seo: {
      title: text("Business English for Working Professionals | Faris Rashad"),
      description: text("Premium Business English training for meetings, interviews, presentations, emails, and professional fluency."),
      keywords: ["Business English", "workplace English", "English for meetings", "interview English"],
    },
  },
  {
    id: "general",
    slug: "general-english",
    title: text("General English for Adults and Teenagers", {
      ar: "الإنجليزية العامة للبالغين والمراهقين",
      tr: "Yetiskinler ve Gencler icin Genel Ingilizce",
      es: "Ingles general para adultos y adolescentes",
      it: "Inglese generale per adulti e ragazzi",
      de: "Allgemeines Englisch fur Erwachsene und Jugendliche",
      fr: "Anglais general pour adultes et adolescents",
      uk: "General English for Adults and Teenagers",
    }),
    shortTitle: text("General English"),
    eyebrow: text("Warm and growth-oriented"),
    description: text(
      "Structured General English for learners who understand some English but want better speaking, grammar, vocabulary, pronunciation, and confidence.",
      {
        ar: "إنجليزية عامة منظمة لمن يفهمون بعض الإنجليزية ويريدون تحدثا وقواعد ومفردات ونطقا وثقة أفضل.",
        tr: "Biraz Ingilizce anlayip daha iyi konusma, gramer, kelime, telaffuz ve ozguven isteyenler icin yapili genel Ingilizce.",
        es: "Ingles general estructurado para mejorar speaking, gramatica, vocabulario, pronunciacion y confianza.",
        it: "Inglese generale strutturato per migliorare speaking, grammatica, vocabolario, pronuncia e sicurezza.",
        de: "Strukturiertes allgemeines Englisch fur besseres Sprechen, Grammatik, Wortschatz, Aussprache und Selbstvertrauen.",
        fr: "Anglais general structure pour ameliorer oral, grammaire, vocabulaire, prononciation et confiance.",
        uk: "Structured General English for better speaking, grammar, vocabulary, pronunciation, and confidence.",
      },
    ),
    audience: [
      "Adults improving everyday and practical English",
      "Teenagers who need stronger speaking, grammar, and confidence",
      "Learners who feel lessons have been random or not useful before",
    ],
    painPoints: [
      "Understanding English but struggling to speak",
      "Low confidence",
      "Weak fluency",
      "Grammar uncertainty",
      "Slow or inconsistent progress",
      "Lack of speaking practice",
    ],
    whyItMatters:
      "General English progress becomes faster when lessons are not random. Learners need a clear path, useful correction, and enough speaking repetition.",
    howIHelp: [
      "Turn passive knowledge into usable spoken English",
      "Connect grammar, vocabulary, pronunciation, and fluency to real communication",
      "Build confidence through guided speaking and practical feedback",
    ],
    curriculum: [
      "Speaking fluency and everyday conversation",
      "Grammar for real sentence control",
      "Vocabulary range and natural phrases",
      "Pronunciation and listening response",
      "Teen and adult confidence-building practice",
    ],
    notFor: [
      "Learners who want entertainment only",
      "Students who do not want to speak during lessons",
      "People who avoid feedback and repeated practice",
    ],
    primaryCta: text("Book a General English Trial on Preply"),
    secondaryCta: text("Join the Free English Webinar"),
    tertiaryCta: text("Take the General English Placement Test"),
    future: [
      { title: "Level Placement Tests", description: "Clear starting-level checks.", type: "placement-test" },
      { title: "Grammar Quizzes", description: "Fast practice by level and topic.", type: "quiz" },
      { title: "Speaking Videos", description: "Confidence and fluency lessons.", type: "video" },
      { title: "Study Articles", description: "Practical learning guidance.", type: "article" },
      { title: "Vocabulary and Pronunciation Tools", description: "Reusable practice aids.", type: "tool" },
      { title: "Free English Webinar", description: "Live training sessions for focused practice.", type: "webinar" },
    ],
    faq: [
      { question: "Is this suitable if I understand English but cannot speak?", answer: "Yes. That is one of the clearest use cases for this track." },
      { question: "Can teenagers join?", answer: "Yes. Serious teenagers can benefit from structure, confidence-building, and speaking practice." },
      { question: "Will lessons include grammar?", answer: "Yes, but grammar is connected to speaking and real use rather than isolated theory." },
    ],
    ogImage: "/images/landing/og/og-general-english.jpg",
    seo: {
      title: text("General English for Adults and Teenagers | Faris Rashad"),
      description: text("Warm, structured General English training for speaking, grammar, vocabulary, pronunciation, and confidence."),
      keywords: ["General English", "spoken English", "English for adults", "English for teenagers"],
    },
  },
  {
    id: "teacher-training",
    slug: "esl-teacher-training",
    title: text("ESL Teacher Training and Advanced English", {
      ar: "تدريب معلمي الإنجليزية والإنجليزية المتقدمة",
      tr: "ESL Ogretmen Egitimi ve Ileri Ingilizce",
      es: "Formacion docente ESL e ingles avanzado",
      it: "Formazione docenti ESL e inglese avanzato",
      de: "ESL Lehrertraining und fortgeschrittenes Englisch",
      fr: "Formation ESL et anglais avance",
      uk: "ESL Teacher Training and Advanced English",
    }),
    shortTitle: text("Teacher Training"),
    eyebrow: text("Expert and thoughtful"),
    description: text(
      "Practical teacher development and advanced English support for ESL teachers, future teachers, trainers, and advanced communicators.",
      {
        ar: "تطوير عملي للمعلمين ودعم للإنجليزية المتقدمة لمعلمي ESL والمدربين والمتواصلين المتقدمين.",
        tr: "ESL ogretmenleri, ogretmen adaylari, egitmenler ve ileri iletisim hedefleri olanlar icin pratik gelisim.",
        es: "Desarrollo practico para docentes ESL, futuros profesores, formadores y comunicadores avanzados.",
        it: "Sviluppo pratico per docenti ESL, futuri insegnanti, trainer e comunicatori avanzati.",
        de: "Praxisnahe Entwicklung fur ESL Lehrkrafte, angehende Lehrende, Trainer und fortgeschrittene Kommunikatoren.",
        fr: "Developpement pratique pour enseignants ESL, futurs enseignants, formateurs et communicateurs avances.",
        uk: "Practical teacher development and advanced English support for ESL teachers and advanced communicators.",
      },
    ),
    audience: [
      "ESL teachers and future teachers",
      "Advanced English learners who want more precise articulation",
      "Trainers and professionals with advanced communication goals",
    ],
    painPoints: [
      "Teaching without enough structure",
      "Limited classroom English confidence",
      "Weak feedback techniques",
      "Uncertainty about lesson design",
      "Difficulty explaining language clearly",
      "Advanced learners wanting more precision",
    ],
    whyItMatters:
      "Teaching quality improves when methodology, classroom language, feedback, and lesson design become practical habits rather than abstract theory.",
    howIHelp: [
      "Train lesson structure, classroom language, feedback, and activity design",
      "Connect grammar, vocabulary, and speaking instruction to real learner needs",
      "Support advanced English precision for teachers and high-level communicators",
    ],
    curriculum: [
      "Lesson planning and staging",
      "Speaking, vocabulary, grammar, reading, and listening techniques",
      "Feedback and correction methods",
      "Classroom management and Zoom teaching techniques",
      "Advanced English articulation and professional communication",
    ],
    notFor: [
      "Teachers who want certificates without practice",
      "Participants unwilling to reflect on teaching decisions",
      "Advanced learners who do not want precise correction",
    ],
    primaryCta: text("Apply for Teacher Training"),
    secondaryCta: text("Join the Free Teacher Development Webinar"),
    tertiaryCta: text("Register Interest in Advanced English Training"),
    future: [
      { title: "Teacher Training Webinars", description: "Live development sessions.", type: "webinar" },
      { title: "Methodology Quizzes", description: "Check understanding of teaching choices.", type: "quiz" },
      { title: "Lesson Planning Tools", description: "Frameworks and reusable templates.", type: "tool" },
      { title: "Reflection Templates", description: "Teacher development worksheets.", type: "tool" },
      { title: "Advanced English Modules", description: "Precision for high-level communicators.", type: "article" },
      { title: "Classroom English Resources", description: "Language banks for teaching moments.", type: "placement-test" },
    ],
    faq: [
      { question: "Is this only for current teachers?", answer: "No. It also fits future teachers, trainers, and advanced learners who want more precise communication." },
      { question: "Does the training include practical classroom techniques?", answer: "Yes. The track is designed around practical methodology, feedback, classroom language, and lesson design." },
      { question: "Can this focus on advanced English instead of methodology?", answer: "Yes. You can choose advanced English training as your main focus." },
    ],
    ogImage: "/images/landing/og/og-esl-teacher-training.jpg",
    seo: {
      title: text("ESL Teacher Training and Advanced English | Faris Rashad"),
      description: text("Practical ESL teacher training and advanced English development for teachers, trainers, and high-level communicators."),
      keywords: ["ESL teacher training", "advanced English", "teacher development", "English teaching methodology"],
    },
  },
];

export function getTrackBySlug(slug: string) {
  return tracks.find((track) => track.slug === slug);
}

export function getTrackById(id: TrackId) {
  return tracks.find((track) => track.id === id);
}
