import { StyleSheet } from "react-native";
import { config } from "../config/gluestack-ui.config";

export const PostStyle = StyleSheet.create({
  PostContainer: {
    borderWidth: 1,
    borderRadius: 10,
    shadowOffset: { width: -2, height: 4 },
    shadowColor: config.tokens.colors.trueGray900,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    padding: 6,
  },
});
