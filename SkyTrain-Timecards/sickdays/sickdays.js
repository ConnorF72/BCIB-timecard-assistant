
async function submitSickDays() {
    const nicknameMap = await getNicknameMap();
    const pasted = document.getElementById("pivot-data").value;

    const sickList = pasted
        .split("\n")
        .map(n => n.trim())
        .filter(Boolean)
        .map(name => normalizeName(name, nicknameMap));

    console.log(sickList);
    alert(`Loaded ${sickList.length} employees`);

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "sickdays",
            data: sickList
        });
    });
}

document
    .getElementById("submit-timecards-btn")
    .addEventListener("click", submitSickDays);

document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "../popup/popup.html";
});
