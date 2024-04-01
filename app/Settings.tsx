import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { Appearance } from "react-native";
import { Picker } from "@react-native-community/picker";
import { Text, Title, View } from "@/components/Themed";
import { Link } from "expo-router";
import { DefaultTheme } from "@react-navigation/native";

export default function ModalScreen() {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    systemColorScheme || "system"
  );

  useEffect(() => {
    setTheme(systemColorScheme || "system");
  }, [systemColorScheme]);

  const handleValueChange = (itemValue: React.ReactText, itemIndex: number) => {
    setTheme(itemValue as "light" | "dark" | "system");
  };

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    marginHorizontal: 20,
    flexGrow: 1,
  },
  picker: {},
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
