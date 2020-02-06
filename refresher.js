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

    if(isAnythingOnAWatchlist() && isLoginPage(pageLink))
    {
        console.log("it's a main page! redirecting...");
        let button = document.getElementById("login-button");
        setAfterLogin(1);

        button.onclick.apply(button);
    }    
    else     
    {
        let watchElementParent = document.getElementById("content-wrapper");

        if (watchElementParent != null)
        {
            let watchElement = watchElementParent.getElementsByClassName("content-grid-wrapper")[0];

            if (isAfterLogin() == 1)
            {
                setAfterLogin(2);
                console.log("redirecting...");
                location = getWatchlistJson().page;
            }
            else if (isAfterLogin() == 2)
            {
                setAfterLogin(0);
                console.log("");
                setWatchSettings(pageLink, getWatchlistJson().text);
                refreshPage();
            }
            else if (isThisPageOnAWatchlist(pageLink))
            {
                console.log("this page is on a watchlist!");
                toRefreshPage = true;
                watchElement.style.border = "2px solid green";

                if (isPageChanged(watchElement.innerHTML))
                {
                    console.log("The page has changed!");
                    watchElement.style.border = "10px solid red";

                    var audio = new Audio('https://se.ifmo.ru/~s270245/alert.mp3');
                    audio.play();

                    toRefreshPage = true;
                }        
            }
            else
            { 
                let watch = confirm("Watch for a changes on this page?");
                if (watch) 
                {
                    toRefreshPage = true;
                    watchElement.style.border = "2px solid green";
                    setWatchSettings(pageLink, watchElement.innerHTML);
                }
            }
        }
        if (toRefreshPage)
        {
            console.log("Gonna refresh soon...");
            setTimeout(refreshPage, 60000);
        }
    }
}

function setWatchSettings(page, text)
{
    let wp = new PageWatchpoint(page, text);

    setWatchlistJson(wp);
}

function isLoginPage(page)
{
    console.log(page);
    return page.includes(":LOGIN:");
}

function isThisPageOnAWatchlist(page)
{
    let wp = getWatchlistJson();
    return (wp == null) ? false : wp.page == page;
}

function isAnythingOnAWatchlist()
{
    let wp = getWatchlistJson();
    return wp != null;
}

function isPageChanged(text)
{
    let wp = getWatchlistJson();
    if (wp != null)
    {
        console.log(text);
        console.log(wp.text);
    }
    return (wp == null) ? true : removeRandomValues(wp.text) != removeRandomValues(text);
}

function removeRandomValues(text)
{
    let newtext = text.replace(new RegExp("value=\"[^\"]+\"", "g"), "");
    newtext = newtext.replace(new RegExp("href=\"[^\"]+\"", "g"), "");
    return newtext;
}

function refreshPage()
{
    console.log("refreshing...");
    location.reload();
}

function getWatchlistJson()
{
    let watchlistRaw = sessionStorage.getItem("ISUwatchlist");
    return ((watchlistRaw == null) || (watchlistRaw == undefined)) ? null : JSON.parse(watchlistRaw);
}

function setWatchlistJson(jsonText)
{
    sessionStorage.setItem("ISUwatchlist", JSON.stringify(jsonText));
}

function isAfterLogin()
{
    let afterLogin = sessionStorage.getItem("afterLogin");
    console.log("afterLogin is " + afterLogin);
    return afterLogin == null ? 0 : afterLogin;
}

function setAfterLogin(al)
{
    console.log("setting afterLogin to " + al);
    sessionStorage.setItem("afterLogin", al);
}



//----------//

setTimeout(main, 2500);