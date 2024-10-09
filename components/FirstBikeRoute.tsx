import { ScrollView, Box, Text } from "@gluestack-ui/themed";
import React from "react";
import { ProfileStyle } from "../style/ProfileStyle";


export const FirstBikeRoute = ({
    bikeDescription,
  }: {
    bikeDescription: string;
  }) => {
    return (
      <Box style={ProfileStyle.bikeImageContainer} marginHorizontal={6} marginVertical={2}>
        <ScrollView>
          <Text fontSize={18}>{bikeDescription}</Text>
        </ScrollView>
      </Box>
    );
  };