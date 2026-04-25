import sharp from "sharp";

const files = [
  {
    path: "E:/AI Faris Website/public/images/faris-teaching-zoom-01.png",
    overlays: [
      { left: 22, top: 88, width: 240, height: 470, color: "rgba(255,255,255,0.88)" },
      { left: 0, top: 700, width: 1152, height: 68, color: "rgba(20,20,22,0.82)" },
      { left: 20, top: 574, width: 358, height: 112, color: "rgba(255,255,255,0.82)" },
    ],
  },
  {
    path: "E:/AI Faris Website/public/images/faris-teaching-zoom-02.png",
    overlays: [
      { left: 482, top: 176, width: 425, height: 210, color: "rgba(255,255,255,0.9)" },
      { left: 470, top: 384, width: 435, height: 132, color: "rgba(255,255,255,0.88)" },
      { left: 0, top: 691, width: 1152, height: 77, color: "rgba(25,24,28,0.84)" },
    ],
  },
  {
    path: "E:/AI Faris Website/public/images/faris-teaching-zoom-03.png",
    overlays: [
      { left: 674, top: 140, width: 432, height: 242, color: "rgba(255,255,255,0.9)" },
      { left: 0, top: 691, width: 1152, height: 77, color: "rgba(25,24,28,0.84)" },
    ],
  },
];

for (const file of files) {
  const composites = file.overlays.map((overlay) => ({
    input: {
      create: {
        width: overlay.width,
        height: overlay.height,
        channels: 4,
        background: overlay.color,
      },
    },
    left: overlay.left,
    top: overlay.top,
  }));

  const image = sharp(file.path);
  const metadata = await image.metadata();
  const buffer = await image.composite(composites).png().toBuffer();
  await sharp(buffer).resize(metadata.width, metadata.height).png().toFile(file.path);
}
