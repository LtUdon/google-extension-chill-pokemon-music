const playPauseBtn = document.getElementById('play-pause-button');
const nextBtn      = document.getElementById('next-button');
const prevBtn      = document.getElementById('prev-button');
const trackName    = document.getElementById('track-name');
const thumbnail    = document.getElementById('thumbnail');
const sourceBtn    = document.getElementById('source-button');

chrome.runtime.sendMessage({ action: 'ensureReady' });

chrome.runtime.onMessage.addListener((message) => {
  if (message.action !== 'stateUpdate') return;
  trackName.textContent    = `${message.track.name} by ${message.track.artist}`;
  thumbnail.src            = message.track.image;
  playPauseBtn.textContent = message.isPlaying ? '||' : '>';
  sourceBtn.onclick        = () => chrome.tabs.create({ url: message.track.url });
});

playPauseBtn.addEventListener('click', () => {
  const action = playPauseBtn.textContent === '>' ? 'play' : 'pause';
  chrome.runtime.sendMessage({ action, target: 'offscreen' });
});

nextBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'next', target: 'offscreen' });
});

prevBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'prev', target: 'offscreen' });
});