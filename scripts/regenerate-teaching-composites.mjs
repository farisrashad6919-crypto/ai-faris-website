import sharp from "sharp";

const sourcePath = "E:/Faris Pro Pics/Deletes/IMG_36402.JPG";
const outputRoot = "E:/AI Faris Website/public/images";

const palette = {
  surface: "#fbf9f5",
  white: "#ffffff",
  peach: "#ffddb6",
  bronze: "#a98c69",
  secondary: "#4f6073",
};

function svg(width, height, content) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${content}</svg>`,
  );
}

async function roundedPhoto(width, height) {
  const image = await sharp(sourcePath)
    .resize(width, height, { fit: "cover", position: "attention" })
    .png()
    .toBuffer();
  const mask = svg(width, height, `<rect width="${width}" height="${height}" rx="22" fill="#fff" />`);
  return sharp(image)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

function gradientOverlay(width, height, variant) {
  return svg(
    width,
    height,
    variant === "slate"
      ? `
        <defs>
          <radialGradient id="a" cx="82%" cy="18%" r="50%">
            <stop offset="0%" stop-color="${palette.secondary}" stop-opacity="0.24" />
            <stop offset="70%" stop-color="${palette.secondary}" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="b" cx="18%" cy="12%" r="54%">
            <stop offset="0%" stop-color="${palette.peach}" stop-opacity="0.32" />
            <stop offset="68%" stop-color="${palette.peach}" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="#fbf9f5" />
        <rect width="${width}" height="${height}" fill="url(#a)" />
        <rect width="${width}" height="${height}" fill="url(#b)" />
      `
      : `
        <defs>
          <radialGradient id="a" cx="16%" cy="12%" r="62%">
            <stop offset="0%" stop-color="${palette.peach}" stop-opacity="0.52" />
            <stop offset="60%" stop-color="${palette.peach}" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="#fbf9f5" />
        <rect width="${width}" height="${height}" fill="url(#a)" />
      `,
  );
}

function zoomWindowSvg(width, height, theme = "speaker") {
  const left = 70;
  const top = 74;
  const shellW = width - 140;
  const shellH = height - 148;

  return svg(
    width,
    height,
    `
      <rect x="${left}" y="${top}" width="${shellW}" height="${shellH}" rx="34" fill="#f7f5f0" stroke="rgba(27,28,26,0.08)" />
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
    `,
  );
}

function studentTile(width, height, accent) {
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

async function createScreen(fileName, layout) {
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

  const mainVideo = await roundedPhoto(layout === "gallery" ? 930 : 860, 700);
  const shell = zoomWindowSvg(width, height, layout);
  const composites = [{ input: shell }];

  if (layout === "slide") {
    composites.push({ input: mainVideo, left: 136, top: 158 });
    composites.push({
      input: svg(650, 560, `<rect width="650" height="560" rx="22" fill="#ffffff" /><rect x="44" y="56" width="310" height="22" rx="11" fill="rgba(79,96,115,0.18)" /><rect x="44" y="108" width="470" height="14" rx="7" fill="rgba(79,96,115,0.12)" /><rect x="44" y="144" width="430" height="14" rx="7" fill="rgba(79,96,115,0.12)" /><rect x="72" y="292" width="44" height="164" rx="10" fill="rgba(169,140,105,0.16)" /><rect x="136" y="256" width="44" height="200" rx="10" fill="rgba(79,96,115,0.18)" /><rect x="200" y="212" width="44" height="244" rx="10" fill="rgba(79,96,115,0.22)" /><rect x="264" y="166" width="44" height="290" rx="10" fill="rgba(169,140,105,0.22)" /><rect x="328" y="126" width="44" height="330" rx="10" fill="rgba(79,96,115,0.26)" /><rect x="392" y="90" width="44" height="366" rx="10" fill="rgba(79,96,115,0.3)" />`),
      left: 980,
      top: 158,
    });
  } else if (layout === "gallery") {
    composites.push({ input: mainVideo, left: 136, top: 158 });
    composites.push({ input: studentTile(260, 170, palette.secondary), left: 1434, top: 158 });
    composites.push({ input: studentTile(260, 170, palette.bronze), left: 1434, top: 386 });
    composites.push({ input: studentTile(260, 170, palette.peach), left: 1434, top: 614 });
  } else {
    composites.push({ input: mainVideo, left: 136, top: 158 });
    composites.push({ input: svg(740, 288, `<rect width="740" height="288" rx="22" fill="#ffffff" /><rect x="44" y="44" width="280" height="20" rx="10" fill="rgba(79,96,115,0.16)" /><rect x="44" y="92" width="530" height="14" rx="7" fill="rgba(79,96,115,0.12)" /><rect x="44" y="126" width="486" height="14" rx="7" fill="rgba(79,96,115,0.12)" /><rect x="44" y="186" width="214" height="56" rx="18" fill="rgba(255,221,182,0.22)" />`), left: 1098, top: 158 });
    composites.push({ input: svg(740, 230, `<rect width="740" height="230" rx="22" fill="#ffffff" /><rect x="44" y="48" width="180" height="18" rx="9" fill="rgba(169,140,105,0.2)" /><rect x="44" y="98" width="430" height="14" rx="7" fill="rgba(79,96,115,0.12)" /><rect x="44" y="132" width="388" height="14" rx="7" fill="rgba(79,96,115,0.12)" />`), left: 1098, top: 520 });
  }

  await sharp(bg).composite(composites).png().toFile(`${outputRoot}/${fileName}`);
}

await createScreen("faris-teaching-zoom-01.png", "speaker");
await createScreen("faris-teaching-zoom-02.png", "gallery");
await createScreen("faris-teaching-zoom-03.png", "slide");
