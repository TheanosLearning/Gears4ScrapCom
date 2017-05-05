// pad the main-menu so credits icon doesn't overflow when scrap is loaded
document.getElementById('main-menu').style.paddingBottom = "5px";

(function injectStyle() {
    let style = document.createElement('link');
    style.rel = "stylesheet"; style.type = "text/css";
    style.href = chrome.extension.getURL("/styles/scrap.css");
    document.head.appendChild(style);
})();

function addSpinner() {
    let wallet = document.querySelector('img[alt="Cards_CreditBalance"]').closest('div');
    let spinner = document.createElement('div');
    spinner.id = 'scrap-spinner';
    spinner.innerHTML = `<img alt="SpinnerSprite" class="loading" src="${chrome.extension.getURL("/img/spinner20.png")}">`;
    wallet.insertBefore(spinner, wallet.firstChild);
};

function removeElementById(id) {
    let element = document.getElementById(id);
    if (element) {
        element.remove();
    }
};

let updateScrap = function scrapCom() {

    let xhttp = new XMLHttpRequest();
    let parser = new DOMParser();
    let locale = document.URL.split("/")[3];
    // select a card EVERYONE has (Starter Emblem)
    let scrapURL = "https://gearsofwar.com/" + locale + "/cards/my-cards/StarterEmblem";
    removeElementById('scrap-com');
    addSpinner();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let gow4Data = JSON.parse(parser.parseFromString(this.responseText, "text/html")
                .getElementById('initialState').textContent);
            let scrapBalance = gow4Data.store.Wallet.ScrapBalance;
            if (scrapBalance === 0) {
                console.warn("Is the user signed in?");
            }
            removeElementById('scrap-spinner');
            displayScrap(scrapBalance);
       }
    };

    xhttp.open("GET", scrapURL, true);
    xhttp.send();

    function displayScrap(scrapBalance) {
        let wallet = document.querySelector('img[alt="Cards_CreditBalance"]').closest('div');
        let scrap = document.createElement('p');
        scrap.id = 'scrap-com';
        scrap.innerHTML =   `<img alt="Cards_ScrapBalance" class="scrapIcon" src="${chrome.extension.getURL("/img/scrap20.png")}">
                             <span id="scrapCounter" class="scrapCounter">${scrapBalance.toLocaleString()}</span>`;

        wallet.insertBefore(scrap, wallet.firstChild);
    };

}

updateScrap();

function dust(event) {
    let key;
    let element = event.target;
    let btn = element.closest('button');
    if (btn) {
    	let craftBtn = btn.querySelector("[data-loc-key]");
    	if (craftBtn) { key = craftBtn.dataset.locKey; }
    }
    if (key && (key.includes("DestroySingle") || key.includes("DestroyDuplicates") || key.includes("CraftSingle"))) {
        let scrapCounter = document.getElementById('scrapCounter');
        // select the target node
        let target = document.querySelector(".walletCounter");
        // create an observer instance
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                let newScrap = mutation.addedNodes[0].data;
                scrapCounter.innerText = newScrap;
            });
        });
        // configuration of the observer:
        let config = { attributes: true, childList: true, characterData: true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    }
}

document.body.addEventListener("click", dust);

