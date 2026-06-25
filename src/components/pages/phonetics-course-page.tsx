import Image from "next/image";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Headphones,
  ListChecks,
  Mic,
  Route,
  Sparkles,
  Waves,
} from "lucide-react";

import { AudioButton } from "@/components/phonetics/audio-button";
import { CopyPracticeButton, PrintCourseButton } from "@/components/phonetics/course-tools";
import { PracticeChecklist } from "@/components/phonetics/practice-checklist";
import { SoundChart } from "@/components/phonetics/sound-chart";
import { FaqList } from "@/components/sections/faq-list";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { StructuredData } from "@/components/ui/structured-data";
import { getBookingHref, siteConfig } from "@/config/site";
import {
  consonantLessons,
  courseBenefits,
  courseModules,
  coursePath,
  faqItems,
  phoneticsNavItems,
  practiceChecklistItems,
  soundLessons,
  studyPath,
  vowelLessons,
  type CourseModule,
  type MinimalPair,
  type SoundLesson,
  type SoundWord,
} from "@/content/phonetics-course";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const benefitIcons = [
  Headphones,
  Mic,
  Brain,
  Waves,
  Route,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
];

const moduleVisuals = [
  { label: "IPA", value: "/θ/ /ð/ /ɝ/", note: "symbols become study tools" },
  { label: "Stress", value: "DA da da DA", note: "strong beats guide rhythm" },
  { label: "Linking", value: "turn off -> tur-noff", note: "words connect naturally" },
];

function getWordSpeechText(word: SoundWord) {
  return `Listen and repeat. ${word.text}. ${word.text}.`;
}

function getPairSpeechText(pair: MinimalPair) {
  return `Listen and compare. First: ${pair.left}. Now: ${pair.right}. Repeat: ${pair.left}. ${pair.right}.`;
}

function getSentenceSpeechText(sentence: string) {
  return `Listen and repeat the sentence. ${sentence}`;
}

function getSoundSpeechText(sound: SoundLesson) {
  const words = sound.words
    .slice(0, 4)
    .map((word) => word.text)
    .join(". ");

  return `Listen and repeat. ${sound.example.text}. ${sound.example.text}. Now practice: ${words}. Sentence: ${sound.sentences[0]}`;
}

function getModuleExampleSpeechText(text: string) {
  return `Listen and repeat. ${text}`;
}

function courseUrl(locale: Locale) {
  return new URL(`/${locale}${coursePath}`, siteConfig.siteUrl).toString();
}

function getCourseStructuredData(locale: Locale) {
  const url = courseUrl(locale);
  const description =
    "Study American English phonetics for free with a complete self-study course covering IPA, consonants, vowels, syllables, stress, rhythm, intonation, connected speech, silent letters, -s endings, and -ed endings.";

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: "Free American English Phonetics Course for ESL Learners",
      description,
      url,
      isAccessibleForFree: true,
      inLanguage: "en-US",
      mainEntity: {
        "@id": `${url}#course`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "@id": `${url}#course`,
      name: "Free American English Phonetics Course for ESL Learners",
      description,
      url,
      isAccessibleForFree: true,
      inLanguage: "en-US",
      provider: {
        "@type": "Person",
        name: siteConfig.brandName,
        url: new URL(`/${locale}`, siteConfig.siteUrl).toString(),
      },
      educationalLevel: "Beginner to intermediate ESL learners",
      teaches: [
        "American English consonant sounds",
        "American English vowel sounds",
        "IPA symbols",
        "Syllables",
        "Word stress",
        "Sentence stress",
        "Rhythm",
        "Intonation",
        "Connected speech",
        "Silent letters",
        "-s endings",
        "-ed endings",
      ],
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online self-paced",
        courseWorkload: "Self-study at your own pace",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
}

function CourseNav({ className }: { className?: string }) {
  return (
    <nav aria-label="Course modules" className={className}>
      <ol className="grid gap-1.5">
        {phoneticsNavItems.map((item, index) => (
          <li key={item.id}>
            <a
              className="group grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-2 rounded-sm px-2 py-2 text-sm font-semibold text-primary/78 hover:bg-accent-pale-blue/56 hover:text-primary"
              href={`#${item.id}`}
            >
              <span className="flex size-7 items-center justify-center rounded-sm border border-accent-blue/20 bg-white/70 text-[0.7rem] text-secondary group-hover:text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function NextModuleLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <div className="mt-8">
      <a className="button-tertiary" href={href}>
        Next: {label}
        <ArrowDown aria-hidden="true" className="size-4" />
      </a>
    </div>
  );
}

function WordList({ words }: { words: SoundWord[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {words.map((word) => (
        <div
          className="flex items-center justify-between gap-3 rounded-sm border border-outline-variant/38 bg-white/75 p-3"
          key={`${word.text}-${word.ipa}`}
        >
          <div>
            <p className="font-semibold text-primary">{word.text}</p>
            <p className="text-sm text-secondary">{word.ipa}</p>
          </div>
          <AudioButton
            compact
            label={word.text}
            speechText={getWordSpeechText(word)}
            text={word.text}
          />
        </div>
      ))}
    </div>
  );
}

function MinimalPairs({ pairs }: { pairs: MinimalPair[] }) {
  return (
    <div className="grid gap-2">
      {pairs.map((pair) => (
        <div
          className="grid gap-3 rounded-sm border border-outline-variant/38 bg-white/75 p-3 sm:grid-cols-[minmax(0,1fr)_auto]"
          key={`${pair.left}-${pair.right}`}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="font-semibold text-primary">{pair.left}</p>
              <p className="text-sm text-secondary">{pair.leftIpa}</p>
            </div>
            <div>
              <p className="font-semibold text-primary">{pair.right}</p>
              <p className="text-sm text-secondary">{pair.rightIpa}</p>
            </div>
          </div>
          <AudioButton
            compact
            label={`${pair.left} and ${pair.right}`}
            speechText={getPairSpeechText(pair)}
            text={`${pair.left}. ${pair.right}. ${pair.left}. ${pair.right}.`}
          />
        </div>
      ))}
    </div>
  );
}

function LessonDetail({
  title,
  children,
  open = false,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="rounded-md border border-outline-variant/40 bg-surface-container-lowest/76 p-4" open={open}>
      <summary className="flex items-center justify-between gap-4 text-start font-display text-xl text-primary">
        <span>{title}</span>
        <ArrowDown aria-hidden="true" className="size-4 shrink-0 text-secondary" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function SoundLessonCard({ sound }: { sound: SoundLesson }) {
  const practiceText = [
    sound.title,
    ...sound.words.map((word) => `${word.text} ${word.ipa}`),
    ...sound.minimalPairs.map((pair) => `${pair.left} ${pair.leftIpa} - ${pair.right} ${pair.rightIpa}`),
    ...sound.sentences,
  ].join("\n");

  return (
    <article
      className="paper-panel rounded-md p-5 scroll-mt-28"
      id={`sound-${sound.id}`}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "rounded-sm px-3 py-1 text-sm font-bold",
                sound.group === "consonants"
                  ? "bg-accent-pale-blue text-accent-navy"
                  : "bg-accent-pale-red text-tertiary",
              )}
            >
              {sound.ipa}
            </span>
            <span className="rounded-sm border border-outline-variant/52 bg-white/70 px-3 py-1 text-sm font-semibold text-secondary">
              {sound.soundType}
            </span>
          </div>
          <h3 className="mt-4 text-3xl">{sound.title}</h3>
          <p className="muted-copy mt-3 max-w-2xl text-base leading-7">
            {sound.hint}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <AudioButton
              label={sound.example.text}
              speechText={getSoundSpeechText(sound)}
              text={sound.audioText}
            />
            <CopyPracticeButton className="shadow-none" text={practiceText} />
          </div>
        </div>

        <PracticeChecklist
          className="self-start"
          items={practiceChecklistItems}
          storageId={`sound-${sound.id}`}
        />
      </div>

      <div className="mt-6 grid gap-3">
        <LessonDetail open title="Learn">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_16rem]">
            <p className="muted-copy text-base leading-7">
              {sound.mouthPosition}
            </p>
            <div className="rounded-md bg-accent-mist p-4">
              <p className="text-xs font-bold uppercase text-secondary">
                Common spellings
              </p>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-primary">
                {sound.spellings.map((spelling) => (
                  <li key={spelling}>{spelling}</li>
                ))}
              </ul>
            </div>
          </div>
        </LessonDetail>

        <LessonDetail title="Words">
          <WordList words={sound.words} />
        </LessonDetail>

        <LessonDetail title="Minimal Pairs">
          <MinimalPairs pairs={sound.minimalPairs} />
        </LessonDetail>

        <LessonDetail title="Sentences">
          <div className="grid gap-2">
            {sound.sentences.map((sentence) => (
              <div
                className="flex items-center justify-between gap-3 rounded-sm border border-outline-variant/38 bg-white/75 p-3"
                key={sentence}
              >
                <p className="text-base leading-7 text-primary">{sentence}</p>
                <AudioButton
                  compact
                  label={sentence}
                  speechText={getSentenceSpeechText(sentence)}
                  text={sentence}
                />
              </div>
            ))}
          </div>
        </LessonDetail>

        <LessonDetail title="Mistakes">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md bg-accent-pale-red/55 p-4">
              <p className="text-xs font-bold uppercase text-tertiary">
                Common mistake
              </p>
              <p className="mt-2 text-sm leading-6 text-primary">
                {sound.commonMistake}
              </p>
            </div>
            <div className="rounded-md bg-accent-pale-blue/70 p-4">
              <p className="text-xs font-bold uppercase text-accent-navy">
                Correction tip
              </p>
              <p className="mt-2 text-sm leading-6 text-primary">
                {sound.correctionTip}
              </p>
            </div>
          </div>
        </LessonDetail>

        <LessonDetail title="Practice">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-display text-xl text-primary">Practice drill</h4>
              <p className="muted-copy mt-2 text-base leading-7">
                {sound.practiceDrill}
              </p>
            </div>
            <div>
              <h4 className="font-display text-xl text-primary">Homework</h4>
              <p className="muted-copy mt-2 text-base leading-7">
                {sound.homework}
              </p>
            </div>
          </div>
        </LessonDetail>
      </div>
    </article>
  );
}

function ModuleSection({
  module,
  next,
}: {
  module: CourseModule;
  next?: { href: string; label: string };
}) {
  const practiceText = [
    module.title,
    ...module.examples.map((example) => `${example.label}: ${example.text}`),
    ...module.practice,
  ].join("\n");

  return (
    <section className="scroll-mt-28" id={module.id}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{module.eyebrow}</p>
          <h2 className="mt-3 text-4xl md:text-5xl">
            {module.number}. {module.title}
          </h2>
          <p className="muted-copy mt-4 max-w-3xl text-base leading-7 md:text-lg">
            {module.description}
          </p>
        </div>
        <CopyPracticeButton text={practiceText} />
      </div>

      <div className="grid gap-4">
        <div className="paper-panel rounded-md p-5">
          <h3 className="text-2xl">Learn</h3>
          <ul className="mt-4 grid gap-3 text-base leading-7 text-secondary">
            {module.learn.map((item) => (
              <li className="flex gap-3" key={item}>
                <BadgeCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-on-tertiary-container" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {module.examples.map((example) => (
            <article className="paper-panel motion-card rounded-md p-5" key={example.label}>
              <p className="eyebrow">{example.label}</p>
              <p className="mt-3 text-lg font-semibold leading-7 text-primary">
                {example.text}
              </p>
              {example.note ? (
                <p className="muted-copy mt-3 text-sm leading-6">{example.note}</p>
              ) : null}
              <div className="mt-4">
                <AudioButton
                  compact
                  label={example.label}
                  speechText={getModuleExampleSpeechText(example.text)}
                  text={example.text.replace(/->/g, " to ")}
                />
              </div>
            </article>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="paper-panel rounded-md p-5">
            <h3 className="text-2xl">Practice</h3>
            <ol className="mt-4 grid gap-3 text-base leading-7 text-secondary">
              {module.practice.map((item, index) => (
                <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3" key={item}>
                  <span className="flex size-8 items-center justify-center rounded-sm bg-accent-pale-blue text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
          <PracticeChecklist
            items={[
              "I studied the examples.",
              "I practiced the module aloud.",
              "I recorded myself.",
              "I checked the answer key.",
              "I chose one next practice target.",
            ]}
            storageId={`module-${module.id}`}
            title="Module checklist"
          />
        </div>

        <details className="paper-panel rounded-md p-5">
          <summary className="flex items-center justify-between gap-4 text-start">
            <span className="font-display text-2xl text-primary">Mini quiz and answer key</span>
            <ArrowDown aria-hidden="true" className="size-4 text-secondary" />
          </summary>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {module.quiz.map((item, index) => (
              <div className="rounded-md bg-white/72 p-4" key={item.question}>
                <p className="text-xs font-bold uppercase text-secondary">
                  Question {index + 1}
                </p>
                <p className="mt-2 font-semibold text-primary">{item.question}</p>
                <p className="muted-copy mt-3 text-sm leading-6">
                  <span className="font-semibold text-primary">Answer:</span> {item.answer}
                </p>
              </div>
            ))}
          </div>
        </details>
      </div>

      {next ? <NextModuleLink href={next.href} label={next.label} /> : null}
    </section>
  );
}

export function PhoneticsCoursePage({ locale }: { locale: Locale }) {
  const pageUrl = courseUrl(locale);
  const allPracticeWords = soundLessons
    .flatMap((sound) => sound.words.map((word) => `${word.text} ${word.ipa}`))
    .join("\n");

  return (
    <>
      <StructuredData data={getCourseStructuredData(locale)} />

      <section
        className="relative min-h-[78svh] overflow-hidden bg-primary py-24 text-surface-container-lowest md:py-28"
        id="course-top"
      >
        <Image
          alt="Faris Rashad teaching American English pronunciation with speech sound graphics"
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src="/images/video-thumb-pronunciation-01.jpg"
          style={{ objectPosition: "60% center" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,27,63,0.92),rgba(10,27,63,0.72)_43%,rgba(10,27,63,0.22)_78%,rgba(10,27,63,0.48)),linear-gradient(180deg,rgba(10,27,63,0.22),rgba(10,27,63,0.78))]"
        />
        <div className="container-shell relative z-10">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-sm border border-white/18 bg-white/12 px-3 py-2 text-xs font-bold uppercase text-tertiary-fixed backdrop-blur-md">
              100% Free | No Login Required | Self-Study Friendly
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] text-surface-container-lowest sm:text-6xl md:text-7xl">
              Free American English Phonetics Course for ESL Learners
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-surface-container-lowest/84">
              A complete self-study pronunciation course covering American English sounds, IPA symbols, syllables, stress, rhythm, intonation, connected speech, and common ESL pronunciation problems.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-surface-container-lowest/76">
              Created by Faris Rashad for English learners who want clearer, more confident pronunciation.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="button-primary" href="#course-overview">
                <BookOpenCheck aria-hidden="true" className="size-4" />
                Start Learning Now
              </a>
              <a className="button-secondary border-white/20 bg-white/12 text-surface-container-lowest hover:bg-white/18" href="#course-modules">
                <ListChecks aria-hidden="true" className="size-4" />
                Explore Course Modules
              </a>
              <PrintCourseButton className="border-white/20 bg-white/12 text-surface-container-lowest hover:bg-white/18" />
            </div>
          </div>
        </div>
      </section>

      <SectionShell
        className="section-space-sm bg-surface-container-low/65"
        description="A practical, open course designed for independent study: listen, repeat, compare, record, and build clearer pronunciation one module at a time."
        eyebrow="What you will learn"
        title="A complete pronunciation path, organized for self-study"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {courseBenefits.map((benefit, index) => {
            const Icon = benefitIcons[index] ?? Sparkles;
            return (
              <article className="paper-panel motion-card rounded-md p-5" key={benefit}>
                <Icon aria-hidden="true" className="size-6 text-on-tertiary-container" />
                <p className="mt-4 text-base font-semibold leading-7 text-primary">
                  {benefit}
                </p>
              </article>
            );
          })}
        </div>
      </SectionShell>

      <section className="section-space" id="course-modules">
        <div className="container-shell">
          <div className="mb-6 lg:hidden">
            <details className="paper-panel rounded-md p-4">
              <summary className="flex items-center justify-between gap-4 text-start font-display text-xl text-primary">
                <span>Course navigation</span>
                <ArrowDown aria-hidden="true" className="size-4 text-secondary" />
              </summary>
              <CourseNav className="mt-4" />
            </details>
          </div>

          <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
            <aside className="sticky top-28 hidden max-h-[calc(100svh-8rem)] overflow-auto rounded-md border border-outline-variant/42 bg-white/76 p-3 shadow-float backdrop-blur lg:block">
              <p className="px-2 py-2 text-xs font-bold uppercase text-secondary">
                Course navigation
              </p>
              <CourseNav />
            </aside>

            <div className="grid gap-16">
              <section className="scroll-mt-28" id="course-overview">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
                  <div>
                    <p className="eyebrow">Course overview</p>
                    <h2 className="mt-3 text-4xl md:text-5xl">
                      Study American English pronunciation step by step
                    </h2>
                    <p className="muted-copy mt-4 max-w-3xl text-base leading-7 md:text-lg">
                      This course is for ESL learners from beginner to intermediate level who want clearer American English pronunciation, better listening, and a simple way to practice without a teacher or student account.
                    </p>
                  </div>
                  <div className="paper-panel rounded-md p-5">
                    <p className="eyebrow">Open access</p>
                    <ul className="mt-4 grid gap-3 text-sm leading-6 text-secondary">
                      <li>Free public URL: {pageUrl}</li>
                      <li>No login, registration, payment, or locked lessons.</li>
                      <li>Local checklists stay only on each learner device.</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
                  <div className="paper-panel rounded-md p-6">
                    <h3 className="text-2xl">How to study this course</h3>
                    <ol className="mt-5 grid gap-3">
                      {studyPath.map((item, index) => (
                        <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 text-base leading-7 text-secondary" key={item}>
                          <span className="flex size-9 items-center justify-center rounded-sm bg-accent-pale-blue text-sm font-bold text-primary">
                            {index + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="grid gap-4">
                    {moduleVisuals.map((item) => (
                      <article className="paper-panel motion-card rounded-md p-5" key={item.label}>
                        <p className="eyebrow">{item.label}</p>
                        <p className="mt-3 font-display text-3xl text-primary">
                          {item.value}
                        </p>
                        <p className="muted-copy mt-2 text-sm leading-6">
                          {item.note}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>

                <NextModuleLink href="#ipa-sound-chart" label="IPA and Sound Chart" />
              </section>

              <section className="scroll-mt-28" id="ipa-sound-chart">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow">IPA and sound chart</p>
                    <h2 className="mt-3 text-4xl md:text-5xl">
                      American English sounds at a glance
                    </h2>
                    <p className="muted-copy mt-4 max-w-3xl text-base leading-7 md:text-lg">
                      Search the chart, listen to a native-style model, review the mouth hint, then jump into the full lesson for that sound.
                    </p>
                  </div>
                  <CopyPracticeButton text={allPracticeWords} />
                </div>
                <SoundChart sounds={soundLessons} />
                <NextModuleLink href="#consonant-sounds" label="Consonant Sounds" />
              </section>

              <section className="scroll-mt-28" id="consonant-sounds">
                <div className="mb-6">
                  <p className="eyebrow">Consonant sounds</p>
                  <h2 className="mt-3 text-4xl md:text-5xl">
                    American English consonant lessons
                  </h2>
                  <p className="muted-copy mt-4 max-w-3xl text-base leading-7 md:text-lg">
                    Work through each consonant with mouth position, common spellings, minimal pairs, correction tips, and a self-study checklist.
                  </p>
                </div>
                <div className="grid gap-5">
                  {consonantLessons.map((sound) => (
                    <SoundLessonCard key={sound.id} sound={sound} />
                  ))}
                </div>
                <NextModuleLink href="#vowel-sounds" label="Vowel Sounds" />
              </section>

              <section className="scroll-mt-28" id="vowel-sounds">
                <div className="mb-6">
                  <p className="eyebrow">Vowel sounds</p>
                  <h2 className="mt-3 text-4xl md:text-5xl">
                    American English vowel lessons
                  </h2>
                  <p className="muted-copy mt-4 max-w-3xl text-base leading-7 md:text-lg">
                    Study American English vowels and diphthongs with consistent IPA, example words, mouth-position notes, and focused practice.
                  </p>
                </div>
                <div className="grid gap-5">
                  {vowelLessons.map((sound) => (
                    <SoundLessonCard key={sound.id} sound={sound} />
                  ))}
                </div>
                <NextModuleLink href="#syllables" label="Syllables" />
              </section>

              {courseModules.map((module, index) => {
                const nextModule = courseModules[index + 1];
                const next =
                  nextModule
                    ? { href: `#${nextModule.id}`, label: nextModule.title }
                    : undefined;

                return (
                  <ModuleSection
                    key={module.id}
                    module={module}
                    next={next}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <SectionShell
        className="bg-surface-container-low/65"
        description="This free course helps you study independently. If you want personal feedback, correction, and a clear learning plan, you can study with Faris Rashad."
        eyebrow="Need personal feedback?"
        title="Want personal correction and a study plan?"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Pronunciation session", "Get targeted correction for your sound, stress, rhythm, and intonation patterns."],
              ["Study plan", "Know exactly what to practice next instead of guessing from random videos."],
              ["Speaking confidence", "Use clearer pronunciation in real conversations, IELTS speaking, work, and study."],
            ].map(([title, description]) => (
              <article className="paper-panel motion-card rounded-md p-5" key={title}>
                <h3 className="text-2xl">{title}</h3>
                <p className="muted-copy mt-3 text-sm leading-6">{description}</p>
              </article>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 lg:max-w-[16rem]">
            <ButtonLink href={getBookingHref(locale)}>
              Book a Pronunciation Session
            </ButtonLink>
            <ButtonLink href="/programs" variant="secondary">
              Explore English Courses
            </ButtonLink>
            <ButtonLink href="/contact" variant="tertiary">
              Contact Faris
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="FAQ"
        title="Questions about the free phonetics course"
      >
        <FaqList items={[...faqItems]} />
      </SectionShell>

      <section className="section-space pt-4">
        <div className="container-shell">
          <div className="rounded-lg bg-primary px-6 py-10 text-surface-container-lowest shadow-glow md:px-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="eyebrow text-tertiary-fixed">Final step</p>
                <h2 className="mt-4 max-w-3xl font-display text-4xl text-surface-container-lowest md:text-5xl">
                  Start with one sound today, then build the full system.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-surface-container-lowest/78">
                  The course stays free and open. For personal feedback, book a session or send Faris a message with your pronunciation goals.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a className="button-primary" href="#ipa-sound-chart">
                  <Headphones aria-hidden="true" className="size-4" />
                  Review the Sound Chart
                </a>
                <ButtonLink className="text-surface-container-lowest" href="/contact" variant="tertiary">
                  Contact Faris
                  <ArrowRight aria-hidden="true" className="size-4" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <a
        aria-label="Back to top"
        className="fixed bottom-5 right-5 z-40 inline-flex size-11 items-center justify-center rounded-sm border border-accent-blue/24 bg-white/86 text-primary shadow-float backdrop-blur hover:-translate-y-1 hover:border-accent-blue/48"
        href="#course-top"
      >
        <ArrowUp aria-hidden="true" className="size-5" />
      </a>
    </>
  );
}
