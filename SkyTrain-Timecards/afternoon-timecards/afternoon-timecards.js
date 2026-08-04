async function submitAfternoonTimecards() {
    const nicknameMap = await getNicknameMap();
    const data = document.getElementById("pivot-data").value;

    const lines = data
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    const pivotHours = {};

    lines.forEach(line => {
        const parts = line.split(/\t| {2,}/);
        const rawName = parts[0];
        const hours = parseFloat(parts[parts.length - 1]);

        if (rawName && !isNaN(hours)) {
            pivotHours[normalizeName(rawName, nicknameMap)] = hours;
        }
    });

    console.log(JSON.stringify(pivotHours, null, 2));
    alert(`Loaded ${Object.keys(pivotHours).length} employees`);

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "afternoontimecards",
            data: pivotHours
        });
    });
}

document
    .getElementById("submit-afternoon-btn")
    .addEventListener("click", submitAfternoonTimecards);

document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "../popup/popup.html";
});
