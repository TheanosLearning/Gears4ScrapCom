let cardsURL = "https://gearsofwar.com/cards";

function openInNewTab(url) {
    let win = window.open(url, '_blank');
    win.focus();
}

chrome.browserAction.onClicked.addListener(() => openInNewTab(cardsURL));