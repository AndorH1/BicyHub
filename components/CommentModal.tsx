import { View, Text, Modal, Image, HStack, Input, Button, InputField, ButtonText, ScrollView } from "@gluestack-ui/themed";
import React, { useState } from "react";
import { Post, User } from "../types/DataTypes";
import { postService } from "../service/PostService";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";

interface propsType {
  modalVisible: boolean;
  setModalVisible: (newValue: boolean) => void;
  post: Post;
  user: User;
}

const CommentModal = (props: propsType) => {
  const [comment, setComment] = useState("");
  const {t} = useTranslation();

  return (
    <Modal
      marginTop={8}
      isOpen={props.modalVisible}
      onClose={() => props.setModalVisible(false)}
      justifyContent={"flex-start"}
      avoidKeyboard
    >
      <Modal.Header backgroundColor={config.tokens.colors.white} width={"80%"} height={"30%"}>
        <HStack alignItems={"center"} width={"100%"}>
          <Image
            borderRadius={100}
            source={{
              uri: props.post.post.profilePic,
            }}
            alt="Profile pic"
          />
          <Text>{props.post.post.userName}</Text>
        </HStack>

        <ScrollView>
          <View>
            <Text>{props.post.post.text}</Text>
          </View>
        </ScrollView>

      </Modal.Header>
      <View backgroundColor={config.tokens.colors.white} width={"80%"}>
        <HStack alignItems={"center"}>
          <Image
            borderRadius={100}
            source={{
              uri: props.user.private.profilePic,
            }}
            alt="Profile pic"
          />
          <Text>{props.user.private.username}</Text>
        </HStack>
        <Input
        >
          <InputField placeholder="Add comment.."
            onChangeText={(text) => setComment(text)}></InputField>
        </Input>
        <HStack justifyContent={"space-between"} padding={2}>
          <Button onPress={() => props.setModalVisible(false)}>
            <ButtonText>{t("Cancel")}</ButtonText>
          </Button>
          <Button onPress={async () => {
            const response = await postService.postComment(
              props.post,
              props.user,
              comment
            );
            if (response === false) {
              alert(t("Something went wrong!"));
            }
            props.setModalVisible(false);
          }}>
            <ButtonText>{t("Post")}</ButtonText>
          </Button>
        </HStack>
      </View>
    </Modal>
  );
};

export default CommentModal;
