import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Calendar } from "@/utils/date";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useDate } from "@/state/date";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [date, setDate] = useDate();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: Calendar.formatDate(date),
          tabBarStyle: {
            display: "none",
          },
          headerTitle: () => {
            return (
              <RNDateTimePicker
                value={date}
                dateFormat="longdate"
                onChange={(event: DateTimePickerEvent, date?: Date) => {
                  if (date) setDate(date);
                }}
              />
            );
          },
          headerRight: () => (
            <Link href="/Credits" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="question"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}
