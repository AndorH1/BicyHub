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
  Box,
  VStack,
  InputField,
  ButtonText,
  Icon,
  AddIcon,
  Spinner
} from "@gluestack-ui/themed"
import { FlatList, StyleSheet } from "react-native";
import { ProfileStyle } from "../style/ProfileStyle";
import BikeCard from "./BikeCard";
import ReviewCard from "./ReviewCard";
import { useUserStore } from "../store/UserStore";
import { ScrollView } from "@gluestack-ui/themed";
import { BikeDetailsStyle } from "../style/BikeDetailsStyle";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigatorProps } from "./StackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AddLogModal from "./AddLogModal";
import HomeBikeCard from "./HomeBikeCard";
import { useBikeStore, usePostStore } from "../store/HomeContentStore";
import PostCard from "./PostCard";
import PostModal from "./PostModal";
import { useLoadingStore } from "../store/LoadingStore";
import { bikeService, ownersDataType } from "../service/BikeService";
import { userService } from "../service/UserService";
import { postService } from "../service/PostService";
import React from "react";
import { config } from "../config/gluestack-ui.config";
import Timeline from 'react-native-timeline-flatlist'
import { FlashList } from "@shopify/flash-list";
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

    fetchData().catch((error) => console.error(error));
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
            data={data}
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
            <InputField placeholder="Write your review here"
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

export const FirstBikeRoute = ({
  bikeDescription,
}: {
  bikeDescription: string;
}) => {
  return (
    <Box style={ProfileStyle.bikeImageContainer} marginHorizontal={6} marginVertical={2}>
      <ScrollView>
        <Text fontSize={18}>{bikeDescription}</Text>
      </ScrollView>
    </Box>
  );
};

export const SecondBikeRoute = ({ bike }: { bike: Bike }) => {
  const {t} = useTranslation();
  return (
    <View height={"100%"}>
      <VStack>
        <View paddingLeft={4}>
          <Text fontSize={18}>
            {"\u2022"} {t("Name")}: {bike.name}
          </Text>
          <Text fontSize={18}>
            {"\u2022"} {t("Model year")}: {bike.modelYear}
          </Text>
          <Text fontSize={18}>
            {"\u2022"} {t("Type")}: {bike.type}
          </Text>
          <Text fontSize={18}>
            {"\u2022"} {t("Current value")}: {bike.value}
          </Text>
          <Text fontSize={18}>{"\u2022"} {t("Components")}:</Text>
          {Object.entries(bike.components).map(
            ([componentName, componentValue], index) => (
              <View key={index}>
                <Text fontSize={18}>
                  {"\t\t\t\t"}
                  {"\u2022"}
                  {componentName + ": " + componentValue}
                </Text>
              </View>
            )
          )}
        </View>
      </VStack>
    </View>
  );
};

export const ThirdBikeRoute = ({ bike }: { bike: Bike }) => {
  const { user } = useUserStore();
  const {t} = useTranslation();
  if (!bike.log) {
    bike.log = [];
  }
  const [modalVisible, setModalVisible] = useState(false);
  const bikeLogData = bike?.log.map((item) => ({
    time: item.date,
    title: `${item.description} `,
    description: `${t("Cost")}: ${item.cost || t("Unkown")} ${("Euro")}  \n${t("Distance")}: ${item.distance
      } km `,
  }));

  return (
    <Box style={BikeDetailsStyle.historyBox}
    >
      <View alignItems={"flex-end"} margin={2}>
        {user && user.private.username === bike.owner && (
          <Pressable onPress={() => setModalVisible(true)}>
            <View
              borderWidth={1}
              borderColor={config.tokens.colors.coolGray800}
              alignItems={"center"}
              width={"6%"}
              borderRadius={10}
            >
              <Icon as={AddIcon} m="$2" w="$4" h="$4" />
            </View>
          </Pressable>
        )}
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Timeline
            style={styles.list}
            data={bikeLogData}
          />
        </View>
      </ScrollView>
      {modalVisible && (
        <AddLogModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          bike={bike}
        />
      )}
    </Box>
  );
};

export const FourthBikeRoute = ({ bike }: { bike: Bike }) => {
  useEffect(() => {
    const fetchPrevOwners = async () => {
      setOwnersData(await bikeService.showOwners(bike));
    };
    fetchPrevOwners();
  }, []);

  const [ownersData, setOwnersData] = useState<Array<ownersDataType>>();
  const {t} = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();
  return (
    <View padding={2}>
      <VStack alignItems={"center"}>
        {ownersData &&
          ownersData.map((ownerData) => (
            <View
              justifyContent={"center"}
              borderWidth={1}
              width={"100%"}
              borderRadius={10}
              height={"70%"}
              paddingLeft={2}
            >
              <HStack
                key={ownerData.username}
                style={{ alignItems: "center" }}
              >
                <Pressable
                  onPress={() =>
                    navigation.navigate("Other Profiles", {
                      username: ownerData.username,
                    })
                  }
                >
                  <Image
                    source={{ uri: ownerData.profilePicture }}
                    alt={"Profile Pic"}
                    borderRadius={100}
                  ></Image>
                </Pressable>
                <Text fontSize={18}>{ownerData.username}</Text>
              </HStack>
            </View>
          ))}
      </VStack>
    </View>
  );
};

interface BikeCardsRenderType {
  id: string;
  name: string;
  pictures: string[];
}

const BikeCardsRender = (props: BikeCardsRenderType) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();
  return (
    <Pressable
      onPress={() => navigation.navigate("BikeDetails", { bikeId: props.id })}
    >
      <HomeBikeCard name={props.name} pictures={props.pictures} />
    </Pressable>
  );
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export const FirstHomeRoute = () => {
  const { bike, setBike } = useBikeStore();
  const { isLoading, setIsLoading } = useLoadingStore();

  useEffect(() => {
    const fetchRandomBikes = async () => {
      setIsLoading(true);
      setBike(await bikeService.getRandomBikes());
      setIsLoading(false);
    };
    fetchRandomBikes();
  }, []);

  const flatListKey = bike?.length.toString();
  const {t} = useTranslation();

  return (
    <View paddingBottom={20}>
      <View margin={2}>
        <Button onPress={async () => {
          setIsLoading(true);
          setBike(await bikeService.getRandomBikes());
          setIsLoading(false);
        }}>
          <ButtonText>{t("Refresh")}</ButtonText>
        </Button>
      </View>
      {isLoading ? (
        <HStack space="sm" alignItems="center" justifyContent="center">
          <Spinner size={"large"} />
          <Text size="lg">{t("Please Wait")}</Text>
        </HStack>
      ) : (
        <View style={{ height: 480 }}>
          <FlashList
            data={bike}
            renderItem={({ item }) => {
              return (
                <BikeCardsRender
                  id={item.id}
                  name={item.name}
                  pictures={item.pictures}
                />
              );
            }}
            estimatedItemSize={100}
            refreshing={false}
            onRefresh={async () => {
              setIsLoading(true);
              setBike(await bikeService.getRandomBikes());
              setIsLoading(false);
            }}
            onEndReached={async () => {
              setIsLoading(true);
              setBike(await bikeService.getRandomBikes());
              setIsLoading(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

const PostCardRender = ({ post }: { post: Post }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {t} = useTranslation();
  return (
    <PostCard
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      post={post}
    />
  );
};

export const SecondHomeRoute = () => {
  const { user } = useUserStore();
  const { post, setPost } = usePostStore();
  const { isLoading, setIsLoading } = useLoadingStore();
  const [modalVisible, setModalVisible] = useState(false);
  const {t} = useTranslation();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const response = await postService.getRandomPosts();
      if (response) {
        setPost(response);
      } else {
        alert(t("Something went wrong!"));
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <View paddingBottom={20}>
      <HStack margin={2} justifyContent={"space-between"}
      >
        <Button onPress={async () => {
          setIsLoading(true);
          const response = await postService.getRandomPosts();
          if (response) {
            setPost(response);
          } else {
            alert(t("Something went wrong!"));
          }
          setIsLoading(false);
        }}>
          <ButtonText>{t("Refresh")}</ButtonText>
        </Button>
        {user && (
          <Button onPress={() => setModalVisible(true)}>
            <ButtonText>{t("Post Something")}</ButtonText>
          </Button>
        )}
      </HStack>
      {isLoading ? (
        <HStack space="sm" alignItems="center" justifyContent="center">
          <Spinner size={"large"} />
          <Text size="lg">{t("Please Wait")}</Text>
        </HStack>
      ) : (
        <FlatList
          data={post}
          renderItem={({ item }) => {
            return <PostCardRender post={item} />;
          }}
          removeClippedSubviews={false}
        />
      )}
      {modalVisible && user && user.private.profilePic && (
        <PostModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          profilePic={user.private.profilePic}
          username={user.private.username}
          setIsLoading={setIsLoading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 5,
    backgroundColor: config.tokens.colors.blue200
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
});