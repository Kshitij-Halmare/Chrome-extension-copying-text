chrome.commands.onCommand.addListener((command) => {
    console.log('Command received:', command); // Add this to verify if the command is detected
    if (command === "start-snipping") {
        console.log("Shortcut detected, sending message to content script.");

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const activeTab = tabs[0];
                console.log('Active Tab:', activeTab);  // Check activeTab details
                chrome.tabs.sendMessage(activeTab.id, { action: "startSnipping" }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message:", chrome.runtime.lastError.message);
                    } else {
                        console.log("Message sent successfully.");
                    }
                });
            }
        });
    }
});
