import { View, Text, ButtonText, VStack, HStack, Button, Spinner, } from "@gluestack-ui/themed";
import { Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { StackNavigatorProps } from "../components/StackNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Bike } from "../types/DataTypes";
import { BikeDetailsStyle } from "../style/BikeDetailsStyle";
import { useUserStore } from "../store/UserStore";
import ImageSlideShow from "../components/ImageSlideShow";
import { useIsFocused } from "@react-navigation/native";
import { TabBar, TabView } from "react-native-tab-view";
import { ProfileStyle } from "../style/ProfileStyle";
import { FirstBikeRoute } from "../components/FirstBikeRoute";
import { SecondBikeRoute } from "../components/SecondBikeRoute";
import { ThirdBikeRoute } from "../components/ThirdBikeRoute";
import { FourthBikeRoute } from "../components/FourthBikeRoute";
import { bikeService } from "../service/BikeService";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<StackNavigatorProps, "BikeDetails">;

const BikeDetails: React.FC<Props> = ({ navigation, route }) => {
  const [bike, setBike] = useState<Bike | null>();
  const bikeId = route.params?.bikeId;
  const { user } = useUserStore();
  const [index, setIndex] = useState(0);
  const { t } = useTranslation();
  const [routes] = useState([
    { key: "first", title: t("Description") },
    { key: "second", title: t("Specification") },
    { key: "third", title: t("History") },
    { key: "fourth", title: t("Owners") },
  ]);
  const layout = {
    width: Dimensions.get("window").width,
  };

  useEffect(() => {
    const fetchBikeData = async () => {
      setBike(await bikeService.getBikeData(bikeId));
    };
    fetchBikeData();
  }, [useIsFocused()]);

  if (bike === null && user === null) {
    return (
      <HStack space="sm" alignItems="center" justifyContent="center">
        <Spinner size={"large"} />
        <Text size="lg">{t("Please Wait")}</Text>
      </HStack>
    )
  }

  return (
    console.log(bike),
    <View style={BikeDetailsStyle.container}>

      {/* <ScrollView style={{ flex: 1 }}> */}
      <View style={{ alignItems: "center" }}>
        {bike && bike.pictures ? (
          <ImageSlideShow pictures={bike.pictures} />
        ) : (
          <Text>{t("No images available")}</Text>
        )}
      </View>
      <VStack style={{ alignItems: "center", marginTop: 8 }}>
        <Text style={BikeDetailsStyle.bikeName}>{bike?.name}</Text>
        {user && bike?.owner == user.private.username ? (
          <HStack marginBottom={2}>
            <Button
              style={{ marginRight: 4 }}
              onPress={() =>
                navigation.navigate("AddEditBike", { bike: bike! })
              }
            >
              <ButtonText>{t("Edit")}</ButtonText>
            </Button>
            <Button style={{ marginLeft: 4 }} onPress={async () => {
              await bikeService.deleteBike(bike);
              navigation.goBack();
            }}>
              <ButtonText>{t("Delete bike")}</ButtonText>
            </Button>
          </HStack>
        ) : null}
      </VStack>
      {/* </ScrollView> */}
      <TabView
        style={{ height: "100%" }}
        navigationState={{ index, routes }}
        renderScene={({ route }) => {
          switch (route.key) {
            case "first": {
              if (bike) {
                return <FirstBikeRoute bikeDescription={bike.description} />;
              }
            }
            case "second": {
              if (bike) {
                return <SecondBikeRoute bike={bike} />;
              }
            }
            case "third": {
              if (bike) {
                return <ThirdBikeRoute bike={bike} />;
              }
            }
            case "fourth": {
              if (bike) {
                return <FourthBikeRoute bike={bike} />;
              }
            }
            default: {
              return null;
            }
          }
        }}
        onIndexChange={setIndex}
        initialLayout={layout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled={true}
            activeColor={config.tokens.colors.white}
            inactiveColor={config.tokens.colors.coolGray400}
            style={ProfileStyle.tabBarStyle}
          />
        )}
      />
    </View>
  );
};

export default BikeDetails;
