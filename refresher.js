//----------//

let CHOSEN_PRICE = 500000;

//----------//

let startupDelay = 1000;
let refreshDelay = 20*1000;

setTimeout(main, startupDelay);

class PageWatchpoint {
    constructor(page, text)
    {
        this.page = page;
        this.text = text;
    }
}

function main()
{
    console.log("launching the watcher");
    let pageLink = window.location.href;
    
    let toRefreshPage = false;

    let watchElement = document.getElementsByClassName("price_85d2b9c")[0];
    
    if (isThisPageOnAWatchlist(pageLink))
    {
        toRefreshPage = true;

        watchElement.style.border = "2px solid green";

        if (watchElement.textContent <= CHOSEN_PRICE)
        {
            watchElement.style.border = "10px solid red";

            var audio = new Audio(browser.extension.getURL("audio/alert.mp3"));
            audio.play();

            toRefreshPage = true;
        }        
    }
    else
    { 
        let watch = confirm("Watch for changes on this page?");
        if (watch) 
        {
            toRefreshPage = true;
            watchElement.style.border = "2px solid green";
            setWatchSettings(pageLink, watchElement.innerHTML);
        }
    }

    if (toRefreshPage)
    {
        console.log("Gonna refresh soon...");
        setTimeout(refreshPage, refreshDelay - startupDelay);
    }
}

function getWatchPage()
{
    let watchPage = sessionStorage.getItem("watchpage");
    console.log(watchPage);
    return ((watchPage == null) || (watchPage == undefined)) ? null : JSON.parse(watchPage);
}

function setWatchSettings(page, text)
{
    let wp = new PageWatchpoint(page, text);

    setWatchPage(wp);
}

function isThisPageOnAWatchlist(page)
{
    let wp = getWatchPage();
    return (wp == null) ? false : wp.page == page;
}

function refreshPage()
{
    location.reload();
}

function setWatchPage(watchPage)
{
    sessionStorage.setItem("ISUwatchpage", JSON.stringify(watchPage));
}
