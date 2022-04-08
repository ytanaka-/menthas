import React from "react";
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';
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
root.render(<App />);