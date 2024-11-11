// Listens for when the popup is opened
document.addEventListener("DOMContentLoaded", function () {
    const startSnipBtn = document.getElementById('startSnipBtn');
    const statusMessage = document.getElementById('statusMessage');

    // Listener to trigger the snipping action
    startSnipBtn.addEventListener('click', function () {
        // Send a message to the content script to start the snipping
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "startSnipping" });

            // Update the status message
            statusMessage.textContent = "Snipping in progress...";
        });
    });
});
