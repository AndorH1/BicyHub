import { StyleSheet } from "react-native";
import { config } from "../config/gluestack-ui.config";

export const HomeStyle = StyleSheet.create({
  background: {
    height: "100%",
  },
  homeView: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 6,
    padding: 4,
  },
  text: {
    fontSize: 22,
  },
  tabBarStyle: {
    backgroundColor: config.tokens.colors.primary900,
  },
});
