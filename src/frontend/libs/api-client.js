export function getChannel(name) {
  const headers = new Headers({
    "Content-type": "application/json"
  });
  return fetch(`/api/channels/${name}`, {
    method: 'GET',
    headers: headers
  });
}

export function getChannels() {
  const headers = new Headers({
    "Content-type": "application/json"
  });
  return fetch(`/api/channels`, {
    method: 'GET',
    headers: headers
  });
}
