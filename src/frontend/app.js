import React from "react";
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from './components/App.jsx';
import NewsList from './components/NewsList.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import "./css/app.css";

/*
router.afterEach((to, from) => {
  if (window.gtag != undefined) {
    gtag('config', 'UA-63592648-1', {'page_path': to.path});
  }
})
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App),
  created () {
    this.$store.dispatch('getChannels', {})
  }
});
*/

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="privacy_policy" element={<PrivacyPolicy />} />
      <Route path=":channel" element={<NewsList />} />
    </Routes>
  </BrowserRouter>
);