import { LiturgicalDay } from "@/types/CalendarAPI";

export class Calendar {
  static formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  static formatLiturgicalDay(data: LiturgicalDay) {
    data.weekday = data.weekday.replace(/(^|\s)[a-z]/gi, (l) =>
      l.toUpperCase()
    ) as LiturgicalDay["weekday"];
    data.season = data.season.replace(/(^|\s)[a-z]/gi, (l) =>
      l.toUpperCase()
    ) as LiturgicalDay["season"];
    if (data.season === "ordinary") data.season = "Ordinary Time";
    data.celebrations.forEach((celebration) => {
      celebration.title = celebration.title.replace(/(^|\s)[a-z]/gi, (l) =>
        l.toUpperCase()
      );
      celebration.rank = celebration.rank.replace(/(^|\s)[a-z]/gi, (l) =>
        l.toUpperCase()
      );
    });
    return data;
  }

  static getWeekString(weekNumber: number): string {
    const weekNames: string[] = [
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
      "Forty-Eighth",
      "Forty-Ninth",
      "Fiftieth",
      "Fifty-First",
      "Fifty-Second",
    ];

    return weekNames[weekNumber];
  }

  static parseUSCCBTitle(title: string, weekday: string) {
    if (title.includes(weekday))
      return { weekday: true, title: weekday, desc: title.split(weekday)[1] };
    else return { weekday: false, title };
  }
  static DayTitle = (week: number, seaon: LiturgicalDay["season"]) => {
    return `of the ${this.getWeekString(week)} week of ${seaon}`;
  };

  static parseColor = (color: string) => {
    switch (color) {
      case "white":
        return "#FFFDD0";
        break;
      case "red":
        return "#D80707";
        break;
      case "violet":
        return "#800080";
        break;
      default:
        return color;
        break;
    }
  };
}
