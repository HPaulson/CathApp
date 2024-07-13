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
import { Redirect } from "expo-router";

export default function index() {
  Redirect({
    href: "/Home/",
  });
}
