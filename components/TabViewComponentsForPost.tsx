import { useEffect, useState } from "react";
import { Bike, Post, User } from "../types/DataTypes";
import {
  View,
  Text,
  Button,
  Modal,
  Image,
  Input,
  HStack,
  InputField,
  ButtonText,
  Spinner
} from "@gluestack-ui/themed"
import { FlatList } from "react-native";
import { ProfileStyle } from "../style/ProfileStyle";
import BikeCard from "./BikeCard";
import ReviewCard from "./ReviewCard";
import { useUserStore } from "../store/UserStore";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigatorProps } from "./StackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { bikeService } from "../service/BikeService";
import { userService } from "../service/UserService";
import React from "react";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";

interface itemType {
  id: string;
  pictures: string[];
  name: string;
  userHelperUserName: string;
  bikeSecretKey: string;
}

const Item = ({
  id,
  pictures,
  name,
  userHelperUserName,
  bikeSecretKey,
}: itemType) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();
  return (
    <Pressable
      onPress={() => navigation.navigate("BikeDetails", { bikeId: id })}
    >
      <BikeCard
        pictures={pictures}
        name={name}
        userHelperUserName={userHelperUserName}
        bikeSecretKey={bikeSecretKey}
      />
    </Pressable>
  );
};

export const FirstRoute = ({
  userHelperuserName,
}: {
  userHelperuserName: string;
}) => {
  const [data, setData] = useState<Bike[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setData(await bikeService.getBikes(userHelperuserName));
      setIsLoading(false);
    };

    fetchData().catch((error) => console.log(error));
  }, []);

  return (
    <View style={ProfileStyle.flatlistContainer}>
      {isLoading ? (
        <HStack space="sm" alignItems="center" justifyContent="center">
          <Spinner size={"large"} />
          <Text size="lg">{t("Please Wait")}</Text>
        </HStack>
      ) : (
        <View>
          {data.length === 0 && (
            <Text>{userHelperuserName} {t("didn't post any bikes")}</Text>
          )}
          <FlatList
            contentContainerStyle={{ alignItems: "stretch" }}
            //size={"full"}
            data={data}
            //keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <Item
                  id={item.id}
                  pictures={item.pictures}
                  name={item.name}
                  userHelperUserName={userHelperuserName}
                  bikeSecretKey={item.secretKey}
                />
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export interface ReviewType {
  userName: string;
  review: string;
  profPic: string;
  userHelper: User | null;
}

const Item2 = ({ userName, review, profPic, userHelper }: ReviewType) => {
  return (
    <ReviewCard
      userName={userName}
      profPic={profPic}
      review={review}
      userHelper={userHelper}
    />
  );
};

export const SecondRoute = ({ userHelper }: { userHelper: User | null }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useUserStore();
  const [comment, setComment] = useState("");
  const {t} = useTranslation();
  return (
    <View style={ProfileStyle.flatlistContainer}>
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Header
          backgroundColor={config.tokens.colors.white}
          width={"80%"}
          justifyContent={"center"}
        >
          <Text fontSize={16}>{t("Review")}</Text>
        </Modal.Header>
        <View
          backgroundColor={config.tokens.colors.white}
          height={"50%"}
          width={"80%"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {user && (
            <View width={"100%"}>
              <HStack marginLeft={2} alignItems={"center"}>
                <Image
                  borderRadius={100}
                  // size={10}
                  source={{
                    uri: user.private.profilePic,
                  }}
                  alt="Profile Pic"
                />
                <Text>{user.private.username}</Text>
              </HStack>
            </View>
          )}
          <Input
            margin={2}
            width={"90%"}
            height={"50%"}
          >
            <InputField placeholder={t("Write your review here")}
              onChangeText={(text) => setComment(text)}></InputField>
          </Input>
          <HStack
            alignItems={"center"}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <Button marginLeft={2} onPress={() => setModalVisible(false)}>
              <ButtonText>{t("Cancel")}</ButtonText>
            </Button>
            {user && userHelper && (
              <Button
                marginRight={2}
                onPress={async () => {
                  const response = await userService.submitReview(
                    user.private.username,
                    comment,
                    user.private.profilePic ||
                    "https://firebasestorage.googleapis.com/v0/b/bicyhub-e12e1.appspot.com/o/ProfilePics%2Fac11aa2add3b0193c8769e0a17d13535.jpg?alt=media&token=e6b8f76d-e0b3-43b4-b031-d2dff7d351e9",
                    userHelper
                  );
                  if (response === false) {
                    alert("Something went wrong");
                  }
                  setModalVisible(false);
                }}
              >
                <ButtonText>{t("Submit")}</ButtonText>
              </Button>
            )}
          </HStack>
        </View>
      </Modal>
      {user?.private.username !== userHelper?.private.username && user && (
        <Button onPress={() => setModalVisible(true)} margin={2}>
          <ButtonText>{t("Add review")}</ButtonText>
        </Button>
      )}
      {userHelper?.public.Reviews?.length === 0 && (
        <Text>{userHelper?.private.username} {t("doesn't have any reviews")}</Text>
      )}
      <FlatList
        data={userHelper?.public.Reviews}
        renderItem={({ item }) => {
          return (
            <Item2
              userName={item.userName}
              review={item.review}
              profPic={item.profPic}
              userHelper={userHelper}
            />
          );
        }}
      />
    </View>
  );
};