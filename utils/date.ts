import { LiturgicalDay } from "@/types/CalendarAPI";
import * as Data from "@/data/export";

export class Calendar {
  static formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  static getData(date: Date): LiturgicalDay | undefined {
    const year = date.getFullYear();
    const dateFormat =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0");

    const prop = `Data_${year}`;
    if (prop in Data) {
      return (Data as any)[prop].find(
        (day: LiturgicalDay) => day.date === dateFormat
      );
    }
  }

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
