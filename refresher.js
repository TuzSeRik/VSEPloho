// Main constant, defines what price we will look for
let CHOSEN_PRICE = 50000;

// Reload
let STARTUP_DELAY = 15000;
let AWAIT_TIME = 60000;

// Used functions
class PageWatchpoint {
    constructor(page, text) {
        this.page = page;
        this.text = text;
    }
}

function setWatchSettings(page, text) {
    let wp = new PageWatchpoint(page, text);

    setWatchPage(wp);
}

function setWatchPage(watchPage) {
    sessionStorage.setItem("watchpage", JSON.stringify(watchPage));
}

function getWatchPage() {
    let watchPage = sessionStorage.getItem("watchpage");
    return ((watchPage == null) || (watchPage == undefined)) ? null : JSON.parse(watchPage);
}

function refreshPage() {
    location.reload();
}



// Main block
setTimeout(main, STARTUP_DELAY);

function main() {
    let pageLink = window.location.href;
    let watchElement = 
                        document.getElementsByClassName("title-3-bold_03dd9f9 mobile-title-3-bold_03dd9f9 ticket-desktop__price")[0]
                        .getElementsByClassName("price_85d2b9c")[0];

    setWatchSettings(pageLink, watchElement);

    console.log("Unformated price is - " + watchElement.innerText)
    var price = Number(watchElement.innerText.slice(0, -1).replace(/\s/g,''))

    if (price <= CHOSEN_PRICE) {
        watchElement.style.border = "10px solid red";

        var audio = new Audio(browser.extension.getURL("audio/alert.mp3"));
        audio.play();
    }
    else {
        watchElement.style.border = "2px solid green";
        setTimeout(refreshPage, AWAIT_TIME);
    }
}
