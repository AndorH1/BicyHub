import { View, Text, HStack, Input, InputField, VStack, Textarea, TextareaInput, Button, ButtonText, ScrollView, useToast } from '@gluestack-ui/themed'
import React, { useState, } from 'react'
import { AddBikeRepairServiceStyle } from '../style/AddBikeRepairServiceStyle'
import { config } from '@gluestack-ui/config'
import { useTranslation } from 'react-i18next'
import { Dimensions, StyleSheet } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { BikeRepairServiceDetailsScreenStyle } from '../style/BikeRepairServiceDetailsScreenStyle'
import ImagePickerForAdd from '../components/ImagePickerForAdd'
import { bikeRepairService } from '../service/BikeRepairService'
import { useUserStore } from '../store/UserStore'
import ErrorAlert2 from '../components/ErrorAlert2'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackNavigatorProps } from '../components/StackNavigator'

type Props = NativeStackScreenProps<StackNavigatorProps, "AddBikeRepairService">;

const AddBikeRepairService: React.FC<Props> = ({ navigation, route }) => {

    let mapRef;
    const { t } = useTranslation();
    const width = Dimensions.get("window").width;
    const [serviceName, setServicename] = useState<string>("");
    const [serviceLocation, setServiceLocation] = useState<{ latitude: number, longitude: number }>({ latitude: 46.52260564059868, longitude: 24.598011821508408 });
    const [serviceDesrcription, setServiceDescription] = useState<string>("");
    const [newServicePictures, setNewServicePictures] = useState<string[]>([]);
    const { user } = useUserStore();
    const toast = useToast();

    // owner and rating

    const handleMapPress = (event: { nativeEvent: { coordinate: { latitude: number, longitude: number } } }) => {
        const { coordinate } = event.nativeEvent;
        //console.log(coordinate);
        setServiceLocation(coordinate);
    };

    const addService = async () => {
        //console.log("AddService Pressed");

        if (user) {
           // console.log(user.private.username);
            const bikeRepairServices = await bikeRepairService.getBikeRepairServiceByOwner(user.private.username);
            // console.log(bikeRepairServices);

            if (bikeRepairServices.length > 0) {
                toast.show({
                    duration: 2000,
                    placement: "top",
                    render: () => {
                        return (
                            <ErrorAlert2 text={"You already have a service"} id={"1"} />
                        );
                    },
                });
                return;
            }

            if (user.private.username) {
                // console.log (newServicePictures);
                const response = await bikeRepairService.saveBikeServiceChanges(
                    serviceDesrcription,
                    serviceLocation,
                    serviceName,
                    user.private.username,
                    0,
                    null,
                    newServicePictures,
                    []
                );
                if (response === true) {
                    navigation.goBack();
                } else if (typeof response === "string") {
                    toast.show({
                        duration: 2000,
                        placement: "top",
                        render: () => {
                            return (
                                <ErrorAlert2 text={response} id={"1"} />
                            );
                        },
                    });
                }
            }
        } else {
            console.log("Not logged in user here?????");
        }
    };


    return (
        <ScrollView style={AddBikeRepairServiceStyle.container}>
            <VStack alignItems={"center"} justifyContent={"space-between"} margin={16} marginTop={26}>
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
                            }} placeholder=" "></InputField>
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
                        <TextareaInput value={serviceDesrcription} onChangeText={(text) => setServiceDescription(text)} />
                    </Textarea>
                </HStack>

                <Text style={{ paddingTop: 10, marginRight: 10 }}>{t("Pick an image")}:</Text>
                <ImagePickerForAdd
                    newPictures={newServicePictures}
                    setNewPictures={setNewServicePictures}
                />

                <Button onPress={() => addService()}>
                    <ButtonText>Add your service</ButtonText>
                </Button>
            </VStack>
        </ScrollView >
    )
}

export default AddBikeRepairService

const styles = StyleSheet.create({
    addButton: {
        marginTop: 10,
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
});