function parseNicknameMap(text) {

    const map = {};

    text
        .split("\n")
        .forEach(line => {

            const trimmed =
                line.trim();

            if (!trimmed) {
                return;
            }

            const parts =
                trimmed.split("=");

            if (
                parts.length !== 2
            ) {
                return;
            }

            const nickname =
                parts[0]
                    .trim()
                    .toLowerCase();

            const canonical =
                parts[1]
                    .trim()
                    .toLowerCase();

            map[nickname] =
                canonical;

        });

    return map;

}

async function getNicknameMap() {

    const result =
        await chrome.storage.local.get(
            "nicknameMapText"
        );

    return parseNicknameMap(
        result.nicknameMapText || ""
    );

}

function normalizeName(
    str,
    nicknameMap
) {

    const cleaned = str
        .toLowerCase()
        .replace(/\(.*?\)/g, "")
        .replace(/\./g, "")
        .replace(/\s+/g, " ")
        .trim();

    const parts =
        cleaned.split(" ");

    if (parts.length < 2) {
        return cleaned;
    }

    const first =
        nicknameMap[
            parts[0]
        ] || parts[0];

    const last =
        parts[
            parts.length - 1
        ];

    return `${first} ${last}`;

}

async function submitDaysOff() {

    const nicknameMap =
        await getNicknameMap();

    const pasted =
        document
            .getElementById(
                "pivot-data"
            )
            .value;

    const offList =
        pasted
            .split("\n")
            .map(l => l.trim())
            .filter(Boolean)
            .map(name =>
                normalizeName(
                    name,
                    nicknameMap
                )
            );

    console.log(offList);

    alert(
        `Loaded ${offList.length} employees`
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
                    action: "daysoff",
                    data: offList
                }
            );

        }
    );

}

document
    .getElementById(
        "submit-timecards-btn"
    )
    .addEventListener(
        "click",
        submitDaysOff
    );

document
    .getElementById(
        "back-btn"
    )
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "popup.html";

        }
    );