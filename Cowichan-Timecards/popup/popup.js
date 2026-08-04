const timecardsButton = document.getElementById("timecards-btn");
const sickDaysButton = document.getElementById("sickdays-btn");
const daysOffButton = document.getElementById("daysoff-btn");
const settingsButton = document.getElementById("settings-btn");


timecardsButton.addEventListener("click", () => {
	window.location.href = "../timecards/timecards.html"
});

sickDaysButton.addEventListener("click", () => {
	window.location.href = "../sickdays/sickdays.html"
});

daysOffButton.addEventListener("click", () => {
	window.location.href = "../daysoff/daysoff.html"
});

settingsButton.addEventListener("click", () => {
	window.location.href = "../settings/settings.html"
});
