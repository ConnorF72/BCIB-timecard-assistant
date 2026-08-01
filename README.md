# BCIB-timecard-assistant
Houle internal tool for automatically filling out BCIB timecards.

This is a Chrome and Microsoft Edge based browser extension for streamlining the process of filing employee timecards on the BCIB website.

Currently, the people entering timecards for several Houle projects are required to manually enter each employee's hours.
This application has been developed to read employee timecard data which has been exported to a CSV file from Procore,
and transformed into a pivot table.

Employees who are sick, off, or on vacation can also be processed properly, with the application taking a newline separated list of names,
and automatically entering their details onto the BCIB timecard portal.
