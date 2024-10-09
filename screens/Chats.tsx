import { View, Text, HStack, Image, FlatList, VStack, Pressable } from '@gluestack-ui/themed'
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { StackNavigatorProps } from '../components/StackNavigator'
import { doc, onSnapshot } from 'firebase/firestore'
import { FIRESTORE_DB } from '../firebaseConfig'
import { useUserStore } from '../store/UserStore'
import { chatService } from '../service/ChatService'
import { useUserChatStore } from '../store/UserChatStore'
import { UserChatSchema, UserChatType } from '../types/DataTypes'
import ConfirmDeleteChatModal from '../components/ConfirmDeleteChatModal'



const RenderUserChats = (props: UserChatType) => {
    const { setUserChat } = useUserChatStore();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();
    const username = props.UserInfo.username;

    return (
        <View>
            <Pressable
                onPress={() => {
                    setUserChat({
                        UserInfo: {
                            displayName: props.UserInfo.displayName,
                            profPic: props.UserInfo.profPic,
                            username: props.UserInfo.username,
                            lastMessage: props.UserInfo.lastMessage
                        }
                    });
                    navigation.navigate("Chat", { username })
                }
                }
            >
                <HStack space={'sm'} margin={6} >
                    <Image
                        source={{
                            uri: props.UserInfo.profPic
                        }}
                        alt='ProfPic'
                        borderRadius={100}
                        size='sm'
                    />
                    <VStack>
                        <Text marginTop={6} size={'lg'}>{props.UserInfo.displayName}</Text>
                        <Text>{props.UserInfo.lastMessage}</Text>
                    </VStack>
                </HStack>
            </Pressable>
            <ConfirmDeleteChatModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    )
}

const Chats = () => {
    const { user } = useUserStore();
    const [chats, setChats] = useState<Array<UserChatType>>([]);

    useEffect(() => {
        if (user) {
            const unSub = onSnapshot(doc(FIRESTORE_DB, "UserChats", user.private.username), async () => {

                const res = await chatService.getUserChats(user.private.username);
                if (!(res instanceof Boolean)) {
                    const userChatsHelper: Array<UserChatType> = [];
                    for (const chat of res) {
                        const chatHelper = UserChatSchema.parse(chat[1]);
                        userChatsHelper.push(chatHelper);
                    }
                    setChats(userChatsHelper);
                }
            })

            return () => {
                unSub();
            }
        }
    }, [user?.private.username])


    return (
        <View padding={6}>
            <FlatList
                data={chats}
                renderItem={({ item }) => {
                    return (
                        <RenderUserChats
                            UserInfo={item.UserInfo}
                        />
                    );
                }}
            />
        </View>
    )
}

export default Chats
