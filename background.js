chrome.commands.onCommand.addListener((command) => {
    if (command === "start-snipping") {
        console.log("Shortcut detected, sending message to content script.");

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const activeTab = tabs[0];

                // Check if the tab URL is not a chrome:// URL
                if (!activeTab.url.startsWith("chrome://")) {
                    chrome.tabs.sendMessage(activeTab.id, { action: "startSnipping" }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error("Error sending message:", chrome.runtime.lastError.message);
                        } else {
                            console.log("Message sent to content script.");
                        }
                    });
                } else {
                    console.error("Cannot execute script on a chrome:// page.");
                }
            } else {
                console.error("No active tab found.");
            }
        });
    }
});


