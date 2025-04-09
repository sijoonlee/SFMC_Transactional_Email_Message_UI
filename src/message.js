const messageElm = document.getElementById("message");
messageElm.style.zIndex = -1000;
messageElm.style.display = "none";

function showMessage(message = "Please wait") {
    messageElm.innerHTML = `<div class="p-10 bg-blue-100 text-black-500">${message}</div>`;
    messageElm.style.display = "block";
    messageElm.style.zIndex = 1000;
}

function closeMessage() {
    messageElm.style.display = "none";
    messageElm.style.zIndex = -1000;
}