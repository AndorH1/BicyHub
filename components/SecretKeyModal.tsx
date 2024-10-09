import { View, Text, Modal } from "@gluestack-ui/themed";
import React from "react";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";

interface propsType {
  modalVisible: boolean;
  setModalVisible: (newValue: boolean) => void;
  bikeSecretKey: string;
}

const SecretKeyModal = (props: propsType) => {
  const{t} = useTranslation();
  return (
    <Modal
      isOpen={props.modalVisible}
      onClose={() => props.setModalVisible(false)}
    >
      <Modal.Header
        backgroundColor={config.tokens.colors.white}
        width={"80%"}
        justifyContent={"center"}
      >
        <Text fontSize={30}>{t("Secret Key")}</Text>
      </Modal.Header>
      <View
        backgroundColor={config.tokens.colors.white}
        height={"50%"}
        width={"80%"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Text fontSize={20}>{props.bikeSecretKey}</Text>
      </View>
    </Modal>
  );
};

export default SecretKeyModal;
