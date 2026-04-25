import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = "E:/AI Faris Website";
const outputDir = path.join(root, "public", "images");

const sources = {
  portrait: "E:/Faris Pro Pics/Deletes/IMG_5733.JPG",
  workspace: "E:/Faris Pro Pics/Deletes/IMG_36402.JPG",
  standing: "E:/Faris Pro Pics/Deletes/IMG_5732.PNG",
};

const palette = {
  surface: "#fbf9f5",
  surfaceLow: "#f5f3ef",
  white: "#ffffff",
  primary: "#151515",
  secondary: "#4f6073",
  bronze: "#a98c69",
  peach: "#ffddb6",
  taupe: "#d8cfbf",
  navy: "#2f3c50",
  ink: "#1b1c1a",
};

function svg(width, height, content) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${content}</svg>`,
  );
}

function roundedRect(width, height, radius, fill, stroke = "none", strokeWidth = 0, opacity = 1) {
  return `<rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="${fill}" fill-opacity="${opacity}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
}

function shadowSvg(width, height, radius, color = "#000000", opacity = 0.12, blur = 36, spread = 10) {
  const w = width + spread * 2;
  const h = height + spread * 2;
  const r = radius + spread;
  return svg(
    w,
    h,
    `
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="${blur / 2}" />
        </filter>
      </defs>
      <rect x="${spread}" y="${spread}" width="${width}" height="${height}" rx="${r}" ry="${r}" fill="${color}" fill-opacity="${opacity}" filter="url(#shadow)" />
    `,
  );
}

function gradientOverlay(width, height, variant = "warm") {
  const overlays = {
    warm: `
      <defs>
        <radialGradient id="glowA" cx="16%" cy="12%" r="62%">
          <stop offset="0%" stop-color="${palette.peach}" stop-opacity="0.58" />
          <stop offset="60%" stop-color="${palette.peach}" stop-opacity="0.0" />
        </radialGradient>
        <radialGradient id="glowB" cx="88%" cy="16%" r="48%">
          <stop offset="0%" stop-color="${palette.secondary}" stop-opacity="0.14" />
          <stop offset="68%" stop-color="${palette.secondary}" stop-opacity="0.0" />
        </radialGradient>
        <linearGradient id="wash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.26" />
          <stop offset="100%" stop-color="${palette.surfaceLow}" stop-opacity="0.44" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#wash)" />
      <rect width="${width}" height="${height}" fill="url(#glowA)" />
      <rect width="${width}" height="${height}" fill="url(#glowB)" />
    `,
    slate: `
      <defs>
        <radialGradient id="glowA" cx="82%" cy="18%" r="50%">
          <stop offset="0%" stop-color="${palette.secondary}" stop-opacity="0.26" />
          <stop offset="70%" stop-color="${palette.secondary}" stop-opacity="0.0" />
        </radialGradient>
        <radialGradient id="glowB" cx="18%" cy="12%" r="54%">
          <stop offset="0%" stop-color="${palette.peach}" stop-opacity="0.34" />
          <stop offset="68%" stop-color="${palette.peach}" stop-opacity="0.0" />
        </radialGradient>
        <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
          <stop offset="100%" stop-color="${palette.surfaceLow}" stop-opacity="0.34" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#wash)" />
      <rect width="${width}" height="${height}" fill="url(#glowA)" />
      <rect width="${width}" height="${height}" fill="url(#glowB)" />
    `,
  };

  return svg(width, height, overlays[variant] ?? overlays.warm);
}

function decorativeShapes(width, height, theme = "mentor") {
  const sets = {
    mentor: `
      <g opacity="0.9">
        <rect x="${width * 0.08}" y="${height * 0.18}" width="${width * 0.22}" height="${height * 0.24}" rx="28" fill="#ffffff" fill-opacity="0.62" stroke="#ffffff" stroke-opacity="0.55" />
        <rect x="${width * 0.11}" y="${height * 0.22}" width="${width * 0.12}" height="12" rx="6" fill="${palette.bronze}" fill-opacity="0.42" />
        <rect x="${width * 0.11}" y="${height * 0.27}" width="${width * 0.16}" height="10" rx="5" fill="${palette.secondary}" fill-opacity="0.18" />
        <rect x="${width * 0.11}" y="${height * 0.32}" width="${width * 0.14}" height="10" rx="5" fill="${palette.secondary}" fill-opacity="0.14" />
      </g>
      <circle cx="${width * 0.9}" cy="${height * 0.18}" r="${Math.min(width, height) * 0.06}" fill="${palette.peach}" fill-opacity="0.28" />
      <circle cx="${width * 0.86}" cy="${height * 0.18}" r="${Math.min(width, height) * 0.02}" fill="${palette.secondary}" fill-opacity="0.24" />
    `,
    results: `
      <g opacity="0.9">
        <rect x="${width * 0.09}" y="${height * 0.18}" width="${width * 0.24}" height="${height * 0.22}" rx="30" fill="#ffffff" fill-opacity="0.6" stroke="#ffffff" stroke-opacity="0.55" />
        <circle cx="${width * 0.14}" cy="${height * 0.29}" r="15" fill="${palette.peach}" fill-opacity="0.7" />
        <rect x="${width * 0.18}" y="${height * 0.26}" width="${width * 0.1}" height="10" rx="5" fill="${palette.bronze}" fill-opacity="0.5" />
        <rect x="${width * 0.18}" y="${height * 0.31}" width="${width * 0.12}" height="10" rx="5" fill="${palette.secondary}" fill-opacity="0.18" />
      </g>
      <g opacity="0.55">
        <circle cx="${width * 0.82}" cy="${height * 0.22}" r="9" fill="${palette.secondary}" />
        <circle cx="${width * 0.86}" cy="${height * 0.18}" r="12" fill="${palette.bronze}" />
        <circle cx="${width * 0.91}" cy="${height * 0.13}" r="15" fill="${palette.peach}" />
      </g>
    `,
    quiz: `
      <g opacity="0.92">
        <rect x="${width * 0.08}" y="${height * 0.2}" width="${width * 0.22}" height="${height * 0.28}" rx="32" fill="#ffffff" fill-opacity="0.62" stroke="#ffffff" stroke-opacity="0.55" />
        <rect x="${width * 0.11}" y="${height * 0.25}" width="${width * 0.12}" height="12" rx="6" fill="${palette.bronze}" fill-opacity="0.42" />
        <circle cx="${width * 0.125}" cy="${height * 0.34}" r="10" fill="${palette.peach}" fill-opacity="0.75" />
        <rect x="${width * 0.15}" y="${height * 0.335}" width="${width * 0.11}" height="10" rx="5" fill="${palette.secondary}" fill-opacity="0.18" />
        <circle cx="${width * 0.125}" cy="${height * 0.41}" r="10" fill="${palette.secondary}" fill-opacity="0.42" />
        <rect x="${width * 0.15}" y="${height * 0.405}" width="${width * 0.09}" height="10" rx="5" fill="${palette.secondary}" fill-opacity="0.18" />
      </g>
    `,
    pronunciation: `
      <g opacity="0.75">
        <path d="M ${width * 0.13} ${height * 0.44} Q ${width * 0.16} ${height * 0.38} ${width * 0.19} ${height * 0.44}" stroke="${palette.secondary}" stroke-width="10" fill="none" stroke-linecap="round" />
        <path d="M ${width * 0.21} ${height * 0.4} Q ${width * 0.27} ${height * 0.3} ${width * 0.33} ${height * 0.4}" stroke="${palette.bronze}" stroke-width="10" fill="none" stroke-linecap="round" />
        <path d="M ${width * 0.36} ${height * 0.37} Q ${width * 0.46} ${height * 0.22} ${width * 0.56} ${height * 0.37}" stroke="${palette.peach}" stroke-width="10" fill="none" stroke-linecap="round" />
      </g>
    `,
    business: `
      <g opacity="0.82">
        <rect x="${width * 0.08}" y="${height * 0.23}" width="${width * 0.24}" height="${height * 0.22}" rx="28" fill="#ffffff" fill-opacity="0.58" />
        <path d="M ${width * 0.12} ${height * 0.38} L ${width * 0.16} ${height * 0.33} L ${width * 0.21} ${height * 0.35} L ${width * 0.26} ${height * 0.28}" stroke="${palette.secondary}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="${width * 0.26}" cy="${height * 0.28}" r="9" fill="${palette.peach}" />
      </g>
    `,
    ielts: `
      <g opacity="0.9">
        <circle cx="${width * 0.16}" cy="${height * 0.28}" r="${Math.min(width, height) * 0.06}" fill="#ffffff" fill-opacity="0.62" />
        <path d="M ${width * 0.16} ${height * 0.24} L ${width * 0.16} ${height * 0.29} L ${width * 0.19} ${height * 0.315}" stroke="${palette.bronze}" stroke-width="10" fill="none" stroke-linecap="round" />
        <rect x="${width * 0.11}" y="${height * 0.39}" width="${width * 0.18}" height="${height * 0.12}" rx="24" fill="#ffffff" fill-opacity="0.58" />
      </g>
    `,
    resources: `
      <g opacity="0.86">
        <rect x="${width * 0.07}" y="${height * 0.22}" width="${width * 0.18}" height="${height * 0.22}" rx="24" fill="#ffffff" fill-opacity="0.58" />
        <rect x="${width * 0.11}" y="${height * 0.19}" width="${width * 0.18}" height="${height * 0.22}" rx="24" fill="${palette.surface}" fill-opacity="0.94" stroke="${palette.taupe}" stroke-opacity="0.7" />
        <rect x="${width * 0.15}" y="${height * 0.25}" width="${width * 0.1}" height="10" rx="5" fill="${palette.bronze}" fill-opacity="0.38" />
        <rect x="${width * 0.15}" y="${height * 0.3}" width="${width * 0.12}" height="10" rx="5" fill="${palette.secondary}" fill-opacity="0.18" />
      </g>
    `,
    video: `
      <g opacity="0.92">
        <circle cx="${width * 0.16}" cy="${height * 0.34}" r="${Math.min(width, height) * 0.075}" fill="#ffffff" fill-opacity="0.82" />
        <polygon points="${width * 0.145},${height * 0.302} ${width * 0.145},${height * 0.378} ${width * 0.205},${height * 0.34}" fill="${palette.primary}" fill-opacity="0.86" />
      </g>
    `,
  };

  return svg(width, height, sets[theme] ?? sets.mentor);
}

async function roundedPhoto(sourcePath, width, height, {
  fit = "cover",
  position = "centre",
  radius = 48,
  brightness = 1.02,
  saturation = 1,
} = {}) {
  const image = await sharp(sourcePath)
    .resize(width, height, { fit, position })
    .modulate({ brightness, saturation })
    .png()
    .toBuffer();

  const mask = svg(width, height, roundedRect(width, height, radius, "#ffffff"));
  const border = svg(
    width,
    height,
    roundedRect(width - 4, height - 4, radius - 2, "none", "rgba(255,255,255,0.68)", 4),
  );

  return sharp(image)
    .composite([
      { input: mask, blend: "dest-in" },
      { input: border, top: 2, left: 2 },
    ])
    .png()
    .toBuffer();
}

async function blurredBackdrop(sourcePath, width, height, {
  fit = "cover",
  position = "centre",
  blur = 34,
  brightness = 1.04,
  saturation = 0.88,
  variant = "warm",
} = {}) {
  const base = await sharp(sourcePath)
    .resize(width, height, { fit, position })
    .modulate({ brightness, saturation })
    .blur(blur)
    .png()
    .toBuffer();

  return sharp(base)
    .composite([{ input: gradientOverlay(width, height, variant) }])
    .png()
    .toBuffer();
}

async function saveOutput(name, image, { format, quality = 90 } = {}) {
  const outputPath = path.join(outputDir, name);
  let pipeline = sharp(image);

  if (format === "webp") {
    pipeline = pipeline.webp({ quality });
  } else if (format === "jpeg") {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  } else if (format === "png") {
    pipeline = pipeline.png({ compressionLevel: 9 });
  }

  await pipeline.toFile(outputPath);
  return outputPath;
}

function panelCard(width, height, {
  fill = "rgba(255,255,255,0.68)",
  stroke = "rgba(255,255,255,0.55)",
  radius = 32,
} = {}) {
  return svg(
    width,
    height,
    `<rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" />`,
  );
}

async function composeHero() {
  const width = 2400;
  const height = 1350;
  const bg = await blurredBackdrop(sources.portrait, width, height, {
    position: "attention",
    blur: 38,
    brightness: 1.06,
    saturation: 0.82,
    variant: "warm",
  });
  const photo = await roundedPhoto(sources.portrait, 980, 1180, {
    position: "centre",
    radius: 64,
    brightness: 1.01,
  });
  const shadow = shadowSvg(980, 1180, 64, "#4f6073", 0.14, 48, 18);

  const canvas = sharp(bg).composite([
    { input: decorativeShapes(width, height, "mentor") },
    { input: shadow, left: 1302, top: 102 },
    { input: photo, left: 1320, top: 120 },
    { input: panelCard(440, 220), left: 260, top: 860 },
    { input: panelCard(260, 88, { fill: "rgba(255,221,182,0.34)", stroke: "rgba(255,255,255,0.0)", radius: 24 }), left: 260, top: 760 },
  ]);

  return saveOutput("faris-hero-main.webp", await canvas.png().toBuffer(), { format: "webp", quality: 90 });
}

async function composePortraitAsset(name, sourcePath, {
  width = 1280,
  height = 1600,
  photoWidth = 980,
  photoHeight = 1320,
  photoLeft = 150,
  photoTop = 120,
  bgVariant = "warm",
  bgSource = sourcePath,
  bgPosition = "centre",
  photoPosition = "centre",
  theme = "mentor",
  extraPanel = false,
  warmth = 1,
} = {}) {
  const bg = await blurredBackdrop(bgSource, width, height, {
    position: bgPosition,
    variant: bgVariant,
    blur: 36,
    saturation: 0.84 + warmth * 0.05,
  });
  const photo = await roundedPhoto(sourcePath, photoWidth, photoHeight, {
    position: photoPosition,
    radius: 56,
    saturation: 0.98 + warmth * 0.03,
  });
  const shadow = shadowSvg(photoWidth, photoHeight, 56, "#2c2316", 0.14, 42, 16);

  const composites = [
    { input: decorativeShapes(width, height, theme) },
    { input: shadow, left: photoLeft - 16, top: photoTop - 16 },
    { input: photo, left: photoLeft, top: photoTop },
  ];

  if (extraPanel) {
    composites.push({
      input: panelCard(260, 104, {
        fill: "rgba(255,255,255,0.55)",
        stroke: "rgba(255,255,255,0.48)",
        radius: 24,
      }),
      left: width - 340,
      top: 128,
    });
  }

  const canvas = sharp(bg).composite(composites);
  return saveOutput(name, await canvas.png().toBuffer(), { format: "webp", quality: 90 });
}

async function composeWorkspaceAsset(name, {
  theme = "mentor",
  cropPosition = "attention",
  variant = "warm",
  overlayRight = false,
} = {}) {
  const width = 1800;
  const height = 1200;
  const bg = await blurredBackdrop(sources.workspace, width, height, {
    position: cropPosition,
    variant,
    blur: 28,
    saturation: 0.9,
  });
  const photo = await roundedPhoto(sources.workspace, 960, 980, {
    position: cropPosition,
    radius: 52,
  });
  const shadow = shadowSvg(960, 980, 52, "#4f6073", 0.14, 42, 18);

  const composites = [
    { input: decorativeShapes(width, height, theme) },
    { input: shadow, left: 748, top: 112 },
    { input: photo, left: 766, top: 130 },
    {
      input: panelCard(340, 200, {
        fill: "rgba(255,255,255,0.58)",
        stroke: "rgba(255,255,255,0.42)",
        radius: 30,
      }),
      left: 176,
      top: 760,
    },
  ];

  if (overlayRight) {
    composites.push({
      input: panelCard(280, 140, {
        fill: "rgba(255,221,182,0.26)",
        stroke: "rgba(255,255,255,0.0)",
        radius: 26,
      }),
      left: 1320,
      top: 130,
    });
  }

  const canvas = sharp(bg).composite(composites);
  return saveOutput(name, await canvas.png().toBuffer(), { format: "webp", quality: 90 });
}

function zoomWindowSvg(width, height, theme = "mentor") {
  const left = 70;
  const top = 74;
  const shellW = width - 140;
  const shellH = height - 148;

  const content = `
    <defs>
      <linearGradient id="appBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f6f4ef" />
        <stop offset="100%" stop-color="#fdfcf9" />
      </linearGradient>
    </defs>
    <rect x="${left}" y="${top}" width="${shellW}" height="${shellH}" rx="34" fill="url(#appBg)" stroke="rgba(27,28,26,0.08)" />
    <rect x="${left}" y="${top}" width="${shellW}" height="56" rx="34" fill="rgba(255,255,255,0.9)" />
    <circle cx="${left + 36}" cy="${top + 28}" r="7" fill="#d9cdb9" />
    <circle cx="${left + 58}" cy="${top + 28}" r="7" fill="${palette.peach}" />
    <circle cx="${left + 80}" cy="${top + 28}" r="7" fill="${palette.secondary}" />
    ${
      theme === "slide"
        ? `
          <rect x="${left + 48}" y="${top + 86}" width="${shellW * 0.56}" height="${shellH - 154}" rx="24" fill="#ffffff" />
          <rect x="${left + shellW * 0.62}" y="${top + 86}" width="${shellW * 0.3}" height="${shellH * 0.38}" rx="24" fill="rgba(255,255,255,0.86)" />
          <rect x="${left + shellW * 0.62}" y="${top + shellH * 0.52}" width="${shellW * 0.3}" height="${shellH * 0.18}" rx="24" fill="rgba(79,96,115,0.1)" />
        `
        : theme === "gallery"
          ? `
            <rect x="${left + 48}" y="${top + 86}" width="${shellW * 0.6}" height="${shellH - 154}" rx="24" fill="#ffffff" />
            <rect x="${left + shellW * 0.69}" y="${top + 86}" width="${shellW * 0.23}" height="${shellH * 0.18}" rx="18" fill="rgba(255,255,255,0.86)" />
            <rect x="${left + shellW * 0.69}" y="${top + shellH * 0.33}" width="${shellW * 0.23}" height="${shellH * 0.18}" rx="18" fill="rgba(255,255,255,0.86)" />
            <rect x="${left + shellW * 0.69}" y="${top + shellH * 0.56}" width="${shellW * 0.23}" height="${shellH * 0.18}" rx="18" fill="rgba(255,255,255,0.86)" />
          `
          : `
            <rect x="${left + 48}" y="${top + 86}" width="${shellW * 0.5}" height="${shellH - 154}" rx="24" fill="#ffffff" />
            <rect x="${left + shellW * 0.57}" y="${top + 86}" width="${shellW * 0.35}" height="${shellH * 0.28}" rx="24" fill="rgba(255,255,255,0.86)" />
            <rect x="${left + shellW * 0.57}" y="${top + shellH * 0.43}" width="${shellW * 0.35}" height="${shellH * 0.24}" rx="24" fill="rgba(255,255,255,0.86)" />
          `
    }
    <rect x="${left + shellW / 2 - 86}" y="${top + shellH - 48}" width="172" height="10" rx="5" fill="rgba(27,28,26,0.12)" />
    <circle cx="${left + shellW / 2 - 46}" cy="${top + shellH - 24}" r="12" fill="#d0d7df" />
    <circle cx="${left + shellW / 2}" cy="${top + shellH - 24}" r="12" fill="${palette.peach}" />
    <circle cx="${left + shellW / 2 + 46}" cy="${top + shellH - 24}" r="12" fill="${palette.secondary}" />
  `;

  return svg(width, height, content);
}

function genericStudentTile(width, height, accent = palette.secondary) {
  return svg(
    width,
    height,
    `
      <rect width="${width}" height="${height}" rx="18" fill="rgba(79,96,115,0.08)" />
      <circle cx="${width / 2}" cy="${height * 0.38}" r="${Math.min(width, height) * 0.16}" fill="${accent}" fill-opacity="0.26" />
      <rect x="${width * 0.23}" y="${height * 0.62}" width="${width * 0.54}" height="${height * 0.1}" rx="${height * 0.05}" fill="${accent}" fill-opacity="0.18" />
    `,
  );
}

async function composeTeachingScreen(name, layout) {
  const width = 1920;
  const height = 1080;
  const bg = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: palette.surface,
    },
  })
    .composite([{ input: gradientOverlay(width, height, layout === "slide" ? "slate" : "warm") }])
    .png()
    .toBuffer();

  const shell = zoomWindowSvg(width, height, layout);
  const mainVideo = await roundedPhoto(sources.workspace, layout === "gallery" ? 930 : 860, 700, {
    position: "attention",
    radius: 22,
    saturation: 1,
  });

  const smallA = genericStudentTile(260, 170, palette.secondary);
  const smallB = genericStudentTile(260, 170, palette.bronze);
  const smallC = genericStudentTile(260, 170, palette.peach);

  const composites = [{ input: shell }];

  if (layout === "slide") {
    composites.push({ input: mainVideo, left: 136, top: 158 });
    composites.push({ input: panelCard(650, 560, { fill: "rgba(255,255,255,0.95)", stroke: "rgba(27,28,26,0.08)", radius: 22 }), left: 980, top: 158 });
    composites.push({ input: panelCard(650, 118, { fill: "rgba(255,221,182,0.2)", stroke: "rgba(27,28,26,0)", radius: 18 }), left: 980, top: 748 });
  } else if (layout === "gallery") {
    composites.push({ input: mainVideo, left: 136, top: 158 });
    composites.push({ input: smallA, left: 1434, top: 158 });
    composites.push({ input: smallB, left: 1434, top: 386 });
    composites.push({ input: smallC, left: 1434, top: 614 });
  } else {
    composites.push({ input: mainVideo, left: 136, top: 158 });
    composites.push({ input: panelCard(740, 288, { fill: "rgba(255,255,255,0.92)", stroke: "rgba(27,28,26,0.06)", radius: 22 }), left: 1098, top: 158 });
    composites.push({ input: panelCard(740, 230, { fill: "rgba(255,255,255,0.92)", stroke: "rgba(27,28,26,0.06)", radius: 22 }), left: 1098, top: 520 });
  }

  const canvas = sharp(bg).composite(composites);
  return saveOutput(name, await canvas.png().toBuffer(), { format: "png" });
}

async function composeVideoCover(name, {
  theme = "video",
  sourcePath = sources.workspace,
  cropPosition = "attention",
  width = 1600,
  height = 900,
} = {}) {
  const bg = await blurredBackdrop(sourcePath, width, height, {
    position: cropPosition,
    variant: "slate",
    blur: 28,
    saturation: 0.88,
  });
  const photo = await roundedPhoto(sourcePath, 700, 760, {
    position: cropPosition,
    radius: 48,
  });
  const shadow = shadowSvg(700, 760, 48, "#2c2316", 0.14, 40, 16);

  const canvas = sharp(bg).composite([
    { input: decorativeShapes(width, height, theme) },
    { input: shadow, left: 848, top: 72 },
    { input: photo, left: 864, top: 88 },
    { input: panelCard(320, 170, { fill: "rgba(255,255,255,0.56)", stroke: "rgba(255,255,255,0.48)", radius: 26 }), left: 136, top: 580 },
  ]);

  return saveOutput(name, await canvas.png().toBuffer(), { format: "jpeg", quality: 90 });
}

async function composeYouTubeBanner() {
  const width = 2400;
  const height = 1000;
  const bg = await blurredBackdrop(sources.portrait, width, height, {
    position: "centre",
    variant: "slate",
    blur: 34,
  });
  const portrait = await roundedPhoto(sources.portrait, 560, 760, {
    position: "centre",
    radius: 48,
  });
  const standing = await roundedPhoto(sources.standing, 410, 760, {
    fit: "contain",
    position: "centre",
    radius: 48,
  });

  const canvas = sharp(bg).composite([
    { input: decorativeShapes(width, height, "video") },
    { input: shadowSvg(560, 760, 48, "#2c2316", 0.12, 40, 16), left: 1368, top: 126 },
    { input: portrait, left: 1384, top: 142 },
    { input: shadowSvg(410, 760, 48, "#2c2316", 0.09, 36, 12), left: 928, top: 126 },
    { input: standing, left: 940, top: 142 },
    { input: panelCard(440, 210, { fill: "rgba(255,255,255,0.56)", stroke: "rgba(255,255,255,0.42)", radius: 30 }), left: 180, top: 610 },
  ]);

  return saveOutput("brand-cover-youtube.jpg", await canvas.png().toBuffer(), { format: "jpeg", quality: 90 });
}

async function composePageCover(name, {
  sourcePath,
  theme,
  width = 1800,
  height = 1100,
  fit = "cover",
  position = "centre",
  bgVariant = "warm",
  accentPanel = true,
} = {}) {
  const bg = await blurredBackdrop(sourcePath, width, height, {
    position,
    variant: bgVariant,
    blur: 32,
  });
  const photo = await roundedPhoto(sourcePath, 760, 900, {
    fit,
    position,
    radius: 52,
  });
  const shadow = shadowSvg(760, 900, 52, "#2c2316", 0.12, 42, 16);

  const composites = [
    { input: decorativeShapes(width, height, theme) },
    { input: shadow, left: 914, top: 84 },
    { input: photo, left: 930, top: 100 },
  ];

  if (accentPanel) {
    composites.push({
      input: panelCard(360, 190, {
        fill: "rgba(255,255,255,0.58)",
        stroke: "rgba(255,255,255,0.42)",
        radius: 28,
      }),
      left: 154,
      top: 724,
    });
  }

  const canvas = sharp(bg).composite(composites);
  return saveOutput(name, await canvas.png().toBuffer(), { format: "webp", quality: 90 });
}

async function composeAll() {
  await fs.mkdir(outputDir, { recursive: true });

  await composeHero();

  await composePortraitAsset("faris-portrait-formal-01.webp", sources.portrait, {
    theme: "mentor",
    bgVariant: "warm",
    extraPanel: true,
  });
  await composePortraitAsset("faris-portrait-natural-01.webp", sources.portrait, {
    theme: "resources",
    bgVariant: "warm",
    photoLeft: 210,
    photoTop: 138,
    photoWidth: 920,
    photoHeight: 1260,
    warmth: 1.5,
  });
  await composePortraitAsset("faris-portrait-speaking-01.webp", sources.workspace, {
    bgSource: sources.workspace,
    theme: "mentor",
    bgVariant: "slate",
    photoWidth: 920,
    photoHeight: 1280,
    photoLeft: 190,
    photoTop: 122,
    photoPosition: "attention",
    bgPosition: "attention",
  });

  await composeWorkspaceAsset("faris-workspace-01.webp", {
    theme: "mentor",
    cropPosition: "attention",
    overlayRight: true,
  });
  await composeWorkspaceAsset("faris-workspace-02.webp", {
    theme: "resources",
    cropPosition: "north",
    variant: "slate",
    overlayRight: false,
  });

  await composeTeachingScreen("faris-teaching-zoom-01.png", "speaker");
  await composeTeachingScreen("faris-teaching-zoom-02.png", "gallery");
  await composeTeachingScreen("faris-teaching-zoom-03.png", "slide");

  await composeVideoCover("video-feature-cover-01.jpg", {
    theme: "video",
    sourcePath: sources.workspace,
    cropPosition: "attention",
  });
  await composeYouTubeBanner();
  await composeVideoCover("video-thumb-speaking-confidence-01.jpg", {
    theme: "video",
    sourcePath: sources.workspace,
  });
  await composeVideoCover("video-thumb-ielts-speaking-01.jpg", {
    theme: "ielts",
    sourcePath: sources.portrait,
    cropPosition: "centre",
  });
  await composeVideoCover("video-thumb-business-english-01.jpg", {
    theme: "business",
    sourcePath: sources.portrait,
    cropPosition: "centre",
  });
  await composeVideoCover("video-thumb-pronunciation-01.jpg", {
    theme: "pronunciation",
    sourcePath: sources.workspace,
    cropPosition: "attention",
  });

  await composePageCover("free-resources-cover-01.webp", {
    sourcePath: sources.workspace,
    theme: "resources",
    position: "attention",
    bgVariant: "warm",
  });
  await composePageCover("quiz-page-cover-01.webp", {
    sourcePath: sources.portrait,
    theme: "quiz",
    position: "centre",
    bgVariant: "warm",
  });
  await composePageCover("about-story-cover-01.webp", {
    sourcePath: sources.standing,
    theme: "mentor",
    fit: "contain",
    position: "centre",
    bgVariant: "warm",
  });
  await composePageCover("services-cover-01.webp", {
    sourcePath: sources.standing,
    theme: "business",
    fit: "contain",
    position: "centre",
    bgVariant: "slate",
  });
  await composePageCover("results-cover-01.webp", {
    sourcePath: sources.workspace,
    theme: "results",
    position: "attention",
    bgVariant: "warm",
  });
}

await composeAll();
