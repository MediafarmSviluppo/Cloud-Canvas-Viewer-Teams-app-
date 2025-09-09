import {
  RemoteUser,
  useIsConnected,
  useJoin,
  useRemoteUsers,
  VideoPlayerConfig,
} from "agora-rtc-react";
import axios from "axios";
import { useEffect, useState } from "react";


export function VideoCall() {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId, setAppId] = useState("d6dc8886fcc44f29847c7e352b080292"); 
  const [channel, setChannel] = useState(""); 
  const [token, setToken] = useState("");
  const [mouseOver, setMouseOver] = useState(false);
  const [error, setError] = useState("");

  const [timer1, setTimer1] = useState<any>(null);
  const [timer2, setTimer2] = useState<any>(null);

  useJoin({appid: appId, channel: channel, token: token ? token : null}, calling);

  //remote users
  const remoteUsers = useRemoteUsers();

  useEffect(() => {
    if (remoteUsers.filter(user => user.hasVideo).length == 0) {setCalling(false)}
  }, [remoteUsers]);

  useEffect(() => {
    if (!error) return;
    
    clearTimeout(timer2)
    setTimer2(setTimeout(() => {
      setError("")
    }, 10000));

  }, [error])

  const fetchToken = async () => {
    const API_BASE_URL = 'http://localhost:53001';

    try {
      const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 1000,
        headers: { 
          'ngrok-skip-browser-warning': 'true', 
          'Access-Control-Allow-Origin': '*',
          'reject-if-empty-channel': 'true'
        }
      });
      const request = await instance.get(`/token?channelName=${channel}`)
      if (request.status == 404) {
        setError("Channel not found. \n Streamer not connected yet or wrong channel name")
        return Promise.resolve(false);
      }
      setToken(request.data.token);
      return Promise.resolve(true);
      
    } catch (error) {
      if (error.status == 404) {
        setError("Channel not found.\nStreamer not connected yet or wrong channel name")
        return Promise.resolve(false);
      }
      console.error("Error fetching token:", error);
      setError("Server error. Could not fetch token")
      return Promise.resolve(false);
    }
  };

  const addLineBreak = (str: string) =>
  str.split('\n').map((subStr) => {
    return (
      <>
        {subStr}
        <br />
      </>
    );
  });

  const mouseMove = () => {
    clearTimeout(timer1)
    setMouseOver(true)
    setTimer1(setTimeout(() => {
      setMouseOver(false)
    }, 3000));
  }
  
  const videoConfig = {
    fit: "contain",
    mirror: false
  } as VideoPlayerConfig

  return (
    <div 
      className="flex flex-col w-full h-full py-5 gap-y-3" 
      onMouseMove={() => mouseMove()} 
    >
      <div className="room flex flex-grow flex-col items-center justify-center">
        {isConnected  ? (
          <div className="user-list w-full flex flex-row flex-wrap h-full justify-center gap-3  items-center">            
            {remoteUsers.filter((user) => user.hasVideo).map((user) => (
              <div className="user grow min-w-80" key={user.uid}>
                <RemoteUser 
                  user={user}
                  videoPlayerConfig={videoConfig}>
                </RemoteUser>
              </div>
            ))}
          </div>
        ) : (
            
          <div className="join-room flex flex-grow flex-col gap-y-10   items-center">
            <h1 className="text-3xl bold">Cloud Canvas Viewer</h1>
            <div className="flex flex-col grow gap-y-8 justify-center items-center"> 
              <input
              className="text-xl bg-slate-200 text-center px-4 py-2 rounded-lg transition ease-in-out hover:bg-slate-300 duration-400"
                onChange={e => setChannel(e.target.value)}
                placeholder="Insert channel name"
                value={channel}
                type="text"
                pattern="(?:0|[1-9]\d*)"
                inputMode="text"
                autoComplete="off"
                onKeyUp={async (e) => {
                  if (e.key === 'Enter' && appId && channel) {
                    if (await fetchToken())
                      setCalling(true)
                  }
                }}
              />

              <button
                className={`transition ease-in-out text-xl font-bold px-4 py-2 rounded-lg hover:bg-slate-300 duration-400  join-channel ${!appId || !channel ? "disabled" : ""}`}
                disabled={!appId || !channel}
                onClick={async () => {
                  if (await fetchToken())
                    setCalling(true)
                }}
              >
              <span>Join Channel</span>
            </button>
            <span className="text-red-500 text-lg text-center">{addLineBreak(error)}</span>
            </div>
          </div>
        )}
        
      </div>
      {isConnected && (
        <div className={`control fixed bottom-0 py-2 w-full flex justify-center items-center bg-slate-300/50 ${mouseOver ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>
          <button
            className={`btn btn-phone ${calling ? "btn-phone-active" : ""}`}
            onClick={() => setCalling(a => !a)}
          >
            {calling ? <i className="i-phone-hangup" /> : <i className="i-mdi-phone" />}
          </button>
        </div>
      )}
      {!isConnected && (
        <div className="fixed bottom-0 right-0 text-slate-400">
          <span>
              Mediafarm SRL @2025
          </span>
        </div>
      )}
      
    </div>
  );
};

export default VideoCall;