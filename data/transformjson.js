const fs = require("fs");

// Function to convert numeric ordinals to textual representation
function replaceOrdinalNumbers(inputString) {
  const ordinals = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
    "Eleventh",
    "Twelfth",
    "Thirteenth",
    "Fourteenth",
    "Fifteenth",
    "Sixteenth",
    "Seventeenth",
    "Eighteenth",
    "Nineteenth",
    "Twentieth",
    "Twenty-First",
    "Twenty-Second",
    "Twenty-Third",
    "Twenty-Fourth",
    "Twenty-Fifth",
    "Twenty-Sixth",
    "Twenty-Seventh",
    "Twenty-Eighth",
    "Twenty-Ninth",
    "Thirtieth",
    "Thirty-First",
    "Thirty-Second",
    "Thirty-Third",
    "Thirty-Fourth",
    "Thirty-Fifth",
    "Thirty-Sixth",
    "Thirty-Seventh",
    "Thirty-Eighth",
    "Thirty-Ninth",
    "Fortieth",
    "Forty-First",
    "Forty-Second",
    "Forty-Third",
    "Forty-Fourth",
    "Forty-Fifth",
    "Forty-Sixth",
    "Forty-Seventh",
    "Forty-Sighth",
    "Forty-Ninth",
    "Fiftieth",
    "Fifty-First",
    "Fifty-Second",
  ];

  return inputString.replace(
    /\b(\d+)(st|nd|rd|th)\b/g,
    (match, number, suffix) => {
      const ordinalIndex = parseInt(number, 10) - 1;
      return (
        ordinals[ordinalIndex] +
        (suffix === "st"
          ? ""
          : suffix === "nd"
            ? ""
            : suffix === "rd"
              ? ""
              : suffix === "th"
                ? ""
                : "")
      );
    }
  );
}

function removeWeekday(inputString) {
  return inputString.replace(
    /\b(Monday, |Tuesday, |Wednesday, |Thursday, |Friday, |Saturday, |Sunday, )\b/g,
    "the "
  );
}

function replaceSundayWithWeek(inputString) {
  return inputString.replace(/\bSunday\b/g, "Week");
}

// Function to transform each event
function transformEvent(event) {
  const celebrations = event.celebrations.map((celebration) => {
    const replacedTitle = replaceOrdinalNumbers(celebration.title);

    let transformed = {
      ...celebration,
      title: "",
      subtitle: "",
    };

    switch (celebration.rank) {
      case "solemnity":
      case "feast":
      case "memorial":
      case "optional memorial":
        transformed.title =
          celebration.rank.charAt(0).toUpperCase() + celebration.rank.slice(1);
        transformed.subtitle = "of " + replacedTitle;
        break;
      case "Sunday":
        transformed.title =
          event.weekday.charAt(0).toUpperCase() + event.weekday.slice(1);
        transformed.subtitle = "of the " + replaceSundayWithWeek(replacedTitle);
        if (transformed.subtitle.includes("triduum")) {
          transformed.subtitle = transformed.subtitle.replace(
            "triduum",
            "Triduum"
          );
        }

        break;
      case "ferial":
        if (replacedTitle.toLowerCase().includes(event.weekday)) {
          transformed.title =
            event.weekday.charAt(0).toUpperCase() + event.weekday.slice(1);
          transformed.subtitle = "of " + removeWeekday(replacedTitle);
        }
        break;
      case "Primary liturgical days":
        transformed.title = replacedTitle;
        break;
      case "Easter triduum":
        transformed.title = replacedTitle;
        transformed.subtitle =
          "of The " +
          celebration.rank.charAt(0).toUpperCase() +
          celebration.rank.slice(1);
        break;
    }
    return transformed;
  });
  event.weekday =
    event.weekday.charAt(0).toUpperCase() + event.weekday.slice(1);
  event.season = event.season.charAt(0).toUpperCase() + event.season.slice(1);
  if (event.season === "ordinary") {
    event.season = "Ordinary Time";
  }
  event.celebrations = celebrations;
  return event;
}

function getMonthData(month, year) {
  return new Promise((resolve, reject) => {
    fetch(
      `http://calapi.inadiutorium.cz/api/v0/en/calendars/default/${year}/${month}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success");
        return resolve(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}

function getData(startDate, endDate, litYear) {
  return new Promise((resolve, reject) => {
    let date = new Date(startDate);
    const monthsBetweenDates = [];
    while (date < endDate) {
      monthsBetweenDates.push(
        [date.getFullYear(), date.getMonth() + 1].join("-")
      );
      date.setMonth(date.getMonth() + 1);
    }

    const monthData = [];
    for (const [i, month] of monthsBetweenDates.entries()) {
      const [y, m] = month.split("-");
      getMonthData(m, y).then((data) => {
        if (i === 0) {
          data = data.filter((day) => day.day >= startDate.getDate());
        }

        monthData.push({ month: m, data: data });
        if (monthData.length === monthsBetweenDates.length) {
          return resolve(monthData);
        }
      });
    }
  });
}

function transform(inputData, file) {
  // Flatten events into a single array
  const transformedData = [];
  inputData = inputData
    .sort((a, b) => a.month - b.month)
    .map((month) => month.data)
    .flat();

  for (const day in inputData) {
    transformedData.push(transformEvent(inputData[day]));
  }
  console.log("Writing File");
  // Write the transformed data to a new JSON file
  fs.writeFileSync(
    file,
    `import { LiturgicalDay } from "@/types/CalendarAPI";

export const Data_2024: LiturgicalDay[] =  ${JSON.stringify(transformedData, null, 2)}`
  );
}

function main() {
  const litYear = process.argv[2];
  const startDate = new Date(process.argv[3]);
  const endDate = new Date(process.argv[4]);

  if (startDate && endDate) {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 365) {
      console.log("The date range must be within 365 days");
      process.exit(1);
    }
  }

  getData(startDate, endDate, litYear).then((data) => {
    transform(data, `${litYear}.ts`);
  });
}

main();
