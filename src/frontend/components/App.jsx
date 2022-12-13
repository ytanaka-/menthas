import React, { useEffect, useReducer, useRef, createContext, useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import Header from './Header.jsx';
import Navigation from './Navigation.jsx';
import NewsList from './NewsList.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import Footer from './Footer.jsx';
import { getChannels } from '../libs/api-client';

export const MenthasContext = createContext();

export const App = () => {
  const [state, dispatch] = useReducer(reduce, {
    channels: [],
    news: new Map(),
    currentChannel: getChannelNameFromPath(location.pathname)
  });
  useEffect(() => {
    (async () => {
      const result = await getChannels();
      const status = result.status;
      if (status === 200) {
        const data = await result.json();
        dispatch({
          type: 'setChannels', payload: {
            channels: data.channels
          }
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
}

const SwipeWrapper = () => {
  const { state, dispatch } = useContext(MenthasContext);
  const { channels, currentChannel } = state;
  const index = channels.findIndex(channel => channel.name === currentChannel);
  const containerRef = useRef();
  const itemsRef = useRef([]);
  useEffect(() => {
    if (containerRef.current && channels.length > 0) {
      containerRef.current.style.scrollBehavior = "unset";
      const target = itemsRef.current[index];
      if (target) {
        target.scrollIntoView(true);
        // チャンネルを切り替えたときに、スクロール位置を保つ
        window.scrollTo(0, 0);
      }
      containerRef.current.style.scrollBehavior = "smooth";
    }
  }, [channels, currentChannel]);

  const onScroll = (ev) => {
    const scrollLeft = ev.target.scrollLeft;
    const width = ev.target.getBoundingClientRect().width;
    const ratio = (scrollLeft - width * index) / width;
    let nextChannel;
    if (ratio <= -1.0) {
      nextChannel = channels[index - 1].name;
    } else if (ratio >= 1.0) {
      nextChannel = channels[index + 1].name;
    }
    if (nextChannel) {
      dispatch({
        type: 'setCurrentChannel', payload: {
          currentChannel: nextChannel
        }
      });
      if (nextChannel === "all") {
        history.pushState(null, null, "/");
      } else {
        history.pushState(null, null, `/${nextChannel}`);
      }
    }
  }

  return (
    <>
      <div className="swipe" onScroll={onScroll} ref={containerRef} >
        {channels.map((channel, i) => {
          const isActive = i >= index - 1 && i <= index + 1;
          return (
            <div className="swipe-item" data-name={channel.name} key={channel.name} ref={el => itemsRef.current[i] = el} >
              <NewsList category={channel.name} isActive={isActive} />
            </div>
          )
        })}
      </div>
    </>
  );
}

const AppWrapper = ({ children }) => {
  const { dispatch } = useContext(MenthasContext);
  const location = useLocation();
  useEffect(() => {
    dispatch({
      type: 'setCurrentChannel', payload: {
        currentChannel: getChannelNameFromPath(location.pathname)
      }
    });
  }, [location.pathname]);

  return (
    <div className="app">
      {children}
    </div>
  )
}

function reduce(state, action) {
  switch (action.type) {
    case "setLoading":
      return { ...state, loading: action.payload.loading }
    case "setChannels":
      return { ...state, channels: action.payload.channels }
    case "setNews": {
      state.news.set(action.payload.channel, action.payload.pages)
      return state;
    }
    case "setCurrentChannel":
      return { ...state, currentChannel: action.payload.currentChannel }
    default:
      throw new Error();
  }
}

function getChannelNameFromPath(pathname) {
  if (pathname === "/") {
    return "all";
  }
  const s = pathname.split('/');
  if (s.length > 0) {
    return s[1];
  }
  return "all";
}
