const daysButton = document.getElementById("dayshift-btn");
const afternoonButton = document.getElementById("afternoon-btn");
const sickDaysButton = document.getElementById("sickdays-btn");
const daysOffButton = document.getElementById("daysoff-btn");
const settingsButton = document.getElementById("settings-btn");


daysButton.addEventListener("click", () => {
	window.location.href = "../day-timecards/day-timecards.html"
});

afternoonButton.addEventListener("click", () => {
	window.location.href = "../afternoon-timecards/afternoon-timecards.html"
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
