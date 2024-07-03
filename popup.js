document.getElementById('cleanButton').addEventListener('click', () => {
  const spinner = document.getElementById('spinner');
  spinner.style.display = 'block';

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js']
    }, () => {
      spinner.style.display = 'none';
    });
  });
});
