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

function submitTimecards() {

	if (Object.keys(NICKNAME_MAP).length === 0) {
        alert("Nickname map not loaded yet.");
        return;
    	}

	const data = 
		document.getElementById("pivot-data").value;

	const lines = data
		.split("\n")
		.map(line => line.trim())
		.filter(Boolean);

	const pivotHours = {};
	
	lines.forEach(line => {
		const parts = line.split(/\t| {2,}/);

		const rawName = parts[0];
		const hours = parseFloat(parts[parts.length - 1]);
		
		if (rawName && !isNaN(hours)) {
			pivotHours[normalizeName(rawName)] = hours;
		}
	});

	console.log(pivotHours);

	alert(
    		`Loaded ${Object.keys(pivotHours).length} employees`
	);
	
	runTimecardAutomation(pivotHours);
}

function normalizeName(str) {
    const cleaned = str
      .toLowerCase()
      .replace(/\(.*?\)/g, "") 
      .replace(/\s+/g, " ")    
      .trim();

      const parts = cleaned.split(" ");
      if (parts.length < 2) return cleaned;

      const firstName = parts[0];
      const lastName = parts[parts.length - 1];

	const canonicalFirst = 
        NICKNAME_MAP[firstName] || firstName

      return `${canonicalFirst} ${lastName}`;
}

function runTimecardAutomation(pivotHours) {
	const employeeRows =
		document.querySelectorAll("tr");

	console.log(
		`Found ${employeeRows.length} rows`
	);
}
document
	.getElementById("submit-timecards-btn")
	.addEventListener("click", submitTimecards);

const backButton = document.getElementById("back-btn");

backButton.addEventListener("click", () => {
	window.location.href = "popup.html"
});


