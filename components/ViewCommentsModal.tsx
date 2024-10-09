import { View, Text, Modal, HStack, Button, Image, Box, ButtonText } from "@gluestack-ui/themed";
import React from "react";
import { FlatList } from "react-native";
import { Post, CommentType } from "../types/DataTypes";
import { PostStyle } from "../style/PostStyle";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";

interface propsType {
  viewModalVisible: boolean;
  setViewModalVisible: (newValue: boolean) => void;
  post: Post;
}

const CommentItem = ({ comment }: { comment: CommentType }) => {
  const { t } = useTranslation();
  return (
    <>
      <HStack alignItems={"center"}>
        <Image
          borderRadius={100}
          source={{
            uri: comment.profilePic,
          }}
          alt="Profile Pic"
        />

        <Text>{comment.writerUsername}</Text>
      </HStack>
      <Box style={PostStyle.PostContainer} marginHorizontal={6} marginVertical={2}>
        <Text>{comment.text}</Text>
      </Box>
    </>
  );
};

const ViewCommentsModal = (props: propsType) => {
  const { t } = useTranslation();
  return (
    <>
      <Modal
        isOpen={props.viewModalVisible}
        onClose={() => props.setViewModalVisible(false)}
      >
        <Modal.Header backgroundColor={config.tokens.colors.white} width={"80%"}>
          <Text>{t("Comments")}</Text>
        </Modal.Header>
        <View backgroundColor={"white"} width={"80%"}>
          {props.post.interactions.comments && (
            <FlatList
              data={props.post.interactions.comments}
              keyExtractor={(item, index) => `${item.writerUsername}_${index}`}
              renderItem={({ item }) => {
                return <CommentItem comment={item} />;
              }}
            />
          )}
          <HStack justifyContent={"space-between"} padding={2}>
            <Button onPress={() => props.setViewModalVisible(false)}>
              <ButtonText>{t("Cancel")}</ButtonText>
            </Button>
          </HStack>
        </View>
      </Modal>
    </>
  );
};

export default ViewCommentsModal;
