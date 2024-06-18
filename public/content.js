(function() {
  const htmlText = document.body.innerText;
  chrome.runtime.sendMessage({ htmlText: htmlText }, (response) => {
    console.log(response.status);
  });
})();