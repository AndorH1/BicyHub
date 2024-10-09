import { StyleSheet } from "react-native";
import { config } from "../config/gluestack-ui.config";

export const DeleteReviewModalStyle = StyleSheet.create({
  Modal: {
    backgroundColor: config.tokens.colors.white,
    height: "30%",
    width: "55%",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
});
