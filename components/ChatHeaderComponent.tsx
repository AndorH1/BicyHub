import { View, Text, HStack, Image, ArrowLeftIcon } from '@gluestack-ui/themed'
import React from 'react'
import { config } from '../config/gluestack-ui.config'
import { useUserChatStore } from '../store/UserChatStore'

const ChatHeaderComponent = () => {
    const { userChat } = useUserChatStore();
    console.info(userChat);
    if (userChat) {

        return (
            <View>
                <HStack space={'sm'} alignItems='center'>
                    <ArrowLeftIcon color={config.tokens.colors.white} size={'xl'} />
                    <Image
                        source={{
                            uri: userChat.UserInfo.profPic
                        }}
                        alt='ProfPic'
                        borderRadius={100}
                        size='xs'
                    />
                    <Text marginTop={6} size={'lg'} color={config.tokens.colors.white}>{userChat.UserInfo.displayName}</Text>
                </HStack>
            </View>
        )
    }
}

export default ChatHeaderComponent