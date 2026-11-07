import { Composition } from "remotion";
import { TOTAL, Video } from "./Video";
import { FPS } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="NirapodAutoCharging"
    component={Video}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
