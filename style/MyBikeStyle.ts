import { StyleSheet } from "react-native";
import { config } from "../config/gluestack-ui.config";

export const MyBikesStyle = StyleSheet.create({
  style: {
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    padding: 20,
  },
  boxStyle: {
    alignItems: "flex-start",
    justifyContent: "center",
    margin: 10,
    padding: 10,
  },
  bikeTitle: {
    margin: 6,
    padding: 6,
    fontSize: 18,
    alignContent: "flex-start",
    backgroundColor: config.tokens.colors.white,
  },
  cardImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    marginVertical: 2,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  cardStyle: {
    marginVertical: 15,
    backgroundColor: config.tokens.colors.white,
    borderRadius: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
});
