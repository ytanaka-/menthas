import React, { useEffect, useReducer } from "react";
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

function getPathnameToChannelName(pathname) {
  if (pathname === "/") {
    return "all";
  }
  const s = pathname.split('/');
  if (s.length > 0) {
    return s[1];
  }
  return "all";
}

const App = () => {
  const [state, dispatch] = useReducer(reduce, {
    loading: false,
    channels: [],
    news: new Map(),
    currentChannel: getPathnameToChannelName(location.pathname)
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
    <BrowserRouter>
      <GtagWrapper state={state} dispatch={dispatch} >
        <Header />
        <Navigation currentChannel={state.currentChannel} channels={state.channels} />
        <Routes>
          <Route path="privacy_policy" element={<PrivacyPolicy />} />
          <Route path=":channel" element={<SwipeWrapper state={state} dispatch={dispatch} />} />
          <Route index element={<SwipeWrapper state={state} dispatch={dispatch} />} />
        </Routes>
        <Footer />
      </GtagWrapper>
    </BrowserRouter>
  );
}

const SwipeWrapper = ({ state, dispatch }) => {
  /*
  const params = useParams();
  const channelName = state.currentChannel;
  if (channels.length === 0) {
    return null;
  }
  const index = channels.findIndex(channel => channel.name === channelName);
  const viewChannelNames = [];
  if (index === 0) {
    viewChannelNames.push(channels[0].name);
    viewChannelNames.push(channels[1].name);
  } else if (index === channels.length - 1) {
    viewChannelNames.push(channels[channels.length - 2].name);
    viewChannelNames.push(channels[channels.length - 1].name);
  } else {
    viewChannelNames.push(channels[index - 1].name);
    viewChannelNames.push(channels[index].name);
    viewChannelNames.push(channels[index + 1].name);
  }
  */

  return (
    <>
      <div className="swipe">
        <div className="swipe-item" >
          <NewsList category={state.currentChannel} state={state} dispatch={dispatch} />
        </div>   
        <div className="swipe-item" >
          <NewsList category={"javascript"} state={state} dispatch={dispatch} />
        </div> 
      </div>
    </>
  );
}

const GtagWrapper = ({ state, dispatch, children }) => {
  const location = useLocation();
  useEffect(() => {
    if (window.gtag != undefined) {
      gtag('config', 'UA-63592648-1', { 'page_path': location.pathname });
    }
    dispatch({
      type: 'setCurrentChannel', payload: {
        currentChannel: getPathnameToChannelName(location.pathname)
      }
    });
  }, [location.pathname]);

  return (
    <div className="app">
      {children}
    </div>
  )
}

export default App;