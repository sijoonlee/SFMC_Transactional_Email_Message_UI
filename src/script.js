/* initial state */
tabCredentialElm.style.display = "none";
tablistElm.style.display = "none";
tabCreateElm.style.display = "none";

function newText(text) {
    document.getElementById("content").innerHTML = text;
}
function updateClientId(e) {
    clientId = e.target.value;
}

//https://stackoverflow.com/questions/51254618/how-do-you-handle-cors-in-an-electron-app
//https://gist.github.com/Ephraim-Bryski/c218cdff6bbe3ca34a0aa67c1f87a715

/* this is not working well when it's made executable file
window.api.send("askToRead", credentialFileName);

window.api.receive("sendReadContent", (file_name, data) => {
    if (file_name !== credentialFileName){
        return;
    }
    if (data == null) {
        return;
    }

    const parsed = JSON.parse(data);
    if (parsed?.baseUrlKey == null || parsed?.clientId == null || parsed?.clientSecret == null) {
        return;
    }

    baseUrlKey = parsed.baseUrlKey;
    clientId = parsed.clientId;
    clientSecret = parsed.clientSecret;
    console.log('baseUrlKey / clientId / clientSecret were loaded from file');
})
*/
