let startupDelay = 1000;
let refreshDelay = 20*1000;

setTimeout(main, startupDelay);


//----------//

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
                location = getWatchPage().page;
            }
            else if (isAfterLogin() == 2)
            {
                setAfterLogin(0);
                console.log("");
                setWatchSettings(pageLink, getWatchPage().text);
                refreshPage();
            }
            else if (isThisPageOnAWatchlist(pageLink))
            {
                toRefreshPage = true;
                watchElement.style.border = "2px solid green";

                if (isPageChanged(watchElement.innerHTML))
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
        }
        if (toRefreshPage)
        {
            console.log("Gonna refresh soon...");
            setTimeout(refreshPage, refreshDelay - startupDelay);
        }
    }
}

function setWatchSettings(page, text)
{
    let wp = new PageWatchpoint(page, text);

    setWatchPage(wp);
}

function isLoginPage(page)
{
    return page.includes(":LOGIN:");
}

function isThisPageOnAWatchlist(page)
{
    let wp = getWatchPage();
    return (wp == null) ? false : wp.page == page;
}

function isAnythingOnAWatchlist()
{
    let wp = getWatchPage();
    console.log(1);
    return wp != null;
}

function isPageChanged(text)
{
    let wp = getWatchPage();
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
    location.reload();
}

function getWatchPage()
{
    let watchPage = sessionStorage.getItem("ISUwatchpage");
    console.log(watchPage);
    return ((watchPage == null) || (watchPage == undefined)) ? null : JSON.parse(watchPage);
}

function setWatchPage(watchPage)
{
    sessionStorage.setItem("ISUwatchpage", JSON.stringify(watchPage));
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