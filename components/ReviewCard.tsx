import {
  Modal,
  Button,
  View,
  Text,
  Box,
  HStack,
  Pressable,
  Image,
  ButtonText,
  Icon,
  CloseIcon,
} from "@gluestack-ui/themed"
import React, { useState } from "react";
import { ProfileStyle } from "../style/ProfileStyle";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorProps } from "./StackNavigator";
import { DeleteReviewModalStyle } from "../style/DeleteReviewModalStyle";
import { useUserStore } from "../store/UserStore";
import { userService } from "../service/UserService";
import { User } from "../types/DataTypes";
import { ScrollView } from "@gluestack-ui/themed";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";

export interface reviewCardProps {
  userName: string;
  review: string;
  profPic: string;
  userHelper: User | null;
}

const ReviewCard = (props: reviewCardProps) => {
  const { user } = useUserStore();
  const [modalVisible, setModalVisible] = useState(false);
  const {t} = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();
  return (
    <Box style={ProfileStyle.bikeImageContainer} marginHorizontal={6} marginVertical={2}>
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <View style={DeleteReviewModalStyle.Modal}>
          <Text>{t("Are you sure you want to delete your review?")}</Text>
        </View>
        <View height={"6%"} width={"55%"} backgroundColor={config.tokens.colors.white}>
          <HStack width={"100%"} justifyContent={"space-between"}>
            <Button marginLeft={2} onPress={() => setModalVisible(false)}>
              <ButtonText>{t("Cancel")}</ButtonText>
            </Button>
            <Button
              marginRight={2}
              onPress={async () => {
                const response = await userService.deleteReview(
                  props.userName,
                  props.review,
                  props.profPic,
                  props.userHelper
                );
                if (response === false) {
                  alert("Something went wrong!");
                }
                setModalVisible(false);
              }}
            >
              <ButtonText>{t("Confirm")}</ButtonText>
            </Button>
          </HStack>
        </View>
      </Modal>
      <HStack justifyContent={"space-between"}>
        <Pressable
          onPress={() =>
            navigation.navigate("Other Profiles", { username: props.userName })
          }
        >
          <HStack
          >
            <Image
              borderRadius={100}
              source={{
                uri: props.profPic,
              }}
              alt="Prof Pic"
            />
            <Text>{props.userName}</Text>
          </HStack>
        </Pressable>
        {user && user.private.username === props.userName && (
          <Pressable onPress={() => setModalVisible(true)}>
            <Icon as={CloseIcon} m="$2" w="$4" h="$4" />
          </Pressable>
        )}
      </HStack>

      <ScrollView>
        <Text>{props.review}</Text>
      </ScrollView>

    </Box>
  );
};

export default ReviewCard;
