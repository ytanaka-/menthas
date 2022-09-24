import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from './Header.jsx';
import Navigation from './Navigation.jsx';
import NewsList from './NewsList.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import Footer from './Footer.jsx';
import { getChannels } from '../libs/api-client';

const App = () => {
  // channelsをstateに、navigationをswipeに渡す
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    (async () => {
      const result = await getChannels();
      const status = result.status;
      if (status === 200) {
        const data = await result.json();
        setChannels(data.channels);
      }
    })();
  }, []);
  
  return (
    <BrowserRouter>
      <GtagWrapper>
        <Header />
        <Navigation channels={channels}/>
        <Routes>
          <Route path="privacy_policy" element={<PrivacyPolicy />} />
          <Route path=":channel" element={<Swipe />} />
          <Route index element={<Swipe />} />
        </Routes>
        <Footer />
      </GtagWrapper>
    </BrowserRouter>
  );
}

const Swipe = () => {
  const params = useParams();
  const channelName = !params.channel ? "all" : params.channel;
  
  return (
    <>
      <>
        <NewsList channelName={channelName}/>
      </>
    </>
  );
}

const GtagWrapper = ({children}) => {
  const location = useLocation();
  useEffect(() => {
    if (window.gtag != undefined) {
      gtag('config', 'UA-63592648-1', {'page_path': location.pathname});
    }
  }, [location.pathname]);

  return (
    <div className="app">
      {children}
    </div>
  )
}

export default App;