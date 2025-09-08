import { useContext } from "react";
import { TeamsFxContext } from "./Context";
import config from "./lib/config";
import { VideoCall } from "./custom/VideoCall";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

const showFunction = Boolean(config.apiName);
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export default function Tab() {
  const { themeString } = useContext(TeamsFxContext);
  return (
    <div
      className={themeString === "default" ? "light" : themeString === "dark" ? "dark" : "contrast"} >
      <AgoraRTCProvider client={client}>
        <VideoCall/>
      </AgoraRTCProvider>
    </div>
  );
}
