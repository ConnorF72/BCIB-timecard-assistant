const SICK_START_TIME = "7:00";
const START_TIME_DAY = "06:30";
const START_TIME_AFTERNOON = "13:30";
const MEAL_BREAK_MIN = 30;

chrome.runtime.onMessage.addListener(message => {
    console.log("Received message:", message);

    if (message.action === "daytimecards") {
        runDayShiftAutomation(message.data);
    }

    if (message.action === "afternoontimecards") {
	  runAfternoonShiftAutomation(message.data);
    }

    if (message.action === "daysoff") {
        runDaysOffAutomation(message.data);
    }

    if (message.action === "sickdays") {
        runSickDaysAutomation(message.data);
    }
});

async function runAfternoonShiftAutomation(pivotHours) {
    const zeroHourEmployees = [];

    const nicknameMap = await getNicknameMap();

    console.log("Starting automation...");

    document.querySelectorAll("tr").forEach(row => {
        const empSelect = row.querySelector('select[id$="_emp"]');
        if (!empSelect || empSelect.selectedIndex <= 0) return;

        const employeeName = empSelect.options[empSelect.selectedIndex].text.split(" (")[0];
        const employeeKey = normalizeName(employeeName, nicknameMap);

        if (!(employeeKey in pivotHours)) return;

        const startInput = row.querySelector('input[id$="_tr"]');
        const endInput = row.querySelector('input[id$="_tr_to"]');

        if (!startInput || !endInput) {
            console.log(`Could not locate time fields for ${employeeKey}`);
            return;
        }

	  if (pivotHours[employeeKey] === 0) {
		zeroHourEmployees.push(`${employeeName}`);
	  }

        if (startInput.value || endInput.value) {
            console.log(`Skipping ${employeeKey} (already populated)`);
            return;
        }

        const workMinutes = pivotHours[employeeKey] * 60 + MEAL_BREAK_MIN;
        const endTime = minutesToTime(timeToMinutes(START_TIME_AFTERNOON) + workMinutes);

        console.log(`Filling ${employeeKey}: ${START_TIME_AFTERNOON} -> ${endTime}`);

        startInput.value = START_TIME_AFTERNOON;
        endInput.value = endTime;

        startInput.dispatchEvent(new Event("input", { bubbles: true }));
        endInput.dispatchEvent(new Event("input", { bubbles: true }));
        endInput.dispatchEvent(new Event("change", { bubbles: true }));
    });

    if (zeroHourEmployees.length > 0) {
         prompt("The following employees have 0 hours, check their notes:", zeroHourEmployees.join("\n"));
    }

    console.log("Timesheet auto-fill complete.");
}

async function runDayShiftAutomation(pivotHours) {
    const zeroHourEmployees = [];

    const nicknameMap = await getNicknameMap();

    console.log("Starting automation...");

    document.querySelectorAll("tr").forEach(row => {
        const empSelect = row.querySelector('select[id$="_emp"]');
        if (!empSelect || empSelect.selectedIndex <= 0) return;

        const employeeName = empSelect.options[empSelect.selectedIndex].text.split(" (")[0];
        const employeeKey = normalizeName(employeeName, nicknameMap);

        if (!(employeeKey in pivotHours)) return;

        const startInput = row.querySelector('input[id$="_tr"]');
        const endInput = row.querySelector('input[id$="_tr_to"]');

        if (!startInput || !endInput) {
            console.log(`Could not locate time fields for ${employeeKey}`);
            return;
        }

	  if (pivotHours[employeeKey] === 0) {
		zeroHourEmployees.push(`${employeeName}`);
	  }

        if (startInput.value || endInput.value) {
            console.log(`Skipping ${employeeKey} (already populated)`);
            return;
        }

        const workMinutes = pivotHours[employeeKey] * 60 + MEAL_BREAK_MIN;
        const endTime = minutesToTime(timeToMinutes(START_TIME_DAY) + workMinutes);

        console.log(`Filling ${employeeKey}: ${START_TIME_DAY} -> ${endTime}`);

        startInput.value = START_TIME_DAY;
        endInput.value = endTime;

        startInput.dispatchEvent(new Event("input", { bubbles: true }));
        endInput.dispatchEvent(new Event("input", { bubbles: true }));
        endInput.dispatchEvent(new Event("change", { bubbles: true }));
    });

    if (zeroHourEmployees.length > 0) {
         prompt("The following employees have 0 hours, check their notes:", zeroHourEmployees.join("\n"));
    }

    console.log("Timesheet auto-fill complete.");
}

async function runDaysOffAutomation(offList) {
    const nicknameMap = await getNicknameMap();
    const offSet = new Set(offList);

    document.querySelectorAll("tr").forEach(row => {
        const empSelect = row.querySelector('select[id$="_emp"]');
        if (!empSelect || empSelect.selectedIndex <= 0) return;

        const pageName = empSelect.options[empSelect.selectedIndex].text.split(" (")[0];
        const employeeKey = normalizeName(pageName, nicknameMap);

        if (!offSet.has(employeeKey)) return;

        console.log(`Applying day off to ${employeeKey}`);

        const dnwCheckbox = row.querySelector('input[type="checkbox"][id$="_dnw_display"]');
        const travelType = row.querySelector('select[id$="_tt"]');
        const travelAmount = row.querySelector('input[id$="_travamt"]');
        const comment = row.querySelector('textarea[id$="_com"]');

        if (dnwCheckbox) {
            dnwCheckbox.checked = true;
            dnwCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
        }

        if (travelType) {
            travelType.value = "0";
            travelType.dispatchEvent(new Event("change", { bubbles: true }));
        }

        if (travelAmount) {
            travelAmount.value = "";
            travelAmount.dispatchEvent(new Event("input", { bubbles: true }));
        }

        if (comment) {
            comment.value = "Off";
            comment.dispatchEvent(new Event("input", { bubbles: true }));
        }
    });

    console.log("Day-off entries applied.");
}

async function runSickDaysAutomation(sickList) {
    const nicknameMap = await getNicknameMap();

    const SICK_HOURS = 8;
    const SICK_TYPE_VALUE = "823";

    const sickSet = new Set(sickList);

    document.querySelectorAll("tr").forEach(row => {
        const empSelect = row.querySelector('select[id$="_emp"]');
        if (!empSelect || empSelect.selectedIndex <= 0) return;

        const pageName = empSelect.options[empSelect.selectedIndex].text.split(" (")[0];
        const employeeKey = normalizeName(pageName, nicknameMap);

        if (!sickSet.has(employeeKey)) return;

        console.log(`Applying sick day to ${employeeKey}`);

        const startInput = row.querySelector('input[id$="_tr"]');
        const endInput = row.querySelector('input[id$="_tr_to"]');
        const typeSelect = row.querySelector('select[id$="_th"]');
        const travelType = row.querySelector('select[id$="_tt"]');
        const travelAmount = row.querySelector('input[id$="_travamt"]');
        const comment = row.querySelector('textarea[id$="_com"]');

        if (!startInput || !endInput || !typeSelect) {
            console.log(`Missing fields for ${employeeKey}`);
            return;
        }

        const endMinutes = timeToMinutes(SICK_START_TIME) + (SICK_HOURS * 60) + MEAL_BREAK_MIN;

        startInput.value = SICK_START_TIME;
        endInput.value = minutesToTime(endMinutes);
        typeSelect.value = SICK_TYPE_VALUE;

        if (travelType) travelType.value = "0";
        if (travelAmount) travelAmount.value = "";
        if (comment) comment.value = "Sick";

        startInput.dispatchEvent(new Event("input", { bubbles: true }));
        endInput.dispatchEvent(new Event("input", { bubbles: true }));
        endInput.dispatchEvent(new Event("change", { bubbles: true }));
        typeSelect.dispatchEvent(new Event("change", { bubbles: true }));

        if (travelType) {
            travelType.dispatchEvent(new Event("change", { bubbles: true }));
        }

        if (comment) {
            comment.dispatchEvent(new Event("input", { bubbles: true }));
        }
    });

    console.log("Sick days applied.");
}
