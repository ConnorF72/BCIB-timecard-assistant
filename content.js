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
      if (parts.length < 2) return cleaned;

      const firstName = parts[0];
      const lastName = parts[parts.length - 1];

	const canonicalFirst = 
        NICKNAME_MAP[firstName] || firstName

      return `${canonicalFirst} ${lastName}`;
}


setTimeout(() => {
    console.log(
        "Rows:",
        document.querySelectorAll("tr").length
    );

    console.log(
        "Employee dropdowns:",
        document.querySelectorAll('select[id$="_emp"]').length
    );

document
    .querySelectorAll('select[id$="_emp"]')
    .forEach(select => {

        if (select.selectedIndex > 0) {

            const employeeName =
                select.options[
                    select.selectedIndex
                ].text
                .split(" (")[0];

            console.log(
			normalizeName(employeeName)
		);

        }

    });

}, 5000);

