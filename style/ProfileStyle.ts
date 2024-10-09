import { StyleSheet } from "react-native";
import { config } from "../config/gluestack-ui.config";

export const ProfileStyle = StyleSheet.create({
  bikeNameStyle: {
    margin: 5,
    fontSize: 20,
  },
  bikeImageContainer: {
    borderWidth: 1,
    borderRadius: 10,
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    padding: 6,
  },
  flatlistContainer: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
  },
  tabContentContainer: {
    height: "100%",
    justifyContent: "space-between",
  },
  descriptionContainer: {
    width: "100%",
    marginTop: 5,
  },
  tabBarStyle: {
    backgroundColor: config.tokens.colors.primary900,
  },
});
