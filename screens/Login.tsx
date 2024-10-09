import {
  Button,
  VStack,
  Text,
  Input,
  InputField,
  ButtonText,
  KeyboardAvoidingView,
  Heading,
  useToast
} from "@gluestack-ui/themed/build/components";
import React, { useState } from "react";
import { useUserStore } from "../store/UserStore";
import { Platform } from "react-native";
import { userService } from "../service/UserService";
import ErrorAlert2 from "../components/ErrorAlert2";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserStore();
  const toast = useToast();
  const {t} = useTranslation();


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <VStack
        space="xl"
        alignItems="stretch"
      >
        <Heading>
          {t("Login")}
        </Heading>
        <Text paddingRight={2} margin={3}>
          {t("Email")}:
        </Text>
        <Input size="xl" >
          <InputField
            type="text"
            placeholder="email..."
            onChangeText={(text) => setEmail(text)} />
        </Input>
        <Text >
          {t("Password")}:
        </Text>
        <Input size="md">
          <InputField placeholder="password..."
            onChangeText={(text) => setPassword(text)}
            type="password" />
        </Input>
        {<Button
          onPress={async () => {
            const response = await userService.login(email, password);
            if (response == null) {
              toast.show({
                duration: 2000,
                placement: "top",
                render: ({ }) => {
                  return (
                    <ErrorAlert2
                      text={"Invalid email or password!"} id={"1"}></ErrorAlert2>
                  )
                },
              })
            } else if (typeof response === 'boolean') {
              toast.show({
                duration: 2000,
                placement: "top",
                render: ({ }) => {
                  return (
                    <ErrorAlert2
                      text={"Please verify your email"} id={"1"}></ErrorAlert2>
                  )
                },
              })
            } else {
              setUser(response);
            }
          }}
        >
          <ButtonText>{t("Login")}</ButtonText>
        </Button>}
      </VStack>
    </KeyboardAvoidingView>
  );
};

export default Login;
