chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'newField') {
    chrome.storage.local.set({ newField: request.fieldName });
  }
});
