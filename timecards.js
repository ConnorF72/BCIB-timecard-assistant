const NICKNAME_MAP = {
    mike: "michael",
    nick: "nicholas",
    nate: "nathaniel",
    nathan: "nathaniel",
    claire: "ivy",
    bob: "robert",
    rob: "robert",
    ben: "benjamin",
    will: "william",
    bill: "william",
    rich: "richard",
    chris: "christopher",
    dave: "david",
    jenn: "jennifer",
    jen: "jennifer",
    doug: "douglas",
    matt: "matthew",
    dan: "daniel",
    ron: "ronald",
    ray: "raymond",
    josh: "joshua",
    carson: "robert",
    katie: "katharine",
    cole: "adam",
    annette: "yvonne",
    chad: "donald",
    maegen: "maegan"
};

function normalizeName(str) {
    const cleaned = str
        .toLowerCase()
        .replace(/\(.*?\)/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const parts = cleaned.split(" ");

    if (parts.length < 2) {
        return cleaned;
    }

    const firstName = parts[0];
    const lastName = parts[parts.length - 1];

    const canonicalFirst =
        NICKNAME_MAP[firstName] || firstName;

    return `${canonicalFirst} ${lastName}`;
}

function submitTimecards() {

    const data =
        document.getElementById("pivot-data").value;

    const lines = data
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    const pivotHours = {};

    lines.forEach(line => {

        const parts =
            line.split(/\t| {2,}/);

        const rawName = parts[0];

        const hours =
            parseFloat(
                parts[parts.length - 1]
            );

        if (
            rawName &&
            !isNaN(hours)
        ) {
            pivotHours[
                normalizeName(rawName)
            ] = hours;
        }

    });

    console.log(
        JSON.stringify(
            pivotHours,
            null,
            2
        )
    );

    alert(
        `Loaded ${Object.keys(pivotHours).length} employees`
    );

    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        tabs => {

            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    action: "timecards",
                    data: pivotHours
                }
            );

        }
    );
}

document
    .getElementById("submit-timecards-btn")
    .addEventListener(
        "click",
        submitTimecards
    );

document
    .getElementById("back-btn")
    .addEventListener(
        "click",
        () => {
            window.location.href =
                "popup.html";
        }
    );