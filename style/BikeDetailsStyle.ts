import { StyleSheet } from "react-native";

export const BikeDetailsStyle = StyleSheet.create({
  container: {
    height: "100%",
  },
  bikeName: {
    fontSize: 30,
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 30,
  },
  viewForTab: {
    height: 600,
  },
  viewForHistory: {
    flex: 1,
    width: 400,
    alignItems: "center",
  },
  historyBox: {
    padding: 10,
  },
});
