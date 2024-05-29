chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    const currentUrl = currentTab.url;
    chrome.runtime.sendMessage({ url: currentUrl });
});