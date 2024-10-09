import { useNavigation } from "@react-navigation/native";
import { Icon, MessageCircleIcon, Pressable } from "@gluestack-ui/themed";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorProps } from "./StackNavigator";
import { config } from "../config/gluestack-ui.config";

const ChatIconOnHeader = () => {

    const navigation = useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();

    const handleNavigation = () => {
        navigation.navigate("Chats");
    }
    return (
        <Pressable
            onPress={handleNavigation}
        >
            <Icon as={MessageCircleIcon} size={"xl"} marginRight={10} color={config.tokens.colors.white} />
        </Pressable>
    )
};

export default ChatIconOnHeader;
