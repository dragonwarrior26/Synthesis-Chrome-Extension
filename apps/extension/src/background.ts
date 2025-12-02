// Background service worker
console.log('Synthesis background script loaded')

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) => console.error(error))
