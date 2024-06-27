(function() {
  const htmlText = document.body.innerText;
  const url = window.location.href;

  chrome.runtime.sendMessage({ htmlText: htmlText, url: url }, (response) => {
    console.log(response.status);
  });
})();