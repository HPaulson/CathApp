import { LiturgicalDay } from "@/types/CalendarAPI";
import { Image } from "react-native";

export default function DayIcon(props: { liturgicalDay: LiturgicalDay }) {
  const { liturgicalDay } = props;
  let icon = null;
  switch (liturgicalDay.celebrations[0].title) {
    case "Ash Wednesday":
      if (!icon) {
        icon = (
          <Image
            style={{
              width: 50,
              height: 50,
              alignSelf: "flex-end",
              position: "absolute",
            }}
            source={require("@/assets/images/ash-wed.png")}
          />
        );
      }
      break;
    case "Good Friday":
      if (!icon) {
        icon = (
          <Image
            style={{
              width: 50,
              height: 50,
              alignSelf: "flex-end",
              position: "absolute",
            }}
            source={require("@/assets/images/good-friday.png")}
          />
        );
      }
      break;
    case "Passion Sunday (Palm Sunday)":
      if (!icon) {
        icon = (
          <Image
            style={{
              width: 50,
              height: 50,
              alignSelf: "flex-end",
              position: "absolute",
            }}
            source={require("@/assets/images/palm-sunday.png")}
          />
        );
      }
      break;
  }
  switch (liturgicalDay.season) {
    case "Lent":
      if (liturgicalDay.weekday === "Friday" && !icon) {
        icon = (
          <Image
            style={{
              width: 50,
              height: 20,
              alignSelf: "flex-end",
              position: "absolute",
            }}
            source={require("@/assets/images/fish.png")}
          />
        );
      }
      break;
  }
  return icon;
}
