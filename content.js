const START_TIME = "07:00";
const MEAL_BREAK_MIN = 30;

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
    const lastName =
        parts[parts.length - 1];

    const canonicalFirst =
        NICKNAME_MAP[firstName] ||
        firstName;

    return `${canonicalFirst} ${lastName}`;
}

function timeToMinutes(t) {

    const [h, m] =
        t.split(":").map(Number);

    return h * 60 + m;
}

function minutesToTime(mins) {

    const h =
        Math.floor(mins / 60)
            .toString()
            .padStart(2, "0");

    const m =
        (mins % 60)
            .toString()
            .padStart(2, "0");

    return `${h}:${m}`;
}

chrome.runtime.onMessage.addListener(
    (message) => {

        console.log(
            "Received message:",
            message
        );

        if (
            message.action ===
            "timecards"
        ) {

            runTimecardAutomation(
                message.data
            );
        }

	
	if (message.action === "daysoff") {

    		runDaysOffAutomation(
        	message.data
    	);

}


if (message.action === "sickdays") {

    runSickDaysAutomation(
        message.data
    );

}



    }
);

function runTimecardAutomation(
    pivotHours
) {

    console.log(
        "Starting automation..."
    );

    document
        .querySelectorAll("tr")
        .forEach(row => {

            const empSelect =
                row.querySelector(
                    'select[id$="_emp"]'
                );

            if (
                !empSelect ||
                empSelect.selectedIndex <= 0
            ) {
                return;
            }

            const employeeName =
                empSelect.options[
                    empSelect.selectedIndex
                ].text
                .split(" (")[0];

            const employeeKey =
                normalizeName(
                    employeeName
                );

            if (
                !(employeeKey in pivotHours)
            ) {
                return;
            }

            const startInput =
                row.querySelector(
                    'input[id$="_tr"]'
                );

            const endInput =
                row.querySelector(
                    'input[id$="_tr_to"]'
                );

            if (
                !startInput ||
                !endInput
            ) {
                console.log(
                    `Could not locate time fields for ${employeeKey}`
                );
                return;
            }

            if (
                startInput.value ||
                endInput.value
            ) {
                console.log(
                    `Skipping ${employeeKey} (already populated)`
                );
                return;
            }

            const workMinutes =
                pivotHours[employeeKey] *
                    60 +
                MEAL_BREAK_MIN;

            const endTime =
                minutesToTime(
                    timeToMinutes(
                        START_TIME
                    ) +
                        workMinutes
                );

            console.log(
                `Filling ${employeeKey}: ${START_TIME} -> ${endTime}`
            );

            startInput.value =
                START_TIME;

            endInput.value =
                endTime;

            startInput.dispatchEvent(
                new Event(
                    "input",
                    {
                        bubbles: true
                    }
                )
            );

            endInput.dispatchEvent(
                new Event(
                    "input",
                    {
                        bubbles: true
                    }
                )
            );

            endInput.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles: true
                    }
                )
            );

        });

    console.log(
        "Timesheet auto-fill complete."
    );
}

function runDaysOffAutomation(
    offList
) {

    const offSet =
        new Set(offList);

    document
        .querySelectorAll("tr")
        .forEach(row => {

            const empSelect =
                row.querySelector(
                    'select[id$="_emp"]'
                );

            if (
                !empSelect ||
                empSelect.selectedIndex <= 0
            ) {
                return;
            }

            const pageName =
                empSelect.options[
                    empSelect.selectedIndex
                ].text
                .split(" (")[0];

            const employeeKey =
                normalizeName(pageName);

            if (
                !offSet.has(employeeKey)
            ) {
                return;
            }

            console.log(
                `Applying day off to ${employeeKey}`
            );

            const dnwCheckbox =
                row.querySelector(
                    'input[type="checkbox"][id$="_dnw_display"]'
                );

            const travelType =
                row.querySelector(
                    'select[id$="_tt"]'
                );

            const travelAmount =
                row.querySelector(
                    'input[id$="_travamt"]'
                );

            const comment =
                row.querySelector(
                    'textarea[id$="_com"]'
                );

            if (dnwCheckbox) {

                dnwCheckbox.checked = true;

                dnwCheckbox.dispatchEvent(
                    new Event(
                        "change",
                        {
                            bubbles: true
                        }
                    )
                );

            }

            if (travelType) {

                travelType.value = "0";

                travelType.dispatchEvent(
                    new Event(
                        "change",
                        {
                            bubbles: true
                        }
                    )
                );

            }

            if (travelAmount) {

                travelAmount.value = "";

                travelAmount.dispatchEvent(
                    new Event(
                        "input",
                        {
                            bubbles: true
                        }
                    )
                );

            }

            if (comment) {

                comment.value = "Off";

                comment.dispatchEvent(
                    new Event(
                        "input",
                        {
                            bubbles: true
                        }
                    )
                );

            }

        });

    console.log(
        "Day-off entries applied."
    );

}

function runSickDaysAutomation(
    sickList
) {

    const START_TIME = "07:00";
    const SICK_HOURS = 8;
    const MEAL_BREAK_MIN = 30;
    const SICK_TYPE_VALUE = "823";

    const sickSet =
        new Set(sickList);

    document
        .querySelectorAll("tr")
        .forEach(row => {

            const empSelect =
                row.querySelector(
                    'select[id$="_emp"]'
                );

            if (
                !empSelect ||
                empSelect.selectedIndex <= 0
            ) {
                return;
            }

            const pageName =
                empSelect.options[
                    empSelect.selectedIndex
                ].text
                .split(" (")[0];

            const employeeKey =
                normalizeName(pageName);

            if (
                !sickSet.has(employeeKey)
            ) {
                return;
            }

            console.log(
                `Applying sick day to ${employeeKey}`
            );

            const startInput =
                row.querySelector(
                    'input[id$="_tr"]'
                );

            const endInput =
                row.querySelector(
                    'input[id$="_tr_to"]'
                );

            const typeSelect =
                row.querySelector(
                    'select[id$="_th"]'
                );

            const travelType =
                row.querySelector(
                    'select[id$="_tt"]'
                );

            const travelAmount =
                row.querySelector(
                    'input[id$="_travamt"]'
                );

            const comment =
                row.querySelector(
                    'textarea[id$="_com"]'
                );

            if (
                !startInput ||
                !endInput ||
                !typeSelect
            ) {
                console.log(
                    `Missing fields for ${employeeKey}`
                );
                return;
            }

            const endMinutes =
                timeToMinutes(
                    START_TIME
                ) +
                (SICK_HOURS * 60) +
                MEAL_BREAK_MIN;

            startInput.value =
                START_TIME;

            endInput.value =
                minutesToTime(
                    endMinutes
                );

            typeSelect.value =
                SICK_TYPE_VALUE;

            if (travelType) {
                travelType.value = "0";
            }

            if (travelAmount) {
                travelAmount.value = "";
            }

            if (comment) {
                comment.value = "Sick";
            }

           
startInput.dispatchEvent(
    new Event("input", {
        bubbles: true
    })
);

endInput.dispatchEvent(
    new Event("input", {
        bubbles: true
    })
);

endInput.dispatchEvent(
    new Event("change", {
        bubbles: true
    })
);


            typeSelect.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles: true
                    }
                )
            );

            if (travelType) {

                travelType.dispatchEvent(
                    new Event(
                        "change",
                        {
                            bubbles: true
                        }
                    )
                );

            }

            if (comment) {

                comment.dispatchEvent(
                    new Event(
                        "input",
                        {
                            bubbles: true
                        }
                    )
                );

            }

        });

    console.log(
        "Sick days applied."
    );
}
