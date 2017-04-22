// pad the main-menu so credits icon doesn't overflow when scrap is loaded
document.getElementById('main-menu').style.paddingBottom = "5px";

let scrap = function scrapCom() {

    let xhttp = new XMLHttpRequest();
    let parser = new DOMParser();
    let locale = document.URL.split("/")[3];
    // select a card EVERYONE has (Starter Emblem)
    let scrapURL = "https://gearsofwar.com/" + locale + "/cards/my-cards/StarterEmblem";
    let wallet = document.querySelector('img[alt="Cards_CreditBalance"]').closest('div');
    injectStyle();
    addSpinner();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let gow4Data = JSON.parse(parser.parseFromString(this.responseText, "text/html")
                .getElementById('initialState').textContent);
            let scrapBalance = gow4Data.store.Wallet.ScrapBalance;
            if (scrapBalance === 0) {
                console.warn("Is the user signed in?");
            }
            removeSpinner();
            displayScrap(scrapBalance);
       }
    };

    xhttp.open("GET", scrapURL, true);
    xhttp.send();

    function displayScrap(scrapBalance) {
        let scrap = document.createElement('p');
        scrap.innerHTML =   `<img alt="Cards_ScrapBalance" class="scrapIcon" src="${chrome.extension.getURL("/img/scrap20.png")}">
                            <span class="scrapCounter">${scrapBalance.toLocaleString()}</span>`;

        wallet.insertBefore(scrap, wallet.firstChild);
    };

    function injectStyle() {
        let style = document.createElement('link');
        style.rel = "stylesheet"; style.type = "text/css";
        style.href = chrome.extension.getURL("/styles/scrap.css");
        document.head.appendChild(style);
    };

    function addSpinner() {
        let spinner = document.createElement('div');
        spinner.id = "scrap-spinner";
        spinner.innerHTML = `<img alt="SpinnerSprite" class="loading" src="${chrome.extension.getURL("/img/spinner20.png")}">`;
        wallet.insertBefore(spinner, wallet.firstChild);
    };

    function removeSpinner() {
        let spinner = document.getElementById('scrap-spinner');
        if(spinner) {
            spinner.remove();
        }
    };

}

scrap();