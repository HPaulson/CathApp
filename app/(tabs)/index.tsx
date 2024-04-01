import { ScrollView, StyleSheet, Image } from "react-native";

import { SeasonGradient, Text, Title, View } from "@/components/Themed";
import { Calendar } from "@/utils/date";
import React, { useEffect, useState } from "react";
import { LiturgicalDay } from "@/types/CalendarAPI";
import * as rssParser from "react-native-rss-parser";
import RenderRSS from "@/components/renderRSS";
import DayIcon from "@/components/icon";
import { Data_2024 } from "@/data/2024-backup";
import { useDate } from "@/state/date";

export default function TabOneScreen() {
  const [liturgicalDay, setLiturgicalDay] = useState<LiturgicalDay | null>(
    null
  );
  const [rssFeed, setRssFeed] = useState<any>(null);
  const [rssData, setRssData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useDate();
  const dateString =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0");

  useEffect(() => {
    const ranks = new Set();
    Data_2024.map((d) => ranks.add(d.celebrations[0].rank));
    console.log(ranks);

    let day = Data_2024.find((day: any) => day.date === dateString);
    if (day) {
      setLiturgicalDay(day as LiturgicalDay);
      setLoading(false);
    }
  }, [Data_2024, dateString]);

  useEffect(() => {
    if (!rssFeed) {
      fetch("https://www.usccb.org/bible/readings/rss/index.cfm")
        .then((response) => response.text())
        .then((responseData) => rssParser.parse(responseData))
        .then((rss) => {
          setRssFeed(rss);
        })
        .catch((error) => console.error(error));
    }
  }, [rssFeed]);

  useEffect(() => {
    console.log("Updating rss");
    if (rssFeed) {
      let item = rssFeed.items.find((item: any) => {
        console.log(
          Calendar.formatDate(new Date(item.published)),
          Calendar.formatDate(date)
        );

        return (
          Calendar.formatDate(new Date(item.published)) ===
          Calendar.formatDate(date)
        );
      });
      if (item) setRssData(item.description);
      else setRssData(null);
    }
  }, [rssFeed, dateString]);

  if (liturgicalDay && !loading)
    return (
      <View style={styles.container}>
        <SeasonGradient
          lightColor={Calendar.parseColor(liturgicalDay.celebrations[0].colour)}
        >
          <Title>{liturgicalDay.celebrations[0].title}</Title>
          {liturgicalDay.celebrations[0].subtitle ? (
            <Text
              style={{
                fontSize: 17,
              }}
            >
              {liturgicalDay.celebrations[0].subtitle}
            </Text>
          ) : null}
          <DayIcon liturgicalDay={liturgicalDay} />
        </SeasonGradient>
        <View style={styles.separator} />
        <View style={{ justifyContent: "center" }}>
          {liturgicalDay.celebrations.map((celebration, index) => {
            if (index != 0)
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    marginVertical: 10,
                  }}
                >
                  <SeasonGradient
                    key={index}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 40,
                      marginHorizontal: 25,
                    }}
                    lightColor={Calendar.parseColor(celebration.colour)}
                  />
                  <View style={{ width: "80%" }}>
                    <Title style={{ fontSize: 20 }}>{celebration.title}</Title>
                    <Text style={{ width: "auto", fontSize: 15 }}>
                      {celebration.subtitle}
                    </Text>
                  </View>
                </View>
              );
          })}
        </View>
        <View
          style={styles.separator}
          lightColor="rgba(0,0,0,0.3)"
          darkColor="rgba(255,255,255,0.3)"
        />
        <ScrollView
          style={{
            width: "100%",
            alignContent: "center",
            paddingHorizontal: 10,
          }}
        >
          {rssData ? (
            <RenderRSS htmlString={rssData} />
          ) : (
            <Text>Readings not available yet.</Text>
          )}
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "100%",
  },
});
