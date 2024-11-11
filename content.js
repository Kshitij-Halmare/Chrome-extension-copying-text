// // Check if html2canvas is already loaded
// if (typeof html2canvas === 'undefined') {
//     const script = document.createElement('script');
//     script.src = chrome.runtime.getURL('libs/html2canvas.min.js'); // Use local file reference
//     document.head.appendChild(script);
//     script.onload = () => console.log('html2canvas loaded successfully.');
// }

// // Check if Tesseract.js is already loaded
// if (typeof Tesseract === 'undefined') {
//     const script = document.createElement('script');
//     script.src = chrome.runtime.getURL('libs/tesseract.min.js'); // Use local file reference
//     document.head.appendChild(script);
//     script.onload = () => console.log('Tesseract.js loaded successfully.');
// }


// Load html2canvas and Tesseract.js locally
function loadScriptIfNeeded(scriptSrc, globalVar, callback) {
    if (typeof window[globalVar] === 'undefined') {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL(scriptSrc);
        script.onload = callback;
        document.head.appendChild(script);
    } else {
        callback();
    }
}

loadScriptIfNeeded('libs/html2canvas.min.js', 'html2canvas', () => console.log('html2canvas loaded successfully.'));
loadScriptIfNeeded('libs/tesseract.min.js', 'Tesseract', () => console.log('Tesseract.js loaded successfully.'));


// Function to start the snipping process
console.log("Content script has been injected and is running.");

// Listen for messages from the background or popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startSnipping") {
        console.log("Snipping action triggered!");
        startSnipping(100, 100);  // Start snipping from the coordinates (100, 100)
    }
});

// Function to create the snipping area
function startSnipping(x, y) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: '9999',
    });
    document.body.appendChild(overlay);

    const snippingArea = document.createElement('div');
    snippingArea.className = 'snipping-area';
    Object.assign(snippingArea.style, {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: '300px',
        height: '200px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        transition: 'transform 0.2s',
    });
    document.body.appendChild(snippingArea);

    const header = document.createElement('div');
    header.className = 'header';
    Object.assign(header.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 15px',
        backgroundColor: '#007BFF',
        color: 'white',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
    });
    snippingArea.appendChild(header);

    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    Object.assign(closeButton.style, {
        marginLeft: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
    });
    closeButton.addEventListener('click', () => {
        document.body.removeChild(snippingArea);
        document.body.removeChild(overlay);
    });
    header.appendChild(closeButton);

    const copyButton = document.createElement('button');
    copyButton.innerText = 'Copy';
    Object.assign(copyButton.style, {
        marginLeft: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
    });
    copyButton.addEventListener('click', () => {
        captureAndProcessText(snippingArea);
    });
    header.appendChild(copyButton);
}

// Function to capture the selected area and process text using Tesseract.js
async function captureAndProcessText(element) {
    try {
        if (typeof html2canvas !== 'undefined') {
            html2canvas(element).then(canvas => {
                canvas.toBlob(async (blob) => {
                    const result = await Tesseract.recognize(blob, 'eng', {
                        logger: m => console.log(m),
                    });
                    console.log('Recognized Text:', result.data.text);
                    alert('Recognized Text: ' + result.data.text);
                });
            });
        } else {
            console.error('html2canvas is not loaded properly.');
        }
    } catch (error) {
        console.error('Error capturing or processing text:', error);
    }
}
