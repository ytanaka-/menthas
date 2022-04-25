import React, { useEffect } from "react";
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

const App = () => {
  return (
    <BrowserRouter>
      <GtagWrapper>
        <Header />
        <Navigation />
        <Routes>
          <Route path="privacy_policy" element={<PrivacyPolicy />} />
          <Route path=":channel" element={<NewsList />} />
          <Route index element={<NewsList />} />
        </Routes>
        <Footer />
      </GtagWrapper>
    </BrowserRouter>
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