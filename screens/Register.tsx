import {
  HStack,
  VStack,
  View,
  Text,
  Input,
  Button,
  KeyboardAvoidingView,
  InputField,
  ButtonText,
  useToast,
} from "@gluestack-ui/themed";
import React, { useState } from "react";
import { userService } from "../service/UserService";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerNavigationProps } from "../components/DrawerNavigation";
import { ButtonStyle } from "../style/ButtonStyle";
import { RegisterStyle } from "../style/RegisterStyle";
import { ScrollView } from "@gluestack-ui/themed";
import "react-native-get-random-values";
import ErrorAlert2 from "../components/ErrorAlert2";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";
import InformationToast from "../components/InformationToast";

type RegisterProps = {
  navigation: DrawerNavigationProp<DrawerNavigationProps, "Login">;
};
const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const toast = useToast();
  const {t} = useTranslation();

  const clear = () => {
    setLastName("");
    setFirstName("");
    setUsername("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setCheckPassword("");
    setCity("");
    setCountry("");
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View style={RegisterStyle.RegisterView}>
          <VStack
            borderRadius={10}
            padding={4}
            backgroundColor={config.tokens.colors.white}
            margin={4}
          >
            <View borderBottomWidth={1} alignItems={"center"} marginBottom={4} marginTop={4}>
              <Text fontSize={30} >{t("Register")}</Text>
            </View>
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
                  }} placeholder="ex: John (min. 2)"></InputField>
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
                  }}
                  placeholder="ex: Doe (min. 2)"></InputField>
              </Input>
            </HStack>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
              <Text>{t("Country")}:</Text>
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
                  }}
                  placeholder="ex: England"></InputField>
              </Input>
            </HStack>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
              <Text>{t("City")}:</Text>
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
                  }}
                  placeholder="ex: London"></InputField>
              </Input>
            </HStack>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
              <Text>{t("Username")}:</Text>
              <Input
                width={150}
                aria-label="username"
                backgroundColor={config.tokens.colors.white}
                borderRadius={10}
                margin={1}
              >
                <InputField value={username}
                  onChangeText={(text) => setUsername(text)}
                  placeholder="ex: johnny123 (min. 5)"></InputField>
              </Input>
            </HStack>

            <HStack alignItems={"center"} justifyContent={"space-between"}>
              <Text>{t("Email")}:</Text>
              <Input
                width={150}
                aria-label="email"
                backgroundColor={config.tokens.colors.white}
                borderRadius={10}
                margin={1}
              >
                <InputField value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                  }}
                  placeholder="johndoe@email.com"></InputField>
              </Input>
            </HStack>

            <HStack alignItems={"center"} justifyContent={"space-between"}>
              <Text>{t("Password")}:</Text>
              <Input
                width={150}

                aria-label="password"
                backgroundColor={config.tokens.colors.white}
                borderRadius={10}
                margin={1}
              >
                <InputField type="password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                  }}
                  placeholder="(min. 6 characters)"></InputField>
              </Input>
            </HStack>

            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Text>{t("Confirm Password")}:</Text>
              <Input
                width={150}
                aria-label="confirmPassword"
                backgroundColor={config.tokens.colors.white}
                borderRadius={10}
                margin={1}
              >
                <InputField type="password"
                  value={checkPassword}
                  onChangeText={(text) => {
                    setCheckPassword(text);
                  }}
                  placeholder="(min. 6 characters)"></InputField>
              </Input>
            </HStack>

            <HStack alignItems={"center"} justifyContent={"space-between"}>
              <Text>{t("Phone Number")}:</Text>

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

            <Button
              marginTop={4}
              onPress={async () => {
                const response = await userService.register(
                  firstName,
                  lastName,
                  username,
                  email,
                  phoneNumber,
                  country,
                  city,
                  password,
                  checkPassword
                );
                if (response === false) {

                  toast.show({
                    duration: 3000,
                    placement: "top",
                    render: ({ id }) => {
                      return (
                        <InformationToast
                          text={"Please check your mailbox for verification"} id={"1"}></InformationToast>
                      )
                    },
                  })
                  navigation.navigate("Login");
                  clear();
                } else if (typeof response === "string") {
                  toast.show({
                    duration: 2000,
                    placement: "top",
                    render: ({ id }) => {
                      return (
                        <ErrorAlert2
                          text={response} id={"1"}></ErrorAlert2>
                      )
                    },
                  })
                }
              }}
              style={ButtonStyle.button}
            >
              <ButtonText>{t("Register")}</ButtonText>
            </Button>
          </VStack>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
