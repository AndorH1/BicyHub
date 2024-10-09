
import { ArrowUpIcon, Icon, Spinner, TrashIcon } from "@gluestack-ui/themed"
import {
  Pressable,
  Button,
  View,
  Text,
  Box,
  HStack,
  Image,
  ButtonText,
} from "@gluestack-ui/themed"
import React, { useEffect, useState } from "react";
import { Post } from "../types/DataTypes";
import { PostStyle } from "../style/PostStyle";
import { useUserStore } from "../store/UserStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorProps } from "./StackNavigator";
import CommentModal from "./CommentModal";
import ViewCommentsModal from "./ViewCommentsModal";
import ConfirmModal from "./ConfirmModal";
import { postService } from "../service/PostService";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";

interface propsType {
  modalVisible: boolean;
  setModalVisible: (newValue: boolean) => void;
  post: Post;
}

const PostCard = (props: propsType) => {
  const { user } = useUserStore();
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();
  const { t } = useTranslation(); 

  const likeCheck = (likes: string[]) => {
    setIsLoading(true);
    try {
      const equalIds = (element: string) => element === props.post.post.id;
      const searchedObj = likes.findIndex(equalIds);
      if (searchedObj !== -1) {
        setLiked(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.public.likes) {
      const likes = user.public.likes;
      likeCheck(likes);
    }
  }, [user]);

  return (
    <>

      {isLoading ? (
        <HStack space="sm" alignItems="center" justifyContent="center">
          <Spinner size={"large"} />
          <Text size="lg">{t("Please Wait")}</Text>
        </HStack>
      ) : (
        <Box style={PostStyle.PostContainer} marginHorizontal={6} marginVertical={2}>
          <HStack justifyContent={"space-between"}>
            <Text>{props.post.post.date}</Text>
            {user?.private.username === props.post.post.userName && (
              <Pressable onPress={() => setConfirmModalVisible(true)}>
                <Icon as={TrashIcon} m="$2" w="$4" h="$4" />
              </Pressable>
            )}
          </HStack>
          <HStack alignItems={"center"}
          >
            <Pressable
              onPress={() => {
                navigation.navigate("Other Profiles", {
                  username: props.post.post.userName,
                });
              }}
            >
              <Image
                borderRadius={100}
                source={{
                  uri: props.post.post.profilePic,
                }}
                alt="Profile Pic"
              />
            </Pressable>
            <Text>{props.post.post.userName}</Text>
          </HStack>
          <View
            borderWidth={1}
            borderRadius={10}
            padding={2}
            margin={2}
            backgroundColor={config.tokens.colors.white}
          >
            <Text>{props.post.post.text}</Text>
          </View>
          <HStack
            justifyContent={"space-between"} width={"100%"}>
            <HStack alignItems={"center"}>
              {user && <View
                borderWidth={1}
                borderRadius={10}
                alignItems={"center"}
                backgroundColor={liked ? config.tokens.colors.green500 : config.tokens.colors.white}
              >
                <Pressable onPress={async () => {
                  const response = await postService.likeManager(
                    user,
                    props.post
                  );
                  if (response === true) {
                    setLiked(true);
                  } else if (response === false) {
                    setLiked(false);
                  } else if (response == null) {
                    alert("Something went wrong!");
                  }
                }}>
                  <Icon as={ArrowUpIcon} m="$2" w="$4" h="$4" />
                </Pressable>
              </View>}
              <Text>{props.post.interactions.likes}</Text>
            </HStack>
            <Button
              borderRadius={100}
              onPress={() => setViewModalVisible(true)}
            >
              <ButtonText>{t("Comments")}</ButtonText>
            </Button>
            {user && (
              <Button
                borderRadius={100}
                onPress={() => props.setModalVisible(true)}
              >
                <ButtonText>{t("Add Comment")}</ButtonText>
              </Button>
            )}
          </HStack>
          {props.modalVisible && user && (
            <CommentModal
              modalVisible={props.modalVisible}
              setModalVisible={props.setModalVisible}
              post={props.post}
              user={user}
            />
          )}
          {viewModalVisible && (

            <ViewCommentsModal
              viewModalVisible={viewModalVisible}
              setViewModalVisible={setViewModalVisible}
              post={props.post}
            />

          )}
          {confirmModalVisible && (
            <ConfirmModal
              modalVisible={confirmModalVisible}
              setModalVisible={setConfirmModalVisible}
              post={props.post}
            />
          )}
        </Box>
      )}

    </>
  );
};

export default PostCard;
