import Image from "next/image";

import { cn } from "@/lib/utils";

type EditorialPhoto = {
  alt: string;
  className?: string;
  objectPosition: string;
  sizes: string;
  src: string;
};

const editorialPhotos: EditorialPhoto[] = [
  {
    alt: "Faris Rashad in a formal suit portrait",
    className: "sm:row-span-2",
    objectPosition: "50% 18%",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 26vw",
    src: "/images/editorial/faris-editorial-direct.jpg",
  },
  {
    alt: "Faris Rashad at an anniversary event in an outdoor portrait",
    objectPosition: "50% 24%",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 18vw",
    src: "/images/editorial/faris-editorial-smile.jpg",
  },
  {
    alt: "Faris Rashad in a casual studio portrait with a denim jacket",
    objectPosition: "50% 22%",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 18vw",
    src: "/images/editorial/faris-editorial-pointing.jpg",
  },
];

type PortraitMosaicProps = {
  className?: string;
};

export function PortraitMosaic({ className }: PortraitMosaicProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]", className)}>
      {editorialPhotos.map((photo, index) => (
        <div
          className={cn(
            "paper-panel relative overflow-hidden rounded-[1.5rem] p-3",
            photo.className,
          )}
          key={photo.src}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-[1.15rem]",
              index === 0 ? "aspect-[4/5]" : "aspect-[6/5]",
            )}
          >
            <Image
              alt={photo.alt}
              className="object-cover"
              fill
              sizes={photo.sizes}
              src={photo.src}
              style={{ objectPosition: photo.objectPosition }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,221,182,0.18),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(21,21,21,0.12))]" />
          </div>
        </div>
      ))}
    </div>
  );
}
