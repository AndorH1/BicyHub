import { config } from '@gluestack-ui/config';
import { View, Text, Modal, HStack, Button, ButtonText } from '@gluestack-ui/themed'
import React from 'react'
import { chatService } from '../service/ChatService';
import { useUserStore } from '../store/UserStore';
import { useUserChatStore } from '../store/UserChatStore';

interface PropsType {
    modalVisible: boolean;
    setModalVisible: (newValue: boolean) => void;
}



const ConfirmDeleteChatModal = (props: PropsType) => {


    const { user } = useUserStore();
    const { userChat } = useUserChatStore();

    const handleDelete = async () => {
        if (user && userChat) {
            const combinedUserName = user.private.username > userChat.UserInfo.username ? userChat.UserInfo.username + user.private.username : user.private.username + userChat.UserInfo.username;
            const res = await chatService.deleteUserChat(combinedUserName, user.private.username);
            if (res) {
                console.info("Chat deleted succesfully");
            }
            else {
                console.error("Something went wrong");
            }
        }
        props.setModalVisible(false);
    }

    return (
        <Modal
            isOpen={props.modalVisible}
            onClose={() => props.setModalVisible(false)}
        >
            <View
                height={"30%"}
                width={"70%"}
                alignItems={"center"}
                justifyContent={"center"}
                backgroundColor={config.tokens.colors.white}
            >
                <Modal.Header
                    borderBottomColor={config.tokens.colors.black}
                    borderBottomWidth={1}
                >
                    <Text>Delete Message</Text>
                </Modal.Header>
                <Modal.Body
                    contentContainerStyle={{
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1
                    }}
                >
                    <Text>Are you sure you want to delete this chat?</Text>
                </Modal.Body>
                <Modal.Footer>
                    <HStack justifyContent={"space-evenly"} alignItems={"center"} width={"100%"}>
                        <Button
                            onPress={handleDelete}
                        ><ButtonText>Yes</ButtonText></Button>
                        <Button
                            onPress={() => { props.setModalVisible(false) }}
                        >
                            <ButtonText>No</ButtonText>
                        </Button>
                    </HStack>
                </Modal.Footer>
            </View >
        </Modal >

    )
}

export default ConfirmDeleteChatModal