import { View, Text, Modal, Input, Button, HStack, InputField, ButtonText } from "@gluestack-ui/themed";
import React, { useState } from "react";
import { useUserStore } from "../store/UserStore";
import { bikeService } from "../service/BikeService";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";

interface propsType {
  modalVisible: boolean;
  setModalVisible: (newValue: boolean) => void;
  bikeSecretKey: string;
}

const BikeTransferCard = (props: propsType) => {
  const { user } = useUserStore();
  const {t} = useTranslation();
  if (user) {
    if (user.private.username) {
      const [secretKey, setSecretKey] = useState("");
      const [error, setError] = useState(false);


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
            <Text fontSize={20}>{t("Bike Transfer")}</Text>
          </Modal.Header>
          <View
            backgroundColor={config.tokens.colors.white}
            height={"50%"}
            width={"80%"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Text fontSize={20}>{t("Type secret key")}</Text>
            <Input
              borderColor={error ? config.tokens.colors.error100 : config.tokens.colors.coolGray900}
              width={"80%"}
            >
              <InputField onChangeText={(text) => {
                setSecretKey(text);
                setError(false);
              }}></InputField>
            </Input>
            {error && (
              <Text color={config.tokens.colors.error900} fontSize={15}>
                {t("Wrong secret key")}
              </Text>
            )}
          </View>
          <Modal.Footer
            backgroundColor={config.tokens.colors.white}
            width={"80%"}
            justifyContent={"center"}
          >
            <HStack width={"100%"} justifyContent={"space-between"}>
              <Button onPress={() => props.setModalVisible(false)}>
                <ButtonText>{t("Cancel")}</ButtonText>
              </Button>
              {user && (
                <Button
                  onPress={async () => {
                    if (
                      await bikeService.ownerChangeCheck(
                        props.bikeSecretKey,
                        secretKey,
                        user.private.username,
                        user
                      )
                    ) {
                      props.setModalVisible(false);
                    } else {
                      setError(true);
                    }
                  }}
                >
                  <ButtonText>{t("Confirm")}</ButtonText>
                </Button>
              )}
            </HStack>
          </Modal.Footer>
        </Modal>
      );
    }
  }
};

export default BikeTransferCard;
