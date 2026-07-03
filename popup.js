const timecardsButton = document.getElementById("timecards-btn");
const sickDaysButton = document.getElementById("sickdays-btn");
const daysOffButton = document.getElementById("daysoff-btn");


timecardsButton.addEventListener("click", () => {
	window.location.href = "timecards.html"
});

sickDaysButton.addEventListener("click", () => {
	window.location.href = "sickdays.html"
});

daysOffButton.addEventListener("click", () => {
	window.location.href = "daysoff.html"
});
