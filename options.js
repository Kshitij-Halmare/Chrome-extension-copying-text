document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveOptions').addEventListener('click', saveOptions);

function saveOptions() {
    const language = document.getElementById('language').value;
    const frameRate = document.getElementById('frameRate').value;
    const formatting = document.getElementById('formatting').value;
    const saveHistory = document.getElementById('saveHistory').checked;

    chrome.storage.sync.set({
        language: language,
        frameRate: frameRate,
        formatting: formatting,
        saveHistory: saveHistory
    }, () => {
        alert('Options saved.');
    });
}

function restoreOptions() {
    chrome.storage.sync.get(['language', 'frameRate', 'formatting', 'saveHistory'], (items) => {
        document.getElementById('language').value = items.language || 'eng';
        document.getElementById('frameRate').value = items.frameRate || '1';
        document.getElementById('formatting').value = items.formatting || 'original';
        document.getElementById('saveHistory').checked = items.saveHistory !== false;
    });
}
