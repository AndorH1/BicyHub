import React, { useEffect, useState } from "react";
import { View, Button, ButtonText,HStack, Spinner, Text,Pressable } from "@gluestack-ui/themed";
import { useLoadingStore } from "../store/LoadingStore";
import { FlatList } from "react-native";
import { useUserStore } from "../store/UserStore";
import { Post } from "../types/DataTypes";
import PostCard from "./PostCard";
import { postService } from "../service/PostService";
import { usePostStore } from "../store/HomeContentStore";
import PostModal from "./PostModal";
import { useTranslation } from "react-i18next";

const PostCardRender = ({ post }: { post: Post }) => {
    const [modalVisible, setModalVisible] = useState(false);
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
    const { t } = useTranslation();
  
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
        <HStack margin={2} justifyContent={"space-between"} //space={5}
        >
          <Button onPress={async () => {
            setIsLoading(true);
            const response = await postService.getRandomPosts();
            if (response) {
              setPost(response);
            } else {
              alert("Something went wrong!");
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
            //keyExtractor={(item, index) => `${item.id}_${index}`}
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
  
  