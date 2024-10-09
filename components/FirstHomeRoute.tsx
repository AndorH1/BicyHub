import React, { useEffect } from "react";
import { View, Button, ButtonText,HStack, Spinner, Text,Pressable } from "@gluestack-ui/themed";
import { useBikeStore } from "../store/HomeContentStore";
import { StackNavigatorProps } from "./StackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLoadingStore } from "../store/LoadingStore";
import { useNavigation } from "@react-navigation/native";
import HomeBikeCard from "./HomeBikeCard";
import { bikeService } from "../service/BikeService";
import { FlatList } from "react-native";
import { useTranslation } from "react-i18next";

interface BikeCardsRenderType {
    id: string;
    name: string;
    pictures: string[];
  }

const BikeCardsRender = (props: BikeCardsRenderType) => {
    const navigation =
      useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();
    return (
      <Pressable
        onPress={() => navigation.navigate("BikeDetails", { bikeId: props.id })}
      >
        <HomeBikeCard name={props.name} pictures={props.pictures} />
      </Pressable>
    );
  };

export const FirstHomeRoute = () => {
    const { bike, setBike } = useBikeStore();
    const { isLoading, setIsLoading } = useLoadingStore();
    const { t } = useTranslation();
  
    useEffect(() => {
      const fetchRandomBikes = async () => {
        setIsLoading(true);
        setBike(await bikeService.getRandomBikes());
        setIsLoading(false);
      };
      fetchRandomBikes();
    }, []);
  
    const flatListKey = bike?.length.toString();
  
    return (
      <View paddingBottom={20}>
        <View margin={2}>
          <Button onPress={async () => {
            setIsLoading(true);
            setBike(await bikeService.getRandomBikes());
            setIsLoading(false);
          }}>
            <ButtonText>{t("Refresh")}</ButtonText>
          </Button>
        </View>
        {isLoading ? (
          <HStack space="sm" alignItems="center" justifyContent="center">
            <Spinner size={"large"} />
            <Text size="lg">{t("Please Wait")}</Text>
          </HStack>
        ) : (
          <FlatList
            data={bike}
            renderItem={({ item }) => {
              return (
                <BikeCardsRender
                  id={item.id}
                  name={item.name}
                  pictures={item.pictures}
                />
              );
            }}
            key={flatListKey}
          />
        )}
      </View>
    );
  };