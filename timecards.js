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
        .replace(/\s+/g, " ")
        .trim();

    const parts =
        cleaned.split(" ");

    if (parts.length < 2) {
        return cleaned;
    }

    const firstName =
        parts[0];

    const lastName =
        parts[
            parts.length - 1
        ];

    const canonicalFirst =
        nicknameMap[firstName] ||
        firstName;

    return `${canonicalFirst} ${lastName}`;
}

async function submitTimecards() {

    const nicknameMap =
        await getNicknameMap();

    const data =
        document
            .getElementById(
                "pivot-data"
            )
            .value;

    const lines =
        data
            .split("\n")
            .map(line =>
                line.trim()
            )
            .filter(Boolean);

    const pivotHours = {};

    lines.forEach(line => {

        const parts =
            line.split(
                /\t| {2,}/
            );

        const rawName =
            parts[0];

        const hours =
            parseFloat(
                parts[
                    parts.length - 1
                ]
            );

        if (
            rawName &&
            !isNaN(hours)
        ) {

            pivotHours[
                normalizeName(
                    rawName,
                    nicknameMap
                )
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
    .getElementById(
        "submit-timecards-btn"
    )
    .addEventListener(
        "click",
        submitTimecards
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