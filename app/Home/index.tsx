import { ScrollView, StyleSheet, Image } from "react-native";

import { SeasonGradient, Text, Title, View } from "@/components/Themed";
import { Calendar } from "@/utils/date";
import React, { useEffect, useState } from "react";
import { LiturgicalDay } from "@/types/CalendarAPI";
import * as rssParser from "react-native-rss-parser";
import RenderRSS from "@/components/renderRSS";
import DayIcon from "@/components/icon";
import { useDate } from "@/state/date";
import { DarkTheme } from "@react-navigation/native";
import { registerRootComponent } from "expo";

export default function HomeScreen() {
  const [liturgicalDay, setLiturgicalDay] = useState<LiturgicalDay | null>(
    null
  );
  const [rssFeed, setRssFeed] = useState<any>(null);
  const [rssData, setRssData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useDate();

  useEffect(() => {
    if (date) {
      const data = Calendar.getData(date);
      if (data) {
        setLiturgicalDay(data);
        setLoading(false);
      } else {
        setLiturgicalDay(null);
        setLoading(false);
      }
    }
  }, [date]);

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
    if (rssFeed) {
      let item = rssFeed.items.find((item: any) => {
        return (
          Calendar.formatDate(new Date(item.published)) ===
          Calendar.formatDate(date)
        );
      });
      if (item) setRssData(item.description);
      else setRssData(null);
    }
  }, [rssFeed, date]);

  if (liturgicalDay && !loading)
    return (
      <View style={styles.container}>
        <SeasonGradient
          lightColor={Calendar.parseColor(liturgicalDay.celebrations[0].colour)}
        >
          <Title
            style={{
              color: DarkTheme ? "black" : "white",
            }}
          >
            {liturgicalDay.celebrations[0].title}
          </Title>
          {liturgicalDay.celebrations[0].subtitle ? (
            <Text
              style={{
                color: DarkTheme ? "black" : "white",
                fontSize: 17,
                flexWrap: "wrap",
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
                    <Title style={{ fontSize: 20, width: "90%" }}>
                      {celebration.title}
                    </Title>
                    <Text
                      style={{
                        fontSize: 15,
                        flexWrap: "wrap",
                        width: "90%",
                      }}
                    >
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
  else
    return (
      <View style={styles.container}>
        <Text>No data found for this date!</Text>
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
