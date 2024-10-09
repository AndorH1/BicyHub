import React, { useState } from "react";
import { VStack, View, Text, HStack, Input, Button, InputField, ButtonText, useToast } from "@gluestack-ui/themed";
import { useUserStore } from "../store/UserStore";
import { ButtonStyle } from "../style/ButtonStyle";
import { RegisterStyle } from "../style/RegisterStyle";
import ErrorAlert2 from "../components/ErrorAlert2";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { userService } from "../service/UserService";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";

const Edit = () => {
  const { user, setUser } = useUserStore();
  if (user) {
    const [firstName, setFirstName] = useState(user.private.firstName || "");
    const [lastName, setLastName] = useState(user.private.lastName || "");
    const [phoneNumber, setPhoneNumber] = useState(user.private.phoneNumber || "");
    const [country, setCountry] = useState(user.private.country || "");
    const [city, setCity] = useState(user.private.city || "");
    const stackNavigation =
      useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const toast = useToast();
    const {t} = useTranslation();


    return (
      <View style={RegisterStyle.RegisterView}>
        <VStack>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Text>{t("First Name")}:</Text>
            <Input
              width={150}
              aria-label="firstName"
              backgroundColor={config.tokens.colors.white}
              borderRadius={10}
              margin={1}
            >
              <InputField value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                }}
                placeholder="ex: John (min. 2)"></InputField>
            </Input>
          </HStack>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Text>{t("Last Name")}:</Text>
            <Input
              width={150}
              aria-label="lastName"
              backgroundColor={config.tokens.colors.white}
              borderRadius={10}
              margin={1}
            >
              <InputField value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                }} placeholder="ex: Doe (min. 2)"></InputField>
            </Input>
          </HStack>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Text>Country:</Text>
            <Input
              width={150}
              aria-label="country"
              backgroundColor={config.tokens.colors.white}
              borderRadius={10}
              margin={1}
            >
              <InputField value={country}
                onChangeText={(text) => {
                  setCountry(text);
                }}></InputField>
            </Input>
          </HStack>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Text>City:</Text>
            <Input
              width={150}
              aria-label="city"
              backgroundColor={config.tokens.colors.white}
              borderRadius={10}
              margin={1}
            >
              <InputField value={city}
                onChangeText={(text) => {
                  setCity(text);
                }}></InputField>
            </Input>
          </HStack>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Text>Phone Number:</Text>

            <Input
              width={150}
              aria-label="phoneNum"
              backgroundColor={config.tokens.colors.white}
              borderRadius={10}
              margin={1}
            >
              <InputField placeholder="Optional"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}></InputField>
            </Input>
          </HStack>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Button
              style={ButtonStyle.button}
              onPress={() => stackNavigation.goBack()}
            >
              <ButtonText> {t("Cancel")} </ButtonText>
            </Button>
            <Button style={ButtonStyle.button} onPress={async () => {
              const response = await userService.updateUser(
                user,
                lastName,
                firstName,
                phoneNumber,
                country,
                city
              );
              if (typeof response === "string") {
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
              } else {
                setUser(response);
                stackNavigation.goBack();
              }
            }}>
              <ButtonText>{t("Save")}</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </View>
    );
  }
};

export default Edit;
