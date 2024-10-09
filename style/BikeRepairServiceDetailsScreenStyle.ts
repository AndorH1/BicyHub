import { StyleSheet, Dimensions } from "react-native";

export const BikeRepairServiceDetailsScreenStyle = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height/2
    },
  });