function setCookie(name, value, days) 
{
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) 
{
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1);
        }
    }
    return "";
}

settings.addEventListener("click", function() 
{
    settingsMenu.classList.add("show");
});


rules.addEventListener("click", function()
{
    rulesList.style.display = "block";
});

bg1.addEventListener("click", function()
{
    bg1.style.opacity = "0.6";
    bg2.style.opacity = "1.0";
    bg3.style.opacity = "1.0";
    bg4.style.opacity = "1.0";
    setCookie("bg", "1", 30);
});

bg2.addEventListener("click", function()
{
    bg1.style.opacity = "1.0";
    bg2.style.opacity = "0.6";
    bg3.style.opacity = "1.0";
    bg4.style.opacity = "1.0";
    setCookie("bg", "2", 30);
});

bg3.addEventListener("click", function()
{
    bg1.style.opacity = "1.0";
    bg2.style.opacity = "1.0";
    bg3.style.opacity = "0.6";
    bg4.style.opacity = "1.0";
    setCookie("bg", "3", 30);
});

bg4.addEventListener("click", function()
{
    bg1.style.opacity = "1.0";
    bg2.style.opacity = "1.0";
    bg3.style.opacity = "1.0";
    bg4.style.opacity = "0.6";
    setCookie("bg", "4", 30);
});

closeSettings.addEventListener("click", function()
{
    settingsMenu.classList.remove("show");
});

closeRules.addEventListener("click", function()
{
    rulesList.style.display = "none";
});
