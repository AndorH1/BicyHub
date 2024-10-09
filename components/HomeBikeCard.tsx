import React from "react";
import { Box, View, Text, Image, HStack } from "@gluestack-ui/themed";
import { ProfileStyle } from "../style/ProfileStyle";

interface bikeCardProps {
  pictures: string[];
  name: string;
}

const HomeBikeCard = (props: bikeCardProps) => {
  return (
    <Box style={ProfileStyle.bikeImageContainer} marginHorizontal={6} marginVertical={2}>
      <View>
        <Image
          style={{ width: "100%", height: undefined, aspectRatio: 1 }}
          source={{
            uri: props.pictures.at(0),
          }}
          alt="Bike picture"
        />
      </View>
      <HStack justifyContent={"space-between"}>
        <Text style={ProfileStyle.bikeNameStyle}>{props.name}</Text>
      </HStack>
    </Box>
  );
};

export default HomeBikeCard;
