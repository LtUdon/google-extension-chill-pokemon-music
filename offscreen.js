const API_KEY = CONFIG.JAMENDO_KEY;
let tracks = [];
let currentIndex = 0;
let isPlaying = false;
const audio = new Audio();

async function fetchTracks() {
  const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${API_KEY}&format=json&limit=20&tags=lofi&include=musicinfo&audioformat=mp32`;
  const response = await fetch(url);
  const data = await response.json();
  tracks = data.results;
  loadTrack(0);
}

function loadTrack(index) {
  audio.src = tracks[index].audio;
}

function sendState() {
  if (tracks.length === 0) return;
  chrome.runtime.sendMessage({
    action: 'stateUpdate',
    track: {
      name: tracks[currentIndex].name,
      artist: tracks[currentIndex].artist_name,
      image: tracks[currentIndex].image,
      url: tracks[currentIndex].shareurl
    },
    isPlaying
  });
}

audio.addEventListener('ended', () => {
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack(currentIndex);
  audio.play();
  isPlaying = true;
  sendState();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.target !== 'offscreen') return;
  switch (message.action) {
    case 'play':  audio.play();  isPlaying = true;  sendState(); break;
    case 'pause': audio.pause(); isPlaying = false; sendState(); break;
    case 'next':
      currentIndex = (currentIndex + 1) % tracks.length;
      loadTrack(currentIndex);
      if (isPlaying) audio.play();
      sendState();
      break;
    case 'prev':
      currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      loadTrack(currentIndex);
      if (isPlaying) audio.play();
      sendState();
      break;
    case 'getState': sendState(); break;
  }
});

fetchTracks();