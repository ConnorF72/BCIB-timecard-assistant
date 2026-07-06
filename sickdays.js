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
        .replace(/\./g, "")
        .replace(/\s+/g, " ")
        .trim();

    const parts = cleaned.split(" ");

    if (parts.length < 2) {
        return cleaned;
    }

    const first =
        NICKNAME_MAP[parts[0]] ||
        parts[0];

    const last =
        parts[parts.length - 1];

    return `${first} ${last}`;
}

function submitSickDays() {

    const pasted =
        document.getElementById("pivot-data").value;

    const sickList =
        pasted
            .split("\n")
            .map(n => n.trim())
            .filter(Boolean)
            .map(normalizeName);

    console.log(sickList);

    alert(
        `Loaded ${sickList.length} employees`
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
                    action: "sickdays",
                    data: sickList
                }
            );

        }
    );
}

document
    .getElementById("submit-timecards-btn")
    .addEventListener(
        "click",
        submitSickDays
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