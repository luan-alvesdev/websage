(function() {
  const htmlText = document.body.innerHTML;
  chrome.runtime.sendMessage({ htmlText: htmlText }, (response) => {
    console.log(response.status);
  });
})();