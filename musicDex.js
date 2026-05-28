const API_KEY = CONFIG.JAMENDO_KEY;

let tracks = [];
let currentIndex = 0;
let isPlaying    = false;

const audio        = new Audio();
const playPauseBtn = document.getElementById("play-pause-button");
const nextBtn      = document.getElementById("next-button");
const prevBtn      = document.getElementById("prev-button");
const trackName    = document.getElementById("track-name");
const thumbnail    = document.getElementById("thumbnail");
const sourceBtn    = document.getElementById('source-button');

async function fetchChillMusic() {
  const url      = `https://api.jamendo.com/v3.0/tracks/?client_id=${API_KEY}&format=json&limit=20&tags=lofi&include=musicinfo&audioformat=mp32`;
  const response = await fetch(url);
  const data     = await response.json();
  tracks         = data.results;
  loadTrack(0);
}

chrome.runtime.sendMessage({ action: 'ensureReady' });

chrome.runtime.onMessage.addListener((message) => {
  if (message.action !== 'stateUpdate') return;
  trackName.textContent    = `${message.track.name} — ${message.track.artist}`;
  thumbnail.src            = message.track.image;
  playPauseBtn.textContent = message.isPlaying ? '||' : '▶';
  console.log('Received state update:', message);
  sourceBtn.onclick        = () => chrome.tabs.create({ url: message.track.url });
});

function loadTrack(index) {
  const track           = tracks[index];
  audio.src             = track.audio;
  trackName.textContent = `${track.name} — ${track.artist_name}`;
  thumbnail.src         = track.image;
}

playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = ">";
  } else {
    audio.play();
    playPauseBtn.textContent = "||";
  }
  isPlaying = !isPlaying;
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack(currentIndex);
  if (isPlaying) audio.play();
});

prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentIndex);
    if (isPlaying) audio.play();
})

audio.addEventListener("ended", () => {
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack(currentIndex);
  audio.play();
});

fetchChillMusic();