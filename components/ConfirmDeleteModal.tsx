import { config } from '@gluestack-ui/config';
import { View, Text, Modal, HStack, Button, ButtonText } from '@gluestack-ui/themed'
import React from 'react'
import { chatService } from '../service/ChatService';
import { MessageType } from '../types/DataTypes';
import { useUserStore } from '../store/UserStore';
import { useUserChatStore } from '../store/UserChatStore';

interface PropsType {
    modalVisible: boolean;
    setModalVisible: (newValue: boolean) => void;
    messageToDelete: string;
    messages: Array<MessageType>;
    combinedUserName: string
}



const ConfirmDeleteModal = (props: PropsType) => {


    const { user } = useUserStore();
    const { userChat } = useUserChatStore();

    const handleDeleteMessage = async () => {
        if (user && userChat) {
            const index = props.messages.findIndex((element) => {
                return element.text === props.messageToDelete
            });
            let lastMessageDeleted = false;
            console.info(index + "and" + (props.messages.length - 1));
            if (index === 0) {
                lastMessageDeleted = true;
            }
            props.messages.splice(index, 1);
            props.messages.reverse();

            const res = await chatService.deleteMessage(props.messages, props.combinedUserName, lastMessageDeleted, user, userChat);
            if (res) {
                console.info("Message deleted");
            }
            else {
                alert("Something went wrong");
            }
        }
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
                    <Text>Are you sure you want to delete this message?</Text>
                </Modal.Body>
                <Modal.Footer>
                    <HStack justifyContent={"space-evenly"} alignItems={"center"} width={"100%"}>
                        <Button
                            onPress={handleDeleteMessage}
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

export default ConfirmDeleteModal