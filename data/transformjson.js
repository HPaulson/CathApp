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
      case "commemoration":
        replacedTitle.replace("The Memorial of the", "The");
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
        } else {
          transformed.title = replacedTitle;
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
    // Local instance of https://github.com/igneus/church-calendar-api
    fetch(`http://0.0.0.0:9292/api/v0/en/calendars/default/${year}/${month}`)
      .then((response) => response.json())
      .then((data) => {
        return resolve(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}

function getData(startDate, endDate) {
  return new Promise((resolve, reject) => {
    let date = new Date(startDate);
    const monthsBetweenDates = [];
    while (date < endDate) {
      monthsBetweenDates.push(
        [date.getUTCFullYear(), date.getUTCMonth() + 1].join("-")
      );
      date.setMonth(date.getMonth() + 1);
    }

    console.log(monthsBetweenDates);

    const monthData = [];
    for (const [i, month] of monthsBetweenDates.entries()) {
      const [y, m] = month.split("-");
      getMonthData(m, y).then((data) => {
        if (i === 0) {
          data = data.filter((day) => new Date(day.date) >= startDate);
        }

        monthData.push({ month: m, data: data });
        if (monthData.length === monthsBetweenDates.length) {
          return resolve(monthData);
        }
      });
    }
  });
}

function transform(inputData, year) {
  // Flatten events into a single array
  const transformedData = [];
  inputData = inputData
    .sort((a, b) => a.month - b.month)
    .map((month) => month.data)
    .flat();

  for (const day in inputData) {
    transformedData.push(transformEvent(inputData[day]));
  }
  // Write the transformed data to a new JSON file
  fs.writeFileSync(
    `${year}.ts`,
    `import { LiturgicalDay } from "@/types/CalendarAPI";

export const Data_${year}: LiturgicalDay[] =  ${JSON.stringify(transformedData, null, 2)}`
  );
}

function main() {
  const year = process.argv[2];
  const startDate = new Date(process.argv[3]);
  const endDate = new Date(process.argv[4]);

  getData(startDate, endDate, year).then((data) => {
    transform(data, year);
  });
}

main();
