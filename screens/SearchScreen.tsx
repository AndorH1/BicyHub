import React, { useEffect, useState } from 'react'
import { HStack, Input, InputField, View, Text, Pressable, Image, Box, Spinner } from '@gluestack-ui/themed'
import { userService } from '../service/UserService';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorProps } from '../components/StackNavigator';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { useLoadingStore } from '../store/LoadingStore';
import { useTranslation } from 'react-i18next';

const SearchScreen = () => {

    const [initialData, setInitialData] = useState<{ username: string; profilePic: string; }[]>([]);
    const [users, setUsers] = useState<{ username: string; profilePic: string; }[]>([]);
    const { isLoading, setIsLoading } = useLoadingStore();
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();
    const {t} = useTranslation();
    
    useEffect(() => {
        setIsLoading(true);
        const saveData = async () => {
            const allUsers = await userService.getAllUsers();
            if (allUsers && allUsers.length > 0) {
                setInitialData(allUsers);
                setUsers(allUsers);
            }
            setIsLoading(false);
        };
        saveData();
    }, []);
    
    const filter = (text: string) => {
        const filteredUsers = initialData.filter(item => item.username.toLowerCase().includes(text.toLocaleLowerCase()));
        setUsers(filteredUsers);
    }

    const renderUsers = (itemData: ListRenderItemInfo<{ username: string; profilePic: string; }>) => {
        return (
            <Box>
                <Pressable
                    onPress={() =>
                        navigation.navigate("Other Profiles", {
                            username: itemData.item.username,
                        })
                    }
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 10,
                        }}
                    >
                        <Image
                            source={{ uri: itemData.item.profilePic }}
                            style={{ width: 60, height: 60, borderRadius: 30, marginRight: 10 }}
                            alt="image"
                        />
                        <Text fontSize={18}>{itemData.item.username}</Text>
                    </View>
                </Pressable>
            </Box>
        );
    };

    return (
        <View>
            {isLoading ? (
                <HStack space="sm" alignItems="center" justifyContent="center">
                    <Spinner size={"large"} />
                    <Text size="lg">{t("Please Wait")}</Text>
                </HStack>
            ) : (
                <View>
                    <HStack>
                        <Input minWidth="$full">
                            <InputField
                                placeholder={t("Write here...")}
                                onChangeText={(text) => filter(text)}
                            >
                            </InputField>
                        </Input>
                    </HStack>

                    <View>
                        <FlatList
                            data={users}
                            renderItem={renderUsers}
                        />
                    </View>
                </View>
            )}
        </View>
    )
}

export default SearchScreen