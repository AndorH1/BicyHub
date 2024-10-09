import {
  Pressable,
  Box,
  View,
  Text,
  Image,
  HStack,
  Button,
  ButtonText,
  Spinner,
} from "@gluestack-ui/themed";
import { ListRenderItemInfo, FlatList, } from "react-native";
import React, { useEffect, useState } from "react";
import { Bike } from "../types/DataTypes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorProps } from "../components/StackNavigator";
import { useUserStore } from "../store/UserStore";
import { MyBikesStyle } from "../style/MyBikeStyle";
import { useLoadingStore } from "../store/LoadingStore";
import { bikeService } from "../service/BikeService";
import { useTranslation } from "react-i18next";

const MyBikes = () => {
  const { user } = useUserStore();
  if (user) {
    const [bikes, setBikes] = useState<Bike[]>([]);
    const { isLoading, setIsLoading } = useLoadingStore();
    const navigation =
      useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();
      const {t} = useTranslation();

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        setBikes([]);
        setBikes(await bikeService.getBikes(user.private.username));
        setIsLoading(false);
      };
      fetchData();
    }, []);

    const renderBikeItem = (itemData: ListRenderItemInfo<Bike>) => {
      return (
        <Box>
          <Pressable
            onPress={() => navigation.navigate("BikeDetails", { bikeId: itemData.item.id })}
            style={MyBikesStyle.cardStyle}
          >
            <Box width={"auto"}>
              <View>
                <Image
                  resizeMode="cover"
                  style={MyBikesStyle.cardImage}
                  source={{ uri: itemData.item.pictures[0] }}
                  alt={itemData.item.name}
                />
              </View>
              <HStack>
                <Text style={MyBikesStyle.bikeTitle}>{itemData.item.name}</Text>
              </HStack>
            </Box>
          </Pressable>
        </Box>
      );
    };

    return (
      <View>
        {isLoading ? (
          <HStack space="sm" alignItems="center" justifyContent="center">
            <Spinner size={"large"} />
            <Text size="lg">{t("Please Wait")}</Text>
          </HStack>
        ) : (
          <View style={MyBikesStyle.style}>
            <FlatList
              data={bikes}
              renderItem={renderBikeItem}
            />
            <Button
              onPress={() => navigation.navigate("AddEditBike", { bike: null })}
            >
              <ButtonText> {t("Add bike")} </ButtonText>
            </Button>
          </View>
        )}
      </View>
    );
  }
};

export default MyBikes;
