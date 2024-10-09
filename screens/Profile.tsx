import * as React from "react";
import { Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { Center, View, Text, Button, Image, ButtonText, Spinner, HStack, MessageCircleIcon } from "@gluestack-ui/themed";
import { useUserStore } from "../store/UserStore";
import { User } from "../types/DataTypes";
import { ProfileStyle } from "../style/ProfileStyle";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack/lib/typescript/src/types";
import { DrawerNavigationProps } from "../components/DrawerNavigation";
import { FirstRoute, SecondRoute } from "../components/TabViewComponentsForPost";
import { StackNavigatorProps } from "../components/StackNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import UploadImage from "../components/UploadImage";
import { ScrollView } from "@gluestack-ui/themed";
import { useLoadingStore } from "../store/LoadingStore";
import { userService } from "../service/UserService";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";
import { useUserChatStore } from "../store/UserChatStore";
import { chatService } from "../service/ChatService";
import { FIREBASE_AUTH } from "../firebaseConfig";

type Props = CompositeScreenProps<
  NativeStackScreenProps<StackNavigatorProps>,
  DrawerScreenProps<DrawerNavigationProps>
>;

const Profile = ({ route }: Props) => {
  const { userChat, setUserChat } = useUserChatStore();
  const { isLoading, setIsLoading } = useLoadingStore();
  const { user: loggedInUser, setUser: setLoggedInUser } = useUserStore();
  const [index, setIndex] = useState(0);
  const {t} = useTranslation();
  const [routes] = useState([
    { key: "first", title: t("Bikes") },
    { key: "second", title: t("Reviews") },
  ]);
  const [user, setUser] = useState<User | null>(loggedInUser);

  const isFocused = useIsFocused();

  const userName =
    route.params && "username" in route.params
      ? (route.params as { username: string }).username
      : undefined;

  const layout = {
    width: Dimensions.get("window").width,
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const response = await userService.getUpdatedUser();
      if (response == null) {
        setLoggedInUser(null);
      } else {
        setLoggedInUser(response);
        setUser(loggedInUser);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    fetchUser();
  }, [isFocused]);

  useEffect(() => {
    if (userName) {
      const fetchOtherUser = async () => {
        setIsLoading(true);
        const response = await userService.getOtherUser(userName);
        if (response == null) {
          setUser(null);
        } else {
          setUser(response);
        }

        setIsLoading(false);
      };
      fetchOtherUser();
    }
  }, [userName]);

  const handleMessageButton = async () => {
    if (user && loggedInUser) {
      const userChatHelper = {
        UserInfo: {
          displayName: user.private.firstName + " " + user.private.lastName,
          lastMessage: "",
          username: user.private.username,
          profPic: user.private.profilePic || ""
        }
      };
      setUserChat(userChatHelper);
      const res = await chatService.createChat(userChatHelper, loggedInUser);
      if (res !== null) {
        navigation.navigate("Chat", { username: userChatHelper.UserInfo.username });
      }
    }
  }

  return (
    //  console.log("After login: "+ JSON.stringify(FIREBASE_AUTH.currentUser, null, 2) ),
    //   console.log("Zod obj:" + JSON.stringify(loggedInUser)),
    console.log("USER: " + JSON.stringify(user)),
    <View>
      {isLoading ? (
        <HStack space="sm" alignItems="center" justifyContent="center">
          <Spinner size={"large"} />
          <Text size="lg">{t("Please Wait")}</Text>
        </HStack>
      ) : (
        <View style={ProfileStyle.tabContentContainer}>

          <ScrollView style={{ flex: 1 }}>
            <Center>
              {user ? (
                user.private.username === loggedInUser?.private.username ? (
                  <UploadImage
                    uriImage={
                      user.private.profilePic ||
                      "https://firebasestorage.googleapis.com/v0/b/bicyhub-e12e1.appspot.com/o/ProfilePics%2Fac11aa2add3b0193c8769e0a17d13535.jpg?alt=media&token=e6b8f76d-e0b3-43b4-b031-d2dff7d351e9"
                    }
                  />
                ) : (
                  <View>
                    <Image
                      marginTop={10}
                      borderRadius={100}
                      source={{
                        uri: user.private.profilePic,
                      }}
                      alt="Profile Picture"
                    />
                  </View>
                )
              ) : (
                <Text fontSize={30} alignSelf={"center"}>
                  {t("Log in to see more details")}
                </Text>
              )}
            </Center>
            {user && loggedInUser ? (
              <Center style={ProfileStyle.descriptionContainer}>
                <Text fontSize={20}>
                  {user.private.firstName} {user.private.lastName}
                </Text>
                <Text fontSize={18}>
                  {user.private.city} , {user.private.country}
                </Text>
                <Text>{t("Member since")} {user.private.creationDate}</Text>
                <Text>{user.private.email}</Text>
                {user.private.phoneNumber !== "" && user.private.phoneNumber && (
                  <Text>{user.private.phoneNumber}</Text>
                )}
                {loggedInUser.private.username == user.private.username ? (
                  <Button
                    style={{ margin: 8 }}
                    onPress={() => {
                      navigation.navigate("Edit");
                    }}
                  >
                    <ButtonText> {t("Edit")} </ButtonText>
                  </Button>
                ) : (
                  <Button
                    style={{ margin: 8 }}
                    onPress={handleMessageButton}
                  >
                    <ButtonText> Message </ButtonText>
                    <MessageCircleIcon color={config.tokens.colors.white} />
                  </Button>
                )}
              </Center>
            ) : (
              <Text fontSize={30}>{t("Log in to see more details")}</Text>
            )}
          </ScrollView>

          {user ? (
            <TabView
              navigationState={{ index, routes }}
              renderScene={({ route }) => {
                switch (route.key) {
                  case "first": {
                    return <FirstRoute userHelperuserName={user.private.username} />;
                  }
                  case "second": {
                    return <SecondRoute userHelper={user} />;
                  }
                  default: {
                    return null;
                  }
                }
              }}
              onIndexChange={setIndex}
              initialLayout={layout}
              renderTabBar={(props) => (
                <TabBar
                  {...props}
                  activeColor={config.tokens.colors.white}
                  inactiveColor={config.tokens.colors.coolGray900}
                  style={ProfileStyle.tabBarStyle}
                />
              )}
            />
          ) : (
            <Text fontSize={30}>{t("No such user")}</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default Profile;
