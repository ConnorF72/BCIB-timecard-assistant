const timecardsButton = document.getElementById("timecards-btn");
const sickDaysButton = document.getElementById("sickdays-btn");
const daysOffButton = document.getElementById("daysoff-btn");

timecardsButton.addEventListener("click", () => {
	alert("Timecards button clicked!");
});

sickDaysButton.addEventListener("click", () => {
	alert("Sick days button clicked!");
});

daysOffButton.addEventListener("click", () => {
	alert("Days off button clicked!");
});