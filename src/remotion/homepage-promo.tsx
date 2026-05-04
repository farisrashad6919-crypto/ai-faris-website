import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const HOMEPAGE_PROMO_FPS = 30;
export const HOMEPAGE_PROMO_WIDTH = 1920;
export const HOMEPAGE_PROMO_HEIGHT = 1080;
export const HOMEPAGE_PROMO_DURATION = HOMEPAGE_PROMO_FPS * 12;

const OPENING_DURATION = 120;
const TRACKS_DURATION = 140;
const PROOF_DURATION = 145;

const colors = {
  surface: "#fbf9f5",
  paper: "#ffffff",
  paperSoft: "#f5f3ef",
  ink: "#151515",
  muted: "#4f6073",
  gold: "#a98c69",
  goldSoft: "#ffddb6",
  blue: "#516f8f",
  green: "#4f7f6c",
};

const heroImage = "images/landing/portraits/hero-faris-main.jpg";
const classImages = [
  "images/landing/classes/class-ielts-test-prep-01-zoom.png",
  "images/landing/classes/class-business-english-01-zoom.png",
  "images/landing/classes/class-general-english-adults-teens-02.png",
  "images/landing/classes/class-esl-teacher-training-01.JPG",
];

const tracks = [
  ["IELTS", "Speaking, writing, band strategy"],
  ["Business English", "Meetings, interviews, presentations"],
  ["General English", "Fluency, grammar, confidence"],
  ["Teacher Training", "Methodology, feedback, classroom English"],
] as const;

const reviews = [
  ["Band 7", "IELTS result"],
  ["60+", "Countries worldwide"],
  ["2018", "Teaching since"],
] as const;

function seconds(value: number, fps: number) {
  return Math.round(value * fps);
}

function easedProgress(frame: number, start: number, duration: number) {
  return interpolate(frame, [start, start + duration], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function sceneOpacity(frame: number, duration: number, fps: number) {
  const enter = interpolate(frame, [0, seconds(0.55, fps)], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(
    frame,
    [duration - seconds(0.75, fps), duration],
    [1, 0],
    {
      easing: Easing.in(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return Math.min(enter, exit);
}

function FadeSlide({
  children,
  delay = 0,
  distance = 40,
  direction = "up",
  style,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  direction?: "up" | "left" | "right";
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = easedProgress(frame, seconds(delay, fps), seconds(0.72, fps));
  const x =
    direction === "left"
      ? interpolate(progress, [0, 1], [distance, 0])
      : direction === "right"
        ? interpolate(progress, [0, 1], [-distance, 0])
        : 0;
  const y = direction === "up" ? interpolate(progress, [0, 1], [distance, 0]) : 0;

  return (
    <div
      style={{
        opacity: progress,
        transform: `translate3d(${x}px, ${y}px, 0)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Background() {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 10% 8%, rgba(255, 221, 182, 0.72), transparent 30%), radial-gradient(circle at 86% 12%, rgba(81, 111, 143, 0.24), transparent 32%), linear-gradient(135deg, #ffffff 0%, #f5f3ef 44%, #eef3f1 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 56,
          border: "1px solid rgba(21, 21, 21, 0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 84,
          right: 84,
          top: 186,
          height: 1,
          background: "rgba(21, 21, 21, 0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 82,
          left: 94,
          width: 420,
          height: 4,
          background: `linear-gradient(90deg, ${colors.gold}, ${colors.blue}, ${colors.green})`,
        }}
      />
    </AbsoluteFill>
  );
}

function Pill({ children, tone = colors.gold }: { children: ReactNode; tone?: string }) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.72)",
        border: "1px solid rgba(21, 21, 21, 0.1)",
        color: tone,
        display: "inline-flex",
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: 3.5,
        padding: "18px 24px",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function OpeningScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = sceneOpacity(frame, OPENING_DURATION, fps);
  const imageProgress = easedProgress(frame, seconds(0.35, fps), seconds(1.1, fps));

  return (
    <AbsoluteFill style={{ opacity }}>
      <Background />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 760px",
          gap: 80,
          height: "100%",
          padding: "150px 118px 116px",
          position: "relative",
        }}
      >
        <div style={{ paddingTop: 34 }}>
          <FadeSlide>
            <Pill>Faris Rashad English Trainer</Pill>
          </FadeSlide>
          <FadeSlide delay={0.18}>
            <h1
              style={{
                color: colors.ink,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 98,
                fontWeight: 700,
                letterSpacing: 0,
                lineHeight: 0.98,
                margin: "42px 0 0",
                maxWidth: 860,
              }}
            >
              Structured English training for serious progress.
            </h1>
          </FadeSlide>
          <FadeSlide delay={0.42}>
            <p
              style={{
                color: colors.muted,
                fontSize: 34,
                lineHeight: 1.35,
                margin: "36px 0 0",
                maxWidth: 840,
              }}
            >
              IELTS, Business English, General English, and teacher development with practical feedback.
            </p>
          </FadeSlide>
          <div style={{ display: "flex", gap: 20, marginTop: 54 }}>
            {reviews.map(([value, label], index) => (
              <FadeSlide delay={0.7 + index * 0.12} key={value}>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.82)",
                    border: "1px solid rgba(21, 21, 21, 0.08)",
                    boxShadow: "0 28px 70px rgba(44, 35, 22, 0.08)",
                    minWidth: 220,
                    padding: 24,
                  }}
                >
                  <p
                    style={{
                      color: colors.ink,
                      fontSize: 42,
                      fontWeight: 800,
                      lineHeight: 1,
                      margin: 0,
                    }}
                  >
                    {value}
                  </p>
                  <p
                    style={{
                      color: colors.muted,
                      fontSize: 20,
                      lineHeight: 1.25,
                      margin: "14px 0 0",
                    }}
                  >
                    {label}
                  </p>
                </div>
              </FadeSlide>
            ))}
          </div>
        </div>
        <div
          style={{
            alignSelf: "center",
            background: colors.paper,
            boxShadow: "0 44px 110px rgba(44, 35, 22, 0.16)",
            height: 720,
            overflow: "hidden",
            position: "relative",
            transform: `translateY(${interpolate(imageProgress, [0, 1], [52, 0])}px) scale(${interpolate(
              imageProgress,
              [0, 1],
              [0.96, 1],
            )})`,
          }}
        >
          <Img
            src={staticFile(heroImage)}
            style={{
              height: "100%",
              objectFit: "cover",
              objectPosition: "64% center",
              width: "100%",
            }}
          />
          <div
            style={{
              background: "linear-gradient(180deg, transparent 48%, rgba(21, 21, 21, 0.58))",
              inset: 0,
              position: "absolute",
            }}
          />
          <div
            style={{
              bottom: 32,
              color: "#ffffff",
              fontSize: 26,
              fontWeight: 700,
              left: 34,
              position: "absolute",
            }}
          >
            Premium online English training
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function TrackCard({
  index,
  label,
  text,
}: {
  index: number;
  label: string;
  text: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = easedProgress(frame, seconds(0.22 + index * 0.18, fps), seconds(0.7, fps));
  const accent = [colors.gold, colors.blue, colors.green, colors.ink][index];

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.86)",
        border: "1px solid rgba(21, 21, 21, 0.08)",
        boxShadow: "0 28px 76px rgba(44, 35, 22, 0.08)",
        minHeight: 168,
        opacity: progress,
        padding: 30,
        transform: `translateY(${interpolate(progress, [0, 1], [34, 0])}px)`,
      }}
    >
      <div
        style={{
          background: accent,
          height: 5,
          marginBottom: 26,
          width: 78,
        }}
      />
      <h3
        style={{
          color: colors.ink,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 42,
          lineHeight: 1,
          margin: 0,
        }}
      >
        {label}
      </h3>
      <p
        style={{
          color: colors.muted,
          fontSize: 22,
          lineHeight: 1.3,
          margin: "18px 0 0",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function TracksScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = sceneOpacity(frame, TRACKS_DURATION, fps);

  return (
    <AbsoluteFill style={{ opacity }}>
      <Background />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "720px 1fr",
          gap: 76,
          height: "100%",
          padding: "132px 118px 104px",
        }}
      >
        <div>
          <FadeSlide>
            <Pill tone={colors.blue}>Four focused paths</Pill>
          </FadeSlide>
          <FadeSlide delay={0.2}>
            <h2
              style={{
                color: colors.ink,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 92,
                lineHeight: 1,
                margin: "44px 0 0",
              }}
            >
              Choose the route that matches the real goal.
            </h2>
          </FadeSlide>
          <FadeSlide delay={0.48}>
            <p
              style={{
                color: colors.muted,
                fontSize: 31,
                lineHeight: 1.36,
                margin: "34px 0 0",
              }}
            >
              Each track connects speaking practice, correction, structure, and clear next steps.
            </p>
          </FadeSlide>
        </div>
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "1fr 1fr",
            placeSelf: "center stretch",
          }}
        >
          {tracks.map(([label, text], index) => (
            <TrackCard index={index} key={label} label={label} text={text} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function ClassImage({
  index,
  src,
  style,
}: {
  index: number;
  src: string;
  style: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = easedProgress(frame, seconds(0.18 + index * 0.16, fps), seconds(0.78, fps));
  const drift = Math.sin((frame + index * 17) / 34) * 8;

  return (
    <div
      style={{
        background: colors.paper,
        boxShadow: "0 28px 80px rgba(44, 35, 22, 0.12)",
        overflow: "hidden",
        opacity: progress,
        position: "absolute",
        transform: `translate3d(0, ${interpolate(progress, [0, 1], [42, drift])}px, 0) rotate(${interpolate(
          progress,
          [0, 1],
          [index % 2 === 0 ? -2.8 : 2.8, 0],
        )}deg)`,
        ...style,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          height: "100%",
          objectFit: "cover",
          width: "100%",
        }}
      />
    </div>
  );
}

function ProofScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = sceneOpacity(frame, PROOF_DURATION, fps);

  return (
    <AbsoluteFill style={{ opacity }}>
      <Background />
      <div
        style={{
          height: "100%",
          padding: "128px 118px 102px",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 820, position: "relative", zIndex: 3 }}>
          <FadeSlide>
            <Pill tone={colors.green}>Real class moments</Pill>
          </FadeSlide>
          <FadeSlide delay={0.2}>
            <h2
              style={{
                color: colors.ink,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 98,
                lineHeight: 0.98,
                margin: "44px 0 0",
              }}
            >
              Proof, practice, feedback, progress.
            </h2>
          </FadeSlide>
          <FadeSlide delay={0.46}>
            <p
              style={{
                color: colors.muted,
                fontSize: 31,
                lineHeight: 1.36,
                margin: "34px 0 0",
                maxWidth: 760,
              }}
            >
              A calm, structured route from diagnosis to correction to visible improvement.
            </p>
          </FadeSlide>
          <FadeSlide delay={0.72}>
            <div
              style={{
                alignItems: "center",
                background: colors.ink,
                color: "#ffffff",
                display: "inline-flex",
                fontSize: 29,
                fontWeight: 800,
                gap: 18,
                marginTop: 56,
                padding: "26px 34px",
              }}
            >
              Book on Preply
              <span style={{ color: colors.goldSoft }}>|</span>
              Explore programs
            </div>
          </FadeSlide>
        </div>
        <div
          style={{
            bottom: 92,
            height: 780,
            position: "absolute",
            right: 94,
            width: 930,
          }}
        >
          <ClassImage
            index={0}
            src={classImages[0]}
            style={{ height: 330, left: 36, top: 8, width: 520 }}
          />
          <ClassImage
            index={1}
            src={classImages[1]}
            style={{ height: 340, right: 0, top: 96, width: 540 }}
          />
          <ClassImage
            index={2}
            src={classImages[2]}
            style={{ bottom: 38, height: 310, left: 0, width: 500 }}
          />
          <ClassImage
            index={3}
            src={classImages[3]}
            style={{ bottom: 0, height: 280, right: 78, width: 420 }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function HomepagePromo() {
  return (
    <AbsoluteFill
      style={{
        background: colors.surface,
        color: colors.ink,
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Sequence durationInFrames={OPENING_DURATION}>
        <OpeningScene />
      </Sequence>
      <Sequence durationInFrames={TRACKS_DURATION} from={105}>
        <TracksScene />
      </Sequence>
      <Sequence durationInFrames={PROOF_DURATION} from={215}>
        <ProofScene />
      </Sequence>
    </AbsoluteFill>
  );
}
