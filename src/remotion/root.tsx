import { Composition, Folder } from "remotion";

import {
  HomepagePromo,
  HOMEPAGE_PROMO_DURATION,
  HOMEPAGE_PROMO_FPS,
  HOMEPAGE_PROMO_HEIGHT,
  HOMEPAGE_PROMO_WIDTH,
} from "./homepage-promo";

export function RemotionRoot() {
  return (
    <Folder name="Website">
      <Composition
        component={HomepagePromo}
        durationInFrames={HOMEPAGE_PROMO_DURATION}
        fps={HOMEPAGE_PROMO_FPS}
        height={HOMEPAGE_PROMO_HEIGHT}
        id="HomepagePromo"
        width={HOMEPAGE_PROMO_WIDTH}
      />
    </Folder>
  );
}
