export function getChannelNews(name) {
  const headers = new Headers({
    "Content-type": "application/json",
  });
  return fetch(`/api/channels/${name}`, {
    method: "GET",
    headers: headers,
  });
}

export function getChannelList() {
  const headers = new Headers({
    "Content-type": "application/json",
  });
  return fetch(`/api/channels`, {
    method: "GET",
    headers: headers,
  });
}
