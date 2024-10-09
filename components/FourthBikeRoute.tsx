import React, { useEffect, useState } from "react";
import { View, Pressable, Image, Text } from "@gluestack-ui/themed";
import { Bike } from "../types/DataTypes";
import { bikeService, ownersDataType } from "../service/BikeService";
import { StackNavigatorProps } from "./StackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";

export const FourthBikeRoute = ({ bike }: { bike: Bike }) => {
  useEffect(() => {
    const fetchPrevOwners = async () => {
      setOwnersData(await bikeService.showOwners(bike));
    };
    fetchPrevOwners();
  }, []);

  const [ownersData, setOwnersData] = useState<Array<ownersDataType>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();

  const renderOwnerItem = ({ item }: { item: ownersDataType }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("Other Profiles", {
          username: item.username,
        })
      }
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        <Image
          source={{ uri: item.profilePicture }}
          style={{ width: 60, height: 60, borderRadius: 30, marginRight: 10 }}
          alt="image"
        />
        <Text fontSize={18}>{item.username}</Text>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={ownersData}
      keyExtractor={(item) => item.username}
      renderItem={renderOwnerItem}
      contentContainerStyle={{ padding: 2 }}
    />
  );
};