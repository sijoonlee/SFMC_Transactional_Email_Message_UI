/* tab credential */
const tabCredentialElm = document.getElementById("tab-credential");
tabCredentialElm.innerHTML = `
        <div class="grid grid-cols-8 gap-1">
            <label class="col-span-2 text-neutral-100 rounded-md bg-blue-500 shadow-blue-300/50 shadow-lg p-3" for='BaseUrlKey'>Base URL Key</label>
            <input class="col-span-5 text-black-100 rounded-md bg-lime-50 shadow-blue-300/50 shadow-lg p-3" id='BaseUrlKey' type='password'>
            <div class='col-span-1 flex flex-row justify-center'><input type='checkbox' onclick="toggleHidePassword('BaseUrlKey')"></div>
            <label class="col-span-2 text-neutral-100 rounded-md bg-blue-500 shadow-blue-300/50 shadow-lg p-3" for='ClientId'>Client Id</label>
            <input class="col-span-5 text-black-100 rounded-md bg-lime-50 shadow-blue-300/50 shadow-lg p-3" id='ClientId' type='password'>
            <div class='col-span-1 flex flex-row justify-center'><input type='checkbox' onclick="toggleHidePassword('ClientId')"></div>
            <label class="col-span-2 text-neutral-100 rounded-md bg-blue-500 shadow-blue-300/50 shadow-lg p-3" for='ClientSecret'>Client Secret</label>
            <input class="col-span-5 text-black-100 rounded-md bg-lime-50 shadow-blue-300/50 shadow-lg p-3" id='ClientSecret' type='password'>
            <div class='col-span-1 flex flex-row justify-center'><input type='checkbox' onclick="toggleHidePassword('ClientSecret')"></div>
        </div>
    `;

const inputBaseUrlKey = document.getElementById("BaseUrlKey");
inputBaseUrlKey.addEventListener('input', (evt) => { baseUrl = evt.target.value; });
const inputClientId = document.getElementById("ClientId");
inputClientId.addEventListener('input', (evt) => { clientId = evt.target.value; });
const inputClientSecret = document.getElementById("ClientSecret");
inputClientSecret.addEventListener('input', (evt) => { clientSecret = evt.target.value; });


function showTabCredential() {
    tabCredentialElm.style.display = "block";
    tablistElm.style.display = "none";
    tabCreateElm.style.display = "none";

    if (baseUrlKey != null) {
        inputBaseUrlKey.value = baseUrlKey;
    }
    if (clientId != null) {
        inputClientId.value = clientId;
    }
    if (clientSecret != null) {
        inputClientSecret.value = clientSecret;
    }
    // window.api.send("askToWrite", "to_write.json", JSON.stringify(data_to_write))
}

function toggleHidePassword(elementId) {
    const x = document.getElementById(elementId);

    if (x == null) {
        return;
    }

    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
}