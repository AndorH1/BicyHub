import { config } from '@gluestack-ui/config'
import { View, Text, Input, InputField, ChevronsRightIcon, HStack, Icon } from '@gluestack-ui/themed'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { StackNavigatorProps } from '../components/StackNavigator'
import { Timestamp, doc, onSnapshot } from 'firebase/firestore'
import { FIRESTORE_DB } from '../firebaseConfig'
import { useUserStore } from '../store/UserStore'
import { chatService } from '../service/ChatService'
import { Pressable } from 'react-native'
import { useUserChatStore } from '../store/UserChatStore'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import { useMessageStore } from '../store/MessageStore'

interface messageInfo {
    username: string,
    text: string
}



type Props = NativeStackScreenProps<StackNavigatorProps>

const Chat = ({ route, navigation }: Props) => {
    const { user } = useUserStore();
    const { userChat } = useUserChatStore();
    const { messages, setMessages } = useMessageStore();

    if (user) {
        let username = route.params && "username" in route.params
            ? (route.params as { username: string }).username
            : "", combinedUsername = user.private.username > username ? username + user.private.username : user.private.username + username;

        const [text, setText] = useState("");

        useEffect(() => {
            username = route.params && "username" in route.params
                ? (route.params as { username: string }).username
                : "";
            if (user && username) {
                combinedUsername = user.private.username > username ? username + user.private.username : user.private.username + username;

                const unSub = onSnapshot(doc(FIRESTORE_DB, "Chats", combinedUsername), async () => {
                    console.info("Here");
                    const res = await chatService.getMessages(combinedUsername);
                    if (!(res instanceof Boolean)) {
                        res.reverse();
                        setMessages(res);
                    }
                })


                return () => {
                    unSub();

                }
            }
        }, []);

        useEffect(() => {
            let isRemoving = false; let navStateFlag = false;

            const beforeRemoveListener = (e: { preventDefault: () => void }) => {
                if (!isRemoving && !navStateFlag) {
                    console.info("OK");
                    navStateFlag = true;
                    const navState = navigation.getState();
                    const belowRoute = navState.routes[navState.index - 1];
                    e.preventDefault();
                    if (belowRoute && belowRoute.name === "Other Profiles") {
                        isRemoving = true;
                        navigation.pop(2);
                    } else {
                        setMessages([]);
                        navigation.goBack();
                    }
                }
            };

            const unsubscribe = navigation.addListener("beforeRemove", beforeRemoveListener);

            return () => {
                unsubscribe();
            };
        }, [navigation]);

        const RenderMessages = (props: messageInfo) => {

            const { user } = useUserStore();
            const [modalVisible, setModalVisible] = useState<boolean>(false);

            return (
                <View padding={6}>
                    {
                        props.username === user?.private.username ? (
                            <Pressable
                                onLongPress={() => { setModalVisible(true); console.info(messages[0].date) }}
                            >
                                <View style={{ justifyContent: 'flex-end', flexDirection: "row" }} >
                                    <View borderColor='black' borderWidth={1} borderRadius={10} padding={4} backgroundColor={config.tokens.colors.primary900} >
                                        <Text color={config.tokens.colors.white}>{props.text}</Text>
                                    </View>
                                </View>
                            </Pressable>)
                            :
                            (
                                <View style={{ justifyContent: 'flex-start', flexDirection: "row" }} >
                                    <View borderColor='black' borderRadius={10} padding={4} backgroundColor={config.tokens.colors.coolGray200}>
                                        <Text>{props.text}</Text>
                                    </View>
                                </View>
                            )
                    }
                    {modalVisible &&
                        <ConfirmDeleteModal modalVisible={modalVisible} setModalVisible={setModalVisible} messageToDelete={props.text} messages={messages} combinedUserName={combinedUsername} />
                    }
                </View>
            )
        }


        return (
            <View paddingBottom={30} >
                <View height={"92%"}>
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => {
                            return (
                                <RenderMessages
                                    username={item.sender}
                                    text={item.text}
                                />
                            )
                        }}
                        inverted
                    />
                </View>
                <View>
                    <HStack space='md' marginLeft={6} alignItems='center' width={"100%"} >
                        <Input width={"86%"}>
                            <InputField placeholder="Type Something..." value={text} onChangeText={(text) => setText(text)}>
                            </InputField>
                        </Input>
                        <Pressable onPress={async () => {
                            if (user && userChat) {
                                messages.reverse();
                                const messagesHelper = messages;
                                messagesHelper.push({
                                    sender: user.private.username,
                                    text: text,
                                    date: Timestamp.now()
                                });
                                userChat.UserInfo.lastMessage = text;
                                setMessages(messagesHelper);
                                console.info("Combined Username:" + combinedUsername)
                                console.info("Last message: " + userChat.UserInfo.lastMessage);
                                const res = await chatService.postMessage(messages, combinedUsername, username, user, userChat);
                                if (res === true) {
                                    setText("");
                                    console.info("Message sent");
                                }
                            }
                        }}>
                            <View justifyContent='center' borderRadius={100} backgroundColor={config.tokens.colors.primary900} flex={1}  >
                                <Icon
                                    color={config.tokens.colors.white}
                                    as={ChevronsRightIcon}
                                />
                            </View>
                        </Pressable>
                    </HStack>
                </View>
            </View>
        )
    }
}

export default Chat;