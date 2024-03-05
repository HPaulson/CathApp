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
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>
        Developed by{" "}
        <Link style={{ color: "blue" }} href={"https://github.com/HPaulson"}>
          Hunter Paulson
        </Link>{" "}
      </Text>
      <Text>
        Open source on{" "}
        <Link
          style={{ color: "blue" }}
          href={"https://github.com/hpaulson/CathApp"}
        >
          Github
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
