/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import { da } from "@directus/sdk/dist/index-5c47c85c";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <DefaultText
      style={[{ color, textAlign: "auto" }, style]}
      {...otherProps}
    />
  );
}

export function Title(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <DefaultText
      style={[{ color, fontSize: 25, fontWeight: "bold" }, style]}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function SeasonGradient(props: ViewProps) {
  const { style, lightColor, ...otherProps } = props;
  return (
    <LinearGradient
      colors={[lightColor || "", lightColor || ""]}
      style={[
        {
          borderRadius: 10,
          height: 150,
          width: "100%",
        },
        props.style,
      ]}
    >
      <View
        style={{
          flex: 1,
          margin: 15,
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          backgroundColor: "rgba(0,0,0,0)",
        }}
      >
        {props.children}
      </View>
    </LinearGradient>
  );
}
