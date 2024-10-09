import {
  Box,
  Divider,
  Select,
  Image,
  Button,
  View,
  VStack,
  HStack,
  Text,
  Input,
  InputField,
  ButtonText,
  useToast,
  SelectItem,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  Icon,
  ChevronDownIcon,
  Center,
} from "@gluestack-ui/themed/build/components";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackNavigatorProps } from "../components/StackNavigator";
import { Dimensions } from "react-native";
import { EditBikeStyle } from "../style/EditBikeStyle";
import { useEffect, useState } from "react";
import { Bike, BikeType, LogType } from "../types/DataTypes";
import { ScrollView } from "@gluestack-ui/themed";
import { FlatList, } from "react-native";
import { useUserStore } from "../store/UserStore";
import ImagePickerForAdd from "../components/ImagePickerForAdd";
import { ZodError } from "zod";
import React from "react";
import { v4 as uuidv4 } from "uuid"
import ErrorAlert2 from "../components/ErrorAlert2";
import { bikeService } from "../service/BikeService";
import { useTranslation } from "react-i18next";
import PagerView from "react-native-pager-view";

type Props = NativeStackScreenProps<StackNavigatorProps, "AddEditBike">;

const AddEditBike: React.FC<Props> = ({ navigation, route }) => {
  const bike: Bike | null = route.params?.bike;
  const { user } = useUserStore();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const [newBikeId, setNewBikeId] = useState<string>("");
  const [newBikeName, setNewBikeName] = useState<string>("");
  const [newBikeValue, setNewBikeValue] = useState<string>("");
  const [newBikeDescription, setNewBikeDescription] = useState<string>("");
  const [newBikeModelYear, setNewBikeModelYear] = useState<string>("");
  const [newBikeType, setNewBikeType] = useState<BikeType | null>(null);
  const [newBikeLog, setNewBikeLog] = useState<LogType>([]);
  const [newBikePictures, setNewBikePictures] = useState<string[]>([]);
  const [newBikePrevOwners, setNewBikePrevOwners] = useState<
    string[] | undefined
  >([]);
  const [onePrevOwner, setOnePrevOwner] = useState<string>("");
  const [newBikeComponents, setNewBikeComponents] = useState<
    Record<string, string>
  >({});
  const [newComponentName, setNewComponentName] = useState<string>("");
  const [newComponentType, setNewComponentType] = useState<string>("");
  const [copyImages, setCopyImages] = useState<string[]>([]);
  const toast = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (bike) {
      setNewBikeId(bike.id);
      setNewBikeName(bike.name);
      setNewBikeValue(`${bike.value}`);
      setNewBikeDescription(bike.description);
      setNewBikeModelYear(`${bike.modelYear}`);
      setNewBikeType(bike.type);
      setNewBikePictures(bike.pictures);
      setNewBikePrevOwners(bike.prevOwners);
      setNewBikeComponents(bike.components);

    } else {
      setNewBikeId(uuidv4());
    }
  }, []);

  const renderBikeItem = ({ item, index }: { item: string; index: number }) => {
    const deletePreviousOwner = async () => {
      const updatedPrevOwners = [...newBikePrevOwners!];
      updatedPrevOwners.splice(index, 1);
      setNewBikePrevOwners(updatedPrevOwners);
    };

    return (
      <Box width={"auto"}>
        <View>
          <HStack
            alignItems={"center"}
            justifyContent={"space-around"}
            marginHorizontal={4}
            marginVertical={1}
            width={"100%"}
          >
            <Text>{`\t\t ${item}`}</Text>
            <Button width={"30%"} onPress={() => deletePreviousOwner()}>
              <ButtonText>{t("delete")}</ButtonText>
            </Button>
          </HStack>
        </View>
      </Box>
    );
  };

  const addPreviousOwner = () => {
    if (onePrevOwner) {
      const updatedPrevOwners = [...newBikePrevOwners!, onePrevOwner];
      setNewBikePrevOwners(updatedPrevOwners);
    }
  };

  const deleteOneComponent = (componentToDelete: string) => {
    const updatedComponents = { ...newBikeComponents };
    delete updatedComponents[componentToDelete];
    setNewBikeComponents(updatedComponents);
  };

  const addComponent = () => {
    if (newComponentName && newComponentType) {
      const updatedComponents = { ...newBikeComponents };
      updatedComponents[newComponentName] = newComponentType;
      setNewBikeComponents(updatedComponents);
      setNewComponentName("");
      setNewComponentType("");
    }
  };

  return (
    <>
      <View style={EditBikeStyle.container}>
        <ScrollView>
          <VStack style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={EditBikeStyle.wellcomeText}>{t("Make your changes!")}</Text>

            <Text>
              {t("Your changes will be done, when you press the save button")}
            </Text>
          </VStack>

          {bike && (
            <View style={EditBikeStyle.card}>
              <Divider orientation="horizontal"></Divider>
              <Text>{t("Your Previous Bikes")}</Text>
              <PagerView
                style={EditBikeStyle.card}
                initialPage={0}
              >
                {bike?.pictures.map((picture, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      resizeMode="cover"
                      style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 1,
                      }}
                      source={{ uri: picture }}
                      alt="bike"
                    />
                  </View>
                ))}
              </PagerView>
            </View>
          )}

          <VStack style={EditBikeStyle.editField} width={width}>
            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
              marginHorizontal={4}
              marginVertical={1}
            >
              <Text>{t("Bike name")}</Text>
              <Input width={width / 2}>
                <InputField placeholder={newBikeName}
                  onChangeText={(text) => setNewBikeName(text)}
                  value={newBikeName} />
              </Input>
            </HStack>
            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
              marginHorizontal={4}
              marginVertical={1}
            >
              <Text>{t("Bike type")}</Text>
              <View>
                <Select minWidth={"$1/2"}>
                  <SelectTrigger>
                    <SelectInput placeholder="Select option" />

                    <Icon as={ChevronDownIcon} />

                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="ASPHALT" value="ASPHALT" />
                      <SelectItem label="CROSS" value="CROSS" />
                      <SelectItem label="TANDEM" value="TANDEM" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </View>
            </HStack>
            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
              marginHorizontal={4}
              marginVertical={1}
            >
              <Text>{t("Bike value")}</Text>
              <Input width={width / 2}>
                <InputField placeholder={newBikeValue}
                  onChangeText={(text) => setNewBikeValue(text)}
                  value={newBikeValue} />
              </Input>
            </HStack>
            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
              marginHorizontal={4}
              marginVertical={1}
            >
              <Text>{t("Bike description")}</Text>
              <Input
                width={width / 2}
              >
                <InputField placeholder=""
                  value={newBikeDescription}
                  onChangeText={(text) => setNewBikeDescription(text)}></InputField>
              </Input>
            </HStack>
            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
              marginHorizontal={4}
              marginVertical={1}
            >
              <Text>{t("Bike Model Year")}</Text>
              <Input
                width={width / 2}
              >
                <InputField placeholder=""
                  onChangeText={(text) => setNewBikeModelYear(text)}
                  value={newBikeModelYear}></InputField>
              </Input>
            </HStack>

            <VStack marginHorizontal={4} marginVertical={1} >
              <Text>{t("Previous owners")}</Text>
              <Center marginHorizontal={4}>
                <FlatList
                  scrollEnabled={false}
                  data={newBikePrevOwners}
                  renderItem={renderBikeItem}
                  keyExtractor={(_, index) => index.toString()}
                ></FlatList>
              </Center>
              <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                marginHorizontal={4}
                marginVertical={1}
              >
                <Input
                  minWidth={width / 2}
                >
                  <InputField placeholder="More previous owner"
                    value={onePrevOwner}
                    onChangeText={(tx) => setOnePrevOwner(tx)}></InputField>
                </Input>
                <Button

                  width={width / 3}
                  onPress={() => addPreviousOwner()}
                >
                  <ButtonText>{t("Add owner")}</ButtonText>
                </Button>
              </HStack>
            </VStack>

            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
              marginHorizontal={4}
              marginVertical={1}
            >
              <VStack marginHorizontal={4}>
                <>
                  <Text>{t("Current components")}:</Text>
                  {Object.entries(newBikeComponents).map(
                    ([componentName, componentValue], index) => (
                      <View key={index}>
                        <HStack
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          marginHorizontal={4}
                          marginRight={6}
                          marginVertical={1}
                        >
                          <Text>
                            {"\t\t"}-{componentName + ": " + componentValue}
                          </Text>
                          <Button
                            width={width / 3}
                            onPress={() => deleteOneComponent(componentName)}
                          >
                            <ButtonText>{t("Remove")}</ButtonText>
                          </Button>
                        </HStack>
                      </View>
                    )
                  )}
                </>
                <HStack
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  marginHorizontal={-4}
                >
                  <Input
                    minWidth={width / 3}
                  >
                    <InputField placeholder="Name"
                      value={newComponentName}
                      onChangeText={(tx) => setNewComponentName(tx)}></InputField>
                  </Input>
                  <Input
                    minWidth={width / 3}
                  >
                    <InputField placeholder="Type"
                      value={newComponentType}
                      width={width / 3}
                      onChangeText={(tx) => setNewComponentType(tx)}></InputField>
                  </Input>
                  <Button onPress={() => addComponent()} width={width / 3}>
                    <ButtonText>{t("Add")}</ButtonText>
                  </Button>
                </HStack>
              </VStack>
            </HStack>

            <ImagePickerForAdd
              newPictures={newBikePictures}
              setNewPictures={setNewBikePictures}
            ></ImagePickerForAdd>

            <HStack alignItems={"center"} justifyContent={"center"} marginVertical={2}>
              <Button marginHorizontal={4} onPress={async () => {
                if (user) {
                  if (user.private.username) {
                    const response = await bikeService.saveChanges(
                      newBikeId,
                      user.private.id,
                      newBikeName,
                      newBikeValue,
                      newBikeDescription,
                      newBikeModelYear,
                      newBikeType,
                      newBikePrevOwners,
                      newBikeComponents,
                      newBikeLog,
                      user.private.username,
                      bike,
                      newBikePictures,
                      copyImages
                    );
                    if (response === true) {
                      navigation.goBack();
                    } else if (typeof response === "string") {
                      toast.show({
                        duration: 2000,
                        placement: "top",
                        render: () => {
                          return (
                            <ErrorAlert2
                              text={response} id={"1"}></ErrorAlert2>
                          )
                        },
                      })
                    }
                  }
                }
              }}>
                <ButtonText>{t("Save changes")}</ButtonText>
              </Button>
              <Button marginVertical={4} onPress={() => navigation.goBack()}>
                <ButtonText>{t("Cancel")}</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </ScrollView>
      </View>
    </>
  );
};

export default AddEditBike;

