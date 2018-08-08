require('es6-promise').polyfill();
require('isomorphic-fetch');

class APIClient {

  getChannel(name) {
    const headers = new Headers({
      "Content-type" : "application/json"
    });
    return fetch(`/api/channels/${name}`, { 
      method: 'GET',
      headers: headers
    });
  }

  getChannels() {
    const headers = new Headers({
      "Content-type" : "application/json"
    });
    return fetch(`/api/channels`, { 
      method: 'GET',
      headers: headers
    });
  }

}

module.exports = new APIClient()