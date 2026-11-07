import { Composition } from "remotion";
import { TOTAL, Video } from "./Video";
import { FPS } from "./theme";
import { OPENING_TOTAL, OpeningVideo } from "./OpeningVideo";

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="NirapodAutoCharging"
    component={Video}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1920}
    height={1080}
  />
  <Composition id="NirapodOpening" component={OpeningVideo} durationInFrames={OPENING_TOTAL} fps={FPS} width={1920} height={1080} />
  </>
);
