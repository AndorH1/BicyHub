import { View, ButtonIcon, SearchIcon, Pressable } from '@gluestack-ui/themed'
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorProps } from "../components/StackNavigator";
import { config } from '@gluestack-ui/config';

const SearchIconOnHeader = () => {

    const ref = React.useRef(null)
    const navigation =
        useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();

    return (
        <View>
            <Pressable onPress={() => navigation.navigate("SearchScreen")} ref={ref}>
                <ButtonIcon as={SearchIcon} size={'xl'} color={config.tokens.colors.white} />
            </Pressable>
        </View>
    )
}

export default SearchIconOnHeader