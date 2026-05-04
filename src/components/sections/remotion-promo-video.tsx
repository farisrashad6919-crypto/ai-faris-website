export function RemotionPromoVideo() {
  return (
    <div className="paper-panel overflow-hidden rounded-md p-3">
      <video
        aria-label="Animated overview of Faris Rashad English training paths"
        autoPlay
        className="aspect-video w-full rounded-sm bg-primary object-cover"
        controls
        loop
        muted
        playsInline
        poster="/videos/homepage-promo-poster.png"
        preload="metadata"
      >
        <source src="/videos/homepage-promo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
