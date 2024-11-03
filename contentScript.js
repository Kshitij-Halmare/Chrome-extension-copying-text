// script.js

console.log("Content script has been injected and is running.");

let snippingArea;
let isResizing = false;
let isDragging = false;
let startX, startY, startWidth, startHeight;

// Function to create the snipping area
function createSnippingArea(x, y) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Darker overlay
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    snippingArea = document.createElement('div');
    snippingArea.className = 'snipping-area';
    snippingArea.style.position = 'absolute';
    snippingArea.style.left = `${x}px`;
    snippingArea.style.top = `${y}px`;
    snippingArea.style.width = '300px'; // Default width
    snippingArea.style.height = '200px'; // Default height
    snippingArea.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
    snippingArea.style.borderRadius = '10px'; // Rounded corners
    snippingArea.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Soft shadow
    snippingArea.style.zIndex = '10000';
    snippingArea.style.transition = 'transform 0.2s'; // Smooth transition
    document.body.appendChild(snippingArea);

    const header = document.createElement('div');
    header.className = 'header';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.padding = '10px 15px';
    header.style.backgroundColor = '#007BFF'; // Primary color
    header.style.color = 'white'; // Text color
    header.style.borderTopLeftRadius = '10px';
    header.style.borderTopRightRadius = '10px';
    snippingArea.appendChild(header);

    // Create a close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = 'X';
    closeButton.style.marginLeft = '10px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(snippingArea);
        document.body.removeChild(overlay);
    });
    header.appendChild(closeButton);

    // Create a copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = 'Copy';
    copyButton.style.marginLeft = '10px';
    copyButton.style.backgroundColor = 'transparent';
    copyButton.style.border = 'none';
    copyButton.style.color = 'white';
    copyButton.style.cursor = 'pointer';
    copyButton.addEventListener('click', copyToClipboard);
    header.appendChild(copyButton);

    // Create a draggable icon
    const dragIcon = document.createElement('div');
    dragIcon.className = 'drag-icon';
    dragIcon.innerHTML = '☰'; // Hamburger icon for drag
    dragIcon.style.cursor = 'move';
    dragIcon.style.fontSize = '20px';
    header.appendChild(dragIcon);

    // Create a resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resizer';
    resizeHandle.style.width = '12px';
    resizeHandle.style.height = '12px';
    resizeHandle.style.background = '#007BFF'; // Resize handle color
    resizeHandle.style.cursor = 'nwse-resize';
    resizeHandle.style.borderRadius = '50%'; // Circular resize handle
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.right = '10px';
    resizeHandle.style.bottom = '10px';
    snippingArea.appendChild(resizeHandle);

    // Make the area draggable
    dragIcon.addEventListener('mousedown', startDrag);
    resizeHandle.addEventListener('mousedown', startResize);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mouseup', endResize);
}

// Function to copy the content to the clipboard
function copyToClipboard() {
    const extractedText = snippingArea.innerText.replace('X', '').replace('Copy', '').trim(); // Remove button texts

    navigator.clipboard.writeText(extractedText)
        .then(() => {
            console.log('Text copied to clipboard:', extractedText);
            alert('Text copied to clipboard!');
        })
        .catch(err => {
            console.error('Error copying to clipboard: ', err);
        });
}

// Start dragging the snipping area
function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    const rect = snippingArea.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    document.addEventListener('mousemove', drag);
}

// Drag the snipping area
function drag(e) {
    if (isDragging) {
        snippingArea.style.left = `${e.clientX - startX}px`;
        snippingArea.style.top = `${e.clientY - startY}px`;
    }
}

// End dragging the snipping area
function endDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
}

// Start resizing the snipping area
function startResize(e) {
    e.preventDefault();
    isResizing = true;
    const rect = snippingArea.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startWidth = rect.width;
    startHeight = rect.height;
    document.addEventListener('mousemove', resize);
}

// Resize the snipping area
function resize(e) {
    if (isResizing) {
        const newWidth = Math.max(50, startWidth + (e.clientX - startX));
        const newHeight = Math.max(50, startHeight + (e.clientY - startY));
        snippingArea.style.width = `${newWidth}px`;
        snippingArea.style.height = `${newHeight}px`;
    }
}

// End resizing the snipping area
function endResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
}

// Listen for messages from background or popup
console.log("Content script loaded.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startSnipping") {
        console.log("Received startSnipping message in content script.");
        createSnippingArea(100, 100);
        sendResponse({ status: "snipping started" });
    }
});
