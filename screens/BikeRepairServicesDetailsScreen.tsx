import { View, Text, HStack, Spinner, VStack, Image, Box, Pressable, ScrollView } from '@gluestack-ui/themed'
import React, { useEffect, useState } from 'react'
import { StackNavigatorProps } from "../components/StackNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useLoadingStore } from '../store/LoadingStore';
import { bikeRepairService } from '../service/BikeRepairService'
import { BikeRepairType } from '../types/DataTypes';
import { useTranslation } from 'react-i18next';
import { Dimensions } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import MapView, { Marker } from 'react-native-maps';
import { BikeRepairServiceDetailsScreenStyle } from '../style/BikeRepairServiceDetailsScreenStyle';

type Props = NativeStackScreenProps<StackNavigatorProps, "BikeRepairServicesDetailsScreen">;

const BikeRepairServicesDetailsScreen: React.FC<Props> = ({ navigation, route }) => {

  const { isLoading, setIsLoading } = useLoadingStore();
  const owner = route.params.owner;
  const [bikeRepairServiceHelper, setBikeRepairServiceHelper] = useState<BikeRepairType[]>([]);
  const [bikeRepair, setBikeRepair] = useState<BikeRepairType>();
  const { t } = useTranslation();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get('window').height;
  let mapRef;

  useEffect(() => {
    setIsLoading(true);
    const saveData = async () => {
      const bikeRepairServices = await bikeRepairService.getBikeRepairServiceByOwner(owner);
      if (bikeRepairServices && bikeRepairServices.length > 0) {
        setBikeRepairServiceHelper(bikeRepairServices);
      }
    };
    saveData();
  }, []);

  useEffect(() => {
    setBikeRepair(bikeRepairServiceHelper[0]);
    console.log(bikeRepairServiceHelper[0]);
    setIsLoading(false);
  }, [bikeRepairServiceHelper])

  return (
    <ScrollView>
      <View>
        {isLoading ? (
          <HStack space="sm" alignItems="center" justifyContent="center">
            <Spinner size={"large"} />
            <Text size="lg">{t("Please Wait")}</Text>
          </HStack>
        ) : (
          <View>
            <VStack>

              <Text size='3xl' style={{ alignSelf: 'center', margin: 20 }}>{bikeRepair?.name}</Text>

              {bikeRepair?.image &&
                (
                  <View>
                    <Image
                      resizeMode='cover'
                      source={{ uri: bikeRepair.image[0] }}
                      style={{ width: width - (width * 10 / 100), height: height / 3, borderRadius: 10, marginRight: 10, alignSelf: 'center' }}
                      alt="image"
                    />
                  </View>)
              }

              {bikeRepair?.description &&
                (<Text style={{ margin: 20, alignSelf: 'center' }}>
                  {bikeRepair.description}
                </Text>)}

              {bikeRepair?.rating && (<StarRating
                style={{ alignSelf: 'center' }}
                rating={bikeRepair.rating}
                onChange={function (rating: number): void { }}
              />)}

              <Box style={{ alignItems: 'center' }}>
                <Pressable
                  onPress={() =>
                    navigation.navigate("Other Profiles", {
                      username: bikeRepair?.owner,
                    })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Text fontSize={22} style={{ alignContent: 'center' }}>Owner:{'\n'} {owner} {'\n'} (press to see details)</Text>
                  </View>
                </Pressable>
                {bikeRepair && bikeRepair.coordinates ?
                  (<View style={BikeRepairServiceDetailsScreenStyle.container}>
                    <MapView
                      style={BikeRepairServiceDetailsScreenStyle.map}
                      ref={(ref) => { mapRef = ref }}
                      mapType="hybrid"
                      loadingEnabled
                      initialRegion=
                      {{
                        latitude: bikeRepair.coordinates.latitude,
                        longitude: bikeRepair.coordinates.longitude,
                        latitudeDelta: 0.009,
                        longitudeDelta: 0.009
                      }}
                    >
                      <Marker coordinate={bikeRepair.coordinates}>
                      </Marker>
                    </MapView>
                  </View>) :
                  (<Text>No map view</Text>)}
              </Box>
            </VStack>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default BikeRepairServicesDetailsScreen