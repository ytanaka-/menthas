import React, { useState, useRef, useEffect } from "react";
import Header from './Header.jsx';
import Navigation from './Navigation.jsx';
import Footer from './Footer.jsx';

const App = () => {
  return (
    <>
      <div className="app">
        <Header />
        <Navigation />
        
        <Footer />
      </div>
    </>
  );
}

export default App;