import { LiturgicalDay } from "@/types/CalendarAPI";

export class Calendar {
  static today() {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }

  static formatLiturgicalDay(data: LiturgicalDay) {
    data.weekday = data.weekday.replace(/(^|\s)[a-z]/gi, l => l.toUpperCase()) as LiturgicalDay["weekday"];
    data.season = data.season.replace(/(^|\s)[a-z]/gi, l => l.toUpperCase()) as LiturgicalDay["season"];
    if (data.season === "ordinary") data.season = "Ordinary Time";
    data.celebrations.forEach(celebration => {
      celebration.title = celebration.title.replace(/(^|\s)[a-z]/gi, l => l.toUpperCase());
      celebration.rank = celebration.rank.replace(/(^|\s)[a-z]/gi, l => l.toUpperCase());
    });
    return data;
  }

  static DayTitle = (week: number, seaon: LiturgicalDay["season"]) => {
    let suffix;
    if (week > 3 && week < 21) suffix = "th";
    switch (week % 10) {
      case 1:
        suffix = "st";
        break;
      case 2:
        suffix = "nd";
        break;
      case 3:
        suffix = "rd";
        break;
      default:
        suffix = "th";
        break;
    }
    return `of the ${week}${suffix} week of ${seaon}`
  };

  static parseColor = (color: string) => {
    switch (color) {
      case "white":
        return "#FFFDD0";
        break;
      case "red":
        return "#D80707";
        break;
      case 'violet':
        return "#800080";
        break;
      default:
        return color;
        break;
    }
}
}
