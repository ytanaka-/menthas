import React, {
  useEffect,
  useReducer,
  useRef,
  createContext,
  useContext,
  useState,
} from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./header.jsx";
import { Navigation } from "./navigation.jsx";
import { NewsList } from "./news-list.jsx";
import { PrivacyPolicy } from "./privacy-policy.jsx";
import { Footer } from "./footer.jsx";
import { getChannelList } from "../lib/api-client.js";

export const MenthasContext = createContext();
const kActivateNextNum = 1;

export const App = () => {
  const [state, dispatch] = useReducer(reduce, {
    channels: [],
    news: new Map(),
    currentChannel: getChannelNameFromPath(location.pathname),
  });
  useEffect(() => {
    (async () => {
      const result = await getChannelList();
      const status = result.status;
      if (status === 200) {
        const data = await result.json();
        dispatch({
          type: "setChannels",
          payload: {
            channels: data.channels,
          },
        });
      }
    })();
  }, []);

  return (
    <MenthasContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <AppWrapper>
          <Header />
          <Navigation />
          <Routes>
            <Route path="privacy_policy" element={<PrivacyPolicy />} />
            <Route path=":channel" element={<SwipeWrapper />} />
            <Route index element={<SwipeWrapper />} />
          </Routes>
          <Footer />
        </AppWrapper>
      </BrowserRouter>
    </MenthasContext.Provider>
  );
};

const SwipeWrapper = () => {
  const { state, dispatch } = useContext(MenthasContext);
  const { channels, currentChannel } = state;
  const [timerId, setTimerId] = useState();
  const index = channels.findIndex(
    (channel) => channel.name === currentChannel,
  );
  const containerRef = useRef();
  const itemsRef = useRef([]);
  useEffect(() => {
    if (containerRef.current && channels.length > 0) {
      containerRef.current.style.scrollBehavior = "unset";
      const target = itemsRef.current[index];
      if (target) {
        const scrollY = window.scrollY;
        const offsetTop = containerRef.current.offsetTop;
        target.scrollIntoView(true);
        if (scrollY < offsetTop) {
          window.scrollTo(0, 0);
        } else {
          // チャンネルを切り替えたときに、ある程度スクロールしていたら位置を保つ
          window.scrollTo(0, scrollY);
        }
      }
      containerRef.current.style.scrollBehavior = "smooth";
    }
  }, [channels, currentChannel]);

  const onScroll = (ev) => {
    clearTimeout(timerId);
    const _id = setTimeout(() => syncChannelTab(ev), 100);
    setTimerId(_id);
  };
  const syncChannelTab = (ev) => {
    const scrollLeft = ev.target.scrollLeft;
    const width = ev.target.getBoundingClientRect().width;
    // scroll終了時にいくつタブを動いたかを計算する
    const ratio = (scrollLeft - width * index) / width;
    // snapの度合いがほぼ完了していない状態でチャンネルを切り替えるとチラつく
    // roundしているのはスマホの場合なぜか微小な誤差が出てピッタリratioが整数にならないため
    const moveNum = Math.round(ratio * 1000000) / 1000000;
    if (!Number.isInteger(moveNum) || moveNum === 0) {
      return;
    }
    const nextChannel = channels[index + moveNum].name;
    if (nextChannel) {
      dispatch({
        type: "setCurrentChannel",
        payload: {
          currentChannel: nextChannel,
        },
      });
      if (nextChannel === "all") {
        history.pushState(null, null, "/");
      } else {
        history.pushState(null, null, `/${nextChannel}`);
      }
    }
  };

  return (
    <>
      <div className="swipe" onScroll={onScroll} ref={containerRef}>
        {channels.map((channel, i) => {
          const isActive =
            i >= index - kActivateNextNum && i <= index + kActivateNextNum;
          return (
            <div
              className="swipe-item"
              data-name={channel.name}
              key={channel.name}
              ref={(el) => (itemsRef.current[i] = el)}
            >
              <NewsList category={channel.name} isActive={isActive} />
            </div>
          );
        })}
      </div>
    </>
  );
};

const isMaybeTouchDevice = () => {
  return window.matchMedia("(pointer: coarse)").matches;
};

const AppWrapper = ({ children }) => {
  const { dispatch } = useContext(MenthasContext);
  const location = useLocation();
  useEffect(() => {
    dispatch({
      type: "setCurrentChannel",
      payload: {
        currentChannel: getChannelNameFromPath(location.pathname),
      },
    });
  }, [location.pathname]);
  const onContextMenu = (ev) => {
    if (isMaybeTouchDevice()) {
      // スマホ・タブレットの場合は長押しタップで右クリックメニューが出てしまうので無効化する
      ev.preventDefault();
    }
  };

  return (
    <div className="app" onContextMenu={onContextMenu}>
      {children}
    </div>
  );
};

function reduce(state, action) {
  switch (action.type) {
    case "setLoading":
      return { ...state, loading: action.payload.loading };
    case "setChannels":
      return { ...state, channels: action.payload.channels };
    case "setNews": {
      state.news.set(action.payload.channel, action.payload.pages);
      return state;
    }
    case "setCurrentChannel":
      return { ...state, currentChannel: action.payload.currentChannel };
    default:
      throw new Error();
  }
}

function getChannelNameFromPath(pathname) {
  if (pathname === "/") {
    return "all";
  }
  const s = pathname.split("/");
  if (s.length > 0) {
    return s[1];
  }
  return "all";
}
