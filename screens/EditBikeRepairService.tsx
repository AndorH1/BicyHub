import { View, Text, HStack, Input, InputField, VStack, Textarea, TextareaInput, Button, ButtonText, ScrollView, Spinner } from '@gluestack-ui/themed'
import React, { useEffect, useState, } from 'react'
import { AddBikeRepairServiceStyle } from '../style/AddBikeRepairServiceStyle'
import { config } from '@gluestack-ui/config'
import { useTranslation } from 'react-i18next'
import { Dimensions, StyleSheet } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { BikeRepairServiceDetailsScreenStyle } from '../style/BikeRepairServiceDetailsScreenStyle'
import ImagePickerForAdd from '../components/ImagePickerForAdd'
import { bikeRepairService } from '../service/BikeRepairService'
import { useLoadingStore } from '../store/LoadingStore'
import { BikeRepairType } from '../types/DataTypes'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackNavigatorProps } from '../components/StackNavigator'

type Props = NativeStackScreenProps<StackNavigatorProps, "EditBikeRepairService">;

const EditBikeRepairService: React.FC<Props> = ({ navigation, route }) => {

  const owner = route.params.owner;
  let mapRef;
  const { isLoading, setIsLoading } = useLoadingStore();
  const { t } = useTranslation();
  const width = Dimensions.get("window").width;
  const [bikeRepair, setBikeRepair] = useState<BikeRepairType>();
  const [serviceName, setServicename] = useState<string>(bikeRepair?.name ? bikeRepair?.name : "");
  const [serviceLocation, setServiceLocation] = useState<{ latitude: number, longitude: number }>(bikeRepair?.coordinates ? bikeRepair?.coordinates : { latitude: 46.52260564059868, longitude: 24.598011821508408 });
  const [serviceDesrcription, setServiceDescription] = useState<string>(bikeRepair?.description ? bikeRepair.description : "");
  const [newServicePictures, setNewServicePictures] = useState<string[]>(bikeRepair?.image ? bikeRepair.image : []);
  const [bikeRepairServiceHelper, setBikeRepairServiceHelper] = useState<BikeRepairType[]>([]);
  // owner and rating

  const handleMapPress = (event: { nativeEvent: { coordinate: { latitude: number, longitude: number } } }) => {
    const { coordinate } = event.nativeEvent;
    console.log(coordinate);
    setServiceLocation(coordinate);
  };

  const changeService = () => {
    console.log("EditService Pressed");
  }

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
    setBikeRepair(bikeRepairServiceHelper[0])
    setIsLoading(false);
  }, [bikeRepairServiceHelper])

  return (
    console.log(serviceName),
    <ScrollView style={AddBikeRepairServiceStyle.container}>
      {isLoading ? (
        <HStack space="sm" alignItems="center" justifyContent="center">
          <Spinner size={"large"} />
          <Text size="lg">{t("Please Wait")}</Text>
        </HStack>
      ) : (
        <View>
          {bikeRepair ? (
            <View>
              <Text style={{ alignSelf: 'center', marginTop: 26 }}>AddBikeRepairService</Text>
              <VStack alignItems={"center"} justifyContent={"space-between"} margin={16} marginTop={26}>
                <Button onPress={async () => await bikeRepairService.deleteBikeService(bikeRepair)}>
                  <ButtonText>Delete</ButtonText>
                </Button>
                <HStack style={{ marginVertical: 10 }}>
                  <Text style={{ paddingTop: 10, marginRight: 10 }}>{t("Service name")}:</Text>
                  <Input
                    width={"50%"}
                    aria-label="Service name"
                    backgroundColor={config.tokens.colors.white}
                    borderRadius={10}
                    margin={1}
                  >
                    <InputField value={serviceName}
                      onChangeText={(text) => {
                        setServicename(text);
                      }} placeholder={bikeRepair.name}></InputField>
                  </Input>
                </HStack>

                <VStack style={{ marginVertical: 10 }}>
                  <Text style={{ paddingTop: 10, marginRight: 10 }}>{t("Service location")}:</Text>
                  <MapView
                    style={BikeRepairServiceDetailsScreenStyle.map}
                    ref={(ref) => { mapRef = ref }}
                    mapType="hybrid"
                    loadingEnabled
                    initialRegion=
                    {{
                      latitude: serviceLocation.latitude,
                      longitude: serviceLocation.longitude,
                      latitudeDelta: 0.009,
                      longitudeDelta: 0.009
                    }}
                    onPress={(event) => handleMapPress(event)}
                  >
                    <Marker coordinate={{
                      latitude: serviceLocation.latitude,
                      longitude: serviceLocation.longitude
                    }}>

                    </Marker>
                  </MapView>
                  {serviceLocation && (
                    <View style={{ marginVertical: 10 }}>
                      <Text>Latitude: {serviceLocation.latitude}</Text>
                      <Text>Longitude: {serviceLocation.longitude}</Text>
                    </View>
                  )}
                </VStack>

                <HStack style={{ marginVertical: 10 }}>
                  <Text style={{ paddingTop: 10, marginRight: 10 }}>{t("Service description")}:</Text>
                  <Textarea width={width / 2}>
                    <TextareaInput value={serviceDesrcription} onChangeText={(text) => setServiceDescription(text)} placeholder={bikeRepair.description} />
                  </Textarea>
                </HStack>

                <VStack>
                  <Text style={{ paddingTop: 10, marginRight: 10 }}>{t("Pick an image")}:</Text>
                  <ImagePickerForAdd
                    newPictures={newServicePictures}
                    setNewPictures={setNewServicePictures}
                  ></ImagePickerForAdd>
                </VStack>
                <View style={{ paddingBottom: 20 }}>
                  <Button style={styles.addButton} onPress={() => changeService()}>
                    <ButtonText>Add your service</ButtonText>
                  </Button>
                </View>
              </VStack>
            </View>
          ) : (
            <View>
              <Text> You have no services</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  )
}

export default EditBikeRepairService

const styles = StyleSheet.create({
  addButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
});