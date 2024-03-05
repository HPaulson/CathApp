import { StyleSheet } from "react-native";

import { SeasonGradient, Text, Title, View } from "@/components/Themed";
import { Calendar } from "@/utils/date";
import React, { useEffect, useState } from "react";
import { LiturgicalDay } from "@/types/CalendarAPI";

export default function TabOneScreen() {
  const [liturgicalDay, setLiturgicalDay] = useState<LiturgicalDay | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const localDate = new Date();
  const dateString = `${localDate.getFullYear()}/${
    localDate.getMonth() + 1
  }/${localDate.getDate()}`;

  useEffect(() => {
    fetch(
      `http://calapi.inadiutorium.cz/api/v0/en/calendars/default/${dateString}`
    )
      .then((resp) => resp.json())
      .then((json) => setLiturgicalDay(Calendar.formatLiturgicalDay(json)))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (liturgicalDay)
    return (
      <View style={styles.container}>
        <SeasonGradient
          lightColor={Calendar.parseColor(liturgicalDay.celebrations[0].colour)}
        >
          <Title>{liturgicalDay.weekday}</Title>
          <Text style={{ fontSize: 17 }}>
            {Calendar.DayTitle(liturgicalDay.season_week, liturgicalDay.season)}
          </Text>
        </SeasonGradient>

        <View style={styles.separator} />
        <View style={{ justifyContent: "center" }}>
          {liturgicalDay.celebrations.map((celebration, index) => {
            if (celebration.rank != "Ferial")
              return (
                <View
                  style={{
                    flexDirection: "row",
                    marginVertical: 10,
                  }}
                >
                  <SeasonGradient
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 40,
                      marginHorizontal: 25,
                    }}
                    lightColor={Calendar.parseColor(celebration.colour)}
                  />
                  <View style={{ width: "80%" }}>
                    <Title style={{ fontSize: 20 }}>{celebration.rank}</Title>
                    <Text style={{ width: "auto", fontSize: 15 }}>
                      of {celebration.title.replace("The Memorial Of ", "")}
                    </Text>
                  </View>
                </View>
              );
          })}
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    flexGrow: 1,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
  },
});
