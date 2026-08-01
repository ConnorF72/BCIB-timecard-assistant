// parseNicknameMap(), getNicknameMap() and normalizeName() now come from
// ../shared/shared.js, loaded via a <script> tag before this file.

async function submitDaysOff() {
    const nicknameMap = await getNicknameMap();
    const pasted = document.getElementById("pivot-data").value;

    const offList = pasted
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean)
        .map(name => normalizeName(name, nicknameMap));

    console.log(offList);
    alert(`Loaded ${offList.length} employees`);

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "daysoff",
            data: offList
        });
    });
}

document
    .getElementById("submit-timecards-btn")
    .addEventListener("click", submitDaysOff);

document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "../popup/popup.html";
});
