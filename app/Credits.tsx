import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

import { Text, Title, View } from "@/components/Themed";
import { Link } from "expo-router";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Title style={{ padding: 10 }}>CathApp</Title>
      <Text>Dominus Vobiscum.</Text>
      <View
        style={styles.separator}
        lightColor="rgba(0,0,0,0.3)"
        darkColor="rgba(255,255,255,0.3)"
      />
      <Text>
        Developed by{" "}
        <Link
          style={{ color: "rgb(87, 179, 253)" }}
          href={"https://github.com/HPaulson"}
        >
          Hunter Paulson
        </Link>{" "}
      </Text>
      <Text>
        Open source on{" "}
        <Link
          style={{ color: "rgb(87, 179, 253)" }}
          href={"https://github.com/hpaulson/CathApp"}
        >
          Github
        </Link>
      </Text>
      <View
        style={styles.separator}
        lightColor="rgba(0,0,0,0.3)"
        darkColor="rgba(255,255,255,0.3)"
      />
      <Text>
        Calendar Data from{" "}
        <Link
          style={{ color: "rgb(87, 179, 253)" }}
          href={"https://github.com/igneus/church-calendar-api"}
        >
          Jakub Pavlík
        </Link>{" "}
        &
        <Link
          style={{ color: "rgb(87, 179, 253)" }}
          href={
            "https://www.usccb.org/committees/divine-worship/liturgical-calendar"
          }
        >
          {" "}
          USCCB
        </Link>
      </Text>
      <Text>
        Readings from{" "}
        <Link
          style={{ color: "rgb(87, 179, 253)" }}
          href={"https://www.usccb.org/subscribe/rss"}
        >
          USCCB
        </Link>
      </Text>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    alignItems: "center",
    flexGrow: 1,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
