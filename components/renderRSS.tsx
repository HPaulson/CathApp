import { useWindowDimensions } from "react-native";
import { useColorScheme } from "react-native";
import RenderHtml from "react-native-render-html";

export default function ReturnRSS(props: { htmlString: string }) {
  const src = {
    html: props.htmlString,
  };

  return (
    <RenderHtml
      key={src.html}
      baseStyle={{
        color: useColorScheme() === "dark" ? "white" : "black",
        fontFamily: "Helvetica",
        flexWrap: "wrap",
        fontSize: 15,
      }}
      contentWidth={useWindowDimensions().width}
      source={src}
    />
  );
}
