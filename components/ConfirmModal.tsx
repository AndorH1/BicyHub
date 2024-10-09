import { View, Text, Modal, HStack, Button, ButtonText, Spinner } from "@gluestack-ui/themed";
import React from "react";
import { Post } from "../types/DataTypes";
import { useLoadingStore } from "../store/LoadingStore";
import { postService } from "../service/PostService";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";

interface ConfirmModalType {
  modalVisible: boolean;
  setModalVisible: (newValue: boolean) => void;
  post: Post;
}

const ConfirmModal = (props: ConfirmModalType) => {
  const { isLoading, setIsLoading } = useLoadingStore();
  const {t} = useTranslation();

  return (
    <Modal
      isOpen={props.modalVisible}
      onClose={() => props.setModalVisible(false)}
    >
      <View
        backgroundColor={config.tokens.colors.white}
        height={"17%"}
        width={"50%"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {isLoading ? (
          <HStack space="sm" alignItems="center" justifyContent="center">
            <Spinner size={"large"} />
            <Text size="lg">{t("Please Wait")}</Text>
          </HStack>
        ) : (
          <Text>{t("Are you sure you want to delete this post?")}</Text>
        )}
        <HStack margin={2} justifyContent={"space-between"} width={"80%"}>
          <Button onPress={() => props.setModalVisible(false)}>
            <ButtonText>{t("No")}</ButtonText>
          </Button>
          <Button onPress={async () => {
            setIsLoading(true);
            const response = await postService.deletePost(props.post);
            if (response === false) {
              alert(t("Something went wrong!"));
            }
            setIsLoading(false);
            props.setModalVisible(false);
          }}>
          <ButtonText>{t("Yes")}</ButtonText>
          </Button>
        </HStack>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
