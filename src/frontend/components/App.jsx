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


export const MenthasContext = createContext();

export const App = () => {
  const [state, dispatch] = useReducer(reduce, {
    loading: false,
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

// useObserverみたいなのを作る
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
        window.scrollTo(0, 0);
      }
      containerRef.current.style.scrollBehavior = "smooth";
    }
  }, [channels, currentChannel]);

  const channelsRef = useRef(null);
  const currentChannelRef = useRef(null);
  channelsRef.current = channels;
  currentChannelRef.current = currentChannel;
  const onScroll = (ev) => {
    const index = channelsRef.current.findIndex(channel => channel.name === currentChannelRef.current);
    const scrollLeft = ev.target.scrollLeft;
    const width = ev.target.getBoundingClientRect().width;
    const ratio = (scrollLeft - width * index) / width;
    let nextChannel;
    if (ratio <= -1.0) {
      nextChannel = channelsRef.current[index-1].name;
    } else if (ratio >= 1.0) {
      nextChannel = channelsRef.current[index+1].name;
    }
    if (nextChannel) {
      dispatch({
        type: 'setCurrentChannel', payload: {
          currentChannel: nextChannel
        }
      });
    }
  }
  useEffect(() => {
    containerRef.current.addEventListener('scroll', onScroll);
    return () => containerRef.current.removeEventListener('scroll', onScroll);
  }, [])

  return (
    <>
      <div className="swipe" ref={containerRef}>
        {channels.map((channel, i) => {
          return (
            <div className="swipe-item" data-name={channel.name} key={channel.name} ref={el => itemsRef.current[i] = el} >
              <NewsList category={channel.name} />
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
