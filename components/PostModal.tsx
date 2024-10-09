import "react-native-get-random-values";
import { postService } from "../service/PostService";
import { View, Text, Modal, Input, HStack, Image, Button, InputField, ButtonText } from "@gluestack-ui/themed";
import React, { useState } from "react";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";

interface propsType {
  modalVisible: boolean;
  setModalVisible: (newValue: boolean) => void;
  profilePic: string;
  username: string;
  setIsLoading: (newValue: boolean) => void;
}

const PostModal = (props: propsType) => {
  const [text, setText] = useState("");
  const {t} = useTranslation();

  return (
    <Modal
      avoidKeyboard={true}
      isOpen={props.modalVisible}
      onClose={() => props.setModalVisible(false)}
    >
      <Modal.Header backgroundColor={config.tokens.colors.white} width={"80%"}>
        <Text fontSize={20}>{t("Create your post")}</Text>
      </Modal.Header>
      <View
        backgroundColor={config.tokens.colors.white}
        width={"80%"}
        height={"50%"}
        alignItems={"center"}
      >
        <HStack
          alignItems={"center"}
          justifyContent={"flex-start"}
          width={"100%"}
          paddingLeft={2}
          paddingTop={2}
        >
          <Image
            borderRadius={100}
            source={{
              uri: props.profilePic,
            }}
            alt="Profile Pic"
          />
          <Text>{props.username}</Text>
        </HStack>
        <Input
          marginTop={2}

          height={"40%"}
          width={"90%"}
        >
          <InputField onChangeText={(text) => {
            setText(text);
          }}
            placeholder={t("Write down your thoughts...")}></InputField>
        </Input>
        <HStack
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
          padding={4}
        >
          <Button onPress={() => props.setModalVisible(false)}>
            <ButtonText>{t("Cancel")}</ButtonText>
          </Button>
          <Button onPress={async () => {
            props.setIsLoading(true);
            const response = await postService.postData(
              props.username,
              props.profilePic,
              text
            );
            if (response === false) {
              alert(t("Something went wrong!"));
            }
            props.setModalVisible(false);
            props.setIsLoading(false);
          }}>
            <ButtonText>{t("Post")}</ButtonText>
          </Button>
        </HStack>
      </View>
    </Modal>
  );
};

export default PostModal;
