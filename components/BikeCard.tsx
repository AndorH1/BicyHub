import React, { useState } from "react";
import { View, Text, Image, HStack, Button, Box, ButtonText, } from "@gluestack-ui/themed"
import { ProfileStyle } from "../style/ProfileStyle";
import BikeTransferCard from "./BikeTransferCard";
import { useUserStore } from "../store/UserStore";
import SecretKeyModal from "./SecretKeyModal";
import { useTranslation } from "react-i18next";

interface bikeCardProps {
  pictures: string[];
  name: string;
  userHelperUserName: string;
  bikeSecretKey: string;
}

const BikeCard = (props: bikeCardProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [secretModalVisible, setSecretModalVisible] = useState(false);
  const { user } = useUserStore();
  const {t} = useTranslation();

  return (
    <Box style={ProfileStyle.bikeImageContainer} marginHorizontal={6} marginVertical={2}>
      <View>
        <Image
          style={{ width: "100%", height: undefined, aspectRatio: 1 }}
          source={{
            uri: props.pictures.at(0),
          }}
          alt="Bike picture"
        />
      </View>
      <HStack justifyContent={"space-between"}>
        <Text style={ProfileStyle.bikeNameStyle}>{props.name}</Text>
        {user && user.private.username !== props.userHelperUserName && (
          <Button
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <ButtonText>{t("Claim Bike")}</ButtonText>
          </Button>
        )}
        {user && user.private.username === props.userHelperUserName && (
          <Button onPress={() => setSecretModalVisible(true)}>
            <ButtonText>{t("View Secret Key")}</ButtonText>
          </Button>
        )}
      </HStack>
      {modalVisible && (
        <BikeTransferCard
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          bikeSecretKey={props.bikeSecretKey}
        />
      )}
      {secretModalVisible && (
        <SecretKeyModal
          modalVisible={secretModalVisible}
          setModalVisible={setSecretModalVisible}
          bikeSecretKey={props.bikeSecretKey}
        />
      )}
    </Box>
  );
};

export default BikeCard;
