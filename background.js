const OFFSCREEN_PATH = 'offscreen.html';

async function ensureOffscreenDocument() {
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL(OFFSCREEN_PATH)]
  });
  if (contexts.length > 0) return;
  await chrome.offscreen.createDocument({
    url: OFFSCREEN_PATH,
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Background music playback for Pokemon Chill'
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'ensureReady') {
    ensureOffscreenDocument().then(() => {
      chrome.runtime.sendMessage({ action: 'getState', target: 'offscreen' });
    });
  }
});