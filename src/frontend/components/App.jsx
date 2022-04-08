import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Header from './Header.jsx';
import Navigation from './Navigation.jsx';
import NewsList from './NewsList.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import Footer from './Footer.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Navigation />
        <Routes>
          <Route path="privacy_policy" element={<PrivacyPolicy />} />
          <Route path=":channel" element={<NewsList />} />
          <Route index element={<NewsList />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;