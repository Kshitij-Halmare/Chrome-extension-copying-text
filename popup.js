document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('copy-text').addEventListener('click', copyText);
    document.getElementById('open-options').addEventListener('click', openOptionsPage);
    document.getElementById('snip-button').addEventListener('click', startSnipping); // Add this line
});

// Function to open the options page
function openOptionsPage() {
    chrome.runtime.openOptionsPage(() => {
        if (chrome.runtime.lastError) {
            console.error(`Error opening options page: ${chrome.runtime.lastError}`);
        }
    });
}

// Function to copy text to clipboard
function copyText() {
    const outputText = document.getElementById('extractedText').innerText;
    navigator.clipboard.writeText(outputText).then(() => {
        alert("Text copied to clipboard!");
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
}

// Function to initiate the snipping process
function startSnipping() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && !activeTab.url.startsWith("chrome://")) {
            chrome.tabs.sendMessage(activeTab.id, { action: "startSnipping" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message:", chrome.runtime.lastError.message);
                } else {
                    console.log("Snipping started.");
                }
            });
        }
    });
}
